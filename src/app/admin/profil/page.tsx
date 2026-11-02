"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/use-session";
import { saveSession, clearSession } from "@/lib/auth/session";
import { site } from "@/lib/site";

export default function AdminProfilPage() {
  const router = useRouter();
  const session = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [schoolName, setSchoolName] = useState<string>(site.school);
  const [schoolAddress, setSchoolAddress] = useState<string>("Jl. Pendidikan No. 1, Jakarta");
  const [schoolPhone, setSchoolPhone] = useState<string>("+62 21 1234 5678");
  const [notifiPesanan, setNotifiPesanan] = useState(true);
  const [notifiStok, setNotifiStok] = useState(true);
  const [notifiPengembalian, setNotifiPengembalian] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("akun");

  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current || !session) return;
    initializedRef.current = true;
    setName(session.name);
    setEmail(session.email);
  }, [session]);

  if (!mounted || !session) return null;

  const handleSaveAkun = async (e: React.FormEvent) => {
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

    setTimeout(() => {
      if (sessionRef.current) {
        const updated = {
          ...sessionRef.current,
          name: name.trim(),
          email: email.trim(),
        };
        saveSession(updated, true);
      }
      setSuccess("Data akun berhasil diperbarui");
      setLoading(false);
    }, 500);
  };

  const handleSaveKeamanan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!passwordLama.trim()) {
      setError("Kata sandi lama wajib diisi");
      setLoading(false);
      return;
    }

    if (!passwordBaru.trim() || passwordBaru.length < 6) {
      setError("Kata sandi baru minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess("Kata sandi berhasil diubah");
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
      setLoading(false);
    }, 500);
  };

  const handleSaveNotifikasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      setSuccess("Preferensi notifikasi berhasil diperbarui");
      setLoading(false);
    }, 500);
  };

  const handleSaveToko = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!schoolName.trim()) {
      setError("Nama sekolah wajib diisi");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess("Pengaturan toko/sekolah berhasil diperbarui");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profil Administrator</h1>
        <p className="mt-2 text-slate-600">Kelola informasi akun, keamanan, dan pengaturan toko Schooly Shop.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
              {(session.name?.[0] ?? "A").toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{session.name}</h2>
            <p className="text-sm text-slate-600 mt-1">{session.email}</p>
            <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Administrator
            </span>
            <p className="text-xs text-slate-500 mt-2">Status: Akun Aktif</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("akun")}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === "akun"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Data Akun
            </button>
            <button
              onClick={() => setActiveTab("keamanan")}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === "keamanan"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Keamanan
            </button>
            <button
              onClick={() => setActiveTab("notifikasi")}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === "notifikasi"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Notifikasi
            </button>
            <button
              onClick={() => setActiveTab("toko")}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === "toko"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pengaturan Toko
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {activeTab === "akun" && (
            <form onSubmit={handleSaveAkun} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                <div className="mt-2 flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-sm">
                    +62
                  </span>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="812-xxxx-xxxx"
                    className="flex-1 px-4 py-2 rounded-r-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          )}

          {activeTab === "keamanan" && (
            <form onSubmit={handleSaveKeamanan} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                Perbarui kata sandi secara berkala untuk melindungi keamanan akun administrator Anda.
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Kata Sandi Lama</label>
                <input
                  type="password"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Memperbarui..." : "Ubah Kata Sandi"}
              </button>
            </form>
          )}

          {activeTab === "notifikasi" && (
            <form onSubmit={handleSaveNotifikasi} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifiPesanan}
                    onChange={(e) => setNotifiPesanan(e.target.checked)}
                    className="mt-1 rounded border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Notifikasi Pesanan Baru</p>
                    <p className="text-xs text-slate-500">Terima notifikasi saat ada pesanan masuk</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifiStok}
                    onChange={(e) => setNotifiStok(e.target.checked)}
                    className="mt-1 rounded border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Notifikasi Stok Menipis</p>
                    <p className="text-xs text-slate-500">Terima pemberitahuan saat stok produk rendah</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifiPengembalian}
                    onChange={(e) => setNotifiPengembalian(e.target.checked)}
                    className="mt-1 rounded border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Notifikasi Pengembalian Barang</p>
                    <p className="text-xs text-slate-500">Terima notifikasi saat ada permintaan pengembalian</p>
                  </div>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Preferensi"}
              </button>
            </form>
          )}

          {activeTab === "toko" && (
            <form onSubmit={handleSaveToko} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Nama Sekolah / Toko</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Alamat</label>
                <textarea
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  rows={3}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Nomor Kontak</label>
                <input
                  type="text"
                  value={schoolPhone}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </form>
          )}

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-900 mb-3">Zona Berbahaya</p>
            <button
              type="button"
              onClick={() => {
                if (confirm("Yakin logout semua perangkat?")) {
                  clearSession();
                  router.push("/login");
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Logout Semua Perangkat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
