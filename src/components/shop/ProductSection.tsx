"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { CATEGORIES, products, type Category } from "@/lib/shop/products";
import ProductCard from "./ProductCard";

const SORTS = [
  { value: "relevan", label: "Paling Relevan" },
  { value: "termurah", label: "Harga Terendah" },
  { value: "termahal", label: "Harga Tertinggi" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];
type Filter = "Semua" | Category;

const FILTERS: Filter[] = ["Semua", ...CATEGORIES];

export default function ProductSection() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const [sort, setSort] = useState<SortValue>("relevan");

  const visible = useMemo(() => {
    const list =
      filter === "Semua"
        ? products
        : products.filter((p) => p.category === filter);
    if (sort === "termurah") return [...list].sort((a, b) => a.price - b.price).slice(0, 8);
    if (sort === "termahal") return [...list].sort((a, b) => b.price - a.price).slice(0, 8);
    return list.slice(0, 8);
  }, [filter, sort]);

  return (
    <>
      {/* Filter kategori dan urutan */}
      <div className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <div
            role="group"
            aria-label="Filter kategori"
            className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:pb-0"
          >
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={cx(
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition",
                  filter === item
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5" aria-live="polite">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {visible.length} Produk Terkurasi Warga
            </span>
            <label className="inline-flex items-center gap-1.5">
              Urutkan:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
                className="rounded-md bg-transparent py-0.5 font-semibold text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Daftar produk */}
      <section id="katalog" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Produk Terbaru dari Warga Sekolah
            </h2>
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
              Koleksi Terverifikasi
            </span>
          </div>
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Lihat Semua Produk ({products.length})
            <ChevronRightIcon width={16} height={16} />
          </Link>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
            Belum ada produk di kategori ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
