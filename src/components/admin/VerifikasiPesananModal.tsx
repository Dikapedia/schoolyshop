"use client";

import { CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";
import type { AdminOrderDetail } from "@/lib/shop/admin-order-details";

const rupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`;

type VerifikasiPesananModalProps = {
  detail: AdminOrderDetail;
  onClose: () => void;
  onConfirm: () => void;
};

export default function VerifikasiPesananModal({
  detail,
  onClose,
  onConfirm,
}: VerifikasiPesananModalProps) {
  const productNames = detail.items.map((item) => item.name).join(", ") || "-";
  const paymentPaid = detail.paymentStatus === "Berhasil";

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="konfirmasi-verifikasi-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition"
          aria-label="Tutup"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheckIcon width={30} height={30} />
          </div>
          <h2 id="konfirmasi-verifikasi-title" className="mt-4 text-xl font-bold text-slate-900">
            Konfirmasi Verifikasi Pesanan
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin memverifikasi pesanan ini? Pastikan informasi pesanan dan
            pembayaran telah sesuai sebelum pesanan diteruskan ke tahap pemrosesan.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-slate-500">Nomor Pesanan</span>
              <span className="font-mono font-bold text-slate-900 text-right">{detail.id}</span>
            </div>
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-slate-500">Nama Pembeli</span>
              <span className="font-semibold text-slate-900 text-right">{detail.buyer.name}</span>
            </div>
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-slate-500">Produk</span>
              <span className="text-slate-700 text-right">{productNames}</span>
            </div>
          </div>

          <div className="my-3 border-t border-slate-200" />

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Total Pembayaran</span>
              <span className="text-base font-bold text-blue-600 text-right">
                {rupiah(detail.summary.total)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Status Pembayaran</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  paymentPaid
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    paymentPaid ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {paymentPaid ? "Berhasil" : "Menunggu Pembayaran"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <CheckCircleIcon width={17} height={17} />
            Ya, Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
}
