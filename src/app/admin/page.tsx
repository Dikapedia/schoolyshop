import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard Admin | Schooly Shop" };

const stats = [
  {
    label: "Total Produk",
    value: "48 Produk",
    subtext: "+4 produk baru minggu ini",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Total Pesanan",
    value: "10 Pesanan",
    subtext: "3 menunggu, 7 diproses/selesai",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Total Transaksi",
    value: "10 Transaksi",
    subtext: "7 lunas, 3 pending bayar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Total User",
    value: "30 User",
    subtext: "Siswa, Guru, dan Civitas",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Total Pendapatan",
    value: "Rp3.450.000",
    subtext: "Rp3.330.000 setelah retur",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const orders = [
  {
    id: "ORD-001",
    buyer: "Budi Santoso",
    meta: "Siswa • XI IPA 2",
    product: "Kemeja Batik Klasik Solo (1 pcs)",
    total: "Rp120.000",
    status: "Diproses",
    statusClass: "bg-blue-50 text-blue-700",
  },
  {
    id: "ORD-002",
    buyer: "Ghofuur Ramadhan",
    meta: "Siswa • XII Mesin",
    product: "Tote Bag Batik Parang (1 pcs)",
    total: "Rp75.000",
    status: "Menunggu Pembayaran",
    statusClass: "bg-amber-50 text-amber-700",
  },
  {
    id: "ORD-003",
    buyer: "Hardika Pratama",
    meta: "Siswa • X RPL",
    product: "Dompet Batik Kulit Sintetis (1 pcs)",
    total: "Rp65.000",
    status: "Siap Dikirim",
    statusClass: "bg-sky-50 text-sky-700",
  },
  {
    id: "ORD-004",
    buyer: "Reza Firmansyah",
    meta: "Guru • Olahraga",
    product: "Tas Anyaman Tradisional (1 pcs)",
    total: "Rp95.000",
    status: "Dikirim",
    statusClass: "bg-violet-50 text-violet-700",
  },
  {
    id: "ORD-006",
    buyer: "Dimas Prakoso",
    meta: "Siswa • XII IPA 1",
    product: "Gantungan Kunci Kayu Ukir (2 pcs)",
    total: "Rp35.000",
    status: "Selesai",
    statusClass: "bg-emerald-50 text-emerald-700",
  },
];

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-sm text-slate-400">Dashboard &gt;</div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">
          Selamat Datang di Schooly Shop — Ringkasan performa katalog, pesanan, transaksi, dan aktivitas belanja kampus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">{stat.icon}</div>
            </div>
            <p className={`text-xs mt-2 ${stat.label === "Total Produk" ? "text-emerald-600" : "text-slate-500"}`}>
              {stat.label === "Total Produk" ? (
                <span className="inline-flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {stat.subtext}
                </span>
              ) : (
                stat.subtext
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pesanan Terbaru</h2>
            <p className="text-sm text-slate-600">Daftar transaksi dan pemesanan terbaru yang masuk ke sistem Schooly Shop</p>
          </div>
          <Link href="/admin/pesanan" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua →</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">No. Pesanan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Pembeli</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Produk</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Total Pembayaran</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status Pesanan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 px-6 font-semibold text-slate-900 font-mono tracking-wide">{order.id}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{order.buyer}</div>
                    <div className="text-xs text-slate-500">{order.meta}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{order.product}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{order.total}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${order.statusClass}`}>{order.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Link href={`/admin/pesanan/${order.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
          <p className="text-sm text-slate-500">Menampilkan 5 pesanan terbaru</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-slate-400 border border-slate-200 rounded-lg cursor-not-allowed">Sebelumnya</button>
            <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
