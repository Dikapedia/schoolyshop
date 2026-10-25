import { inter } from "@/lib/fonts";
import BrandPanel from "@/components/auth/BrandPanel";
import { ShoppingBagIcon } from "@/components/icons";
import { site } from "@/lib/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} grid min-h-screen bg-white text-slate-900 lg:grid-cols-2`}
    >
      <BrandPanel />

      <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          {/* Logo ringkas untuk layar kecil (panel kiri disembunyikan) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <ShoppingBagIcon width={18} height={18} />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold">Schooly Shop</p>
              <p className="text-[11px] text-slate-500">{site.school}</p>
            </div>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 sm:inline-flex">
            <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-500" />
            Portal Autentikasi Kampus Terpadu
          </span>
        </div>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>

        <footer className="text-center text-xs text-slate-400">
          {/* Tahun ditulis tetap sesuai desain. new Date() tidak boleh dipakai
              di sini karena proyek memakai cacheComponents. */}
          {site.name} © 2026 {site.school}. Seluruh hak cipta dilindungi.
        </footer>
      </div>
    </div>
  );
}
