"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import ProductImage from "./ProductImage";
import { cx } from "@/lib/cx";
import { inter } from "@/lib/fonts";
import { formatRupiah } from "@/lib/format";
import { addToCustomerCartBySlug } from "@/api/customer/cart";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import type { Product, ProductVariant } from "@/api/products";
import { useProductReviews } from "@/api/reviews";
import { site, whatsappLink } from "@/lib/site";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getProductMeta(
  product: Product,
  variant?: ProductVariant | null,
) {
  const stock = variant?.stock ?? product.stock;
  const code = variant?.sku ?? `PRD-${product.numericId}`;
  const sellerSubtitle =
    product.seller.role === "Guru"
      ? "Pembina Koperasi Guru SMK"
      : product.seller.role === "Siswa"
        ? "Kelas X • OSIS SMK"
        : "Koperasi & Kantin Sekolah";
  const sellerInitial = product.seller.label.trim().charAt(0).toUpperCase();
  const specs: { label: string; value: string }[] = [
    { label: "Berat", value: `${product.weight} Gram` },
    { label: "Kategori", value: product.category },
    { label: "Tag", value: product.tag },
  ];
  return { stock, code, sellerSubtitle, sellerInitial, specs };
}

/**
 * Tampilkan pemilih ukuran bila produk punya lebih dari satu varian, atau
 * varian non-"All Size". Produk tanpa varian memakai stok gabungan produk.
 */
function shouldShowSizePicker(variants: ProductVariant[]): boolean {
  if (variants.length === 0) return false;
  if (variants.length > 1) return true;
  return variants[0].size.toLowerCase() !== "all size";
}

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const session = useSession();
  const extra = useMemo(
    () => getProductMeta(product),
    [product],
  );
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<
    number | null
  >(() => {
    const firstInStock =
      product.variants.find((variant) => variant.stock > 0) ??
      product.variants[0];
    return firstInStock?.id ?? null;
  });
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState("");
  const productReviews = useProductReviews(product.id);
  const reviewCount = productReviews.length;
  const averageRating = productReviews.length
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
      productReviews.length
    : 0;

  // Setelah diarahkan dari halaman ulasan, gulir ke daftar ulasan.
  useEffect(() => {
    if (window.location.hash !== "#ulasan") return;
    document
      .getElementById("ulasan")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [productReviews.length]);

  const gallery = useMemo(() => product.images, [product]);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [product.variants, selectedVariantId],
  );

  const activeMeta = useMemo(
    () => getProductMeta(product, selectedVariant),
    [product, selectedVariant],
  );

  const showSizePicker = shouldShowSizePicker(product.variants);
  const displayPrice = product.price + (selectedVariant?.priceAdjustment ?? 0);
  const maxQty = activeMeta.stock;
  const outOfStock = activeMeta.stock <= 0;

  async function handleAdd(): Promise<boolean> {
    if (outOfStock) return false;
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(`/produk/${product.slug}`)}`);
      return false;
    }

    setAdding(true);
    setCartError("");

    try {
      await addToCustomerCartBySlug({
        slug: product.slug,
        qty,
        size: selectedVariant?.size,
      });
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1400);
      return true;
    } catch (cause: unknown) {
      setCartError(getApiErrorMessage(cause, "Gagal menambahkan ke keranjang."));
      return false;
    } finally {
      setAdding(false);
    }
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
              <Link
                href={`/produk?kategori=${encodeURIComponent(product.category)}`}
                className="hover:text-blue-600"
              >
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
                  <ProductImage
                    src={gallery[activeThumb] ?? null}
                    alt={product.name}
                    sizes="(min-width:1024px) 560px, 100vw"
                    priority
                    iconSize={40}
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                    {product.tag}
                  </span>
                </div>

                {gallery.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {gallery.map((src, i) => (
                      <button
                        key={src}
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
                        <ProductImage src={src} alt="" sizes="140px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                    {product.category}
                  </span>
                  {outOfStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 font-semibold text-red-700">
                      Stok Habis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Stok Tersedia ({activeMeta.stock})
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                    Kode: {activeMeta.code}
                  </span>
                </div>

                <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-[22px]">
                  {product.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xl font-bold text-white">
                    {formatRupiah(displayPrice)}
                  </span>
                  {reviewCount > 0 && (
                    <a
                      href="#ulasan"
                      className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600"
                    >
                      <span className="text-amber-500">★</span>
                      {averageRating.toFixed(1)}
                      <span className="font-normal text-slate-500">
                        ({reviewCount} ulasan Anda)
                      </span>
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <span
                    className={cx(
                      "grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white",
                      sellerRoleStyle,
                    )}
                  >
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
                    href={whatsappLink(`Halo, saya tertarik dengan ${product.name} (${activeMeta.code})`)}
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
                    <div
                      key={s.label}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                    >
                      <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {product.description}
                </p>

                {showSizePicker && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">
                        Pilih Ukuran
                        {selectedVariant && (
                          <span className="ml-2 font-normal text-slate-500">
                            Ukuran {selectedVariant.size}
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        className="text-[11px] font-medium text-emerald-600 hover:underline"
                      >
                        Panduan Ukuran
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.variants.map((variant) => {
                        const disabled = variant.stock <= 0;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={cx(
                              "min-w-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                              selectedVariantId === variant.id
                                ? "border-blue-600 bg-blue-600 text-white"
                                : disabled
                                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                            )}
                          >
                            {variant.size}
                            {variant.priceAdjustment > 0 &&
                              ` (+${formatRupiah(variant.priceAdjustment)})`}
                          </button>
                        );
                      })}
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
                  <p className="text-[11px] text-slate-600">
                    Ruang Guru Lt. 2 atau Koperasi Siswa Gedung B
                  </p>
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
                  <span className="min-w-7 text-center text-sm font-semibold text-slate-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="grid h-7 w-7 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={adding || outOfStock}
                  className={cx(
                    "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-4 text-xs font-semibold transition disabled:opacity-60",
                    outOfStock
                      ? "border-slate-200 bg-slate-100 text-slate-400"
                      : added
                        ? "border-emerald-200 bg-emerald-600 text-white"
                        : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
                  )}
                >
                  {outOfStock ? (
                    "Stok Habis"
                  ) : added ? (
                    <>
                      <CheckIcon width={14} height={14} /> Ditambahkan
                    </>
                  ) : (
                    <>
                      <span aria-hidden>🛒</span> {adding ? "Menambahkan..." : "Tambah ke Keranjang"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={adding || outOfStock}
                  onClick={async () => {
                    if (await handleAdd()) router.push("/keranjang");
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <span aria-hidden>◧</span> Beli Sekarang
                </button>
              </div>
              {cartError && (
                <p className="mt-2 text-xs font-medium text-red-600">{cartError}</p>
              )}
            </div>
          </div>

          <section
            id="ulasan"
            className="mt-8 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                <span aria-hidden className="h-2 w-2 rounded-full bg-blue-600" />
                Ulasan Anda
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {reviewCount} ulasan
              </span>
            </div>

            {reviewCount === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Belum ada ulasan Anda untuk produk ini. Selesaikan pesanan lalu
                bagikan pengalaman Anda.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {productReviews.map((review) => (
                  <li
                    key={`${review.orderId}-${review.productId}-${review.submittedAt}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                          P
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Ulasan Anda
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(review.submittedAt).toLocaleDateString(
                              "id-ID",
                              { dateStyle: "long" },
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-sm tracking-wide text-amber-500"
                        aria-label={`Rating ${review.rating} dari 5`}
                      >
                        {"★".repeat(review.rating)}
                        <span className="text-slate-200">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </span>
                    </div>
                    {review.comment ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {review.comment}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs italic text-slate-400">
                        Tidak ada komentar.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                <span aria-hidden className="h-2 w-2 rounded-full bg-blue-600" />
                Produk Lainnya dari {site.school}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Koleksi Perlengkapan Sekolah
                </span>
              </h2>
              <Link
                href="/produk"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Lihat Semua →
              </Link>
            </div>

            {related.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produk/${p.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)]">
                      <ProductImage src={p.image} alt="" sizes="56px" iconSize={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold leading-tight text-slate-900 group-hover:text-blue-600">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {p.seller.role} • {p.seller.label.split("(")[0].trim()}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-blue-600">
                        {formatRupiah(p.price)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
