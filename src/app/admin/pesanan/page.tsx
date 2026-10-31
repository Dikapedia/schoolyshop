"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ADMIN_ORDERS,
  ORDER_STATUS_OPTIONS,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/shop/admin-orders";

const PAGE_SIZE = 10;

const PAYMENT_FILTERS = ["Semua Pembayaran", "Berhasil", "Menunggu Pembayaran"] as const;

function getBadgeTone(status: PaymentStatus | OrderStatus) {
  switch (status) {
    case "Berhasil":
    case "Selesai":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
    case "Menunggu Pembayaran":
      return { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
    case "Menunggu Verifikasi":
    case "Diproses":
      return { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" };
    case "Dikirim":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
    default:
      return { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" };
  }
}

function StatusBadge({ label }: { label: PaymentStatus | OrderStatus }) {
  const tone = getBadgeTone(label);
  const multiline = label === "Menunggu Pembayaran";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${tone.badge} ${
        multiline ? "px-3 py-1.5 text-[11px] leading-tight max-w-[110px]" : "px-2.5 py-1 text-xs whitespace-nowrap"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${tone.dot}`} />
      <span className={multiline ? "whitespace-normal" : "whitespace-nowrap"}>{label}</span>
    </span>
  );
}

export default function PesananPage() {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<(typeof PAYMENT_FILTERS)[number]>("Semua Pembayaran");
  const [orderFilter, setOrderFilter] = useState<"Semua Status Pesanan" | OrderStatus>("Semua Status Pesanan");
  const [page, setPage] = useState(1);

  const filteredOrders = ADMIN_ORDERS.filter((order) => {
    const keyword = query.trim().toLowerCase();
    const matchesKeyword =
      !keyword ||
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword);
    const matchesPayment = paymentFilter === "Semua Pembayaran" || order.paymentStatus === paymentFilter;
    const matchesOrder = orderFilter === "Semua Status Pesanan" || order.orderStatus === orderFilter;

    return matchesKeyword && matchesPayment && matchesOrder;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startIndex = filteredOrders.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const waitingPayment = ADMIN_ORDERS.filter((order) => order.paymentStatus === "Menunggu Pembayaran").length;
  const paymentSuccess = ADMIN_ORDERS.filter((order) => order.paymentStatus === "Berhasil").length;
  const inProcess = ADMIN_ORDERS.filter((order) => order.orderStatus === "Diproses").length;

  const stats = [
    {
      label: "Total Pesanan",
      value: ADMIN_ORDERS.length,
      description: "Total keseluruhan pesanan",
      labelClass: "text-slate-600",
      valueClass: "text-slate-900",
      descriptionClass: "text-slate-500",
      iconClass: "bg-blue-50 text-blue-600",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Menunggu Pembayaran",
      value: waitingPayment,
      description: "Perlu konfirmasi bayar",
      labelClass: "text-orange-500",
      valueClass: "text-orange-500",
      descriptionClass: "text-slate-500",
      iconClass: "bg-amber-50 text-amber-500",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Pembayaran Berhasil",
      value: paymentSuccess,
      description: "Dana telah terverifikasi",
      labelClass: "text-emerald-600",
      valueClass: "text-emerald-600",
      descriptionClass: "text-slate-500",
      iconClass: "bg-emerald-50 text-emerald-600",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8.5 12L11 14.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Sedang Diproses",
      value: inProcess,
      description: `${inProcess} pesanan diproses / dikirim`,
      labelClass: "text-blue-600",
      valueClass: "text-blue-600",
      descriptionClass: "text-slate-500",
      iconClass: "bg-blue-50 text-blue-600",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5281 18.364 18.364C17.5281 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5281 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 4V9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const resetFilters = () => {
    setQuery("");
    setPaymentFilter("Semua Pembayaran");
    setOrderFilter("Semua Status Pesanan");
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Pesanan</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Daftar Pesanan</h1>
        <p className="text-sm text-slate-600 mt-1">Kelola pesanan dan pantau status pembayaran pelanggan.</p>
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nomor pesanan atau nama pelanggan"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value as (typeof PAYMENT_FILTERS)[number]);
                setPage(1);
              }}
              className="appearance-none w-full xl:w-auto min-w-[180px] pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAYMENT_FILTERS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="relative">
            <select
              value={orderFilter}
              onChange={(e) => {
                setOrderFilter(e.target.value as "Semua Status Pesanan" | OrderStatus);
                setPage(1);
              }}
              className="appearance-none w-full xl:w-auto min-w-[200px] pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Semua Status Pesanan</option>
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            aria-label="Segarkan data"
            className="h-[42px] w-[42px] rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center transition xl:ml-auto shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5281 18.364 18.364C17.5281 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5281 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 4V9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-sm font-medium ${stat.labelClass}`}>{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.valueClass}`}>{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${stat.iconClass}`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-xs mt-2 ${stat.descriptionClass}`}>{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide w-16">No.</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nomor Pesanan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Pelanggan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Produk</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Total Pembayaran</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status Pembayaran</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status Pesanan</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 text-slate-500">{startIndex + index}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{order.id}</td>
                  <td className="py-4 px-6 text-slate-700">{order.customer}</td>
                  <td className="py-4 px-6 text-slate-700">{order.product}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{order.total}</td>
                  <td className="py-4 px-6">
                    <StatusBadge label={order.paymentStatus} />
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge label={order.orderStatus} />
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/pesanan/${order.id}`}
                      className="inline-flex flex-col items-center gap-0.5 text-blue-600 hover:text-blue-700 transition"
                      title="Lihat detail pesanan"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12S5 5 12 5C19 5 22 12 22 12S19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs leading-tight text-center">
                        Lihat
                        <br />
                        Detail
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-slate-500">
                    Pesanan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
          <p className="text-sm text-slate-500">
            Menampilkan {paginatedOrders.length} dari {filteredOrders.length} pesanan
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                currentPage === 1
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-8 w-8 text-sm rounded-lg font-semibold transition ${
                  currentPage === pageNumber
                    ? "text-white bg-blue-600"
                    : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                currentPage === totalPages
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
