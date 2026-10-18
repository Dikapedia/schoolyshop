import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { UserPlusIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Daftar | Schooly Shop" };

export default function DaftarPage() {
  return (
    <>
      <header>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <UserPlusIcon width={14} height={14} />
          Registrasi Komunitas Sekolah
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Buat Akun Baru
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Daftar untuk mulai berbelanja karya dan produk kreatif di Schooly Shop
        </p>
      </header>

      <RegisterForm />
    </>
  );
}
