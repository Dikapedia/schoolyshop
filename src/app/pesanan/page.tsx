"use client";

import { useEffect, useState } from "react";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/lib/auth/use-session";
import { useRouter } from "next/navigation";
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
  status: "Menunggu Pembayaran" | "Diproses" | "Dikirim" | "Dalam Pengembalian" | "Selesai";
};

const TABS = [
  { label: "Semua", value: "Semua" },
  { label: "Menunggu Pembayaran", value: "Menunggu Pembayaran" },
  { label: "Diproses", value: "Diproses" },
  { label: "Dikirim", value: "Dikirim" },
  { label: "Dalam Pengembalian", value: "Dalam Pengembalian" },
  { label: "Selesai", value: "Selesai" },
] as const;

export default function PesananPage() {
  const router = useRouter();
  const session = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Semua");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan");
      return;
    }
    try {
      const raw = window.localStorage.getItem("schooly.orders");
      const all: Record<string, Order[]> = raw ? JSON.parse(raw) : {};
      setOrders(all[session.id] ?? []);
    } catch {
      setOrders([]);
    }
  }, [session, router]);

  if (!session) return null;

  const filteredOrders =
    activeTab === "Semua"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Riwayat Pesanan</h1>
              <p className="text-xs text-slate-500">Semua pesanan Anda dari komunitas &amp; koperasi {site.school}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Belum ada Pesanan <span className="text-slate-400 font-normal">Bulan ini</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Akun Terverifikasi Siswa
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              const count = orders.filter((o) => tab.value === "Semua" || o.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-base font-semibold text-slate-900">Belum ada pesanan</p>
                <p className="mt-1 text-sm text-slate-500">Mulai berbelanja di Schooly Shop sekarang</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-900">{order.id}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{new Date(order.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        Lunas - Virtual Account BCA
                      </span>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-100 grid place-items-center text-xl">
                        🛍️
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{order.items[0]?.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">Bu Siti Aminah, M.Pd.</span> • Guru (NIP Terverifikasi)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">({order.items[0]?.qty} barang)</p>
                      <p className="text-base font-bold text-blue-600">{formatRupiah(order.total)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Cetak Invoice
                    </button>
                    {order.status === "Selesai" && (
                      <>
                        <button
                          onClick={() => router.push(`/pesanan/ulasan?id=${order.id}`)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Beri Ulasan
                        </button>
                        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                          Lacak Pengiriman
                        </button>
                        <button
                          onClick={() => router.push(`/pesanan/terima?id=${order.id}`)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Pesanan Diterima
                        </button>
                        <button className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600">
                          Ajukan Pengembalian
                        </button>
                      </>
                    )}
                    {order.status === "Dikirim" && (
                      <>
                        <button
                          onClick={() => router.push(`/pesanan/lacak?id=${order.id}`)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Lacak Pengiriman
                        </button>
                        <button
                          onClick={() => router.push(`/pesanan/terima?id=${order.id}`)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Pesanan Diterima
                        </button>
                        <button className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600">
                          Ajukan Pengembalian
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
