import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Lupa Kata Sandi | Schooly Shop" };

export default function LupaSandiPage() {
  return (
    <>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Lupa Kata Sandi
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Masukkan email akun Schooly Shop Anda. Kami akan mengirimkan
          instruksi untuk mengatur ulang kata sandi.
        </p>
      </header>

      <ForgotPasswordForm />
    </>
  );
}
