"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  EyeIcon,
  PackageIcon,
  ReceiptIcon,
  TruckIcon,
} from "@/components/icons";
import {
  ADMIN_RETURNS,
  getReturnStatusTone,
  RETURN_STATUS_OPTIONS,
  type ReturnStatus,
} from "@/lib/shop/admin-returns";

function HourglassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3H17M7 21H17M8 3V7L12 11L16 7V3M8 21V17L12 13L16 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STATUS_STYLES = [
  {
    label: "Menunggu Persetujuan",
    value: "1",
    description: "Perlu tindakan verifikasi segera",
    tone: "border-t-orange-400",
    descriptionClass: "text-orange-500",
    iconClass: "bg-amber-50 text-amber-500",
    icon: <HourglassIcon />,
  },
  {
    label: "Menunggu Barang Kembali",
    value: "1",
    description: "Dalam pengiriman oleh kurir",
    tone: "border-t-blue-400",
    descriptionClass: "text-blue-600",
    iconClass: "bg-blue-50 text-blue-600",
    icon: <PackageIcon width={20} height={20} />,
  },
  {
    label: "Pengembalian Diproses",
    value: "1",
    description: "Proses refund dana / tukar stok",
    tone: "border-t-purple-400",
    descriptionClass: "text-purple-600",
    iconClass: "bg-purple-50 text-purple-600",
    icon: <RefreshIcon />,
  },
  {
    label: "Pengembalian Selesai",
    value: "2",
    description: "Kasus berhasil ditutup",
    tone: "border-t-emerald-400",
    descriptionClass: "text-emerald-600",
    iconClass: "bg-emerald-50 text-emerald-600",
    icon: <CheckCircleIcon width={20} height={20} />,
  },
];

export default function PengembalianBarangPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua Status" | ReturnStatus>("Semua Status");

  const filteredReturns = ADMIN_RETURNS.filter((item) => {
    const keyword = query.trim().toLowerCase();
    const matchesKeyword =
      !keyword ||
      item.id.toLowerCase().includes(keyword) ||
      item.customer.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === "Semua Status" || item.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/pengiriman" className="hover:text-slate-600">Pengiriman &amp; Pengembalian</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Pengembalian Barang</span>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
        <Link
          href="/admin/pengiriman"
          className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px border-transparent text-slate-500 hover:text-slate-700 transition"
        >
          <TruckIcon width={17} height={17} />
          Pengiriman
        </Link>
        <Link
          href="/admin/pengiriman/pengembalian"
          className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px border-blue-600 text-blue-600"
        >
          <ReceiptIcon width={17} height={17} />
          Pengembalian
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[11px] font-bold text-red-600">
            1
          </span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pengembalian Barang</h1>
        <p className="text-sm text-slate-600 mt-1">Kelola permintaan retur barang dari pembeli.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATUS_STYLES.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl border border-slate-200 border-t-4 ${stat.tone} p-5 shadow-sm`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {stat.value} <span className="text-sm font-medium text-slate-600">Permintaan</span>
                </p>
              </div>
              <span className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${stat.iconClass}`}>
                {stat.icon}
              </span>
            </div>
            <p className={`text-xs mt-2 ${stat.descriptionClass}`}>{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari id pesanan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative xl:ml-auto">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "Semua Status" | ReturnStatus)}
              className="appearance-none w-full xl:w-auto min-w-[180px] pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter status pengembalian"
            >
              <option>Semua Status</option>
              {RETURN_STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">No. Pesanan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Pembeli</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Produk</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Alasan Pengembalian</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Tanggal Pengajuan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((item) => {
                const tone = getReturnStatusTone(item.status);
                return (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/admin/pesanan/${item.id}`} className="font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">
                        {item.id}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${item.avatarClass}`}>
                          {item.initials}
                        </span>
                        <span className="font-semibold text-slate-900 whitespace-nowrap">{item.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{item.product}</td>
                    <td className="py-4 px-6 text-slate-700">{item.reason}</td>
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{item.submittedAt}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${tone.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {item.status === "Menunggu Persetujuan" ? (
                        <Link
                          href={`/admin/pengiriman/pengembalian/${item.id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition whitespace-nowrap"
                        >
                          Periksa Pengembalian
                        </Link>
                      ) : (
                        <Link
                          href={`/admin/pengiriman/pengembalian/${item.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap"
                        >
                          <EyeIcon width={14} height={14} />
                          Lihat Detail
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-slate-500">
                    Permintaan pengembalian tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
          <p className="text-sm text-slate-500">
            Menampilkan {filteredReturns.length} dari {filteredReturns.length} permintaan pengembalian
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              aria-label="Halaman sebelumnya"
              className="h-8 w-8 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
            >
              <ChevronLeftIcon width={15} height={15} />
            </button>
            <button
              type="button"
              className="h-8 w-8 text-sm rounded-lg font-semibold text-white bg-blue-600"
            >
              1
            </button>
            <button
              type="button"
              disabled
              aria-label="Halaman selanjutnya"
              className="h-8 w-8 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
