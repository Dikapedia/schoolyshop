"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  StoreIcon,
  TruckIcon,
} from "@/components/icons";
import { getAdminOrderDetail } from "@/lib/shop/admin-order-details";

const rupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`;

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
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

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
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

function SyncIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 2L21 6L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 22L3 18L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HasilVerifikasiPesananPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminOrderDetail(id);
  const [bannerOpen, setBannerOpen] = useState(true);

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

  const seller = detail.items[0]?.seller ?? "-";
  const products = detail.items.map((item) => `${item.name} (${item.quantity} pcs)`).join(", ");

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/pesanan" className="hover:text-slate-600">Pesanan &amp; Transaksi</Link>
          <span>&gt;</span>
          <Link href={`/admin/pesanan/${detail.id}`} className="hover:text-slate-600">
            Detail Pesanan #{detail.id}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Hasil Verifikasi</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pesanan Berhasil Diverifikasi</h1>
            <p className="text-sm text-slate-600 mt-1">
              Status pesanan telah diperbarui dan diteruskan ke pihak penyedia produk.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start lg:self-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Tersinkronisasi ke Ekosistem
          </span>
        </div>
      </div>

      {bannerOpen && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircleIcon width={22} height={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-emerald-700">Pesanan Berhasil Diverifikasi!</h2>
            <p className="text-sm text-emerald-800/80 mt-1 leading-relaxed">
              Pesanan {detail.id} berhasil diverifikasi. Pesanan kini berstatus Diproses dan siap
              dilanjutkan ke tahap pemrosesan oleh penjual.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBannerOpen(false)}
            className="h-8 w-8 shrink-0 rounded-lg text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition"
            aria-label="Tutup banner"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DocumentIcon />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ringkasan Pesanan</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Rincian data transaksi dan pembeli yang telah tervalidasi
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 whitespace-nowrap">
            <LockIcon className="text-slate-500" />
            Data Terenkripsi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Nomor Pesanan</span>
              <span className="text-sm font-mono font-bold text-slate-900 text-right">{detail.id}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Nama Pembeli</span>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{detail.buyer.name}</p>
                <p className="text-xs text-slate-500">({detail.buyer.type})</p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Produk</span>
              <span className="text-sm text-slate-700 text-right">{products}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Total Pembayaran</span>
              <span className="text-lg font-bold text-blue-600 text-right">{rupiah(detail.summary.total)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Status Pembayaran</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckIcon width={13} height={13} />
                Berhasil
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border-t border-slate-100">
            <div className="flex items-center justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Status Pesanan</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                <SyncIcon />
                Diproses
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Tanggal Verifikasi</span>
              <span className="text-sm text-slate-700 text-right">{detail.verifiedAt}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Penjual / Supplier</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 text-right">
                <StoreIcon width={15} height={15} className="text-slate-400" />
                {seller}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm text-slate-500 shrink-0">Metode Pembayaran</span>
              <div className="text-right">
                <p className="text-sm text-slate-700">{detail.transaction.method}</p>
                <p className="text-xs font-medium text-emerald-600 mt-0.5">Lunas Otomatis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-white text-blue-600 flex items-center justify-center">
            <TruckIcon width={22} height={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Langkah Selanjutnya</h2>
              <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                Panduan Operasional
              </span>
            </div>
            <p className="text-sm text-blue-900/80 mt-1 leading-relaxed">
              Pesanan telah diverifikasi. Setelah pesanan siap dikirim, admin dapat melanjutkan
              proses melalui menu{" "}
              <Link href="/admin/pengiriman" className="font-semibold text-blue-700 hover:text-blue-800 underline">
                Pengiriman
              </Link>
              .
            </p>

            <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4 flex items-start gap-3">
              <span className="h-7 w-7 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <InfoIcon />
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">
                Catatan Ekspedisi: Nomor resi pengiriman akan diperoleh secara otomatis ketika admin
                memproses pengiriman melalui integrasi ekspedisi Biteship pada menu Pengiriman.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate-500">
          Sistem Schooly Shop • Auto-synchronized 09:40 WIB
        </p>
        <Link
          href="/admin/pesanan"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <ChevronLeftIcon width={16} height={16} />
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    </div>
  );
}
