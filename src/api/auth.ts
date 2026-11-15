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

/**
 * Backend mengirim `UserProfile.id` sebagai number, sedangkan sesi lama dan
 * akun mock memakai string. Normalisasi ke string agar key localStorage
 * (pesanan, alamat, ulasan) tetap konsisten dan sesi lama tidak ter-logout.
 */
const sessionIdSchema = z.union([z.string(), z.number()]).transform(String);

export const sessionSchema = z.object({
  id: sessionIdSchema,
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

export const forgotPasswordInputSchema = z.object({
  email: z.string(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const resetPasswordInputSchema = z.object({
  token: z.string().min(1),
  password: z.string(),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

/** Endpoint reset password tidak mengembalikan body (HTTP 204/200 kosong). */
export const forgotPasswordResponseSchema = z.void();
export const resetPasswordResponseSchema = z.void();

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
 * Response login backend adalah `UserProfile`:
 * `{ id: number, name, email, role, phone, createdAt }`.
 * `sessionSchema` menormalkan `id` menjadi string dan mengabaikan field
 * tambahan yang belum dipakai frontend.
 *
 * TODO(backend): konfirmasi apakah backend juga mengirim token atau hanya
 * cookie httpOnly.
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

/**
 * Minta instruksi reset kata sandi.
 *
 * Respons harus selalu terlihat berhasil agar email yang terdaftar tidak
 * bisa ditebak dari perbedaan pesan.
 *
 * TODO(backend): konfirmasi masa berlaku token, apakah token sekali pakai,
 * format error token kedaluwarsa (404/410/422), dan rate-limit request
 * (mis. 429) beserta header `Retry-After`.
 */
export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<void> {
  const parsed = parseInput(
    forgotPasswordInputSchema,
    input,
    "Data email tidak valid.",
  );

  if (USE_MOCK_AUTH) return mockForgotPassword();

  await request<void>("/auth/forgot-password", {
    method: "POST",
    body: parsed,
    responseSchema: forgotPasswordResponseSchema,
  });
}

/**
 * Atur ulang kata sandi dengan token dari tautan email.
 *
 * TODO(backend): konfirmasi kontrak token (opaque/JWT), masa berlaku, apakah
 * token langsung hangus setelah dipakai, dan bentuk response untuk token
 * tidak valid/kedaluwarsa. Frontend menangani 404/422 dengan pesan yang sama
 * agar tautan lama tidak membocorkan detail.
 */
export async function resetPassword(
  input: ResetPasswordInput,
): Promise<void> {
  const parsed = parseInput(
    resetPasswordInputSchema,
    input,
    "Data reset kata sandi tidak valid.",
  );

  if (USE_MOCK_AUTH) return mockResetPassword();

  await request<void>("/auth/reset-password", {
    method: "POST",
    body: parsed,
    responseSchema: resetPasswordResponseSchema,
    statusMessages: {
      404: "Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.",
      422: "Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.",
    },
    statusCodes: {
      404: "NOT_FOUND",
      422: "VALIDATION",
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
 * Mock sengaja tidak mengecek apakah email terdaftar agar respons selalu
 * sama (anti-enumeration), sesuai perilaku UI saat ini.
 */
async function mockForgotPassword(): Promise<void> {
  await sleep(600);
}

/**
 * Mock menerima token apa pun yang tidak kosong; validasi token nyata
 * dilakukan backend.
 */
async function mockResetPassword(): Promise<void> {
  await sleep(600);
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
