"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, products, type Category } from "@/lib/shop/products";
import ProductCard from "./ProductCard";

const SORTS = [
  { value: "relevan", label: "Paling Relevan" },
  { value: "termurah", label: "Harga Terendah" },
  { value: "termahal", label: "Harga Tertinggi" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

const PRICE_BUCKETS = [
  { label: "Di bawah Rp 20.000", min: 0, max: 19999 },
  { label: "Rp 20.000 - Rp 50.000", min: 20000, max: 50000 },
  { label: "Rp 50.001 - Rp 100.000", min: 50001, max: 100000 },
  { label: "Di atas Rp 100.000", min: 100001, max: 1000000000 },
] as const;

const PAGE_SIZE = 12;

export default function KatalogProduk() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [sort, setSort] = useState<SortValue>("relevan");
  const [page, setPage] = useState(1);

  const visible = useMemo(() => {
    let list = products;
    if (selectedCats.length > 0) {
      list = list.filter((p) => selectedCats.includes(p.category));
    }
    if (selectedPrices.length > 0) {
      list = list.filter((p) =>
        selectedPrices.some(
          (i) => p.price >= PRICE_BUCKETS[i].min && p.price <= PRICE_BUCKETS[i].max,
        ),
      );
    }
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.seller.label.toLowerCase().includes(query),
      );
    }
    if (sort === "termurah") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "termahal") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [selectedCats, selectedPrices, sort, query]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [visible, safePage],
  );

  function toggleCat(cat: Category) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setPage(1);
  }

  function togglePrice(index: number) {
    setSelectedPrices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
    setPage(1);
  }

  function clearAll() {
    setSelectedCats([]);
    setSelectedPrices([]);
    setPage(1);
  }

  const hasAnyFilter = selectedCats.length > 0 || selectedPrices.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Beranda</Link>
        <span aria-hidden className="text-slate-300">/</span>
        <span className="font-medium text-slate-700">Katalog Produk</span>
      </nav>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Katalog Produk</h1>
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-slate-500">
          Urutkan:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
        <aside className="flex h-full flex-col">
          <h2 className="text-sm font-bold text-slate-900">Filter</h2>

          <div className="my-4 h-px bg-slate-200" />

          <div>
            {hasAnyFilter && (
              <>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Clear All
                </button>
                <div className="my-6 h-px bg-slate-900" />
              </>
            )}
            <p className="text-xs font-semibold text-slate-700">KATEGORI</p>
            <ul className="mt-3 space-y-2.5">
              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const checked = selectedCats.includes(cat);
                return (
                  <li key={cat}>
                    <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCat(cat)}
                        className="h-3.5 w-3.5 rounded accent-blue-600"
                      />
                      <span className="flex-1 leading-relaxed">{cat}</span>
                      {checked && <span className="text-slate-400">{count}</span>}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold text-slate-700">RENTANG HARGA</p>
            <ul className="mt-3 space-y-2.5">
              {PRICE_BUCKETS.map((bucket, i) => (
                <li key={bucket.label}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(i)}
                      onChange={() => togglePrice(i)}
                      className="h-3.5 w-3.5 rounded accent-blue-600"
                    />
                    <span className="leading-relaxed">{bucket.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:mt-9">
          {visible.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
              Tidak ada produk yang cocok dengan filter.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center border-t border-slate-200 pt-5">
                  <nav aria-label="Pagination" className="flex items-center gap-1.5">
                    {safePage > 1 && (
                      <button
                        type="button"
                        aria-label="Halaman sebelumnya"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      >
                        &lt;
                      </button>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`Halaman ${n}`}
                        aria-current={safePage === n ? "page" : undefined}
                        onClick={() => setPage(n)}
                        className={
                          safePage === n
                            ? "grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white"
                            : "grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        }
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-label="Halaman berikutnya"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    >
                      &gt;
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
