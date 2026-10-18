"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth/api";
import { ADMIN_HOME } from "@/lib/auth/redirect";
import { saveSession } from "@/lib/auth/session";
import { AuthError } from "@/lib/auth/types";
import { validateLogin } from "@/lib/auth/validation";
import { Field, PasswordField } from "./Field";
import { FormAlert, SubmitButton } from "./FormParts";
import { MailIcon } from "@/components/icons";

type Props = {
  /** Tujuan setelah login sebagai User (sudah divalidasi di server). */
  nextPath: string;
  /** True bila baru saja selesai registrasi. */
  justRegistered: boolean;
};

export default function LoginForm({ nextPath, justRegistered }: Props) {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const loading = submitting || isNavigating;

  // Dengan cacheComponents, Next menyimpan halaman sebelumnya (tersembunyi)
  // agar statenya bisa dipulihkan. Untuk form login itu tidak diinginkan:
  // kata sandi tidak boleh tertinggal. Saat form disembunyikan atau
  // dilepas, kosongkan semua isian dan status.
  useEffect(() => {
    return () => {
      setValues({ email: "", password: "" });
      setRemember(false);
      setTouched({ email: false, password: false });
      setSubmitted(false);
      setSubmitting(false);
      setFormError(null);
    };
  }, []);

  const errors = validateLogin(values);
  const visible = (field: "email" | "password") =>
    submitted || touched[field] ? errors[field] : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (errors.email || errors.password) return;

    setSubmitting(true);
    try {
      const session = await login({
        email: values.email.trim(),
        password: values.password,
      });
      saveSession(session, remember);
      // Satu portal untuk dua peran: arah tujuan ditentukan oleh peran akun.
      // Tombol tetap "Memproses…" selama perpindahan halaman berlangsung.
      startNavigation(() => {
        router.replace(session.role === "admin" ? ADMIN_HOME : nextPath);
      });
    } catch (error) {
      setFormError(
        error instanceof AuthError
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      {justRegistered && !formError && (
        <FormAlert variant="success">
          Registrasi berhasil. Silakan masuk dengan akun Anda.
        </FormAlert>
      )}
      {formError && <FormAlert variant="error">{formError}</FormAlert>}

      <Field
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nama@email.com"
        icon={<MailIcon />}
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={visible("email")}
      />

      <PasswordField
        label="Kata Sandi"
        name="password"
        autoComplete="current-password"
        placeholder="Masukkan kata sandi"
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={visible("password")}
      />

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
          />
          Ingat saya
        </label>
        {/* Halaman /lupa-sandi belum dibuat. */}
        <Link
          href="/lupa-sandi"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Lupa kata sandi?
        </Link>
      </div>

      <SubmitButton loading={loading}>Masuk</SubmitButton>

      <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        ATAU
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link
          href="/daftar"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Daftar
        </Link>
      </p>
    </form>
  );
}
