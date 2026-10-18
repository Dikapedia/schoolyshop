import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";
import SiteFooter from "@/components/shop/SiteFooter";
import SiteHeader from "@/components/shop/SiteHeader";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Keranjang Belanja | Schooly Shop",
  description: "Daftar produk yang siap Anda beli di Schooly Shop.",
};

export default function KeranjangPage() {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <CartView />
      </main>
      <SiteFooter />
    </div>
  );
}
