import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Masuk | Schooly Shop" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// searchParams baru dibaca di dalam <Suspense> agar judul dan kerangka
// halaman tetap bisa disiapkan lebih dulu (aturan cacheComponents).
export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Selamat Datang Kembali
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Masuk untuk melanjutkan belanja di Schooly Shop
        </p>
      </header>

      <Suspense fallback={<LoginForm nextPath="/" justRegistered={false} />}>
        <LoginFormWithParams searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function LoginFormWithParams({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <LoginForm
      nextPath={safeNextPath(next)}
      justRegistered={params.registered === "1"}
    />
  );
}
