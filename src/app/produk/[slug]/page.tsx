import type { Metadata } from "next";
import { Suspense } from "react";
import ProductPageClient from "./product-page-client";

export const metadata: Metadata = {
  title: "Detail Produk | Schooly Shop",
  description:
    "Lihat detail produk kreatif warga sekolah: harga, stok, ukuran, penjual, dan ulasan.",
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductPageFallback />}>
      <ProductPageClient params={params} />
    </Suspense>
  );
}

function ProductPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        Memuat produk…
      </div>
    </div>
  );
}
