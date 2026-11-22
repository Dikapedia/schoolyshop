"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrashIcon } from "@/components/icons";
import { formatRupiah } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image-url";
import {
  removeCustomerCartItem,
  updateCustomerCartItem,
  useCustomerCart,
} from "@/api/customer/cart";
import type { CustomerCartItem } from "@/api/customer/schemas";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import { site } from "@/lib/site";

function sellerShort(label: string): string {
  return label.split("(")[0].trim();
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

function variantText(item: CustomerCartItem): string {
  if (item.variant) return `Varian: Ukuran ${item.variant.size} • ${item.variant.sku}`;
  return "Varian: All Size";
}

const STEPS = ["Keranjang", "Alamat", "Pengiriman", "Pembayaran"] as const;

export default function CartView() {
  const router = useRouter();
  const session = useSession();
  const cart = useCustomerCart();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const items = cart.data;
  const selectedCount = cart.itemCount;
  const subtotal = cart.total;

  async function changeQty(item: CustomerCartItem, delta: number) {
    const nextQty = item.qty + delta;
    if (nextQty < 1) return;

    setBusyId(item.productId);
    setError("");
    try {
      await updateCustomerCartItem(item.productId, nextQty);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(item: CustomerCartItem) {
    setBusyId(item.productId);
    setError("");
    try {
      await removeCustomerCartItem(item.productId);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
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
          href={session ? "/produk" : "/login?next=/keranjang"}
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
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden className="h-px w-5 bg-slate-200 sm:w-8" />}
              <span
                className={
                  index === 0
                    ? "grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white"
                    : "grid h-5 w-5 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500"
                }
              >
                {index + 1}
              </span>
              <span className={index === 0 ? "font-semibold text-blue-700" : "text-slate-400"}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">
                {items.length} Produk di Keranjang
              </p>
              <Link href="/#katalog" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                + Tambah Produk
              </Link>
            </div>

            <ul className="divide-y divide-slate-100">
              {items.map((item) => {
                const image = resolveImageUrl(item.product.image);
                const busy = busyId === item.productId;

                return (
                  <li key={item.id} className="flex gap-3 px-4 py-4">
                    <Link
                      href={`/produk/${item.product.slug}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                    >
                      {image ? (
                        <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center text-xl">📦</span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/produk/${item.product.slug}`}
                        className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{variantText(item)}</p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                        <span
                          aria-hidden
                          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white ${roleDot(item.product.seller.role)}`}
                        >
                          {sellerShort(item.product.seller.label).charAt(0)}
                        </span>
                        <span className="truncate font-medium">
                          {sellerShort(item.product.seller.label)}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadge(item.product.seller.role)}`}>
                          {item.product.seller.role}
                        </span>
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-xs text-slate-500">{formatRupiah(item.unitPrice)}</span>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
                          <button
                            type="button"
                            aria-label="Kurangi"
                            disabled={busy || item.qty <= 1}
                            onClick={() => changeQty(item, -1)}
                            className="grid h-6 w-6 place-items-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Tambah"
                            disabled={busy}
                            onClick={() => changeQty(item, 1)}
                            className="grid h-6 w-6 place-items-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          >
                            +
                          </button>
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {formatRupiah(item.subtotal)}
                        </span>
                        <button
                          type="button"
                          aria-label={`Hapus ${item.product.name}`}
                          disabled={busy}
                          onClick={() => removeItem(item)}
                          className="ml-auto text-slate-300 hover:text-red-500 disabled:opacity-40"
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
                <strong className="font-bold">100% Produk Internal Warga {site.school}</strong>
                <span className="block font-normal text-emerald-800">
                  Bebas biaya antar jemput untuk pengambilan langsung di Koperasi Siswa &amp; Gazebo OSIS.
                </span>
              </span>
            </p>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Ringkasan Belanja</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              E-Katalog Aktif
            </span>
          </div>

          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-600">Total Harga ({selectedCount} Barang)</dt>
              <dd className="font-bold text-slate-900">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Ongkos Kirim</dt>
              <dd className="text-right text-[11px] font-semibold text-slate-700">
                Dihitung saat checkout
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Biaya Layanan Koperasi</dt>
              <dd className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                Gratis
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">
              <strong className="block text-xs font-bold text-slate-900">Subtotal</strong>
              Belum termasuk ongkos kirim
            </p>
            <p className="text-xl font-bold text-blue-600">{formatRupiah(subtotal)}</p>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => router.push("/checkout")}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
          >
            🛒 Lanjut ke Pembayaran ({selectedCount})
          </button>

          <p className="mt-2.5 text-center text-[11px] text-slate-500">
            🛡 Verifikasi pembayaran resmi terintegrasi Kampus
          </p>
          <p className="mt-2 rounded-xl bg-blue-50/70 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600">
            📍 Barang diserahkan melalui loket Koperasi Sekolah {site.school} atau diantar antar-kelas
            saat jam istirahat.
          </p>
        </aside>
      </div>
    </div>
  );
}
