"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TrashIcon } from "@/components/icons";
import { formatRupiah } from "@/lib/format";
import { removeFromCart, updateCartQuantity, useCart } from "@/lib/shop/cart";
import { getProductById, type Product } from "@/lib/shop/products";
import { useSession } from "@/lib/auth/use-session";

function sellerShort(label: string): string {
  return label.split("(")[0].trim();
}

function variantText(product: Product): string {
  if (product.category === "Pakaian Sekolah")
    return "Varian: Ukuran M \u2022 Bahan Katun Primissima";
  if (product.category === "Alat Tulis")
    return `Varian: ${product.tag} \u2022 Kertas HVS 70gsm 38 Hal`;
  if (product.category === "Kerajinan")
    return `Varian: ${product.tag} \u2022 Grafir Presisi`;
  if (product.category === "Makanan") return "Varian: Balado 200 g \u2022 Fresh Pack";
  if (product.category === "Minuman") return "Varian: Dingin 250 ml \u2022 Botol PET";
  return `Varian: ${product.tag} \u2022 ${product.category}`;
}

function roleBadge(role: string): string {
  if (role === "Guru") return "bg-blue-100 text-blue-700";
  if (role === "Siswa") return "bg-emerald-100 text-emerald-700";
  return "bg-amber-100 text-amber-800";
}

function roleDot(role: string): string {
  if (role === "Guru") return "bg-blue-600";
  if (role === "Siswa") return "bg-emerald-500";
  return "bg-amber-500";
}

const STEPS = ["Keranjang", "Alamat", "Pengiriman", "Pembayaran"] as const;

export default function CartView() {
  const router = useRouter();
  const session = useSession();
  const lines = useCart();
  const [deselected, setDeselected] = useState<string[]>([]);
  const [voucher, setVoucher] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          return { line, product, subtotal: product.price * line.qty };
        })
        .filter((i): i is NonNullable<typeof i> => i !== null),
    [lines],
  );

  const selected = useMemo(
    () => items.map((i) => i.line.productId).filter((id) => !deselected.includes(id)),
    [items, deselected],
  );
  const selectedItems = useMemo(
    () => items.filter((i) => selected.includes(i.line.productId)),
    [items, selected],
  );
  const selectedCount = selectedItems.reduce((s, i) => s + i.line.qty, 0);
  const subtotal = selectedItems.reduce((s, i) => s + i.subtotal, 0);
  const discount = voucherApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;
  const allChecked = items.length > 0 && selected.length === items.length;

  function toggleOne(id: string) {
    setDeselected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll() {
    setDeselected(allChecked ? items.map((i) => i.line.productId) : []);
  }

  function removeSelected() {
    selected.forEach((id) => removeFromCart(id));
    setDeselected([]);
  }

  function applyVoucher() {
    setVoucherApplied(voucher.trim().length > 0);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-3xl">🛒</div>
        <h3 className="mt-6 text-xl font-bold text-slate-900">
          {session ? "Keranjang Masih Kosong" : "Masuk Untuk Melihat Keranjang"}
        </h3>
        <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
          {session
            ? "Belum ada produk di keranjang. Jelajahi katalog dan tambahkan produk favoritmu."
            : "Silakan masuk terlebih dahulu untuk menyimpan produk dan melanjutkan checkout."}
        </p>
        <Link
          href={session ? "/#katalog" : "/login?next=/keranjang"}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {session ? "Mulai Belanja" : "Masuk"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">
          ⌂ Beranda
        </Link>
        <span aria-hidden className="text-slate-300">›</span>
        <span className="font-medium text-slate-700">Keranjang Belanja</span>
      </nav>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          Keranjang Belanja
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
            {selectedCount} Produk
          </span>
        </h1>
        <ol className="flex items-center gap-1.5 text-xs" aria-label="Langkah checkout">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="h-px w-5 bg-slate-200 sm:w-8" />}
              <span
                className={
                  i === 0
                    ? "grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white"
                    : "grid h-5 w-5 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500"
                }
              >
                {i + 1}
              </span>
              <span className={i === 0 ? "font-semibold text-blue-700" : "text-slate-400"}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                Pilih Semua ({items.length} Produk)
              </label>
              <button
                type="button"
                onClick={removeSelected}
                disabled={selected.length === 0}
                className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-40"
              >
                🗑 Hapus Terpilih
              </button>
            </div>

            <ul className="divide-y divide-slate-100">
              {items.map(({ line, product, subtotal }) => {
                const checked = selected.includes(line.productId);
                return (
                  <li key={line.productId} className="flex gap-3 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(line.productId)}
                      aria-label={`Pilih ${product.name}`}
                      className="mt-1 h-4 w-4 shrink-0 rounded accent-blue-600"
                    />
                    <Link
                      href={`/produk/${product.slug}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                    >
                      {product.image ? (
                        <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center text-xl">📦</span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/produk/${product.slug}`}
                        className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{variantText(product)}</p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                        <span
                          aria-hidden
                          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white ${roleDot(product.seller.role)}`}
                        >
                          {sellerShort(product.seller.label).charAt(0)}
                        </span>
                        <span className="truncate font-medium">{sellerShort(product.seller.label)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadge(product.seller.role)}`}>
                          {product.seller.role}
                        </span>
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-xs text-slate-500">{formatRupiah(product.price)}</span>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
                          <button
                            type="button"
                            aria-label="Kurangi"
                            onClick={() => updateCartQuantity(line.productId, -1)}
                            className="grid h-6 w-6 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold text-slate-900">{line.qty}</span>
                          <button
                            type="button"
                            aria-label="Tambah"
                            onClick={() => updateCartQuantity(line.productId, 1)}
                            className="grid h-6 w-6 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </span>
                        <span className="text-sm font-bold text-blue-600">{formatRupiah(subtotal)}</span>
                        <button
                          type="button"
                          aria-label={`Hapus ${product.name}`}
                          onClick={() => removeFromCart(line.productId)}
                          className="ml-auto text-slate-300 hover:text-red-500"
                        >
                          <TrashIcon width={15} height={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-emerald-100/80 px-4 py-3">
            <p className="flex items-center gap-2 text-xs text-emerald-900">
              <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-xs text-white">✓</span>
              <span>
                <strong className="font-bold">100% Produk Internal Warga SMK Bandung</strong>
                <span className="block font-normal text-emerald-800">
                  Bebas biaya antar jemput untuk pengambilan langsung di Koperasi Siswa & Gazebo OSIS.
                </span>
              </span>
            </p>
            <span className="hidden shrink-0 text-xs font-bold text-emerald-700 sm:block">
              ⇄ Gratis Ambil di Kampus
            </span>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Ringkasan Belanja</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              E-Katalog Aktif
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-700">Voucher Diskon Sekolah</p>
          <div className="mt-1.5 flex gap-2">
            <input
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              placeholder="Masukkan kode kupon kantin/OSIS"
              className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={applyVoucher}
              className="h-9 shrink-0 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-600 hover:bg-blue-100"
            >
              Terapkan
            </button>
          </div>
          {voucherApplied && (
            <p className="mt-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
              Voucher diterapkan: potongan 10%
            </p>
          )}

          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-600">Total Harga ({selectedCount} Barang)</dt>
              <dd className="font-bold text-slate-900">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Diskon Komunitas SMK ⓘ</dt>
              <dd className="font-semibold text-slate-900">- {formatRupiah(discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Biaya Layanan Koperasi</dt>
              <dd className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Gratis</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Estimasi Biaya Pengambilan</dt>
              <dd className="text-right font-semibold text-slate-900">
                {formatRupiah(0)}{" "}
                <span className="block text-[10px] font-normal text-blue-600">(Ambil di Kampus)</span>
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">
              <strong className="block text-xs font-bold text-slate-900">Total Tagihan</strong>
              Termasuk pajak & kas pengembangan OSIS
            </p>
            <p className="text-xl font-bold text-blue-600">{formatRupiah(total)}</p>
          </div>

          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => router.push(`/login?next=/keranjang`)}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
          >
            🛒 Lanjut ke Pembayaran ({selectedCount})
          </button>

          <p className="mt-2.5 text-center text-[11px] text-slate-500">
            🛡 Verifikasi pembayaran resmi terintegrasi Kampus
          </p>
          <p className="mt-2 rounded-xl bg-blue-50/70 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600">
            📍 Barang diserahkan melalui loket Koperasi Sekolah SMK Bandung atau diantar antar-kelas
            saat jam istirahat.
          </p>
        </aside>
      </div>
    </div>
  );
}