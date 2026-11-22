"use client";

import Link from "next/link";
import { use } from "react";
import { inter } from "@/lib/fonts";
import ProductDetail from "@/components/shop/ProductDetail";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useProductPage } from "@/api/products";

export default function ProductPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, loading, error } = useProductPage(slug);

  return (
    <div
      className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}
    >
      <SiteHeader />
      <main className="flex-1">
        {loading ? (
          <ProductSkeleton />
        ) : error ? (
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Produk gagal dimuat
            </h1>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/produk"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali ke Katalog
              </Link>
            </div>
          </div>
        ) : !data ? (
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Produk tidak ditemukan
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Produk mungkin sudah dihapus, disembunyikan, atau tautan-nya
              salah.
            </p>
            <Link
              href="/produk"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Jelajahi Katalog
            </Link>
          </div>
        ) : (
          <ProductDetail key={slug} product={data.product} related={data.related} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-blue-100" />
          <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
