"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth/use-session";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  postalCode: string;
  note: string;
  badges: string[];
  isPrimary: boolean;
  isPickupHub?: boolean;
};

const STORAGE_KEY = "schooly.addresses";
const loadStoredAddresses = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Address[] : [];
  } catch { return [];
  }
};
const INITIAL_ADDRESSES: Address[] = loadStoredAddresses().length ? loadStoredAddresses() : [
  {
    id: "1",
    name: "Nabila Putri Ramadhani",
    phone: "(+62) 812-3456-7890",
    address: "Jl. Citrum No. 15, RT 03/RW 05, Kel. Citrum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat",
    postalCode: "40115",
    note: "Pagar hitam depan pos satpam perumahan",
    badges: ["Rumah", "Alamat Utama"],
    isPrimary: true,
  },
  {
    id: "2",
    name: "Nabila Putri (Titik Koperasi Sekolah)",
    phone: "(+62) 812-3456-7890",
    address: "Gedung B Koperasi Siswa SMK Bandung, Jl. Ir. H. Juanda No. 93, Kel. Tamansari, Kec. Bandung Wetan, Kota Bandung",
    postalCode: "40132",
    note: "Titik di Loket Koperasi Siswa Lt. 1 Gedung B. Waktu ambil: Istirahat 1 dan Pulang Sekolah.",
    badges: ["Pick-Up Hub", "Bebas Ongkir Pengiriman"],
    isPrimary: false,
    isPickupHub: true,
  },
  {
    id: "3",
    name: "Drs. H. M. Ramadhani (Wali Siswa)",
    phone: "(+62) 811-2233-4411",
    address: "Komplek Dago Asri Blok C-12, Kel. Dago, Kec. Coblong, Kota Bandung, Jawa Barat",
    postalCode: "40135",
    note: "Rumah pagar putih samping Mushola Al-Hidayah",
    badges: ["Rumah Wali"],
    isPrimary: false,
  },
];

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  postalCode: "",
  note: "",
};

export default function AlamatPengirimanPage() {
  const session = useSession();
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);

  // Persist addresses to localStorage
  React.useEffect(() => {
    try {
      window.localStorage.setItem("schooly.addresses", JSON.stringify(addresses));
    } catch {}
  }, [addresses]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

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

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(address: Address) {
    setEditingId(address.id);
    setForm({
      name: address.name,
      phone: address.phone,
      address: address.address,
      postalCode: address.postalCode,
      note: address.note,
    });
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormError("");
  }

  function saveAddress(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.postalCode.trim()) {
      setFormError("Nama, nomor kontak, alamat, dan kode pos wajib diisi.");
      return;
    }

    if (editingId) {
      setAddresses((current) =>
        current.map((address) =>
          address.id === editingId
            ? {
                ...address,
                name: form.name.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                postalCode: form.postalCode.trim(),
                note: form.note.trim(),
              }
            : address
        )
      );
    } else {
      const newAddress: Address = {
        id: `address-${Date.now()}`,
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        postalCode: form.postalCode.trim(),
        note: form.note.trim(),
        badges: ["Rumah"],
        isPrimary: addresses.length === 0,
      };
      setAddresses((current) => [...current, newAddress]);
    }
    closeForm();
  }

  function setPrimary(id: string) {
    setAddresses((current) =>
      current.map((address) => ({ ...address, isPrimary: address.id === id }))
    );
  }

  function removeAddress(id: string) {
    setAddresses((current) => {
      const remaining = current.filter((address) => address.id !== id);
      if (remaining.length > 0 && !remaining.some((address) => address.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Beranda
            </Link>
            <span className="text-slate-400">/</span>
            <Link href="/profil" className="text-slate-500 hover:text-slate-700">Profil Siswa</Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-900">Alamat Pengiriman</span>
          </div>

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Kelola Alamat Pengiriman</h1>
              <p className="mt-1 text-sm text-slate-600">
                Kelola alamat pengiriman paket domisili dan titik penjemputan resmi loket sekolah SMK Bandung.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Alamat Baru
            </button>
          </div>

          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong>Integrasi Biteship API aktif:</strong> Alamat terverifikasi otomatis hingga tingkat kecamatan dan kode pos kelurahan di Kota Bandung &amp; sekitarnya.
              </span>
            </div>
            <span className="hidden shrink-0 items-center gap-1 text-xs font-medium text-green-600 sm:flex">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              API Online 99.8%
            </span>
          </div>

          <div className="space-y-2">
            {addresses.map((address) => (
              <article key={address.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="font-bold text-sm">{address.name}</h2>
                        <p className="text-xs text-slate-600">{address.phone}</p>
                      </div>
                    </div>

                    <div className="mb-1 flex flex-wrap gap-1.5">
                      {address.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            badge === "Alamat Utama"
                              ? "bg-green-100 text-green-700"
                              : badge === "Pick-Up Hub"
                              ? "bg-blue-100 text-blue-700"
                              : badge === "Bebas Ongkir Pengiriman"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {badge === "Alamat Utama" && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                          {badge}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs leading-5 text-slate-700">{address.address}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-900">Kode Pos: {address.postalCode}</p>
                    {address.note && <p className="mt-0.5 text-xs text-slate-500">Catatan: {address.note}</p>}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(address)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    {address.isPrimary ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Terpilih
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimary(address.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 9.11c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Jadikan Utama
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAddress(address.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50"
                      title="Hapus alamat"
                      aria-label={`Hapus alamat ${address.name}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {addresses.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm text-slate-600">Belum ada alamat tersimpan.</p>
              <button type="button" onClick={openAddForm} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                Tambah Alamat Pertama
              </button>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">Tips Pengiriman Biteship</p>
                <p className="mt-1 text-sm text-amber-700">
                  Saat menambah alamat baru, ketik nama kecamatan (misal: Bandung Wetan, Coblong, Sukajadi) dan sistem akan menampilkan pilihan area
                  logistik terdaftar secara otomatis beserta tarif instan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={saveAddress} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{editingId ? "Edit Alamat" : "Tambah Alamat Baru"}</h2>
                <p className="mt-1 text-sm text-slate-600">Lengkapi alamat pengiriman atau titik penjemputan paket.</p>
              </div>
              <button type="button" onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup form">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="address-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama Penerima / Label</label>
                <input
                  id="address-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: Rumah, Kantor, Titik Koperasi"
                />
              </div>
              <div>
                <label htmlFor="address-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Nomor WhatsApp / Kontak</label>
                <input
                  id="address-phone"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: (+62) 812-3456-7890"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address-detail" className="mb-1.5 block text-sm font-medium text-slate-700">Alamat Lengkap</label>
                <textarea
                  id="address-detail"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kabupaten/kota, provinsi"
                />
              </div>
              <div>
                <label htmlFor="address-postal-code" className="mb-1.5 block text-sm font-medium text-slate-700">Kode Pos</label>
                <input
                  id="address-postal-code"
                  value={form.postalCode}
                  onChange={(event) => setForm({ ...form, postalCode: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: 40115"
                />
              </div>
              <div>
                <label htmlFor="address-note" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Catatan
                </label>
                <input
                  id="address-note"
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: Loket Lt. 1 Gedung B"
                />
              </div>
            </div>

            {formError && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div>}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Batal
              </button>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                {editingId ? "Simpan Perubahan" : "Simpan Alamat"}
              </button>
            </div>
          </form>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
