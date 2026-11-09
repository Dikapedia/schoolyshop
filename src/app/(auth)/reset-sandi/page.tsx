import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { FormAlert } from "@/components/auth/FormParts";

export const metadata: Metadata = { title: "Reset Kata Sandi | Schooly Shop" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ResetSandiPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Atur Ulang Kata Sandi
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Buat kata sandi baru untuk akun Schooly Shop Anda.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-slate-500">
            Memuat…
          </div>
        }
      >
        <ResetPasswordWithParams searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ResetPasswordWithParams({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token.trim() : "";

  if (!token) {
    return (
      <div className="mt-8 space-y-5">
        <FormAlert variant="error">
          Tautan reset tidak valid atau tidak lengkap. Silakan minta tautan
          baru.
        </FormAlert>
        <p className="text-center text-sm text-slate-600">
          <Link
            href="/lupa-sandi"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Minta tautan reset baru
          </Link>
        </p>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
