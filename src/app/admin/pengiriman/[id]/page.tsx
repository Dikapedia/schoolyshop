"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  InfoIcon,
  MapPinIcon,
  PrinterIcon,
  TruckIcon,
} from "@/components/icons";
import { getAdminShipmentDetail } from "@/lib/shop/admin-shipments";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 2V6M16 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m3.3 7.7 8.7 4.8 8.7-4.8M12 12.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DetailPengirimanPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminShipmentDetail(id);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Pengiriman tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Data pengiriman dengan nomor tersebut tidak tersedia.</p>
        <Link
          href="/admin/pengiriman"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeftIcon width={16} height={16} />
          Kembali ke Pengiriman
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/pengiriman" className="hover:text-slate-600">Pengiriman &amp; Pengembalian</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Detail Pengiriman</span>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <CheckCircleIcon width={22} height={22} />
        </div>
        <div>
          <h2 className="text-base font-bold text-emerald-700">Pengiriman Berhasil Dibuat!</h2>
          <p className="text-sm text-emerald-800/80 mt-1 leading-relaxed">
            Pesanan {detail.id} telah berhasil didaftarkan ke sistem Biteship dan siap dipickup oleh
            kurir.
          </p>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TruckIcon width={20} height={20} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Detail Pengiriman <span className="text-sm font-medium text-slate-400">(Biteship)</span>
                </h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                  Pesanan #{detail.id}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Kelola dan pantau informasi manifes penjemputan logistik kampus
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {detail.status}
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            <div>
              <p className="text-xs text-slate-500 mb-1">Nomor Pesanan</p>
              <p className="text-sm font-mono font-bold text-slate-900">{detail.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Nama Penerima</p>
              <p className="text-sm font-semibold text-slate-900">{detail.recipient}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Produk</p>
              <p className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                <span className="h-5 w-5 rounded bg-slate-200/80 text-slate-500 flex items-center justify-center">
                  <BoxIcon />
                </span>
                {detail.product} ({detail.quantity} pcs)
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Total Nilai Pesanan</p>
              <p className="text-sm font-bold text-blue-600">{detail.total}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Nama Kurir &amp; Layanan</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="h-5 rounded bg-[#e30613] px-1.5 text-[10px] font-black leading-5 text-white">
                  J&amp;T
                </span>
                <span className="text-sm text-slate-700">{detail.service}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Nomor Resi</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-mono font-semibold text-slate-900">{detail.trackingNumber}</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Simulasi Prototype
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Tanggal Pengiriman</p>
              <p className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                <CalendarIcon className="text-slate-400" />
                {detail.shippedAt}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500 mb-1">Alamat Tujuan</p>
            <p className="flex items-start gap-1.5 text-sm text-slate-700 leading-relaxed">
              <MapPinIcon width={15} height={15} className="mt-0.5 shrink-0 text-blue-600" />
              {detail.address}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-3">
          <span className="h-7 w-7 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <InfoIcon width={15} height={15} />
          </span>
          <p className="text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold">Keterangan:</span> Nomor resi ini merupakan data simulasi,
            bukan nomor resi asli. Pada implementasi sistem sesungguhnya, nomor resi diperoleh otomatis
            melalui API integrasi Biteship.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-5">
          <Link
            href="/admin/pengiriman"
            aria-label="Kembali ke Pengiriman"
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <ChevronLeftIcon width={16} height={16} />
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/pengiriman/${detail.id}/label`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <PrinterIcon width={16} height={16} />
              Cetak Label Pengiriman
            </Link>
            <Link
              href={`/admin/pengiriman/${detail.id}/pelacakan`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              <MapPinIcon width={16} height={16} />
              Lihat Pelacakan
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
