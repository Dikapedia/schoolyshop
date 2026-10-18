import {
  AuthError,
  type LoginInput,
  type RegisterInput,
  type Session,
} from "./types";

/**
 * Lapisan komunikasi dengan backend untuk login dan registrasi.
 *
 * Selama API backend belum siap, mode MOCK aktif (default). Matikan dengan
 * NEXT_PUBLIC_USE_MOCK_AUTH=false di .env.local setelah backend tersedia.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false";

export async function login(input: LoginInput): Promise<Session> {
  return USE_MOCK ? mockLogin(input) : apiLogin(input);
}

export async function register(input: RegisterInput): Promise<void> {
  return USE_MOCK ? mockRegister(input) : apiRegister(input);
}

/* ------------------------------------------------------------------ */
/* API asli                                                            */
/* ------------------------------------------------------------------ */
/* PENTING: endpoint dan format respons di bawah adalah ASUMSI.        */
/* Sesuaikan dengan dokumentasi API dari tim backend.                  */

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // untuk cookie sesi dari backend
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError(
      "NETWORK",
      "Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.",
    );
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new AuthError("INVALID_CREDENTIALS", "Email atau kata sandi salah");
    }
    if (res.status === 403) {
      throw new AuthError(
        "ACCOUNT_INACTIVE",
        "Akun Anda tidak aktif. Hubungi admin Schooly Shop.",
      );
    }
    if (res.status === 409) {
      throw new AuthError("EMAIL_TAKEN", "Email sudah digunakan");
    }
    throw new AuthError("UNKNOWN", "Terjadi kesalahan. Silakan coba lagi.");
  }

  return (await res.json().catch(() => ({}))) as T;
}

async function apiLogin(input: LoginInput): Promise<Session> {
  return post<Session>("/auth/login", input);
}

async function apiRegister(input: RegisterInput): Promise<void> {
  await post<unknown>("/auth/register", input);
}

/* ------------------------------------------------------------------ */
/* MOCK (hanya untuk pengembangan, hapus saat backend siap)            */
/* ------------------------------------------------------------------ */
/* Akun contoh:                                                        */
/*   admin@schoolyshop.test     / Admin12345   (Admin)                 */
/*   user@schoolyshop.test      / User12345    (User)                  */
/*   nonaktif@schoolyshop.test  / User12345    (User, akun nonaktif)   */
/* Akun hasil registrasi disimpan di localStorage browser ini.         */

type MockAccount = Session & { password: string; active: boolean };

const MOCK_KEY = "schooly.mock.users";

const SEED: MockAccount[] = [
  {
    id: "admin-1",
    name: "Admin Schooly Shop",
    email: "admin@schoolyshop.test",
    password: "Admin12345",
    role: "admin",
    active: true,
  },
  {
    id: "user-1",
    name: "Nabila Azzahra",
    email: "user@schoolyshop.test",
    password: "User12345",
    role: "user",
    active: true,
  },
  {
    id: "user-2",
    name: "Akun Nonaktif",
    email: "nonaktif@schoolyshop.test",
    password: "User12345",
    role: "user",
    active: false,
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readRegistered(): MockAccount[] {
  try {
    const raw = window.localStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as MockAccount[]) : [];
  } catch {
    return [];
  }
}

function writeRegistered(accounts: MockAccount[]): void {
  try {
    window.localStorage.setItem(MOCK_KEY, JSON.stringify(accounts));
  } catch {
    // abaikan
  }
}

async function mockLogin({ email, password }: LoginInput): Promise<Session> {
  await sleep(600);
  const key = email.trim().toLowerCase();
  const account = [...SEED, ...readRegistered()].find(
    (a) => a.email.toLowerCase() === key,
  );

  if (!account || account.password !== password) {
    throw new AuthError("INVALID_CREDENTIALS", "Email atau kata sandi salah");
  }
  if (!account.active) {
    throw new AuthError(
      "ACCOUNT_INACTIVE",
      "Akun Anda tidak aktif. Hubungi admin Schooly Shop.",
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
  const registered = readRegistered();

  if ([...SEED, ...registered].some((a) => a.email.toLowerCase() === key)) {
    throw new AuthError("EMAIL_TAKEN", "Email sudah digunakan");
  }

  writeRegistered([
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
