"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, useSession } from "@/api/auth";
import { getAdminDashboardSummary } from "@/api/admin/dashboard";
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

type MenuIconName =
  | "dashboard"
  | "seller"
  | "product"
  | "order"
  | "shipping"
  | "users"
  | "report";

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

const SEARCH_ENTRIES: { label: string; href: string; hint: string }[] = [
  { label: "Dashboard", href: "/admin", hint: "Ringkasan" },
  { label: "Penjual / Supplier", href: "/admin/penjual", hint: "Data penjual" },
  { label: "Kelola Produk", href: "/admin/produk", hint: "Produk" },
  { label: "Kategori Produk", href: "/admin/produk/kategori", hint: "Produk" },
  { label: "Data User", href: "/admin/data-user", hint: "Pengguna" },
  { label: "Pesanan & Transaksi", href: "/admin/pesanan", hint: "Pesanan" },
  {
    label: "Pengiriman & Pengembalian",
    href: "/admin/pengiriman",
    hint: "Logistik",
  },
  {
    label: "Pengembalian Barang",
    href: "/admin/pengiriman/pengembalian",
    hint: "Logistik",
  },
  { label: "Laporan Penjualan", href: "/admin/laporan", hint: "Laporan" },
  { label: "Profil Admin", href: "/admin/profil", hint: "Kelola akun" },
];

function MenuIcon({
  name,
  className,
}: {
  name: MenuIconName;
  className?: string;
}) {
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

const noopSubscribe = () => () => {};

function ShellFallback({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-surface">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        {message}
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Awaited<ReturnType<typeof getAdminDashboardSummary>>["notifications"]
  >([]);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/login?next=/admin");
      return;
    }
    if (session.role !== "admin") {
      router.replace("/");
    }
  }, [hydrated, session, router]);

  useEffect(() => {
    if (!session || session.role !== "admin") return;
    let active = true;
    getAdminDashboardSummary()
      .then((summary) => {
        if (active) setNotifications(summary.notifications);
      })
      .catch(() => {
        if (active) setNotifications([]);
      });
    return () => {
      active = false;
    };
  }, [pathname, session]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return SEARCH_ENTRIES.filter((entry) =>
      `${entry.label} ${entry.hint}`.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  if (!hydrated) return <ShellFallback message="Memeriksa sesi admin..." />;
  if (!session || session.role !== "admin") {
    return <ShellFallback message="Mengalihkan ke halaman login..." />;
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const notificationCount = notifications.length;
  const currentMenu =
    [...MENU_ITEMS]
      .reverse()
      .find(
        (item) =>
          pathname === item.href || pathname.startsWith(`${item.href}/`),
      ) ?? MENU_ITEMS[0];
  const currentLabel = pathname.startsWith("/admin/profil")
    ? "Profil Admin"
    : currentMenu.label;

  return (
    <div className="flex min-h-screen bg-admin-surface">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } flex shrink-0 flex-col overflow-hidden bg-admin-navy text-white transition-all duration-300`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M22 10L12 5L2 10L12 15L22 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12V16C6 17.6569 8.68629 19 12 19C15.3137 19 18 17.6569 18 16V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 10V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block text-base font-bold leading-tight">
                Schooly Shop
              </span>
              <span className="block text-xs leading-tight text-blue-100/90">
                Admin Management
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {MENU_ITEMS.map((item) => {
            if (item.children) {
              const parentActive = pathname === item.href;
              return (
                <div key={item.href} className="space-y-1">
                  <div
                    className={`flex items-center rounded-lg text-sm transition ${
                      parentActive
                        ? "bg-admin-active font-semibold"
                        : "font-medium hover:bg-white/10"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex flex-1 items-center gap-3 px-4 py-2.5"
                    >
                      <MenuIcon
                        name={item.icon}
                        className="shrink-0 text-blue-100"
                      />
                      <MenuLabel item={item} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmenuOpen((open) => !open)}
                      className="px-3 py-2.5"
                      aria-label={
                        submenuOpen ? "Sembunyikan submenu" : "Tampilkan submenu"
                      }
                      aria-expanded={submenuOpen}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          submenuOpen ? "" : "-rotate-90"
                        }`}
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
                            className={`flex items-center gap-2.5 rounded-lg py-2 pl-9 pr-4 text-[13px] transition ${
                              childActive
                                ? "bg-admin-active font-semibold text-white"
                                : "font-medium text-blue-100 hover:bg-white/10"
                            }`}
                          >
                            {child.label}
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
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                  isActive(item.href)
                    ? "bg-admin-active font-semibold"
                    : "font-medium hover:bg-white/10"
                }`}
              >
                <MenuIcon name={item.icon} className="shrink-0 text-blue-100" />
                <span className="flex-1">
                  <MenuLabel item={item} />
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition hover:bg-white/10"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-pink-300"
              aria-hidden
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Logout</span>
          </button>
          <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-admin-navy">
              {(session.name?.[0] ?? "A").toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {session.name}
              </span>
              <span className="block truncate text-xs text-blue-100">
                {session.email}
              </span>
            </span>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="text-slate-500 transition hover:text-slate-900"
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="hidden items-center gap-2 whitespace-nowrap text-sm text-slate-400 lg:flex">
            <span>Admin</span>
            <span>/</span>
            <span className="font-medium text-slate-700">
              {currentLabel}
            </span>
          </div>

          <div className="max-w-md flex-1">
            <form
              className="relative"
              onSubmit={(event) => {
                event.preventDefault();
                const first = searchResults[0];
                if (first) {
                  router.push(first.href);
                  setSearchQuery("");
                  setSearchOpen(false);
                }
              }}
            >
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M20 20L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                aria-label="Cari menu atau fitur admin"
                placeholder="Cari pesanan, produk, atau menu..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              {searchOpen && searchQuery.trim() !== "" && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSearchOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                    {searchResults.length > 0 ? (
                      searchResults.map((entry) => (
                        <Link
                          key={entry.href}
                          href={entry.href}
                          onClick={() => {
                            setSearchQuery("");
                            setSearchOpen(false);
                          }}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                        >
                          <span className="font-medium text-slate-700">
                            {entry.label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {entry.hint}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-slate-500">
                        Menu tidak ditemukan.
                      </p>
                    )}
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 xl:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sistem Integrasi Online
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((open) => !open);
                  setProfileOpen(false);
                }}
                className="relative text-slate-500 transition hover:text-slate-900"
                aria-label="Notifikasi"
                aria-expanded={notifOpen}
              >
                <BellIcon className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {notificationCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        Notifikasi
                      </p>
                      <p className="text-xs text-slate-500">
                        {notificationCount} perlu ditindaklanjuti
                      </p>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="px-4 py-4 text-sm text-slate-500">
                        Tidak ada notifikasi baru.
                      </p>
                    ) : (
                      notifications.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setNotifOpen(false)}
                          className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"
                        >
                          <p className="text-sm font-medium text-slate-800">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {item.detail}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotifOpen(false);
                }}
                className="block text-left"
                aria-label="Buka menu profil"
                aria-expanded={profileOpen}
              >
                <span className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {(session.name?.[0] ?? "A").toUpperCase()}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-semibold leading-tight text-slate-900">
                      {session.name}
                    </span>
                    <span className="block text-xs leading-tight text-slate-500">
                      Super Admin
                    </span>
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="hidden text-slate-400 sm:block"
                    aria-hidden
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden
                  />
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {session.name}
                      </p>
                      <p className="text-xs text-slate-500">{session.email}</p>
                    </div>
                    <Link
                      href="/admin/profil"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Profil Saya
                    </Link>
                    <Link
                      href="/"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Lihat Toko
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        clearSession();
                        router.push("/login");
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
