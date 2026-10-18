import type { Metadata } from "next";
import Hero from "@/components/shop/Hero";
import ProductSection from "@/components/shop/ProductSection";
import SiteFooter from "@/components/shop/SiteFooter";
import SiteHeader from "@/components/shop/SiteHeader";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Schooly Shop | Produk Kreatif Warga Sekolah",
  description:
    "Belanja produk kreatif siswa, guru, dan karyawan sekolah. Semua produk terkurasi dan disetujui Admin.",
};

export default function Home() {
  return (
    <div
      className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}
    >
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProductSection />
      </main>
      <SiteFooter />
    </div>
  );
}
