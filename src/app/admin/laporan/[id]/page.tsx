"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  formatRupiah,
  getSellerReportDetail,
} from "@/lib/shop/admin-sales-report";

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V15M12 15L7.5 10.5M12 15L16.5 10.5M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M6 12H6.01M18 12H18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8H18L19 21H5L6 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11V16M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OutboundIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3H21V10M21 3L13 11M10 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const STATUS_CLASS = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
};

export default function RincianPenjualanPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getSellerReportDetail(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [disbursed, setDisbursed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Rincian penjual tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Data penjual dengan nomor tersebut tidak tersedia.</p>
        <Link
          href="/admin/laporan"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Kembali ke Laporan Penjualan
        </Link>
      </div>
    );
  }

  const { seller, products, totals, period } = detail;
  const unitName = seller.role.split(" — ")[1] ?? seller.business;
  const unitBadge =
    seller.roleTone === "siswa"
      ? "Unit Siswa Aktif"
      : seller.roleTone === "guru"
        ? "Unit Guru Aktif"
        : "Unit Karyawan Aktif";
  const fundDestination =
    seller.roleTone === "siswa"
      ? `rekening kas unit usaha siswa/jurusan ${unitName}`
      : `rekening kas unit usaha ${seller.business}`;

  const handleDownload = () => {
    const header = [
      "No",
      "Nama Produk",
      "SKU",
      "Kategori",
      "Harga Satuan",
      "Terjual",
      "Total Penjualan",
      "Pengembalian",
      "Pendapatan Bersih",
      "Status",
    ];
    const body = products.map((product, index) => [
      index + 1,
      product.name,
      product.sku,
      product.category,
      product.unitPrice,
      product.sold,
      product.total,
      product.refund,
      product.net,
      product.status,
    ]);
    const summary = [
      "Total",
      "",
      "",
      "",
      "",
      totals.sold,
      totals.total,
      totals.refund,
      totals.net,
      "Terverifikasi",
    ];
    const csv = [header, ...body, summary]
      .map((line) => line.join(","))
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rincian-penjualan-${seller.business.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/laporan" className="hover:text-slate-600">Laporan Penjualan</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">
            Rincian Penjualan {seller.name} ({seller.business})
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mt-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Rincian Penjualan — {seller.business}
              </h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {unitBadge}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 mt-2">
              <span>
                Periode: <span className="font-medium text-slate-700">{period}</span>
              </span>
              <span className="text-slate-300">|</span>
              <span>
                Penjual: <span className="font-semibold text-slate-700">{seller.name}</span>{" "}
                <span>({seller.role})</span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/admin/laporan"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Kembali ke Laporan Penjualan
            </Link>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              <DownloadIcon />
              Unduh Rincian (PDF / Excel)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-600">Total Penjualan Bruto</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatRupiah(totals.total)}</p>
            </div>
            <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MoneyIcon />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              ↗ 100% Target
            </span>
            <span className="text-xs text-slate-500">omzet bulan ini</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-600">Produk Terjual</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{totals.sold} pcs</p>
            </div>
            <div className="h-9 w-9 shrink-0 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <BagIcon />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{products.length} variasi produk dalam katalog</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-600">Pengembalian Dana (Retur)</p>
              <p className="text-xl font-bold text-red-600 mt-1">{formatRupiah(totals.refund)}</p>
            </div>
            <div className="h-9 w-9 shrink-0 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <ReturnIcon />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              {totals.refund > 0 ? "1 item disetujui" : "Tidak ada retur"}
            </span>
            <span className="text-xs text-slate-500">
              {totals.refund > 0 ? "retur ukuran" : "tanpa retur"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm ring-1 ring-blue-100">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-600">Pendapatan Bersih</p>
              <p className="text-xl font-bold text-blue-700 mt-1">{formatRupiah(totals.net)}</p>
            </div>
            <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <WalletIcon />
            </div>
          </div>
          <p className={`text-xs mt-2 ${disbursed ? "text-slate-500" : "text-emerald-600"}`}>
            {disbursed ? "Dana sudah disalurkan ke kas unit" : "Siap Disalurkan ke kas unit siswa"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">
              <ListIcon />
            </span>
            <h2 className="text-base font-bold text-slate-900">Daftar Produk Terjual &amp; Pengembalian</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Menampilkan {products.length} Baris Data Produk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">No.</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Nama Produk &amp; SKU</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Kategori</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Harga Satuan</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Terjual</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Total Penjualan</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Pengembalian (Retur)</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Pendapatan Bersih</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Status Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">SKU: {product.sku}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{product.category}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">{formatRupiah(product.unitPrice)}</p>
                    {product.priceNote && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{product.priceNote}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{product.sold} pcs</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{formatRupiah(product.total)}</td>
                  <td className={`px-4 py-4 font-semibold ${product.refund > 0 ? "text-red-600" : "text-slate-500"}`}>
                    {product.refund > 0 ? `-${formatRupiah(product.refund)}` : "Rp0"}
                    {product.refundNote && (
                      <p className="text-[10px] font-normal text-red-500 mt-0.5">{product.refundNote}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{formatRupiah(product.net)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_CLASS[product.statusTone]}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/60 font-bold">
                <td colSpan={4} className="px-4 py-3.5 text-sm text-slate-900">Total Ringkasan</td>
                <td className="px-4 py-3.5 text-sm text-blue-600">{totals.sold} pcs</td>
                <td className="px-4 py-3.5 text-sm text-slate-900">{formatRupiah(totals.total)}</td>
                <td className="px-4 py-3.5 text-sm text-red-600">
                  {totals.refund > 0 ? `-${formatRupiah(totals.refund)}` : "Rp0"}
                </td>
                <td className="px-4 py-3.5 text-sm text-blue-700">{formatRupiah(totals.net)}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                    Terverifikasi
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <InfoIcon />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Status Rekonsiliasi &amp; Penyaluran Dana
                </h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  disbursed ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${disbursed ? "bg-blue-500" : "bg-emerald-500"}`} />
                  {disbursed ? "Dana Disalurkan" : "Siap Transfer"}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Pendapatan bersih sebesar{" "}
                <span className="font-semibold text-slate-900">{formatRupiah(totals.net)}</span>{" "}
                {disbursed ? "telah disalurkan ke" : "siap diteruskan ke"} {fundDestination}.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Lihat Riwayat Kas
            </button>
            {disbursed ? (
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white">
                <OutboundIcon />
                Dana Telah Disalurkan
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                <OutboundIcon />
                Konfirmasi Penyaluran
              </button>
            )}
          </div>
        </div>
      </section>

      {confirmOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#071b45]/60 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            <h2 className="text-lg font-bold text-slate-900">Konfirmasi Penyaluran Dana?</h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Dana bersih sebesar{" "}
              <span className="font-semibold text-slate-900">{formatRupiah(totals.net)}</span> akan
              disalurkan ke {fundDestination}. Pastikan retur dan rekonsiliasi sudah sesuai sebelum
              melanjutkan.
            </p>
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">Penerima</span>
                <span className="font-semibold text-slate-900 text-right">{seller.business}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs mt-1.5">
                <span className="text-slate-500">Jumlah</span>
                <span className="font-bold text-blue-700">{formatRupiah(totals.net)}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisbursed(true);
                  setConfirmOpen(false);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Ya, Salurkan Dana
              </button>
            </div>
          </div>
        </div>
      )}

      {historyOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#071b45]/60 backdrop-blur-sm"
            onClick={() => setHistoryOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Riwayat Kas</h2>
                <p className="text-xs text-slate-500 mt-0.5">{seller.business} • {period}</p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                aria-label="Tutup riwayat kas"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-900">Penerimaan penjualan bruto</p>
                  <p className="text-[11px] text-slate-500">{period}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">+{formatRupiah(totals.total)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-900">Pengembalian dana retur</p>
                  <p className="text-[11px] text-slate-500">
                    {totals.refund > 0 ? "1 item retur ukuran" : "Tidak ada retur"}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${totals.refund > 0 ? "text-red-600" : "text-slate-400"}`}>
                  {totals.refund > 0 ? `-${formatRupiah(totals.refund)}` : "Rp0"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-900">Penyaluran ke unit usaha</p>
                  <p className="text-[11px] text-slate-500">{disbursed ? "Telah disalurkan" : "Belum disalurkan"}</p>
                </div>
                <span className={`text-sm font-semibold ${disbursed ? "text-blue-700" : "text-slate-400"}`}>
                  {disbursed ? `-${formatRupiah(totals.net)}` : "—"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-xs text-slate-500">Saldo bersih</span>
              <span className="text-sm font-bold text-blue-700">{formatRupiah(totals.net)}</span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
