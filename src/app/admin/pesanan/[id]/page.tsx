"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
  StoreIcon,
  UserIcon,
} from "@/components/icons";
import VerifikasiPesananModal from "@/components/admin/VerifikasiPesananModal";
import { getAdminOrderDetail } from "@/lib/shop/admin-order-details";

const rupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`;

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2V8H20M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShirtIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 2L12 5L9 2L3 5V9L6 8V22H18V8L21 9V5L15 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DetailPesananPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
  const detail = getAdminOrderDetail(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Pesanan tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Data pesanan dengan nomor tersebut tidak tersedia.</p>
        <Link
          href="/admin/pesanan"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeftIcon width={16} height={16} />
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  const paymentPaid = detail.paymentStatus === "Berhasil";
  const canVerify = detail.orderStatus === "Menunggu Verifikasi";
  const totalItems = detail.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/pesanan" className="hover:text-slate-600">Pesanan &amp; Transaksi</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Detail Pesanan #{detail.id}</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Detail Pesanan #{detail.id}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {detail.orderStatus}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                paymentPaid
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <CheckIcon width={14} height={14} />
              {paymentPaid ? "Pembayaran Berhasil" : "Menunggu Pembayaran"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <PrinterIcon width={16} height={16} />
              Cetak Invoice
            </button>
            {canVerify ? (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                <CheckCircleIcon width={16} height={16} />
                Verifikasi Pesanan
              </button>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700">
                <CheckIcon width={16} height={16} />
                Pesanan Terverifikasi
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserIcon width={17} height={17} />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Informasi Pembeli</h2>
            </div>
            <span className="rounded-full bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 whitespace-nowrap">
              {detail.buyer.type}
            </span>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-y border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Nama Pembeli</span>
              <span className="text-sm font-semibold text-slate-900 text-right">{detail.buyer.name}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Nomor WhatsApp / Kontak</span>
              <a
                href={`tel:${detail.buyer.contact.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 text-right"
              >
                <PhoneIcon width={14} height={14} />
                {detail.buyer.contact}
              </a>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Email</span>
              <span className="text-sm text-slate-700 text-right break-all">{detail.buyer.email}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Tanggal &amp; Waktu Pesanan</span>
              <span className="text-sm text-slate-700 text-right">{detail.buyer.orderedAt}</span>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-500 mb-2">Alamat Pengiriman</p>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-4">
              <MapPinIcon width={20} height={20} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">{detail.buyer.address}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <DocumentIcon />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Informasi Transaksi</h2>
            </div>
            <span className="rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 whitespace-nowrap">
              {detail.transaction.provider}
            </span>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-y border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Metode Pembayaran</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 text-right">
                <CreditCardIcon width={14} height={14} className="text-slate-500" />
                {detail.transaction.method}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">ID Transaksi</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono font-medium text-slate-700 text-right">
                {detail.transaction.transactionId}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Waktu Pembayaran</span>
              <span className="text-sm text-slate-700 text-right">{detail.transaction.paidAt}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Status Pembayaran</span>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold text-right ${
                  paymentPaid ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {paymentPaid ? <CheckCircleIcon width={15} height={15} /> : null}
                {paymentPaid ? "Berhasil (Otomatis via Midtrans)" : "Menunggu Pembayaran"}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 border border-blue-100 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-blue-900">Total Pembayaran</p>
                <p className="text-xs text-blue-600 mt-0.5">Lunas via Payment Gateway</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{rupiah(detail.summary.total)}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DocumentIcon />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Rincian Produk</h2>
            <span className="text-sm text-slate-500">({totalItems} item dipesan)</span>
          </div>
          <p className="text-sm text-slate-600">
            Gudang Penyedia: <span className="font-semibold text-slate-900">{detail.warehouse}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs tracking-wide">Produk</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs tracking-wide">Penjual / Supplier</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs tracking-wide">Jumlah</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs tracking-wide">Harga Satuan</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs tracking-wide">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detail.items.map((item) => (
                <tr key={`${item.sku}-${item.name}`} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center">
                        <ShirtIcon />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-700">
                      <StoreIcon width={15} height={15} className="text-slate-400" />
                      {item.seller}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 whitespace-nowrap">{item.quantity} pcs</td>
                  <td className="py-4 px-4 text-slate-700 whitespace-nowrap">{rupiah(item.unitPrice)}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">{rupiah(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-5">
          <div className="w-full sm:w-80 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal Produk</span>
              <span className="font-medium text-slate-800">{rupiah(detail.summary.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Ongkos Kirim ({detail.summary.shippingLabel})</span>
              <span className="font-medium text-emerald-600">{rupiah(detail.summary.shippingCost)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm font-semibold text-slate-900">Total Pembayaran</span>
              <span className="text-xl font-bold text-blue-600">{rupiah(detail.summary.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[#eef4ff] border border-blue-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="h-9 w-9 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <InfoIcon />
            </span>
            <p className="text-sm text-blue-900 leading-relaxed">
              {canVerify
                ? `Pembayaran telah terverifikasi via Midtrans. Pesanan memerlukan konfirmasi dan verifikasi admin sebelum diteruskan ke ${detail.items[0]?.seller ?? "supplier"} untuk dipacking.`
                : `Pembayaran telah terverifikasi via Midtrans. Pesanan telah diverifikasi admin dan diteruskan ke ${detail.items[0]?.seller ?? "supplier"} untuk dipacking.`}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 self-start sm:self-center rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
              paymentPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            <CheckIcon width={14} height={14} />
            {detail.transaction.settledLabel}
          </span>
        </div>
      </section>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Sinkronisasi otomatis dengan server aktif
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/admin/pesanan"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ChevronLeftIcon width={16} height={16} />
            Kembali ke Daftar Pesanan
          </Link>
          {canVerify ? (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              <CheckIcon width={16} height={16} />
              Verifikasi Pesanan
            </button>
          ) : (
            <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700">
              <CheckIcon width={16} height={16} />
              Pesanan Terverifikasi
            </span>
          )}
        </div>
      </div>

      {confirmOpen && (
        <VerifikasiPesananModal
          detail={detail}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            router.push(`/admin/pesanan/${detail.id}/verifikasi`);
          }}
        />
      )}
    </div>
  );
}
