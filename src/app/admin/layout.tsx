"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChartIcon,
  BellIcon,
  HomeIcon,
  PackageIcon,
  ReceiptIcon,
  StoreIcon,
  TruckIcon,
  UsersIcon,
} from "@/components/icons";
import { clearSession } from "@/lib/auth/session";

type MenuIconName = "dashboard" | "seller" | "product" | "order" | "shipping" | "users" | "report";

type MenuItem = {
  label: string;
  href: string;
  icon: MenuIconName;
  lines?: string[];
  children?: { label: string; href: string }[];
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Penjual / Supplier", href: "/admin/penjual", icon: "seller" },
  {
    label: "Produk",
    href: "/admin/produk",
    icon: "product",
    children: [
      { label: "Kelola Produk", href: "/admin/produk" },
      { label: "Kategori Produk", href: "/admin/produk/kategori" },
    ],
  },
  { label: "Data User", href: "/admin/data-user", icon: "users" },
  {
    label: "Pesanan & Transaksi",
    href: "/admin/pesanan",
    icon: "order",
    lines: ["Pesanan &", "Transaksi"],
  },
  {
    label: "Pengiriman & Pengembalian",
    href: "/admin/pengiriman",
    icon: "shipping",
    lines: ["Pengiriman &", "Pengembalian"],
  },
  { label: "Laporan Penjualan", href: "/admin/laporan", icon: "report" },
];

function MenuIcon({ name, className }: { name: MenuIconName; className?: string }) {
  const props = { width: 17, height: 17, className, "aria-hidden": true } as const;

  switch (name) {
    case "dashboard":
      return <HomeIcon {...props} />;
    case "seller":
      return <StoreIcon {...props} />;
    case "product":
      return <PackageIcon {...props} />;
    case "order":
      return <ReceiptIcon {...props} />;
    case "shipping":
      return <TruckIcon {...props} />;
    case "users":
      return <UsersIcon {...props} />;
    case "report":
      return <BarChartIcon {...props} />;
  }
}

function MenuLabel({ item }: { item: MenuItem }) {
  if (item.lines) {
    return (
      <span className="leading-tight">
        {item.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </span>
    );
  }
  return <span>{item.label}</span>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const notificationCount = 1;

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isKategoriPage = pathname.startsWith("/admin/produk/kategori");
  const isLaporanPage = pathname.startsWith("/admin/laporan");
  const isLaporanDetailPage = /^\/admin\/laporan\/[^/]+/.test(pathname);
  const isDataUserPage = pathname.startsWith("/admin/data-user");
  const isUserDetailPage = pathname.startsWith("/admin/data-user/");
  const isPesananPage = pathname.startsWith("/admin/pesanan");
  const isPesananDetailPage = /^\/admin\/pesanan\/[^/]+/.test(pathname);
  const isPengirimanPage = pathname.startsWith("/admin/pengiriman");
  const isPengirimanDetailPage = /^\/admin\/pengiriman\/[^/]+/.test(pathname);
  const isLabelPage = /^\/admin\/pengiriman\/[^/]+\/label/.test(pathname);
  const isTrackingPage = /^\/admin\/pengiriman\/[^/]+\/pelacakan/.test(pathname);
  const isPengembalianPage = pathname.startsWith("/admin/pengiriman/pengembalian");
  const isPengembalianDetailPage = /^\/admin\/pengiriman\/pengembalian\/[^/]+/.test(pathname);
  const isPengembalianHasilPage =
    /^\/admin\/pengiriman\/pengembalian\/[^/]+\/(disetujui|ditolak)/.test(pathname);

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden bg-[#0d47b8] text-white transition-all duration-300 flex flex-col`}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 12V16C6 17.6569 8.68629 19 12 19C15.3137 19 18 17.6569 18 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 10V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold leading-tight">Schooly Shop</div>
              <div className="text-xs text-blue-100/90 leading-tight">Admin Management</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            if (item.children && isPesananPage) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive(item.href)
                      ? "bg-[#2563eb] font-semibold"
                      : "hover:bg-white/10 font-medium"
                  }`}
                >
                  <MenuIcon name={item.icon} className="shrink-0 text-blue-100" />
                  <MenuLabel item={item} />
                </Link>
              );
            }

            if (item.children) {
              const parentActive = pathname === item.href;
              return (
                <div key={item.href} className="space-y-1">
                  <div
                    className={`flex items-center rounded-lg text-sm transition ${
                      parentActive ? "bg-[#2563eb] font-semibold" : "hover:bg-white/10 font-medium"
                    }`}
                  >
                    <Link href={item.href} className="flex flex-1 items-center gap-3 px-4 py-2.5">
                      <MenuIcon name={item.icon} className="shrink-0 text-blue-100" />
                      <MenuLabel item={item} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmenuOpen((open) => !open)}
                      className="px-3 py-2.5"
                      aria-label={submenuOpen ? "Sembunyikan submenu" : "Tampilkan submenu"}
                      aria-expanded={submenuOpen}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform ${submenuOpen ? "" : "-rotate-90"}`}
                      >
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {submenuOpen && (
                    <div className="space-y-1 pb-1">
                      {item.children.map((child) => {
                        const childActive =
                          child.href === "/admin/produk"
                            ? pathname === "/admin/produk"
                            : pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-2.5 pl-6 pr-4 py-2 rounded-lg text-[13px] transition ${
                              childActive
                                ? "bg-[#2563eb] font-semibold text-white"
                                : "text-blue-100 hover:bg-white/10 font-medium"
                            }`}
                          >
                            {child.href === "/admin/produk" ? (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="3" width="18" height="5" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3L12 10H3L8 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
                                <rect x="13" y="13" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive(item.href)
                    ? "bg-[#2563eb] font-semibold"
                    : "hover:bg-white/10 font-medium"
                }`}
              >
                <MenuIcon name={item.icon} className="shrink-0 text-blue-100" />
                <span className="flex-1">
                  <MenuLabel item={item} />
                </span>
                {isActive(item.href) &&
                  (item.href === "/admin/pesanan" || item.href === "/admin/pengiriman") && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm font-medium text-left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-300">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4 px-6 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-slate-900 transition"
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder={
                    isLaporanDetailPage
                      ? "Cari data laporan, nomor pesanan..."
                      : isLaporanPage
                      ? "Cari data, nomor pesanan, penjual..."
                      : isPengembalianHasilPage
                      ? "Cari ID pesanan, nama pembeli, atau resi..."
                      : isPengembalianDetailPage
                        ? "Cari ID pesanan, nama pembeli, atau retur..."
                      : isPengembalianPage
                        ? "Cari pesanan, pembeli..."
                        : isTrackingPage
                        ? "Cari nomor resi, pesanan, kurir..."
                        : isLabelPage
                        ? "Cari resi / paket..."
                        : isKategoriPage
                        ? "Cari data kategori, produk, kode sku..."
                        : isPengirimanDetailPage
                          ? "Cari resi, pesanan, pembeli..."
                          : isPesananDetailPage
                          ? "Cari di Schooly Shop..."
                          : isPesananPage || isPengirimanPage
                            ? "Cari data, nomor pesanan..."
                          : isUserDetailPage
                            ? "Cari data, ID, transaksi..."
                            : "Cari fitur, data transaksi, produk..."
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              {isLaporanPage && (
                <span className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 whitespace-nowrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Semester Ganjil 2026/2027
                </span>
              )}
              <button
                className={`relative text-slate-500 hover:text-slate-900 transition ${
                  isPesananPage
                    ? "h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center"
                    : ""
                }`}
                aria-label="Notifikasi"
              >
                <BellIcon className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
              {isLaporanDetailPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">AP</div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : isLaporanPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">AP</div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Administrator Kampus</div>
                  </div>
                </div>
              ) : isKategoriPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <Image
                    src="/images/admin-avatar.svg"
                    alt="Super Admin"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Super Admin</div>
                    <div className="text-xs text-slate-500 leading-tight">Administrator Pusat</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : isPengembalianHasilPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <Image
                    src="/images/admin-avatar.svg"
                    alt="Admin Pengelola"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Super Administrator</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : isPengembalianDetailPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <Image
                    src="/images/admin-avatar.svg"
                    alt="Admin Pengelola"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Kepala Admin</div>
                  </div>
                </div>
              ) : isPengembalianPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <Image
                    src="/images/admin-avatar.svg"
                    alt="Admin Pengelola"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                </div>
              ) : isTrackingPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Store Logistics</div>
                  </div>
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">SL</div>
                </div>
              ) : isLabelPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">AP</div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Admin Gudang</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : isPesananPage || isPengirimanPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">AP</div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Super Admin</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : isDataUserPage ? (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">AP</div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pengelola</div>
                    <div className="text-xs text-slate-500 leading-tight">Super Admin</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">Admin Pusat</div>
                    <div className="text-xs text-slate-500 leading-tight">admin@schooly.id</div>
                  </div>
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">AD</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

