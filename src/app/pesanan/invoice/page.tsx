"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/lib/auth/use-session";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";

type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
};

const INVOICE_ACTIONS = [
  { label: "Cetak", action: "print", icon: "🖨️" },
  { label: "Unduh PDF", action: "download", icon: "⬇️" },
  { label: "Cetak Lembar", action: "printLayout", icon: "📄" },
  { label: "Simpan PDF", action: "savePdf", icon: "💾" },
] as const;

export default function InvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan");
      return;
    }
    const id = searchParams.get("id") ?? "";
    if (!id) {
      setError("ID pesanan belum diberikan.");
      setLoading(false);
      return;
    }
    try {
      const raw = window.localStorage.getItem("schooly.orders");
      if (!raw) {
        setError("Belum ada riwayat pesanan.");
        setLoading(false);
        return;
      }
      const all: Record<string, Order[]> = JSON.parse(raw);
      const list = all[session.id] ?? [];
      const found = list.find((o: Order) => o.id === id);
      if (!found) {
        setError("Pesanan tidak ditemukan.");
      } else {
        setOrder(found);
      }
    } catch {
      setError("Gagal membaca data pesanan.");
    } finally {
      setLoading(false);
    }
  }, [session, router]);

  if (!session) return null;
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Memuat detail invoice...
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {error ?? "Invoice tidak ditemukan."}
      </div>
    );
  }

  const selectedItem = order.items[0];

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header band */}
        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-400">Invoice</p>
            <p className="mt-0.5 text-2xl font-bold">{order.id}</p>
            <p className="mt-1 text-xs text-slate-400">
              Terbit: {new Date(order.date).toLocaleDateString("id-ID", { dateStyle: "long" })}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              Status Pembayaran:{" "}
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                {order.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Komunitas</p>
            <p className="mt-0.5 text-xl font-bold">{site.school}</p>
            <p className="text-xs text-slate-500">Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung</p>
            <p className="text-xs text-slate-500">MIDTRANS Payment Gateway Terverifikasi OJK</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          {/* Left */}
          <div className="space-y-4">
            {/* Customer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Konsumen</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Nabila Putri Ramadhani</p>
                <p className="text-slate-500">Siswa Sekolah Menengah Kejuruan Negeri 1 Bandung</p>
                <p className="text-slate-500">Email: nabila@example.com</p>
                <p className="text-slate-500">Kontak: <a href="tel:+6281234567890" className="font-semibold">+62 812-3456-7890</a></p>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Alamat Envoi / Pengiriman</p>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-semibold">Nabila Putri Ramadhani</p>
                <p className="text-slate-500">Jalan Cikondang No. 45, Ngesrep, Kec. Coblong, Kota Bandung</p>
                <p className="text-slate-500">Kode Pos: 40115</p>
                <p className="text-slate-500">Diterima oleh: Nabila Putri Ramadhani</p>
                <p className="text-slate-500">Nomor WhatsApp: <a href="tel:+6281234567890" className="font-semibold">+62 812-3456-7890</a></p>
              </div>
            </div>

            {/* Item & Totals */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-xl bg-slate-100 grid place-items-center text-lg">🛍️</div>
                <div>
                  <p className="text-sm font-bold">{selectedItem?.name}</p>
                  <p className="text-xs text-slate-500">{selectedItem?.qty} unit × {formatRupiah(selectedItem?.price ?? 0)}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-semibold text-slate-700">Subtotal Produk</span>
                <span className="font-bold text-blue-600">{formatRupiah(selectedItem?.price ?? 0)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span className="font-semibold text-slate-700">Biaya Layanan Kampus</span>
                <span className="font-semibold text-emerald-600">Gratis</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Aksi Invoice</p>
              <div className="grid grid-cols-2 gap-3">
                {INVOICE_ACTIONS.map((a) => (
                  <button
                    key={a.action}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="text-lg">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Rincian Pembayaran</p>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">Lunas</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Metode Pembayaran</span>
                  <span className="font-medium">Virtual Account BCA</span>
                </div>
                <div className="flex justify-between">
                  <span>VA Number / QRIS</span>
                  <span className="font-mono font-bold">8801 2025 0101 001</span>
                </div>
                <div className="flex justify-between">
                  <span>Midtrans Payment Gateway</span>
                  <span className="font-medium">OJK &amp; Bank Indonesia</span>
                </div>
                <div className="flex justify-between">
                  <span>Batas Selesaikan</span>
                  <span className="font-medium">60 Menit</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-blue-600">
                  <span>Total Tagihan</span>
                  <span>{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Penjual &amp; Koperasi</p>
              <div className="space-y-1.5 text-sm text-slate-700">
                <p className="font-semibold">{site.school}</p>
                <p className="text-slate-500">Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung</p>
                <p className="text-slate-500">Pengambilan mandiri atau kirim langsung ke kelas saat jam istirahat</p>
              </div>
              <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Butuh konfirmasi? Kontak Admin Koperasi: <a href="tel:+6281234567890" className="font-bold">+62 812-3456-7890</a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-xs font-semibold text-slate-400">Produk</p>
              <div className="space-y-2 text-xs">
                {order.items.map((it) => (
                  <div key={it.productId} className="flex justify-between">
                    <span className="text-slate-700">{it.name}</span>
                    <span className="font-semibold text-slate-900">{it.qty} × {formatRupiah(it.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
