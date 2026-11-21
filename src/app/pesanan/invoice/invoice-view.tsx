"use client";

import Image from "next/image";
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
  getCustomerInvoice,
  paymentStatusLabel,
} from "@/api/customer/orders";
import type { CustomerInvoice } from "@/api/customer/schemas";
import { site } from "@/lib/site";

export default function InvoiceView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const invoiceId = Number(searchParams.get("id") ?? "");
  const validInvoiceId = Number.isFinite(invoiceId) && invoiceId > 0;
  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan");
      return;
    }

    if (!validInvoiceId) {
      return;
    }

    let active = true;
    getCustomerInvoice(invoiceId)
      .then((data) => {
        if (active) setInvoice(data);
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
  }, [session, router, invoiceId, validInvoiceId]);

  if (!session) return null;
  if (validInvoiceId && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Memuat detail invoice...
      </div>
    );
  }
  if (!validInvoiceId || error || !invoice) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-slate-500">
        <p>
          {!validInvoiceId
            ? "ID pesanan belum diberikan."
            : error || "Invoice tidak ditemukan."}
        </p>
        <button
          onClick={() => router.push("/pesanan")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Kembali ke Riwayat Pesanan
        </button>
      </div>
    );
  }

  const paid = invoice.paymentStatus === "paid";

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-400">Invoice</p>
            <p className="mt-0.5 text-2xl font-bold">{invoice.invoiceNumber}</p>
            <p className="mt-1 text-xs text-slate-400">
              Terbit:{" "}
              {new Date(invoice.issuedAt).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              Status Pembayaran:{" "}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {paymentStatusLabel(invoice.paymentStatus, invoice.paymentMethod)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Komunitas</p>
            <p className="mt-0.5 text-xl font-bold">{site.school}</p>
            <p className="text-xs text-slate-500">
              Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung
            </p>
            <p className="text-xs text-slate-500">Pesanan #{invoice.orderId}</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Konsumen</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{invoice.customerName}</p>
                <p className="text-slate-500">{invoice.customerType}</p>
                <p className="text-slate-500">Email: {invoice.customerEmail}</p>
                <p className="text-slate-500">Kontak: {invoice.customerPhone}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Alamat Pengiriman</p>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-semibold">{invoice.recipient}</p>
                <p className="text-slate-500">{invoice.shippingAddress}</p>
                <p className="text-slate-500">Kode Pos: {invoice.shippingPostalCode}</p>
                <p className="text-slate-500">
                  Kurir: {invoice.courier.name} {invoice.courier.service} ({invoice.courier.eta})
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Produk</p>
              <ul className="divide-y divide-slate-100">
                {invoice.items.map((item) => {
                  const image = resolveImageUrl(item.productImage);
                  return (
                    <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-lg">
                        {image ? (
                          <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                        ) : (
                          "🛍️"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{item.productName}</p>
                        <p className="text-xs text-slate-500">
                          {item.qty} unit × {formatRupiah(item.unitPrice)}
                          {item.variantSize ? ` • ${item.variantSize}` : ""}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Subtotal Produk</span>
                  <span className="font-bold text-slate-900">{formatRupiah(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Ongkos Kirim</span>
                  <span className="font-bold text-slate-900">{formatRupiah(invoice.shippingCost)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-blue-600">{formatRupiah(invoice.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Aksi Invoice</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-lg">🖨️</span> Cetak
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-lg">⬇️</span> Unduh PDF
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Rincian Pembayaran</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {paid ? "Lunas" : "Belum Lunas"}
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Metode Pembayaran</span>
                  <span className="font-medium">{invoice.paymentMethod ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nomor Virtual Account</span>
                  <span className="font-mono font-bold">
                    {invoice.virtualAccountNumber ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status Pesanan</span>
                  <span className="font-medium">{invoice.status}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-blue-600">
                  <span>Total Tagihan</span>
                  <span>{formatRupiah(invoice.total)}</span>
                </div>
              </div>
              {!paid && (
                <button
                  onClick={() => router.push(`/pesanan/bayar?id=${invoice.orderId}`)}
                  className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                >
                  Bayar Sekarang
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Penjual &amp; Koperasi</p>
              <div className="space-y-1.5 text-sm text-slate-700">
                <p className="font-semibold">{site.school}</p>
                <p className="text-slate-500">
                  Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung
                </p>
              </div>
              <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                Butuh konfirmasi? Hubungi admin koperasi sekolah.
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
