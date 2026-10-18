"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth/api";
import { AuthError } from "@/lib/auth/types";
import {
  normalizePhone,
  validateRegister,
  type RegisterValues,
} from "@/lib/auth/validation";
import { Field, PasswordField } from "./Field";
import { FormAlert, PasswordStrength, SubmitButton } from "./FormParts";
import { MailIcon, PhoneIcon, UserIcon } from "@/components/icons";

type FieldName = keyof RegisterValues;

const EMPTY: RegisterValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  terms: false,
};

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState<string | null>(null);
  const loading = submitting || isNavigating;

  // Dengan cacheComponents, Next menyimpan halaman sebelumnya (tersembunyi)
  // agar statenya bisa dipulihkan. Untuk form registrasi itu tidak
  // diinginkan: data pribadi dan kata sandi tidak boleh tertinggal. Saat
  // form disembunyikan atau dilepas, kosongkan semua isian dan status.
  useEffect(() => {
    return () => {
      setValues(EMPTY);
      setTouched({});
      setSubmitted(false);
      setSubmitting(false);
      setFormError(null);
      setEmailTaken(null);
    };
  }, []);

  const errors = validateRegister(values);
  const visible = (field: FieldName) =>
    submitted || touched[field] ? errors[field] : undefined;

  const set = <K extends FieldName>(field: K, value: RegisterValues[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (field === "email") setEmailTaken(null);
  };
  const touch = (field: FieldName) =>
    setTouched((t) => ({ ...t, [field]: true }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: `+62${normalizePhone(values.phone)}`,
        password: values.password,
      });
      // Tombol tetap "Memproses…" selama perpindahan halaman berlangsung.
      startNavigation(() => {
        router.replace("/login?registered=1");
      });
    } catch (error) {
      if (error instanceof AuthError && error.code === "EMAIL_TAKEN") {
        setEmailTaken(error.message);
      } else {
        setFormError(
          error instanceof AuthError
            ? error.message
            : "Terjadi kesalahan. Silakan coba lagi.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
      {formError && <FormAlert variant="error">{formError}</FormAlert>}

      <Field
        label="Nama Lengkap"
        name="name"
        autoComplete="name"
        placeholder="Nama lengkap Anda"
        icon={<UserIcon />}
        value={values.name}
        onChange={(e) => set("name", e.target.value)}
        onBlur={() => touch("name")}
        error={visible("name")}
      />

      <Field
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="contoh@sekolah.sch.id atau email pribadi"
        icon={<MailIcon />}
        value={values.email}
        onChange={(e) => set("email", e.target.value)}
        onBlur={() => touch("email")}
        error={emailTaken ?? visible("email")}
      />

      <Field
        label="Nomor Telepon"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="812-3456-7890"
        icon={<PhoneIcon />}
        prefix="+62"
        value={values.phone}
        onChange={(e) => set("phone", e.target.value)}
        onBlur={() => touch("phone")}
        error={visible("phone")}
      />

      <PasswordField
        label="Kata Sandi"
        name="password"
        autoComplete="new-password"
        placeholder="Minimal 8 karakter unik"
        value={values.password}
        onChange={(e) => set("password", e.target.value)}
        onBlur={() => touch("password")}
        error={visible("password")}
        hint={<PasswordStrength password={values.password} />}
      />

      <PasswordField
        label="Konfirmasi Kata Sandi"
        name="confirm"
        autoComplete="new-password"
        placeholder="Ketik ulang kata sandi"
        value={values.confirm}
        onChange={(e) => set("confirm", e.target.value)}
        onBlur={() => touch("confirm")}
        error={visible("confirm")}
      />

      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.terms}
            onChange={(e) => {
              set("terms", e.target.checked);
              touch("terms");
            }}
            aria-invalid={visible("terms") ? true : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
          />
          <span>
            Saya menyetujui{" "}
            <Link href="/syarat-ketentuan" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
              Syarat &amp; Ketentuan
            </Link>{" "}
            dan memberikan persetujuan atas pemrosesan data pribadi saya sesuai
            dengan{" "}
            <Link href="/kebijakan-privasi" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
              Kebijakan Privasi
            </Link>
          </span>
        </label>
        {visible("terms") && (
          <p className="mt-1.5 text-xs text-red-600">{visible("terms")}</p>
        )}
      </div>

      <SubmitButton loading={loading}>Daftar Sekarang</SubmitButton>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Masuk
        </Link>
      </p>
    </form>
  );
}
