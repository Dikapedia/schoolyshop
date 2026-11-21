"use client";

import { InfoIcon, TruckIcon } from "@/components/icons";
import type { AdminShipment, ShippingRateView } from "@/api/admin/shipments";
import type { AdminOrderDetail } from "@/api/admin/order-details";
import { formatAdminRupiah } from "@/api/admin/shared";

type KonfirmasiPengirimanModalProps = {
  shipment: AdminShipment;
  address?: string;
  quantity?: number;
  orderDetail?: AdminOrderDetail;
  shippingRates?: ShippingRateView[];
  selectedRateId?: string | number;
  onRateSelect?: (rateId: string | number) => void;
  loadingRates?: boolean;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
};

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KonfirmasiPengirimanModal({
  shipment,
  address = "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150",
  quantity = 1,
  orderDetail,
  shippingRates,
  selectedRateId,
  onRateSelect,
  loadingRates = false,
  busy = false,
  error,
  onClose,
  onConfirm,
}: KonfirmasiPengirimanModalProps) {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#071b45]/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="konfirmasi-pengiriman-title"
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6"
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

        <div className="flex items-start gap-3 pr-8">
          <span className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TruckIcon width={22} height={22} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="konfirmasi-pengiriman-title" className="text-lg font-bold text-slate-900">
                Konfirmasi Pengiriman
              </h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-blue-600">
                BITESHIP
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Periksa rincian pengiriman sebelum meneruskan order ke kurir Biteship
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Ringkasan Pesanan
            </span>
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
              {shipment.orderId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-slate-500">Nama Penerima</span>
                <span className="text-sm font-semibold text-slate-900 text-right">{shipment.customer}</span>
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                <span className="text-xs text-slate-500">Total Nilai Pesanan</span>
                <span className="text-sm font-semibold text-slate-900 text-right">{shipment.total}</span>
              </div>
              <p className="text-xs text-slate-500 mt-3 mb-1.5">Alamat Tujuan Pengantaran</p>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 leading-relaxed">
                {address}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-slate-500">Produk</span>
                <span className="text-sm text-slate-700 text-right">
                  {shipment.product} ({quantity} pcs)
                </span>
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                <span className="text-xs text-slate-500">Berat Paket</span>
                <span className="text-sm text-slate-700 text-right">
                  {orderDetail?.totalWeight
                    ? `${orderDetail.totalWeight.toLocaleString("id-ID")} gram`
                    : "350 gram (0.35 kg)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <TruckIcon width={16} height={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Pilihan Kurir &amp; Layanan Pengiriman</h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
              {shippingRates && shippingRates.length > 0
                ? `${shippingRates.length} tarif tersedia`
                : "Real-time Tarif API"}
            </span>
          </div>

          <div className="space-y-2">
            {loadingRates ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                Memuat tarif pengiriman...
              </div>
            ) : shippingRates && shippingRates.length > 0
              ? shippingRates.map((rate) => {
                  const isSelected = selectedRateId === rate.id;
                  return (
                    <div
                      key={String(rate.id)}
                      onClick={() => onRateSelect?.(rate.id)}
                      className={`rounded-xl border p-4 cursor-pointer transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/60"
                          : "border-slate-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{rate.courier}</span>
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                              {rate.service}
                            </span>
                            {rate.badge && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                {rate.badge}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <ClockIcon />
                            {rate.eta} • {rate.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            {formatAdminRupiah(rate.price)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isSelected ? "Terpilih" : "Ongkir"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : (
                  <div className="rounded-xl border-2 border-blue-500 bg-blue-50/60 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">J&amp;T Express</span>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                            Regular
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            Rekomendasi
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <ClockIcon />
                          Estimasi 2-3 Hari • Drop-off / Pickup
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">Ongkir Standar</span>
                    </div>
                  </div>
                )}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-3">
          <span className="h-7 w-7 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <InfoIcon width={15} height={15} />
          </span>
          <p className="text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold">Catatan Simulasi:</span> Integrasi sistem kurir terhubung via
            Biteship API. Nomor resi otomatis digenerate setelah konfirmasi.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Terkoneksi API:</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Biteship Sandbox Aktif
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TruckIcon width={17} height={17} />
              {busy ? "Memproses..." : "Konfirmasi Pengiriman"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
