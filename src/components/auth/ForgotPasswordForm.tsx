"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { validateEmail } from "@/lib/auth/validation";
import { Field } from "./Field";
import { FormAlert, SubmitButton } from "./FormParts";
import { MailIcon } from "@/components/icons";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError = validateEmail(email);
  const visibleError = submitted || touched ? emailError : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (emailError) return;

    setSubmitting(true);
    // TODO(backend): ganti simulasi ini dengan POST /auth/forgot-password { email }.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8 space-y-5">
        <FormAlert variant="success">
          Jika email terdaftar, instruksi reset kata sandi telah dikirim. Periksa kotak masuk Anda.
        </FormAlert>
        <p className="text-center text-sm text-slate-600">
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Kembali ke halaman masuk
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <Field
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nama@email.com"
        icon={<MailIcon />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        error={visibleError}
      />

      <SubmitButton loading={submitting}>Kirim Instruksi Reset</SubmitButton>

      <p className="text-center text-sm text-slate-600">
        Ingat kata sandi Anda?{" "}
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
