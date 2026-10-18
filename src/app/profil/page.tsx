"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth/use-session";
import { saveSession, clearSession } from "@/lib/auth/session";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";

export default function ProfilPage() {
  const session = useSession();
  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  // Persist name & email locally
  React.useEffect(() => {
    if (!session) return;
    const updated = { ...session, name, email };
    saveSession(updated, true);
  }, [name, email]);
  const [phone, setPhone] = useState<string[]>([]);
  // Persist phone digits only
  React.useEffect(() => {
    try {
      window.localStorage.setItem("schooly.phone", phone.join(""));
    } catch {}
  }, [phone]);
  // Display phone as +62 followed by digits, limited to 10 digits
  const displayPhone = "+62" + phone.join("");
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!session) {
    return (
      <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
        <SiteHeader />
        <main className="flex-1 px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Akses Ditolak</h1>
            <p className="mb-6 text-slate-600">Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
            <Link href="/login" className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
              Masuk
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Nama tidak boleh kosong");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      setLoading(false);
      return;
    }

    if (phone.length < 10) {
      setError("Nomor HP minimal 10 digit");
      setLoading(false);
      return;
    }
    if (passwordBaru && passwordBaru !== konfirmasiPassword) {
      setError("Kata sandi baru tidak cocok");
      setLoading(false);
      return;
    }

    if (passwordBaru && passwordBaru.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (session) {
        const updated = {
          ...session,
          name: name.trim(),
          email: email.trim(),
        };
        saveSession(updated, true);
      }
      setSuccess("Profil berhasil diperbarui");
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
      setLoading(false);
    }, 500);
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Beranda
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-900">Profil Pengguna</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-4 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Profile Card */}
                <div className="border-b border-slate-100 p-5 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="relative">
                      <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                        {session.name ? session.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-600 text-white hover:bg-blue-700"
                        title="Ubah Foto"
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94m-7.5-7.5L19.5 3.5a2.121 2.121 0 013 3L9.28 16.44m-7 7v-3.75L9.94 6.19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mb-1">Ubah Foto</p>
                  <h2 className="text-lg font-bold">{session.name}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">{session.email}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-0.5 p-2">
                  <a
                    href="#profil"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-700 bg-blue-50"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-3.866 0-7 1.79-7 4v2h14v-2c0-2.21-3.134-4-7-4z" />
                    </svg>
                    Profil Saya
                  </a>
                  <Link
                    href="/profil/alamat"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Alamat Pengiriman
                  </Link>
                  <a
                    href="#riwayat"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M7 7a2 2 0 012-2h6a2 2 0 012 2" />
                    </svg>
                    Riwayat Pesanan
                  </a>
                  <a
                    href="/profil/bantuan"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.906-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bantuan
                  </a>
                  <button
                    onClick={() => clearSession()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4.243 4.242a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4.242-4.243a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Logout
                  </button>
                </nav>

                {/* Status */}
                <div className="border-t border-slate-100 p-4 space-y-2">
                  <div className="flex items-center gap-2 rounded bg-slate-50 p-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-slate-700">T.A. 2026/2027 Genap</p>
                      <p className="text-xs text-slate-500">Aktif s/d Juni 2027</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-5">
              {/* Informasi Data Diri */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                  <h2 className="text-lg font-bold">Informasi Data Diri</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Terverifikasi
                  </span>
                </div>
                <form onSubmit={handleSubmit} className="p-5">
                  <div className="grid gap-4 mb-4">
                    {/* Row 1 */}
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Nama Lengkap Siswa
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Sesuai Ijazah SMP</p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Email Resmi Institusi
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <span className="mt-1 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          @smksukamaju
                        </span>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Nomor WhatsApp / Kontak
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                      <input
                        type="tel"
                        value={displayPhone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          // Strip "62" prefix if present, keep only what user typed
                          const userDigits = digits.startsWith("62") ? digits.slice(2) : digits;
                          // Limit to 10 digits
                          const next = userDigits.slice(0, 10);
                          setPhone(next.split(""));
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        maxLength={13}
                      />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Untuk konfirmasi pick-up</p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Tanggal Terdaftar di Schooly
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input
                            type="text"
                            value="12 Juli 2027 (Tahun Ajaran Baru)"
                            disabled
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Tahun Ajaran Aktif</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-3 rounded-lg bg-red-50 p-2.5 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-3 rounded-lg bg-green-50 p-2.5 text-sm text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                      Perubahan kontak otomatis diperbarui pada bukti nota belanja Koperasi.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Keamanan & Kata Sandi */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Keamanan &amp; Kata Sandi</h2>
                    <span className="text-xs text-slate-500">Terakhir diubah: 3 bulan lalu</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Perbarui kata sandi secara berkala untuk melindungi transaksi tabungan dan keranjang Schooly Anda.
                  </p>
                </div>
                <div className="p-5">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Kata Sandi Lama</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                          type="password"
                          value={passwordLama}
                          onChange={(e) => setPasswordLama(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Kata Sandi Baru</label>
                      <input
                        type="password"
                        value={passwordBaru}
                        onChange={(e) => setPasswordBaru(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi Sandi Baru</label>
                      <input
                        type="password"
                        value={konfirmasiPassword}
                        onChange={(e) => setKonfirmasiPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Min. 8 karakter
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Kombinasi huruf & angka
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        Karakter spesial
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!passwordLama.trim() || !passwordBaru.trim() || !konfirmasiPassword.trim()) {
                          setError("Kata sandi lama, baru, dan konfirmasi wajib diisi.");
                          return;
                        }
                        if (passwordBaru.length < 8) {
                          setError("Kata sandi baru minimal 8 karakter.");
                          return;
                        }
                        if (passwordBaru !== konfirmasiPassword) {
                          setError("Konfirmasi kata sandi tidak cocup.");
                          return;
                        }
                        // Verify old password matches current user
                        const users = JSON.parse(localStorage.getItem("schooly.mock.users") || "[]");
                        const user = users.find((u: any) => u.id === session?.id);
                        if (!user || user.password !== passwordLama) {
                          setError("Kata sandi lama tidak sesuai.");
                          return;
                        }
                        // Update password for current user in mock storage
                        const updated = users.map((u: any) =>
                          u.id === session?.id ? { ...u, password: passwordBaru } : u
                        );
                        localStorage.setItem("schooly.mock.users", JSON.stringify(updated));
                        setPasswordLama("");
                        setPasswordBaru("");
                        setKonfirmasiPassword("");
                        setError("");
                        setSuccess("Kata sandi berhasil diperbarui.");
                      }}
                      className="rounded-lg border border-blue-600 px-5 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
