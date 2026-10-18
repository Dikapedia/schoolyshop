"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon } from "@/components/icons";
import { clearSession } from "@/lib/auth/session";

const MENU_ITEMS = [
  { icon: "", label: "Dashboard", href: "/admin" },
  { icon: "", label: "Penjual / Supplier", href: "/admin/penjual" },
  { icon: "", label: "Produk", href: "/admin/produk" },
  { icon: "", label: "Data User", href: "/admin/data-user" },
  { icon: "", label: "Pesanan & Transaksi", href: "/admin/pesanan" },
  { icon: "", label: "Pengiriman & Pengambalian", href: "/admin/pengiriman" },
  { icon: "", label: "Laporan Penjualan", href: "/admin/laporan" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const notificationCount = 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-0"
        } overflow-hidden bg-blue-700 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-5 border-b border-blue-600">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl"></span>
            <div>
              <div>Schooly Shop</div>
              <div className="text-xs font-normal text-blue-100">Admin Management</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-blue-600 p-3">
          <button
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition text-sm font-medium text-left"
          >
            <span></span>
            <span>Logout</span>
          </button>
          <div className="mt-2 px-4 py-2 bg-blue-600 rounded-lg text-xs">
            <div className="font-semibold">AP</div>
            <div className="text-blue-100">admin@schooly.sch.id</div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl text-slate-600 hover:text-slate-900"
            >
              ☰
            </button>

            <div className="flex-1 max-w-sm mx-6">
              <input
                type="text"
                placeholder="Cari pesanan, produk, atau data…"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 bg-green-600 rounded-full" />
            Sistem Terintegrasi Online
          </div>
          <button className="relative text-slate-600 hover:text-slate-900" aria-label="Notifikasi">
            <BellIcon className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
              <div className="flex items-center gap-2 pl-6 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">Admin</div>
                  <div className="text-xs text-slate-500">Pengelola</div>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  AP
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
