"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  EyeIcon,
  MapPinIcon,
  PlusIcon,
  ReceiptIcon,
  TruckIcon,
} from "@/components/icons";
import {
  ADMIN_SHIPMENTS,
  BITESHIP_COURIER,
  createTrackingNumber,
  SHIPMENT_STATUS_OPTIONS,
  type AdminShipment,
  type ShipmentStatus,
} from "@/lib/shop/admin-shipments";
import KonfirmasiPengirimanModal from "@/components/admin/KonfirmasiPengirimanModal";

function getStatusTone(status: ShipmentStatus) {
  switch (status) {
    case "Siap Dikirim":
      return { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
    case "Dikirim":
      return { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" };
    case "Selesai":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  }
}

function StatusBadge({ status }: { status: ShipmentStatus }) {
  const tone = getStatusTone(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${tone.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13L11 15L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PengirimanPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<AdminShipment[]>(ADMIN_SHIPMENTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua Status" | ShipmentStatus>("Semua Status");
  const [createFor, setCreateFor] = useState<AdminShipment | null>(null);

  const filteredShipments = shipments.filter((shipment) => {
    const keyword = query.trim().toLowerCase();
    const matchesKeyword =
      !keyword ||
      shipment.id.toLowerCase().includes(keyword) ||
      shipment.customer.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === "Semua Status" || shipment.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const readyCount = shipments.filter((item) => item.status === "Siap Dikirim").length;
  const shippingCount = shipments.filter((item) => item.status === "Dikirim").length;
  const doneCount = shipments.filter((item) => item.status === "Selesai").length;

  const stats = [
    {
      label: "Siap Dikirim",
      value: `${readyCount} pesanan`,
      description: "Perlu diproses & cetak label",
      labelClass: "text-orange-500",
      valueClass: "text-orange-500",
      iconClass: "bg-amber-50 text-amber-500",
      icon: <ClipboardIcon />,
    },
    {
      label: "Sedang Dikirim",
      value: `${shippingCount} pesanan`,
      description: "Dalam proses kurir ekspedisi",
      labelClass: "text-blue-600",
      valueClass: "text-blue-600",
      iconClass: "bg-blue-50 text-blue-600",
      icon: <TruckIcon width={20} height={20} />,
    },
    {
      label: "Selesai",
      value: `${doneCount} pesanan`,
      description: "Telah diterima oleh pembeli",
      labelClass: "text-emerald-600",
      valueClass: "text-emerald-600",
      iconClass: "bg-emerald-50 text-emerald-600",
      icon: <CheckCircleIcon width={20} height={20} />,
    },
  ];

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("Semua Status");
  };

  const handleCreateShipment = () => {
    if (!createFor) return;
    const shipmentId = createFor.id;
    const trackingNumber = createTrackingNumber(BITESHIP_COURIER);
    setShipments((prev) =>
      prev.map((item) =>
        item.id === shipmentId
          ? { ...item, courier: BITESHIP_COURIER, trackingNumber, status: "Dikirim" }
          : item,
      ),
    );
    setCreateFor(null);
    router.push(`/admin/pengiriman/${shipmentId}`);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Pengiriman &amp; Pengembalian</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Pengiriman &amp; Pengembalian</h1>
        <p className="text-sm text-slate-600 mt-1">
          Kelola pengiriman pesanan serta permohonan pengembalian barang dan dana pembeli secara terpadu.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
        <Link
          href="/admin/pengiriman"
          className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px border-blue-600 text-blue-600"
        >
          <TruckIcon width={17} height={17} />
          Pengiriman
        </Link>
        <Link
          href="/admin/pengiriman/pengembalian"
          className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px border-transparent text-slate-500 hover:text-slate-700 transition"
        >
          <ReceiptIcon width={17} height={17} />
          Pengembalian
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[11px] font-bold text-red-600">
            1
          </span>
        </Link>
      </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-medium ${stat.labelClass}`}>{stat.label}</p>
                    <p className={`text-lg font-bold mt-1 ${stat.valueClass}`}>{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${stat.iconClass}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xs mt-2 text-slate-500">{stat.description}</p>
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
                  placeholder="Cari nomor pesanan atau nama pembeli..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2 xl:ml-auto">
                <label htmlFor="status-pengiriman" className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  Status:
                </label>
                <div className="relative">
                  <select
                    id="status-pengiriman"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as "Semua Status" | ShipmentStatus)}
                    className="appearance-none w-full xl:w-auto min-w-[160px] pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Semua Status</option>
                    {SHIPMENT_STATUS_OPTIONS.map((option) => (
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
                  className="h-[42px] w-[42px] rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center transition shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5281 18.364 18.364C17.5281 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5281 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 4V9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60">
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide w-16">No</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nomor Pesanan</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Pembeli</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Produk</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Total Pembayaran</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Kurir</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nomor Resi</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status Pengiriman</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment, index) => {
                    const courierPending = shipment.courier === "Belum dipilih";
                    const trackingPending = shipment.trackingNumber === "Belum tersedia";

                    return (
                      <tr key={shipment.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6 text-slate-500">{index + 1}</td>
                        <td className="py-4 px-6">
                          <Link href={`/admin/pesanan/${shipment.id}`} className="font-bold text-blue-600 hover:text-blue-700">
                            {shipment.id}
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <span className="block max-w-[150px] font-semibold text-slate-900 leading-tight">
                            {shipment.customer}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-700">{shipment.product}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">{shipment.total}</td>
                        <td className={`py-4 px-6 ${courierPending ? "italic text-slate-400" : "text-slate-700"}`}>
                          {shipment.courier}
                        </td>
                        <td className={`py-4 px-6 ${trackingPending ? "italic text-slate-400" : "font-mono text-slate-700"}`}>
                          {shipment.trackingNumber}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={shipment.status} />
                        </td>
                        <td className="py-4 px-6">
                          {shipment.status === "Siap Dikirim" && (
                            <button
                              type="button"
                              onClick={() => setCreateFor(shipment)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition whitespace-nowrap"
                            >
                              <PlusIcon width={14} height={14} />
                              Buat Pengiriman
                            </button>
                          )}
                          {shipment.status === "Dikirim" && (
                            <Link
                              href={`/admin/pengiriman/${shipment.id}/pelacakan`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap"
                            >
                              <MapPinIcon width={14} height={14} />
                              Lacak
                            </Link>
                          )}
                          {shipment.status === "Selesai" && (
                            <Link
                              href={`/admin/pesanan/${shipment.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition whitespace-nowrap"
                            >
                              <EyeIcon width={14} height={14} />
                              Detail
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredShipments.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 px-6 text-center text-slate-500">
                        Pengiriman tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
              <p className="text-sm text-slate-500">
                Menampilkan {filteredShipments.length} dari {filteredShipments.length} pengiriman
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="px-3 py-1.5 text-sm border rounded-lg text-slate-300 border-slate-200 cursor-not-allowed"
                >
                  Sebelumnya
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
                  className="px-3 py-1.5 text-sm border rounded-lg text-slate-300 border-slate-200 cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
      {createFor && (
        <KonfirmasiPengirimanModal
          shipment={createFor}
          onClose={() => setCreateFor(null)}
          onConfirm={handleCreateShipment}
        />
      )}

    </div>
  );
}
