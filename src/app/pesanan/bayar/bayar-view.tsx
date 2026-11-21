"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/api/auth";
import { getApiErrorMessage, isApiError } from "@/api/errors";
import {
  getCustomerInvoice,
  getCustomerOrder,
  type CustomerOrder,
} from "@/api/customer/orders";
import {
  PAYMENT_METHODS,
  PAYMENT_SIMULATION_ENABLED,
  createCustomerPayment,
  forgetPaymentId,
  getCustomerPayment,
  getRememberedPaymentId,
  rememberPaymentId,
  simulateCustomerPayment,
  type PaymentMethodCode,
} from "@/api/customer/payments";
import type { CustomerInvoice, CustomerPayment } from "@/api/customer/schemas";

const METHOD_STYLES: Record<string, string> = {
  BCA: "bg-blue-600",
  BNI: "bg-orange-500",
  MANDIRI: "bg-sky-900",
};

function countdown(target: string, now: number): string {
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return "Kedaluwarsa";

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}j ${minutes}m ${seconds}d`;
  return `${minutes}m ${seconds}d`;
}

export default function BayarView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const orderId = Number(searchParams.get("id") ?? "");
  const validOrderId = Number.isFinite(orderId) && orderId > 0;

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
  const [payment, setPayment] = useState<CustomerPayment | null>(null);
  const [method, setMethod] = useState<PaymentMethodCode>("BCA");
  const [loadedOrderId, setLoadedOrderId] = useState<number | null>(null);
  const loading = validOrderId && loadedOrderId !== orderId;
  const [creating, setCreating] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const loadOrder = useCallback(async (): Promise<CustomerOrder | null> => {
    if (!validOrderId) return null;
    return getCustomerOrder(orderId);
  }, [orderId, validOrderId]);

  useEffect(() => {
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(`/pesanan/bayar?id=${orderId}`)}`);
      return;
    }
    if (!validOrderId) {
      return;
    }

    let active = true;

    loadOrder()
      .then(async (data) => {
        if (!active || !data) return;
        setOrder(data);
        setError("");

        const remembered = getRememberedPaymentId(orderId);
        if (remembered) {
          try {
            const current = await getCustomerPayment(remembered);
            if (active) setPayment(current);
          } catch {
            forgetPaymentId(orderId);
          }
        }

        if (data.paymentStatus === "pending" || data.paymentStatus === "paid") {
          try {
            const invoiceData = await getCustomerInvoice(orderId);
            if (active) {
              setInvoice(invoiceData);
            }
          } catch {
            // Invoice hanya pelengkap; halaman tetap bisa menampilkan status.
          }
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoadedOrderId(orderId);
      });

    return () => {
      active = false;
    };
  }, [session, router, orderId, validOrderId, loadOrder]);

  // Poll status pesanan selama masih menunggu pembayaran.
  useEffect(() => {
    if (!order || order.status !== "Menunggu Pembayaran") return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
      void loadOrder()
        .then((data) => {
          if (data) setOrder(data);
        })
        .catch(() => {
          // Diamkan; pengguna tetap bisa memuat ulang manual.
        });

      const remembered = getRememberedPaymentId(orderId);
      if (remembered) {
        void getCustomerPayment(remembered)
          .then((current) => setPayment(current))
          .catch(() => {
            // Pembayaran mungkin sudah kedaluwarsa.
          });
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [order, orderId, loadOrder]);

  useEffect(() => {
    if (!payment || payment.status !== "pending") return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [payment]);

  const expiresAt = useMemo(() => {
    if (payment?.status === "pending") return payment.expiresAt;
    if (order?.status === "Menunggu Pembayaran") return order.expiresAt;
    return null;
  }, [payment, order]);

  const isPaid = payment?.status === "paid" || order?.paymentStatus === "paid";
  const isPending = !isPaid && order?.paymentStatus === "pending";
  const vaNumber = payment?.vaNumber ?? invoice?.virtualAccountNumber ?? null;
  const methodLabel = payment?.methodLabel ?? invoice?.paymentMethod ?? null;

  async function handleCreatePayment() {
    if (!order) return;

    setCreating(true);
    setError("");
    setNotice("");

    try {
      const created = await createCustomerPayment(order.id, method);
      setPayment(created);
      setNotice("Pembayaran berhasil dibuat. Silakan bayar sesuai nomor Virtual Account.");
      const refreshed = await loadOrder();
      if (refreshed) setOrder(refreshed);
    } catch (cause: unknown) {
      if (isApiError(cause) && cause.status === 409) {
        setError(
          "Pesanan ini sudah memiliki pembayaran aktif. Nomor Virtual Account terbaru bisa dilihat di invoice.",
        );
        try {
          const invoiceData = await getCustomerInvoice(order.id);
          setInvoice(invoiceData);
        } catch {
          // abaikan
        }
      } else {
        setError(getApiErrorMessage(cause));
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleSimulate() {
    if (!payment) return;

    setSimulating(true);
    setError("");

    try {
      const paid = await simulateCustomerPayment(payment.paymentId);
      setPayment(paid);
      rememberPaymentId(payment.orderId, payment.paymentId);
      const refreshed = await loadOrder();
      if (refreshed) setOrder(refreshed);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause));
    } finally {
      setSimulating(false);
    }
  }

  async function handleRefresh() {
    setError("");
    try {
      const refreshed = await loadOrder();
      if (refreshed) setOrder(refreshed);

      const remembered = getRememberedPaymentId(orderId);
      if (remembered) {
        const current = await getCustomerPayment(remembered);
        setPayment(current);
      }
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause));
    }
  }

  async function copyVa() {
    if (!vaNumber) return;
    try {
      await navigator.clipboard.writeText(vaNumber.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Nomor Virtual Account tidak bisa disalin otomatis.");
    }
  }

  if (!session) return null;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/pesanan" className="hover:text-blue-600">
              Riwayat Pesanan
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">Pembayaran</span>
          </nav>

          {validOrderId && loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Memuat pesanan...
            </div>
          ) : (!validOrderId || error) && !order ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm font-semibold text-red-700">
                {!validOrderId ? "ID pesanan tidak valid." : error}
              </p>
              <Link
                href="/pesanan"
                className="mt-4 inline-flex rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Kembali ke Riwayat Pesanan
              </Link>
            </div>
          ) : !order ? null : isPaid ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mb-3 text-5xl">✅</div>
              <h1 className="text-2xl font-bold text-emerald-800">Pembayaran Berhasil</h1>
              <p className="mt-2 text-sm text-emerald-700">
                Pesanan #{order.id} sudah lunas dan akan segera diproses.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/pesanan"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Lihat Riwayat
                </Link>
                <Link
                  href={`/pesanan/invoice?id=${order.id}`}
                  className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Lihat Invoice
                </Link>
              </div>
            </div>
          ) : order.status !== "Menunggu Pembayaran" ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h1 className="text-xl font-bold text-slate-900">Pesanan Tidak Dapat Dibayar</h1>
              <p className="mt-2 text-sm text-slate-500">
                Status pesanan saat ini: <strong>{order.status}</strong>.
              </p>
              <Link
                href="/pesanan"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Kembali ke Riwayat Pesanan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Pesanan</p>
                    <p className="text-xl font-bold">#{order.id}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.items.length} produk • {order.items.reduce((sum, item) => sum + item.qty, 0)} barang
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total Tagihan</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatRupiah(order.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3">
                      <span className="min-w-0 truncate">
                        {item.productName}
                        {item.variantSize ? ` (${item.variantSize})` : ""} × {item.qty}
                      </span>
                      <span className="shrink-0 font-semibold text-slate-900">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span>Ongkos kirim ({order.courier.name} {order.courier.service})</span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(order.shippingCost)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {notice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {notice}
                </div>
              )}

              {isPending ? (
                <div className="rounded-2xl border border-amber-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Selesaikan Pembayaran</h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {methodLabel ?? "Virtual Account"}
                      </p>
                    </div>
                    {expiresAt && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                        Batas bayar: {countdown(expiresAt, now)}
                      </span>
                    )}
                  </div>

                  {vaNumber ? (
                    <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                        Nomor Virtual Account
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <p className="font-mono text-xl font-bold tracking-wider text-slate-900">
                          {vaNumber}
                        </p>
                        <button
                          onClick={copyVa}
                          className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          {copied ? "Tersalin" : "Salin"}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-amber-700">
                        Bayar melalui ATM, mobile banking, atau aplikasi bank dengan nomor di atas.
                        Status akan diperbarui otomatis.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                      Pembayaran aktif sudah dibuat. Nomor Virtual Account dapat dilihat pada
                      invoice pesanan ini.
                      <button
                        onClick={() => router.push(`/pesanan/invoice?id=${order.id}`)}
                        className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Buka Invoice
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleRefresh}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cek Status
                    </button>
                    {PAYMENT_SIMULATION_ENABLED && payment && (
                      <button
                        onClick={handleSimulate}
                        disabled={simulating}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {simulating ? "Memproses..." : "Simulasi Pembayaran Lunas"}
                      </button>
                    )}
                    <Link
                      href={`/pesanan/invoice?id=${order.id}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Lihat Invoice
                    </Link>
                  </div>

                  {PAYMENT_SIMULATION_ENABLED && !payment && (
                    <p className="mt-3 text-[11px] text-slate-400">
                      Tombol simulasi hanya muncul saat nomor pembayaran berhasil dimuat di
                      perangkat ini.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-base font-bold text-slate-900">Pilih Metode Pembayaran</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Virtual Account diproses otomatis melalui payment gateway.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {PAYMENT_METHODS.map((option) => {
                      const active = method === option.code;
                      return (
                        <button
                          key={option.code}
                          type="button"
                          onClick={() => setMethod(option.code)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                            active
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`grid h-9 w-9 place-items-center rounded-lg text-[10px] font-bold text-white ${METHOD_STYLES[option.code] ?? "bg-slate-600"}`}
                          >
                            {option.short.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-slate-900">
                              {option.short}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              Virtual Account
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleCreatePayment}
                    disabled={creating}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? "Membuat Pembayaran..." : "Buat Nomor Pembayaran"}
                  </button>
                </div>
              )}

              {order.paymentStatus === "expired" && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Pembayaran pesanan ini sudah kedaluwarsa. Silakan buat pesanan baru.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
