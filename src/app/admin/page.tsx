"use client";

import Link from "next/link";
import {
  getAdminDashboardSummary,
  getAdminRecentOrders,
} from "@/api/admin/dashboard";
import {
  BarChartIcon,
  CreditCardIcon,
  PackageIcon,
  ReceiptIcon,
  UsersIcon,
} from "@/components/icons";
import {
  Card,
  ErrorState,
  LoadingState,
  PageHeader,
  StatCard,
  StatusBadge,
  Table,
  Td,
  Th,
} from "@/components/admin/ui";
import { useAsyncData } from "@/lib/use-async-data";

const STAT_ICONS = [
  <PackageIcon key="products" width={18} height={18} />,
  <ReceiptIcon key="orders" width={18} height={18} />,
  <CreditCardIcon key="transactions" width={18} height={18} />,
  <UsersIcon key="users" width={18} height={18} />,
  <BarChartIcon key="revenue" width={18} height={18} />,
];

export default function AdminPage() {
  const { data, loading, error, reload } = useAsyncData(
    "admin-dashboard",
    async () => {
      const [summary, orders] = await Promise.all([
        getAdminDashboardSummary(),
        getAdminRecentOrders(),
      ]);
      return { summary, orders };
    },
  );

  if (loading) return <LoadingState label="Memuat ringkasan dashboard..." />;
  if (error || !data) {
    return <ErrorState message={error || "Data dashboard tidak tersedia."} onRetry={reload} />;
  }

  const stats = Array.isArray(data.summary?.stats) ? data.summary.stats : [];
  const orders = Array.isArray(data.orders) ? data.orders : [];

  return (
    <div>
      <PageHeader
        breadcrumb={<span className="font-medium text-blue-600">Dashboard</span>}
        title="Dashboard"
        description="Selamat Datang di Schooly Shop — Ringkasan performa katalog, pesanan, transaksi, dan aktivitas belanja kampus."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.subtext}
            icon={STAT_ICONS[index]}
            tone={index === 0 ? "success" : "info"}
          />
        ))}
      </div>

      <Card>
        <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pesanan Terbaru</h2>
            <p className="text-sm text-slate-600">
              Daftar transaksi dan pemesanan terbaru yang masuk ke sistem Schooly Shop
            </p>
          </div>
          <Link
            href="/admin/pesanan"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Lihat Semua →
          </Link>
        </div>

        <Table minWidth={980}>
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50/60">
              <Th>No. Pesanan</Th>
              <Th>Nama Pembeli</Th>
              <Th>Produk</Th>
              <Th>Total Pembayaran</Th>
              <Th>Status Pesanan</Th>
              <Th>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40"
              >
                <Td className="font-mono font-semibold text-slate-900">
                  {order.id}
                </Td>
                <Td>
                  <div className="font-medium text-slate-900">{order.customer}</div>
                  {order.buyerType && (
                    <div className="text-xs text-slate-500">{order.buyerType}</div>
                  )}
                </Td>
                <Td className="text-slate-700">{order.product}</Td>
                <Td className="font-semibold text-slate-900">{order.total}</Td>
                <Td>
                  <StatusBadge status={order.orderStatus} />
                </Td>
                <Td>
                  <Link
                    href={`/admin/pesanan/${order.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Detail
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 text-sm text-slate-500">
          <span>Menampilkan {orders.length} pesanan terbaru</span>
          <Link href="/admin/pesanan" className="font-semibold text-blue-600">
            Selanjutnya →
          </Link>
        </div>
      </Card>
    </div>
  );
}
