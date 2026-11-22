"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image-url";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import {
  getCustomerOrder,
  receiveCustomerOrder,
  type CustomerOrder,
} from "@/api/customer/orders";
import { site } from "@/lib/site";

export default function TerimaPesananPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const orderId = Number(searchParams.get("id") ?? "");
  const validOrderId = Number.isFinite(orderId) && orderId > 0;
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/terima");
      return;
    }

    if (!validOrderId) {
      return;
    }

    let active = true;
    getCustomerOrder(orderId)
      .then((data) => {
        if (active) setOrder(data);
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session, router, orderId, validOrderId]);

  async function handleConfirm() {
    if (!order) return;

    setSubmitting(true);
    setError("");

    try {
      const updated = await receiveCustomerOrder(order.id);
      setOrder(updated);
      setConfirmed(true);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause));
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) return null;
  if (validOrderId && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Memuat detail pesanan...
      </div>
    );
  }
  if (!validOrderId || (error && !order)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-slate-500">
        <p>{!validOrderId ? "ID pesanan belum diberikan." : error}</p>
        <button
          onClick={() => router.push("/pesanan")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Kembali ke Riwayat Pesanan
        </button>
      </div>
    );
  }
  if (!order) return null;

  const address = [
    order.shipping.address,
    order.shipping.district,
    order.shipping.city,
    order.shipping.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {!confirmed ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">ID Pesanan</p>
                  <p className="text-2xl font-bold">#{order.id}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {order.status}
                </span>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-bold text-slate-900">Info Pengiriman</h3>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Kurir</p>
                    <p className="font-semibold">
                      {order.courier.name} {order.courier.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estimasi</p>
                    <p className="font-semibold">{order.courier.eta}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-500">Alamat Pengiriman</p>
                    <p className="font-semibold">{address || "-"}</p>
                    <p className="text-xs text-slate-500">Kode Pos: {order.shipping.postalCode}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold text-slate-900">Isi Pesanan</h3>
                <ul className="space-y-2">
                  {order.items.map((item) => {
                    const image = resolveImageUrl(item.productImage);
                    return (
                      <li
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-xl">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={image}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              "🛍️"
                            )}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{item.productName}</p>
                            <p className="text-xs text-slate-500">
                              Qty: {item.qty} x {formatRupiah(item.unitPrice)}
                              {item.variantSize ? ` • ${item.variantSize}` : ""}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-blue-600">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 text-sm">
                  <span className="font-semibold text-slate-700">Total Pembayaran: </span>
                  <span className="ml-2 text-base font-bold text-blue-600">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "✓ Konfirmasi Pesanan Diterima"}
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Dengan mengkonfirmasi, Anda menyatakan telah menerima pesanan dalam kondisi baik.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mb-4 text-5xl">✅</div>
              <h2 className="text-2xl font-bold text-emerald-800">Pesanan Berhasil Diterima!</h2>
              <p className="mt-2 text-sm text-emerald-700">
                Terima kasih telah menyelesaikan transaksi di <strong>{site.school}</strong>.
              </p>
              <p className="mt-1 text-xs text-emerald-600">Status pesanan: {order.status}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => router.push("/pesanan")}
                  className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Lihat Riwayat
                </button>
                <button
                  onClick={() => router.push("/keranjang")}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Belanja Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
