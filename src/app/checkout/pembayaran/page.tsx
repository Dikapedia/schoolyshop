"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/lib/auth/use-session";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/lib/shop/cart";
import { getProductById } from "@/lib/shop/products";

type PendingCheckout = {
  addressId?: string;
  shippingId?: string;
  sessionId?: string;
};

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

type ProductImageMap = Record<string, string>;

function loadPending(): PendingCheckout | null {
  try {
    const raw = window.localStorage.getItem("schooly.checkout.pending");
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

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

export default function PembayaranPage() {
  const router = useRouter();
  const session = useSession();
  const lines = useCart();

  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [shipping, setShipping] = useState<string>("");
  const [countdown, setCountdown] = useState(3582);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/checkout/pembayaran");
      return;
    }
    const p = loadPending();
    if (p) setPending(p);
    setAddresses(loadAddresses(session.id));
    if (p?.addressId) setSelectedAddress(p.addressId);
    if (p?.shippingId) setShipping(p.shippingId);
  }, [session, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
  const seconds = String(countdown % 60).padStart(2, "0");

  const selectedAddressData = addresses.find((a) => a.id === selectedAddress);

  const items = useMemo(() => {
    const result = lines.map((line) => {
      const product = getProductById(line.productId);
      if (!product) return null;
      return { line, product, subtotal: product.price * line.qty };
    });
    return result.filter((i): i is NonNullable<typeof i> => i !== null);
  }, [lines]);

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const SHIPPING_OPTIONS = [
    { id: "jne", label: "JNE Express — Layanan Reguler", sub: "Estimasi tiba: Besok atau 1-2 Hari Kerja", fee: 15000, badge: "Termurah" as const },
    { id: "sicepat", label: "SiCepat — SIUNTUNG", sub: "Estimasi tiba: 1-2 Hari Kerja", fee: 16500, badge: undefined },
    { id: "jt", label: "J&T Express — EZ Reguler", sub: "Estimasi tiba: 2-3 Hari Kerja", fee: 18000, badge: undefined },
    { id: "anteraja", label: "AnterAja — Reguler Parcel", sub: "Estimasi tiba: 2-3 Hari Kerja", fee: 17000, badge: undefined },
  ] as const;
  const selectedShippingData = SHIPPING_OPTIONS.find((s) => s.id === shipping);
  const shippingFee = selectedShippingData?.fee ?? 0;
  const total = subtotal + shippingFee;
  const [invoiceId, setInvoiceId] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setInvoiceId(
      `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-001`,
    );
  }, []);

  useEffect(() => {
    if (items.length === 0 || !pending) {
      router.replace("/checkout");
    }
  }, [items, pending, router]);

  if (!session) return null;
  if (!pending) return null;

  function handleCopy() {
    navigator.clipboard?.writeText("8801 2025 0101 001");
  }

  return (
    <div className={`${inter.className} min-h-screen bg-[#f5f7ff] text-slate-900`}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-5">
        {/* Steps */}
        <div className="mb-6 flex items-center justify-end gap-2 text-xs">
          {["Keranjang", "Alamat", "Pengiriman", "Pembayaran"].map((s, i) => {
            const done = i < 3;
            const current = i === 3;
            return (
              <span key={s} className="flex items-center gap-1.5">
                {i > 0 && <span className="h-px w-6 bg-slate-200" />}
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold ${
                    done ? "bg-green-600 text-white" : current ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={current ? "font-semibold text-slate-900" : done ? "text-slate-600" : "text-slate-400"}>{s}</span>
              </span>
            );
          })}
          {<span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">LANGKAH 4</span>}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Left: Payment */}
          <div className="space-y-4">
            {/* Code */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">Kode Transaksi / Tagihan</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-base font-bold">
                    {invoiceId}
                    <button onClick={handleCopy} className="rounded-md border border-slate-200 p-1 hover:bg-slate-50">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">Metode Pengiriman</p>
                  <p className="mt-0.5 text-xs font-semibold">{selectedShippingData?.label ?? "—"}</p>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-100 px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Selesaikan Pembayaran Dalam: <span className="font-mono font-bold">{minutes}:{seconds}</span>
                </div>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Batas 60 Menit</span>
              </div>

              {/* Total */}
              <div className="mb-4 flex items-end justify-between rounded-xl bg-blue-50 px-4 py-3">
                <div>
                  <p className="text-xs text-slate-500">Total Tagihan Pesanan</p>
                  <p className="text-2xl font-bold text-blue-700">{formatRupiah(total)}</p>
                  <p className="text-[11px] text-slate-500">(Termasuk Ongkir {selectedShippingData?.label ?? "—"} Rp {shippingFee.toLocaleString("id-ID")})</p>
                </div>
                <span className="rounded-full bg-green-400 px-3 py-1 text-[10px] font-bold text-white">Bebas Biaya Admin VA</span>
              </div>

              {/* Metode Pembayaran */}
              <p className="mb-3 text-sm font-bold">Pilih Metode Pembayaran</p>
              <div className="space-y-3">
                {/* Transfer Bank (default open) */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="radio" name="payment" defaultChecked className="accent-blue-600" />
                    <div className="flex-1 font-bold text-sm">Transfer Bank / Virtual Account (Otomatis)</div>
                    <div className="flex gap-1">
                      {["BCA","BNI","Mandiri"].map((b) => (
                        <span key={b} className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-blue-700">{b}</span>
                      ))}
                    </div>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </label>
                  <div className="mt-3 rounded-lg bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded bg-blue-600 text-[10px] font-bold text-white">BCA</span>
                        <div>
                          <p className="text-[11px] text-slate-500">BCA Virtual Account ({site.school})</p>
                          <p className="font-mono font-bold">8801 2025 0101 001</p>
                        </div>
                      </div>
                      <button onClick={handleCopy} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">Salin No. VA</button>
                    </div>
                    <div className="mt-3 rounded-lg bg-emerald-100 p-2 text-xs text-emerald-800">
                      <strong>✓ Dicek Otomatis 24 Jam</strong><br />
                      Tidak perlu unggah bukti transfer. Sistem akan mendeteksi transaksi secara real-time dan menerbitkan struk Koperasi sekolah.
                    </div>
                  </div>
                </div>

                {/* E-Wallet */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="accent-blue-600" />
                    <span className="text-lg">💳</span>
                    <div>
                      <p className="font-bold text-sm">E-Wallet (GoPay, OVO, DANA, ShopeePay)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Instan & Praktis</span>
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </label>

                {/* QRIS */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="accent-blue-600" />
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="font-bold text-sm">QRIS (Semua Dompet Digital & Mobile Banking)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">QRIS Standar BI</span>
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </label>

                {/* Kartu */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="accent-blue-600" />
                    <span className="text-lg">🏧</span>
                    <div>
                      <p className="font-bold text-sm">Kartu Kredit / Debit Online (Visa, Mastercard, GPN)</p>
                    </div>
                  </div>
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </label>
              </div>

              <button className="mt-5 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700">
                Bayar Sekarang — {formatRupiah(total)}
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-500">Transaksi dienkripsi 256-bit SSL & Terverifikasi Midtrans Payment Gateway</p>
            </div>
          </div>

          {/* Right: Status & Summary */}
          <div className="space-y-4">
            {/* Status */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-sm">Status Pembayaran Real-Time</p>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-amber-100 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <span className="h-2 w-2 rounded-full bg-amber-600" />
                    Menunggu Pembayaran
                  </div>
                  <p className="mt-0.5 text-[11px] text-amber-700">Aktif Sekarang</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-slate-400">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300" />Berhasil</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-slate-400"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300" />Gagal</span></div>
                <div className="rounded-lg bg-slate-50 p-3 text-slate-400"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300" />Kedaluwarsa</span></div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-sm">Ringkasan Pesanan ({items.length} Item)</p>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">Siswa Mandiri</span>
              </div>
              <div className="space-y-3 mb-3">
                {items.map(({ line, product, subtotal }) => (
                  <div key={line.productId} className="flex gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <span className="grid h-full text-lg">🛒</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-semibold">{product.name}</p>
                      <p className="text-[10px] text-slate-500">
                        <span className={`rounded px-1 py-0.5 ${product.seller.role === "Guru" ? "bg-blue-100 text-blue-700" : product.seller.role === "Siswa" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{product.seller.label}</span>
                        <span>• {product.category}</span>
                        <span> • {line.qty}x</span>
                      </p>
                      <p className="font-bold text-xs">{formatRupiah(subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ongkos Kirim ({selectedShippingData?.label ?? "—"})</span>
                  <span className="font-semibold">{formatRupiah(shippingFee)}</span>
                </div>
              </div>
            </div>

            {/* Midtrans */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-100 text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-sm">Midtrans Payment Gateway</p>
                  <p className="text-[11px] text-slate-500">Tertulisensi Bank Indonesia & OJK</p>
                </div>
              </div>
              <p className="mb-3 text-[11px] text-slate-600">
                Penjual Resmi: <strong>Koperasi {site.school}</strong> (Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung). Pengambilan mandiri atau kirim langsung ke kelas tersedia saat jam istirahat.
              </p>
              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Butuh konfirmasi? Kontak Admin Koperasi: <a href="tel:+6281234567890" className="font-bold">+62 812-3456-7890</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
