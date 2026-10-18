import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Admin | Schooly Shop" };

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-sm text-slate-500">Dashboard &gt;</h2>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">
          Selamat Datang di Schooly Shop — Ringkasan performa katalog, pesanan, transaksi, dan aktivitas belanja kampus.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs font-medium">Total Produk</p>
              <p className="text-xl font-bold text-slate-900 mt-1">0 Produk</p>
              <p className="text-[11px] text-slate-500 mt-1">Belum ada data</p>
            </div>
            <span className="text-2xl shrink-0"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs font-medium">Total Pesanan</p>
              <p className="text-xl font-bold text-slate-900 mt-1">0 Pesanan</p>
              <p className="text-[11px] text-slate-500 mt-1">Belum ada data</p>
            </div>
            <span className="text-2xl shrink-0"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs font-medium">Total Transaksi</p>
              <p className="text-xl font-bold text-slate-900 mt-1">0 Transaksi</p>
              <p className="text-[11px] text-slate-500 mt-1">Belum ada data</p>
            </div>
            <span className="text-2xl shrink-0"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs font-medium">Total User</p>
              <p className="text-xl font-bold text-slate-900 mt-1">0 User</p>
              <p className="text-[11px] text-slate-500 mt-1">Belum ada data</p>
            </div>
            <span className="text-2xl shrink-0"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs font-medium">Total Pendapatan</p>
              <p className="text-xl font-bold text-slate-900 mt-1">Rp0</p>
              <p className="text-[11px] text-slate-500 mt-1">Belum ada data</p>
            </div>
            <span className="text-2xl shrink-0"></span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pesanan Terbaru</h3>
            <p className="text-sm text-slate-600">Daftar transaksi dan pemesanan terbaru yang masuk ke sistem Schooly Shop</p>
          </div>
          <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
            Lihat Semua →
          </a>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs">NO. PESANAN</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs">NAMA PEMBELI</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs">PRODUK</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs">TOTAL PEMBAYARAN</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs">STATUS PESANAN</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase text-xs">AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-semibold text-slate-900">-</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900">-</div>
                  <div className="text-xs text-slate-500">-</div>
                </td>
                <td className="py-3 px-4 text-slate-700">-</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Rp0</td>
                <td className="py-3 px-4 text-slate-500">-</td>
                <td className="py-3 px-4 text-slate-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center text-sm text-slate-500">
          Belum ada pesanan. Sistem kosong.
        </div>
      </div>
    </div>
  );
}
