"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import { getCustomerOrder, type CustomerOrder } from "@/api/customer/orders";
import { createReturn, uploadReturnPhoto } from "@/api/returns";

export default function ReturPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const orderId = Number(searchParams.get("id") ?? "");
  const validOrderId = Number.isFinite(orderId) && orderId > 0;
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/retur");
      return;
    }
    if (!validOrderId) return;

    let active = true;
    getCustomerOrder(orderId)
      .then((found) => {
        if (active) setOrder(found);
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

  async function handleSubmit() {
    if (!order || !session) return;
    const items = order.items
      .filter((item) => reasons[item.id]?.trim())
      .map((item) => ({
        orderItemId: item.id,
        qty: item.qty,
        reason: reasons[item.id].trim(),
      }));

    if (items.length === 0) {
      setError("Pilih setidaknya satu item untuk dikembalikan.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const created = await createReturn({ orderId: order.id, items });
      if (photos.length > 0) {
        await uploadReturnPhoto(Number(created.id), photos);
      }
      setSubmitted(true);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause, "Gagal menyimpan permintaan pengembalian."));
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) return null;
  if (validOrderId && loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Memuat...</div>;
  if (!validOrderId || error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {!validOrderId ? "ID pesanan tidak diberikan." : error || "Pesanan tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <h2 className="text-2xl font-bold text-emerald-800">Permintaan Pengembalian Dikirim</h2>
              <p className="mt-2 text-sm text-emerald-700">Terima kasih, tim kami akan memproses pengembalian Anda.</p>
              <button onClick={() => router.push("/pesanan")} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Kembali ke Riwayat
              </button>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-2xl font-bold">Ajukan Pengembalian</h1>
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Order ID: {order.id}</p>
                <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
              </div>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 rounded border border-slate-200 bg-white p-3">
                    <div className="flex-1">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        Qty: {item.qty} • {formatRupiah(item.unitPrice)}
                      </p>
                      <textarea
                        placeholder="Alasan pengembalian"
                        value={reasons[item.id] ?? ""}
                        onChange={(event) =>
                          setReasons((prev) => ({ ...prev, [item.id]: event.target.value }))
                        }
                        className="mt-2 w-full rounded border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <label className="mt-4 block rounded-xl border border-dashed border-slate-300 bg-white p-4">
                <span className="text-sm font-semibold text-slate-700">Foto bukti (opsional, maksimal 5)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="mt-2 block w-full text-sm text-slate-600"
                  onChange={(event) => setPhotos(Array.from(event.target.files ?? []).slice(0, 5))}
                />
                {photos.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">{photos.length} foto dipilih.</p>
                )}
              </label>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Mengirim..." : "Kirim Permintaan Pengembalian"}
              </button>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
