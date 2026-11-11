"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { forgotPassword } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
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
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = validateEmail(email);
  const visibleError = submitted || touched ? emailError : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (emailError) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await forgotPassword({ email: email.trim() });
      setSent(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
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
      {formError && <FormAlert variant="error">{formError}</FormAlert>}

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
