import { useMemo, useSyncExternalStore } from "react";
import { z } from "zod";
import { request, USE_MOCK_AUTH } from "./client";
import { ApiError } from "./errors";
import {
  readRegisteredAccounts,
  SEED_ACCOUNTS,
  sleep,
  writeRegisteredAccounts,
} from "./mocks/auth";

/* ------------------------------------------------------------------ */
/* Kontrak auth                                                        */
/* ------------------------------------------------------------------ */

export const roleSchema = z.enum(["admin", "user"]);
export type Role = z.infer<typeof roleSchema>;

export const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleSchema,
});
export type Session = z.infer<typeof sessionSchema>;

export const loginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  password: z.string(),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const changePasswordInputSchema = z.object({
  userId: z.string(),
  currentPassword: z.string(),
  newPassword: z.string(),
});
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;

export type MockAccount = Session & {
  password: string;
  active: boolean;
};

/* ------------------------------------------------------------------ */
/* Login & registrasi                                                  */
/* ------------------------------------------------------------------ */

function parseInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
  message: string,
): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError("VALIDATION", message, {
      details: { issues: parsed.error.issues },
    });
  }
  return parsed.data;
}

/**
 * TODO(backend): kontrak login diasumsikan mengembalikan objek Session
 * (id, name, email, role). Konfirmasi apakah backend juga mengirim token
 * atau hanya cookie httpOnly.
 */
export async function login(input: LoginInput): Promise<Session> {
  const parsed = parseInput(
    loginInputSchema,
    input,
    "Data login tidak valid.",
  );

  if (USE_MOCK_AUTH) return mockLogin(parsed);

  return request<Session>("/auth/login", {
    method: "POST",
    body: parsed,
    responseSchema: sessionSchema,
    statusMessages: {
      401: "Email atau kata sandi salah",
      403: "Akun Anda tidak aktif. Hubungi admin Schooly Shop.",
    },
    statusCodes: {
      401: "INVALID_CREDENTIALS",
      403: "ACCOUNT_INACTIVE",
    },
  });
}

/**
 * TODO(backend): registrasi saat ini hanya mengirim data akun. Konfirmasi
 * apakah backend memerlukan verifikasi email/OTP dan apakah respons berisi
 * data user baru.
 */
export async function register(input: RegisterInput): Promise<void> {
  const parsed = parseInput(
    registerInputSchema,
    input,
    "Data registrasi tidak valid.",
  );

  if (USE_MOCK_AUTH) return mockRegister(parsed);

  await request<unknown>("/auth/register", {
    method: "POST",
    body: parsed,
    statusMessages: {
      409: "Email sudah digunakan",
    },
    statusCodes: {
      409: "EMAIL_TAKEN",
    },
  });
}

async function mockLogin({ email, password }: LoginInput): Promise<Session> {
  await sleep(600);
  const key = email.trim().toLowerCase();
  const account = [...SEED_ACCOUNTS, ...readRegisteredAccounts()].find(
    (item) => item.email.toLowerCase() === key,
  );

  if (!account || account.password !== password) {
    throw new ApiError("INVALID_CREDENTIALS", "Email atau kata sandi salah", {
      status: 401,
    });
  }
  if (!account.active) {
    throw new ApiError(
      "ACCOUNT_INACTIVE",
      "Akun Anda tidak aktif. Hubungi admin Schooly Shop.",
      { status: 403 },
    );
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  };
}

async function mockRegister(input: RegisterInput): Promise<void> {
  await sleep(600);
  const key = input.email.trim().toLowerCase();
  const registered = readRegisteredAccounts();

  if (
    [...SEED_ACCOUNTS, ...registered].some(
      (account) => account.email.toLowerCase() === key,
    )
  ) {
    throw new ApiError("EMAIL_TAKEN", "Email sudah digunakan", { status: 409 });
  }

  writeRegisteredAccounts([
    ...registered,
    {
      id: `user-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password,
      role: "user",
      active: true,
    },
  ]);
}

/**
 * Ubah kata sandi akun mock yang terdaftar di browser ini.
 *
 * TODO(backend): ganti dengan PATCH /users/me/password dan tangani 401/422
 * dari server.
 */
export function changePassword(input: ChangePasswordInput): void {
  const parsed = parseInput(
    changePasswordInputSchema,
    input,
    "Data kata sandi tidak valid.",
  );
  const accounts = readRegisteredAccounts();
  const account = accounts.find((item) => item.id === parsed.userId);

  if (!account || account.password !== parsed.currentPassword) {
    throw new ApiError("INVALID_CREDENTIALS", "Kata sandi lama tidak sesuai.", {
      status: 401,
    });
  }

  writeRegisteredAccounts(
    accounts.map((item) =>
      item.id === parsed.userId
        ? { ...item, password: parsed.newPassword }
        : item,
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Sesi browser                                                        */
/* ------------------------------------------------------------------ */

export const SESSION_KEY = "schooly.session";
export const SESSION_EVENT = "schooly:session";

/** Isi mentah sesi (string JSON) atau "" bila belum login. */
export function readSessionRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      window.localStorage.getItem(SESSION_KEY) ??
      window.sessionStorage.getItem(SESSION_KEY) ??
      ""
    );
  } catch {
    return "";
  }
}

export function saveSession(session: Session, remember: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const target = remember ? window.localStorage : window.sessionStorage;
    const other = remember ? window.sessionStorage : window.localStorage;
    other.removeItem(SESSION_KEY);
    target.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // penyimpanan tidak tersedia (mode privat, dll.)
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getSession(): Session | null {
  const raw = readSessionRaw();
  if (!raw) return null;
  try {
    const parsed = sessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

/**
 * Sesi login saat ini, atau null (juga null saat render di server).
 *
 * TODO(backend): bila backend memakai cookie httpOnly, ganti hook ini
 * dengan pemanggilan GET /auth/me.
 */
export function useSession(): Session | null {
  const raw = useSyncExternalStore(
    subscribeSession,
    readSessionRaw,
    () => "",
  );

  return useMemo(() => {
    if (!raw) return null;
    try {
      const parsed = sessionSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }, [raw]);
}

function subscribeSession(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}
