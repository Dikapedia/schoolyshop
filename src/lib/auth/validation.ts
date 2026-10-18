export type LoginValues = { email: string; password: string };

export type RegisterValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export type Errors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Email wajib diisi";
  if (!EMAIL_RE.test(email)) return "Format email tidak valid";
  return undefined;
}

/**
 * Mengambil digit nomor telepon tanpa kode negara, sehingga "0812…",
 * "+62 812…", dan "812…" menghasilkan nilai yang sama.
 */
export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return "Nomor telepon wajib diisi";
  // Nomor seluler Indonesia: diawali 8, total 9–12 digit setelah +62.
  if (!/^8\d{8,11}$/.test(normalizePhone(value))) {
    return "Nomor telepon tidak valid (contoh: 812-3456-7890)";
  }
  return undefined;
}

export function validateLogin(values: LoginValues): Errors<LoginValues> {
  const errors: Errors<LoginValues> = {};
  const email = validateEmail(values.email);
  if (email) errors.email = email;
  if (!values.password) errors.password = "Kata sandi wajib diisi";
  return errors;
}

export function validateRegister(
  values: RegisterValues,
): Errors<RegisterValues> {
  const errors: Errors<RegisterValues> = {};

  const name = values.name.trim();
  if (!name) errors.name = "Nama lengkap wajib diisi";
  else if (name.length < 2) errors.name = "Nama terlalu pendek";

  const email = validateEmail(values.email);
  if (email) errors.email = email;

  const phone = validatePhone(values.phone);
  if (phone) errors.phone = phone;

  if (!values.password) errors.password = "Kata sandi wajib diisi";
  else if (values.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter";
  }

  if (!values.confirm) errors.confirm = "Konfirmasi kata sandi wajib diisi";
  else if (values.confirm !== values.password) {
    errors.confirm = "Kata sandi tidak cocok";
  }

  if (!values.terms) {
    errors.terms = "Anda harus menyetujui Syarat & Ketentuan";
  }

  return errors;
}

export type Strength = { level: 1 | 2 | 3; label: "Lemah" | "Sedang" | "Kuat" };

export function passwordStrength(password: string): Strength | null {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8 || score <= 2) return { level: 1, label: "Lemah" };
  if (score === 3) return { level: 2, label: "Sedang" };
  return { level: 3, label: "Kuat" };
}
