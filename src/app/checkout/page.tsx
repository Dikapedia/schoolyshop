"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/lib/auth/use-session";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/lib/shop/cart";
import { getProductById } from "@/lib/shop/products";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  postalCode: string;
  note: string;
  badges: string[];
  isPrimary: boolean;
  isPickupHub?: boolean;
};

const STEPS = ["Keranjang", "Alamat & Pengiriman", "Pembayaran", "Selesai"] as const;
type StepIndex = 0 | 1 | 2 | 3;

const SHIPPING_OPTIONS = [
  { id: "jne", label: "JNE Express — Layanan Reguler", sub: "Estimasi tiba: Besok atau 1-2 Hari Kerja", fee: 15000, badge: "Termurah" as const },
  { id: "sicepat", label: "SiCepat — SIUNTUNG", sub: "Estimasi tiba: 1-2 Hari Kerja", fee: 16500, badge: undefined },
  { id: "jt", label: "J&T Express — EZ Reguler", sub: "Estimasi tiba: 2-3 Hari Kerja", fee: 18000, badge: undefined },
  { id: "anteraja", label: "AnterAja — Reguler Parcel", sub: "Estimasi tiba: 2-3 Hari Kerja", fee: 17000, badge: undefined },
] as const;

function loadAddresses(sessionId: string | null): Address[] {
  if (!sessionId) return [];
  try {
    const raw = window.localStorage.getItem("schooly.addresses");
    if (!raw) return [];
    const all: Record<string, Address[]> = JSON.parse(raw);
    return all[sessionId] ?? [];
  } catch {
    return [];
  }
}

function saveAddresses(sessionId: string, addresses: Address[]): void {
  try {
    const raw = window.localStorage.getItem("schooly.addresses");
    const all: Record<string, Address[]> = raw ? JSON.parse(raw) : {};
    all[sessionId] = addresses;
    window.localStorage.setItem("schooly.addresses", JSON.stringify(all));
  } catch {
    // ignore
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const session = useSession();
  const lines = useCart();

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

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);

  const [step, setStep] = useState<StepIndex>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [shipping, setShipping] = useState<string>("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session && mounted) {
      const next = "/checkout";
      router.replace("/login?next=" + encodeURIComponent(next));
      return;
    }
    if (!session) return;
    const all = loadAddresses(session.id);
    if (all.length > 0) {
      setAddresses(all);
    } else {
      // Seed demo address (alamat penerima/pembeli)
      const demo: Address = {
        id: "address-demo",
        name: "Demo Alamat",
        phone: "+62 812-0000-0000",
        address: "Jalan Demo No.1, Kecamatan Demo, Kota Demo",
        postalCode: "12345",
        note: "Demo address for checkout",
        badges: ["Rumah"],
        isPrimary: true,
      };
      setAddresses([demo]);
      saveAddresses(session.id, [demo]);
    }
    const chosen = all.find((a) => a.isPrimary);
    if (chosen) setSelectedAddress(chosen.id);
    else setSelectedAddress("address-demo");
    setShipping("jne");
  }, [session, router, mounted]);

  const shippingFee = SHIPPING_OPTIONS.find((s) => s.id === shipping)?.fee ?? 0;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/keranjang");
    }
  }, [items, router]);

  if (!session) return null;

  const selectedAddressData = addresses.find((a) => a.id === selectedAddress);

  function handleCheckout() {
    try {
      const data: Record<string, string> = {};
      if (selectedAddress) data.addressId = selectedAddress;
      if (shipping) data.shippingId = shipping;
      if (session?.id) data.sessionId = session.id;
      window.localStorage.setItem("schooly.checkout.pending", JSON.stringify(data));
    } catch {
      // ignore
    }
    router.push("/checkout/pembayaran");
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-5">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <a href="/" className="hover:text-blue-600">
              Beranda
            </a>
            <span className="text-slate-300">/</span>
            <a href="/keranjang" className="hover:text-blue-600">
              Keranjang Belanja
            </a>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">Checkout</span>
          </nav>

          {/* Steps */}
          <ol className="mb-8 flex items-center justify-end gap-2 text-xs" aria-label="Langkah checkout">
            {STEPS.map((s, i) => {
              const isCurrent = i === step;
              const isDone = i < step;
              return (
                <li key={s} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden className="h-px w-4 bg-slate-200 sm:w-6" />}
                  <span
                    className={
                      isDone
                        ? "grid h-6 w-6 place-items-center rounded-full bg-green-600 text-xs font-bold text-white"
                        : isCurrent
                          ? "grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white"
                          : "grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-500"
                    }
                  >
                    {i + 1}
                  </span>
                  <span className={isDone || isCurrent ? "font-semibold text-slate-900" : "text-slate-400"}>{s}</span>
                </li>
              );
            })}
          </ol>

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-4">
              {/* 1. Alamat Pengiriman */}
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    1. Alamat Pengiriman
                  </h2>
                  <a
                    href="/profil/alamat"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Alamat Baru
                  </a>
                </div>

                {addresses.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center">
                    <p className="mb-2 text-sm text-slate-600">Belum ada alamat tersimpan.</p>
                    <a
                      href="/profil/alamat"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Kelola Alamat
                    </a>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={
                        "flex cursor-pointer flex-col gap-2 rounded-xl border p-4 " +
                        (selectedAddress === a.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="address"
                            value={a.id}
                            checked={selectedAddress === a.id}
                            onChange={() => setSelectedAddress(a.id)}
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="font-bold text-sm">{a.name}</span>
                        </div>
                        {a.isPrimary && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{a.phone}</p>
                      <p className="text-xs text-slate-700">{a.address}</p>
                      <p className="text-xs text-slate-500">Kode Pos: {a.postalCode}</p>
                      {a.isPrimary && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Ubah Alamat
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </section>

              {/* 2. Pilih Pengiriman */}
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </span>
                    2. Pilih Pengiriman
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Terintegrasi Biteship API Auto-Resi
                  </span>
                </div>

                {/* Titik asal */}
                <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-bold">Titik Asal: Koperasi SMAN 1 Bandung</p>
                      <p className="text-xs text-slate-500">Jl. Ir. H. Juanda No. 93, Dago, Bandung</p>
                    </div>
                  </div>
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      Tujuan: {selectedAddressData?.name ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedAddressData?.address ?? "Pilih alamat terlebih dahulu"}
                    </p>
                  </div>
                </div>

                {/* Kurir */}
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((s) => (
                    <label
                      key={s.id}
                      className={
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 " +
                        (shipping === s.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50")
                      }
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={s.id}
                        checked={shipping === s.id}
                        onChange={() => setShipping(s.id)}
                        className="h-5 w-5 accent-blue-600"
                      />
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
                        {s.label.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{s.label}</span>
                          {s.badge && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{s.sub}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-bold text-blue-600">{formatRupiah(s.fee)}</span>
                        {shipping === s.id && (
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Semua paket diverifikasi dan dikemas langsung dari loket koperasi sekolah dengan stempel resmi.
                </div>
              </section>
            </div>

            {/* Ringkasan Pesanan */}
            <aside className="rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Ringkasan Pesanan</h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {items.length} item
                </span>
              </div>

              <div className="mb-4 space-y-3">
                {items.map(({ line, product, subtotal }) => (
                  <div key={line.productId} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-semibold text-slate-900">{product.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {product.seller.label} • {line.qty} barang
                      </p>
                      <p className="text-xs font-bold text-slate-900">{formatRupiah(subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <dl className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Subtotal Produk ({items.length} item)</dt>
                  <dd className="font-semibold text-slate-900">{formatRupiah(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Ongkos Kirim ({SHIPPING_OPTIONS.find((s) => s.id === shipping)?.label ?? "-"})</dt>
                  <dd className="font-semibold text-slate-900">{formatRupiah(shippingFee)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Biaya Layanan Kampus</dt>
                  <dd className="font-bold text-emerald-600">Rp 0 (Bebas Biaya)</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">Total Pembayaran</p>
                  <p className="text-[10px] text-slate-500">Termasuk pajak & kas OSIS</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatRupiah(total)}</p>
              </div>

              <button
                type="button"
                disabled={!selectedAddress || !shipping}
                onClick={handleCheckout}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
              >
                Lanjut ke Pembayaran
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <p className="mt-3 text-center text-[11px] text-slate-500">
                Penjual: Komunitas Resmi {site.school}
              </p>
              <p className="mt-1 text-center text-[11px] text-slate-500">
                Metode pembayaran Midtrans (QRIS, VA Mandiri/BCA/BNI, KantinPay) akan dipilih pada langkah berikutnya.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
