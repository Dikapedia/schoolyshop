"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ImageIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { inter } from "@/lib/fonts";
import { formatRupiah } from "@/lib/format";
import { addToCartWithAuth } from "@/lib/shop/cart";
import type { Product } from "@/lib/shop/products";
import { site, whatsappLink } from "@/lib/site";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function hashCode(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = ((h << 5) - h + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getExtra(product: Product) {
  const h = hashCode(product.id);
  const stock = 7 + (h % 18);
  const rating = (46 + (h % 5)) / 10;
  const reviews = 24 + (h % 180);
  const discount = 5 + (h % 11);
  const original = Math.round((product.price / (1 - discount / 100)) / 1000) * 1000;
  const code = `PRD-${product.id.toUpperCase()}-${product.tag.slice(0, 3).toUpperCase()}`;
  const sellerSubtitle =
    product.seller.role === "Guru"
      ? "Pembina Koperasi Guru SMK"
      : product.seller.role === "Siswa"
        ? `Kelas ${["X", "XI", "XII"][h % 3]} \u2022 OSIS SMK`
        : "Koperasi & Kantin Sekolah";
  const sellerInitial = product.seller.label.trim().charAt(0).toUpperCase();
  const specs: { label: string; value: string }[] =
    product.category === "Pakaian Sekolah"
      ? [
          { label: "Bahan Kain", value: ["Katun Halus 40s", "Dry-Fit Premium", "Twill Katun"][h % 3] },
          { label: "Berat Fisik", value: `${260 + (h % 6) * 15} Gram` },
          { label: "Standar Wajib", value: ["Seragam Kamis", "Seragam Senin", "Upacara"][h % 3] },
        ]
      : product.category === "Makanan" || product.category === "Minuman"
        ? [
            { label: "Berat Bersih", value: product.category === "Makanan" ? "200 Gram" : "250 ml" },
            { label: "Ketahanan", value: "Siap Konsumsi" },
            { label: "Varian", value: product.tag },
          ]
        : [
            { label: "Bahan Utama", value: ["Akrilik Premium", "Kanvas Tebal", "Metal & Kertas"][h % 3] },
            { label: "Berat", value: `${80 + (h % 8) * 20} Gram` },
            { label: "Kategori", value: product.category },
          ];
  return { stock, rating, reviews, discount, original, code, sellerSubtitle, sellerInitial, specs };
}

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const router = useRouter();
  const extra = useMemo(() => getExtra(product), [product]);
  const [activeThumb, setActiveThumb] = useState(0);
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const thumbnails = useMemo(() => [0, 1, 2, 3], []);

  function handleAdd(): boolean {
    if (!addToCartWithAuth(product.id, qty)) {
      router.push(`/login?next=${encodeURIComponent(`/produk/${product.slug}`)}`);
      return false;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    return true;
  }

  const sellerRoleStyle =
    product.seller.role === "Guru"
      ? "bg-blue-600"
      : product.seller.role === "Siswa"
        ? "bg-emerald-500"
        : "bg-amber-500";

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-500">
              <Link href="/" className="hover:text-blue-600">
                Beranda
              </Link>
              <span aria-hidden className="text-slate-300">
                /
              </span>
              <Link href="/#katalog" className="hover:text-blue-600">
                Katalog
              </Link>
              <span aria-hidden className="text-slate-300">
                /
              </span>
              <Link href={`/?kategori=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">
                {product.category}
              </Link>
              <span aria-hidden className="text-slate-300">
                /
              </span>
              <span className="font-medium text-slate-700">{product.name}</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              100% Produk Terverifikasi Kurikulum & Koperasi Sekolah
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
              <div className="border-b border-slate-200 p-3 sm:p-4 lg:border-b-0 lg:border-r">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width:1024px) 560px, 100vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-slate-400">
                      <ImageIcon width={40} height={40} />
                    </span>
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                    Resmi SMK
                  </span>
                  <span className="absolute left-3 top-10 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow">
                    100% Katun Primissima
                  </span>
                  <button
                    type="button"
                    aria-label="Perbesar gambar"
                    className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:bg-white"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                      <path d="M11 8v6M8 11h6" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {thumbnails.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveThumb(i)}
                      aria-label={`Gambar ${i + 1}`}
                      className={cx(
                        "relative aspect-[4/3] overflow-hidden rounded-lg border bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)]",
                        activeThumb === i
                          ? "border-blue-600 ring-2 ring-blue-600/20"
                          : "border-slate-200 hover:border-slate-300",
                      )}
                    >
                      {product.image ? (
                        <Image src={product.image} alt="" fill className="object-cover opacity-90" sizes="140px" />
                      ) : (
                        <span className="grid h-full place-items-center text-slate-300">
                          <ImageIcon width={20} height={20} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                    {product.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Stok Tersedia ({extra.stock})
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">Kode: {extra.code}</span>
                </div>

                <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-[22px]">{product.name}</h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xl font-bold text-white">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">{formatRupiah(extra.original)}</span>
                  <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-600">-{extra.discount}%</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                    <span className="text-amber-500">★</span> {extra.rating.toFixed(1)}
                    <span className="font-normal text-slate-500">({extra.reviews} Ulasan Warga Sekolah)</span>
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <span className={cx("grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white", sellerRoleStyle)}>
                    {extra.sellerInitial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold leading-none text-slate-900">
                      {product.seller.label}
                      <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                        {product.seller.role}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{extra.sellerSubtitle}</p>
                  </div>
                  <a
                    href={whatsappLink(`Halo, saya tertarik dengan ${product.name} (${extra.code})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
                  >
                    Chat
                  </a>
                  <Link
                    href="/#katalog"
                    className="hidden shrink-0 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 sm:inline-flex"
                  >
                    Profil Toko
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {extra.specs.map((s) => (
                    <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                      <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{product.description}</p>

                {product.category === "Pakaian Sekolah" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">
                        Pilih Ukuran
                        <span className="ml-2 font-normal text-slate-500">Ukuran {size} siap diambil di Koperasi</span>
                      </p>
                      <button type="button" className="text-[11px] font-medium text-emerald-600 hover:underline">
                        Panduan Ukuran (Panjang x Lebar)
                      </button>
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={cx(
                            "min-w-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                            size === s
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-900">Lokasi Pengambilan Internal</p>
                  <p className="text-[11px] text-slate-600">Ruang Guru Lt. 2 atau Koperasi Siswa Gedung B</p>
                </div>
                <span className="ml-2 hidden rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white sm:inline-flex">
                  Siap Hari Ini
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-7 w-7 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="min-w-7 text-center text-sm font-semibold text-slate-900">{qty}</span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() => setQty((q) => Math.min(extra.stock, q + 1))}
                    className="grid h-7 w-7 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  className={cx(
                    "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-4 text-xs font-semibold transition",
                    added ? "border-emerald-200 bg-emerald-600 text-white" : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
                  )}
                >
                  {added ? (
                    <>
                      <CheckIcon width={14} height={14} /> Ditambahkan
                    </>
                  ) : (
                    <>
                      <span aria-hidden>🛒</span> Tambah ke Keranjang
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (handleAdd()) router.push("/keranjang");
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <span aria-hidden>◧</span> Beli Sekarang
                </button>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                <span aria-hidden className="h-2 w-2 rounded-full bg-blue-600" />
                Produk Lainnya dari {site.school}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Koleksi Perlengkapan Sekolah
                </span>
              </h2>
              <Link href="/#katalog" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Lihat Semua (48 Produk Kampus) →
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => {
                return (
                  <Link
                    key={p.id}
                    href={`/produk/${p.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)]">
                      {p.image ? (
                        <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <ImageIcon width={18} height={18} className="text-slate-300" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold leading-tight text-slate-900 group-hover:text-blue-600">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {p.seller.role} • {p.seller.label.split("(")[0].trim()}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-blue-600">{formatRupiah(p.price)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
