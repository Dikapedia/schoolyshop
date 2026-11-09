"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PasswordField } from "./Field";
import { FormAlert, PasswordStrength, SubmitButton } from "./FormParts";

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState<{
    password?: boolean;
    confirm?: boolean;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const errors = {
    password: !password
      ? "Kata sandi wajib diisi"
      : password.length < 8
        ? "Kata sandi minimal 8 karakter"
        : undefined,
    confirm: !confirm
      ? "Konfirmasi kata sandi wajib diisi"
      : confirm !== password
        ? "Kata sandi tidak cocok"
        : undefined,
  };

  const visible = (field: "password" | "confirm") =>
    submitted || touched[field] ? errors[field] : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.password || errors.confirm) return;

    setSubmitting(true);
    // TODO(backend): ganti simulasi ini dengan POST /auth/reset-password { token, password }.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="mt-8 space-y-5">
        <FormAlert variant="success">
          Kata sandi berhasil diatur ulang. Silakan masuk dengan kata sandi baru
          Anda.
        </FormAlert>
        <p className="text-center text-sm text-slate-600">
          <Link
            href="/login?reset=1"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Masuk
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <input type="hidden" name="token" value={token} />

      <PasswordField
        label="Kata Sandi Baru"
        name="password"
        autoComplete="new-password"
        placeholder="Minimal 8 karakter unik"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={visible("password")}
        hint={<PasswordStrength password={password} />}
      />

      <PasswordField
        label="Konfirmasi Kata Sandi"
        name="confirm"
        autoComplete="new-password"
        placeholder="Ketik ulang kata sandi"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
        error={visible("confirm")}
      />

      <SubmitButton loading={submitting}>Simpan Kata Sandi Baru</SubmitButton>
    </form>
  );
}
