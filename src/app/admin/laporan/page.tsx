"use client";

import Link from "next/link";
import { useState } from "react";
import {
  SELLER_AVATAR_CLASS,
  SELLER_ROLE_CLASS,
  SALES_REPORT,
  formatReportDate,
  formatRupiah,
} from "@/lib/shop/admin-sales-report";

const DEFAULT_START = "2026-10-01";
const DEFAULT_END = "2026-10-31";

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V15M12 15L7.5 10.5M12 15L16.5 10.5M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5H20L13.5 12.5V19L10.5 21V12.5L4 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12A9 9 0 004.2 7.5M3 4V9H8M3 12A9 9 0 0019.8 16.5M21 20V15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9H14C17.866 9 21 12.134 21 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 7V5C20 4.46957 19.7893 3.96086 19.4142 3.58579C19.0391 3.21071 18.5304 3 18 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9C21 8.46957 20.7893 7.96086 20.4142 7.58579C20.0391 7.21071 19.5304 7 19 7H20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12H17M3 7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6H21L19 14H8L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L5 3H2M9 18.5H9.01M18 18.5H18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SalesStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10H21M7 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LaporanPenjualanPage() {
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);
  const [seller, setSeller] = useState("all");
  const [appliedSeller, setAppliedSeller] = useState("all");

  const rows =
    appliedSeller === "all"
      ? SALES_REPORT
      : SALES_REPORT.filter((row) => row.business === appliedSeller);

  const total = rows.reduce(
    (acc, row) => ({
      sold: acc.sold + row.sold,
      sales: acc.sales + row.total,
      refund: acc.refund + row.refund,
      net: acc.net + row.net,
    }),
    { sold: 0, sales: 0, refund: 0, net: 0 }
  );

  const period = `${formatReportDate(startDate)} - ${formatReportDate(endDate)}`;

  const handleDownload = () => {
    const header = [
      "No",
      "Nama Penjual",
      "Nama Usaha",
      "Produk Terjual",
      "Total Penjualan",
      "Pengembalian Dana",
      "Pendapatan Bersih",
    ];
    const body = rows.map((row, index) => [
      index + 1,
      row.name,
      row.business,
      row.sold,
      row.total,
      row.refund,
      row.net,
    ]);
    const summary = ["Total", "", "", total.sold, total.sales, total.refund, total.net];
    const csv = [header, ...body, summary]
      .map((line) => line.join(","))
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-penjualan-${startDate}-${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setStartDate(DEFAULT_START);
    setEndDate(DEFAULT_END);
    setSeller("all");
    setAppliedSeller("all");
  };

  const stats = [
    {
      title: "Total Penjualan",
      value: formatRupiah(total.sales),
      description: "Dari seluruh transaksi kotor",
      valueClass: "text-slate-900",
      iconClass: "bg-blue-50 text-blue-600",
      icon: <SalesStatIcon />,
    },
    {
      title: "Jumlah Terjual",
      value: `${total.sold} Produk`,
      description: `Tersebar di ${rows.length} unit usaha`,
      valueClass: "text-slate-900",
      iconClass: "bg-sky-50 text-sky-600",
      icon: <CartStatIcon />,
    },
    {
      title: "Pengembalian Dana",
      value: formatRupiah(total.refund),
      description: total.refund > 0 ? "1 retur telah disetujui" : "Tidak ada retur",
      valueClass: "text-red-600",
      iconClass: "bg-red-50 text-red-500",
      icon: <ReturnIcon />,
    },
    {
      title: "Pendapatan Bersih",
      value: formatRupiah(total.net),
      description: "Hasil bersih setelah retur",
      valueClass: "text-emerald-600",
      iconClass: "bg-emerald-50 text-emerald-600",
      icon: <WalletIcon />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>Dashboard</span>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Laporan Penjualan</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Laporan Penjualan</h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Melihat dan menganalisis hasil penjualan, perputaran produk, serta pendapatan bersih
              berdasarkan periode dan penjual/supplier.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <DownloadIcon />
            Unduh Laporan
          </button>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label htmlFor="tanggal-mulai" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tanggal Mulai
            </label>
            <input
              id="tanggal-mulai"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="tanggal-akhir" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tanggal Akhir
            </label>
            <input
              id="tanggal-akhir"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="pilihan-penjual" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Pilihan Penjual
            </label>
            <select
              id="pilihan-penjual"
              value={seller}
              onChange={(event) => setSeller(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Penjual</option>
              {SALES_REPORT.map((row) => (
                <option key={row.id} value={row.business}>
                  {row.name} — {row.business}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAppliedSeller(seller)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              <FilterIcon />
              Tampilkan
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
              aria-label="Segarkan filter"
            >
              <RefreshIcon />
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-600">{stat.title}</p>
                <p className={`text-xl font-bold mt-1 ${stat.valueClass}`}>{stat.value}</p>
              </div>
              <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${stat.iconClass}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Rincian Penjualan Penjual</h2>
            <p className="text-xs text-slate-500 mt-0.5">Periode {period}</p>
          </div>
          <span className="text-xs font-medium text-slate-500">{rows.length} Penjual Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">No.</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Nama Penjual</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Nama Usaha</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Produk Terjual</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Total Penjualan</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Pengembalian Dana</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Pendapatan Bersih</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${SELLER_AVATAR_CLASS[row.roleTone]}`}>
                        {row.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${SELLER_ROLE_CLASS[row.roleTone]}`}>
                          {row.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-700">{row.business}</td>
                  <td className="px-4 py-4 text-slate-700">{row.sold} pcs</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{formatRupiah(row.total)}</td>
                  <td className={`px-4 py-4 font-semibold ${row.refund > 0 ? "text-red-600" : "text-slate-500"}`}>
                    {formatRupiah(row.refund)}
                  </td>
                  <td className={`px-4 py-4 font-semibold ${row.net > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                    {formatRupiah(row.net)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/laporan/${row.id}`}
                      className="inline-flex flex-col items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold leading-tight text-slate-700 hover:bg-slate-50 transition"
                    >
                      <span>Lihat</span>
                      <span>Detail</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/60 font-bold text-slate-900">
                <td colSpan={3} className="px-4 py-3.5 text-sm">Total Keseluruhan</td>
                <td className="px-4 py-3.5 text-sm">{total.sold} pcs</td>
                <td className="px-4 py-3.5 text-sm">{formatRupiah(total.sales)}</td>
                <td className="px-4 py-3.5 text-sm text-red-600">{formatRupiah(total.refund)}</td>
                <td className="px-4 py-3.5 text-sm text-emerald-600">{formatRupiah(total.net)}</td>
                <td className="px-4 py-3.5" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}
