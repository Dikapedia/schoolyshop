"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image-url";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import {
  CUSTOMER_ORDER_TABS,
  listCustomerOrders,
  orderStatusTone,
  paymentStatusLabel,
  paymentStatusTone,
  type CustomerOrder,
} from "@/api/customer/orders";
import { site } from "@/lib/site";

function orderCode(id: number): string {
  return `#${String(id).padStart(6, "0")}`;
}

function sellerText(order: CustomerOrder): string {
  const first = order.items[0]?.seller;
  if (!first) return "Penjual koperasi sekolah";
  const extra = order.sellers.length > 1 ? ` +${order.sellers.length - 1} penjual lain` : "";
  return `${first.label} • ${first.role}${extra}`;
}

export default function PesananPage() {
  const router = useRouter();
  const session = useSession();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Semua");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan");
      return;
    }

    const id = session.id;
    let active = true;

    listCustomerOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data);
        setError("");
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoadedFor(id);
      });

    return () => {
      active = false;
    };
  }, [session, router]);

  const loading = Boolean(session) && loadedFor !== session?.id;

  const filteredOrders = useMemo(
    () =>
      activeTab === "Semua"
        ? orders
        : orders.filter((order) => order.status === activeTab),
    [orders, activeTab],
  );

  const waitingPayment = orders.filter(
    (order) => order.status === "Menunggu Pembayaran",
  ).length;
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid",
  ).length;

  if (!session) return null;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Riwayat Pesanan</h1>
              <p className="text-xs text-slate-500">
                Semua pesanan Anda dari komunitas &amp; koperasi {site.school}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {waitingPayment > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {waitingPayment} Menunggu Pembayaran
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {paidOrders} Pesanan Lunas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Akun Terverifikasi
              </span>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {CUSTOMER_ORDER_TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              const count = orders.filter(
                (order) => tab.value === "Semua" || order.status === tab.value,
              ).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-base font-semibold text-slate-900">
                  {error ? "Pesanan gagal dimuat" : "Belum ada pesanan"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {error
                    ? "Coba muat ulang halaman ini."
                    : "Mulai berbelanja di Schooly Shop sekarang"}
                </p>
                {!error && (
                  <button
                    onClick={() => router.push("/#katalog")}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Mulai Belanja
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map((order) => {
                const firstItem = order.items[0];
                const image = resolveImageUrl(firstItem?.productImage);
                const qty = order.items.reduce((sum, item) => sum + item.qty, 0);
                const canPay = order.status === "Menunggu Pembayaran";

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">
                          {orderCode(order.id)}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${paymentStatusTone(order.paymentStatus)}`}
                        >
                          {paymentStatusLabel(order.paymentStatus, order.paymentMethod)}
                        </span>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${orderStatusTone(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-xl">
                          {image ? (
                            <Image
                              src={image}
                              alt={firstItem?.productName ?? "Produk"}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            "🛍️"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {firstItem?.productName ?? "Pesanan"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                              {sellerText(order)}
                            </span>
                          </p>
                          {order.items.length > 1 && (
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              +{order.items.length - 1} produk lainnya
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">({qty} barang)</p>
                        <p className="text-base font-bold text-blue-600">
                          {formatRupiah(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => router.push(`/pesanan/invoice?id=${order.id}`)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cetak Invoice
                      </button>

                      {canPay && (
                        <button
                          onClick={() => router.push(`/pesanan/bayar?id=${order.id}`)}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                        >
                          Bayar Sekarang
                        </button>
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
                        </>
                      )}

                      {order.status === "Selesai" && (
                        <button
                          onClick={() => router.push(`/pesanan/ulasan?id=${order.id}`)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Beri Ulasan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
