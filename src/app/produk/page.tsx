import { Suspense } from "react";
import type { Metadata } from "next";
import KatalogProduk from "@/components/shop/KatalogProduk";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Katalog Produk | Schooly Shop",
  description: "Jelajahi 24+ produk kreatif warga sekolah — seragam, alat tulis, kerajinan, makanan & minuman terverifikasi.",
};

export default function ProdukPage() {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-500">Memuat katalog…</div>}>
          <KatalogProduk />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}