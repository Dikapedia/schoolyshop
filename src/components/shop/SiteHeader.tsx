"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartIcon, SearchIcon, ShoppingBagIcon } from "@/components/icons";
import { clearSession } from "@/lib/auth/session";
import { useSession } from "@/lib/auth/use-session";
import { useCartCount } from "@/lib/shop/cart";
import { site } from "@/lib/site";

type NavItem = { label: string; href: string; external?: boolean };

const NAV: NavItem[] = [
  { label: "Katalog", href: "/produk" },
  {
    label: "Bantuan",
    href: "/profil/bantuan",
  },
  { label: "Lacak Pesanan", href: "/pesanan" },
];

const outlineButton =
  "inline-flex h-9 items-center rounded-lg border border-blue-600 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50";
const solidButton =
  "inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700";

export default function SiteHeader() {
  const router = useRouter();
  const count = useCartCount();
  const session = useSession();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/produk?q=${encodeURIComponent(q)}` : "/produk");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const linkClass =
    "whitespace-nowrap text-sm font-medium text-slate-700 transition hover:text-blue-600";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 lg:flex-nowrap lg:gap-6">
        {/* Logo */}
        <Link href="/" className="order-1 flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
            <ShoppingBagIcon width={20} height={20} />
          </span>
          <span className="leading-tight">
            <span className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                {site.name}
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-600">
                RESMI
              </span>
            </span>
            <span className="block text-xs text-slate-500">{site.school}</span>
          </span>
        </Link>

        {/* Pencarian */}
        <form
          role="search"
          onSubmit={handleSearch}
          className="order-3 flex h-10 w-full items-center rounded-lg border border-slate-200 bg-slate-50 pr-1 transition focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10 lg:order-2 lg:flex-1"
        >
          <SearchIcon className="mx-3 shrink-0 text-slate-400" />
          <input
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari seragam, alat tulis, kerajinan"
            aria-label="Cari produk"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="h-8 shrink-0 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Cari
          </button>
        </form>

        {/* Menu */}
        <nav
          aria-label="Navigasi utama"
          className="order-4 flex w-full items-center gap-5 overflow-x-auto lg:order-3 lg:w-auto lg:gap-6"
        >
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Keranjang dan akun */}
        <div className="order-2 ml-auto flex items-center gap-2 sm:gap-3 lg:order-4 lg:ml-0">
          <span aria-hidden className="hidden h-6 w-px bg-slate-200 sm:block" />

          <Link
            href={session ? "/keranjang" : "/login?next=/keranjang"}
            aria-label={
              session
                ? `Keranjang belanja, ${count} barang`
                : "Masuk untuk melihat keranjang belanja"
            }
            className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100"
          >
            <CartIcon width={20} height={20} />
            {count > 0 && (
              <span
                aria-hidden
                className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {session ? (
            <>
              <div
                ref={menuRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-100"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
                    <span className="text-sm font-semibold text-white">
                      {session?.name
                        ? session.name.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </span>
                  <span className="hidden text-sm font-medium text-slate-700 sm:block">
                    {session?.name?.split(" ")[0] ?? "Profil"}
                  </span>
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white text-sm shadow-lg">
                      <div className="py-2">
                        <p className="px-4 py-2 text-xs font-semibold text-slate-400">
                          {session.role === "admin" ? "Admin" : "Member"}
                        </p>
                        <p className="truncate px-4 py-1 text-slate-900">
                          {session.name}
                        </p>
                        <p className="truncate px-4 py-1 text-xs text-slate-500">
                          {session.role}
                        </p>
                      </div>
                  <div className="border-t border-slate-100 px-2 py-2">
                    <Link
                      href="/profil"
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 transition hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Kelola Profil
                    </Link>
                    <Link
                      href="/keranjang"
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 transition hover:bg-slate-50"
                    >
                      <CartIcon width={16} height={16} />
                      Keranjang
                    </Link>
                        {session.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 text-slate-700 transition hover:bg-slate-50"
                          >
                            <svg
                              className="h-4 w-4 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 6v4M9 12h6"
                              />
                            </svg>
                            Dashboard
                          </Link>
                        )}
                        <hr className="my-2 border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            clearSession();
                            setMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1m3 10a3 3 0 01-3-3V7a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3z"
                            />
                          </svg>
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={outlineButton}>
                Masuk
              </Link>
              <Link href="/daftar" className={solidButton}>
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
