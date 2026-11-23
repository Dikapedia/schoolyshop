"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/api/auth";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  findShippingArea,
  listCustomerAddresses,
  updateCustomerAddress,
  type CustomerAddressInput,
} from "@/api/customer/addresses";
import type { CustomerAddress } from "@/api/customer/schemas";
import { getApiErrorMessage } from "@/api/errors";
import { inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";

const emptyForm = {
  label: "",
  recipientName: "",
  phone: "",
  address: "",
  district: "",
  city: "",
  province: "",
  postalCode: "",
  note: "",
};

type FormState = typeof emptyForm;

export default function AlamatPengirimanPage() {
  const session = useSession();
  const router = useRouter();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!session && hydrated) {
      router.replace("/login?next=" + encodeURIComponent("/profil/alamat"));
    }
  }, [session, router, hydrated]);

  if (!session) return null;

  return <AddressBook />;
}

function AddressBook() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listCustomerAddresses()
      .then((data) => {
        if (!cancelled) setAddresses(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(err, "Gagal memuat alamat."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function reload(): Promise<void> {
    setAddresses(await listCustomerAddresses());
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(address: CustomerAddress) {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      address: address.address ?? "",
      district: address.district,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      note: address.note ?? "",
    });
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormError("");
  }

  async function buildInput(): Promise<CustomerAddressInput> {
    const district = form.district.trim();
    const area = district ? await findShippingArea(district) : null;

    return {
      label: form.label.trim(),
      recipientName: form.recipientName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
      areaId: area?.id ?? district,
      district,
      city: form.city.trim() || area?.city || district,
      province: form.province.trim() || area?.province || "",
      postalCode: form.postalCode.trim() || area?.postalCode || "",
      note: form.note.trim() || undefined,
      isPrimary: editingId === null && addresses.length === 0,
    };
  }

  async function saveAddress(event: React.FormEvent) {
    event.preventDefault();
    if (
      !form.label.trim() ||
      !form.recipientName.trim() ||
      !form.phone.trim() ||
      !form.district.trim() ||
      !form.city.trim() ||
      !form.province.trim() ||
      !form.postalCode.trim()
    ) {
      setFormError(
        "Label, nama penerima, telepon, kecamatan, kota, provinsi, dan kode pos wajib diisi.",
      );
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const input = await buildInput();
      if (editingId !== null) {
        await updateCustomerAddress(editingId, input);
      } else {
        await createCustomerAddress(input);
      }
      await reload();
      closeForm();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Gagal menyimpan alamat."));
    } finally {
      setSaving(false);
    }
  }

  async function setPrimary(id: number) {
    try {
      await updateCustomerAddress(id, { isPrimary: true });
      await reload();
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Gagal mengubah alamat utama."));
    }
  }

  async function handleRemoveAddress(id: number) {
    try {
      await deleteCustomerAddress(id);
      await reload();
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Gagal menghapus alamat."));
    }
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
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
                Kelola alamat pengiriman paket domisili dan titik penjemputan resmi loket sekolah {site.school}.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Tambah Alamat Baru
            </button>
          </div>

          {loadError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : (
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
                          <h2 className="font-bold text-sm">{address.recipientName}</h2>
                          <p className="text-xs text-slate-600">{address.phone}</p>
                        </div>
                      </div>

                      <div className="mb-1 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {address.label}
                        </span>
                        {address.isPrimary && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Alamat Utama
                          </span>
                        )}
                      </div>

                      <p className="text-xs leading-5 text-slate-700">
                        {address.address ?? "-"}, {address.district}, {address.city}, {address.province}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-900">Kode Pos: {address.postalCode}</p>
                      {address.note && <p className="mt-0.5 text-xs text-slate-500">Catatan: {address.note}</p>}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(address)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      {address.isPrimary ? (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700">
                          Terpilih
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimary(address.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          Jadikan Utama
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(address.id)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50"
                        title="Hapus alamat"
                        aria-label={`Hapus alamat ${address.recipientName}`}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && addresses.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm text-slate-600">Belum ada alamat tersimpan.</p>
              <button type="button" onClick={openAddForm} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                Tambah Alamat Pertama
              </button>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={saveAddress} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{editingId !== null ? "Edit Alamat" : "Tambah Alamat Baru"}</h2>
                <p className="mt-1 text-sm text-slate-600">Lengkapi alamat pengiriman atau titik penjemputan paket.</p>
              </div>
              <button type="button" onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup form">
                Tutup
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="address-label" className="mb-1.5 block text-sm font-medium text-slate-700">Label Alamat</label>
                <input
                  id="address-label"
                  value={form.label}
                  onChange={(event) => setForm({ ...form, label: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: Rumah, Kantor, Koperasi"
                />
              </div>
              <div>
                <label htmlFor="address-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama Penerima</label>
                <input
                  id="address-name"
                  value={form.recipientName}
                  onChange={(event) => setForm({ ...form, recipientName: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nama lengkap penerima"
                />
              </div>
              <div>
                <label htmlFor="address-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Nomor WhatsApp / Kontak</label>
                <input
                  id="address-phone"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: 08123456789"
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
              <div className="sm:col-span-2">
                <label htmlFor="address-detail" className="mb-1.5 block text-sm font-medium text-slate-700">Alamat Lengkap</label>
                <textarea
                  id="address-detail"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nama jalan, nomor rumah, RT/RW"
                />
              </div>
              <div>
                <label htmlFor="address-district" className="mb-1.5 block text-sm font-medium text-slate-700">Kecamatan</label>
                <input
                  id="address-district"
                  value={form.district}
                  onChange={(event) => setForm({ ...form, district: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: Coblong"
                />
              </div>
              <div>
                <label htmlFor="address-city" className="mb-1.5 block text-sm font-medium text-slate-700">Kota / Kabupaten</label>
                <input
                  id="address-city"
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: Kota Bandung"
                />
              </div>
              <div>
                <label htmlFor="address-province" className="mb-1.5 block text-sm font-medium text-slate-700">Provinsi</label>
                <input
                  id="address-province"
                  value={form.province}
                  onChange={(event) => setForm({ ...form, province: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="cth: Jawa Barat"
                />
              </div>
              <div>
                <label htmlFor="address-note" className="mb-1.5 block text-sm font-medium text-slate-700">Catatan</label>
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
              <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {saving ? "Menyimpan..." : editingId !== null ? "Simpan Perubahan" : "Simpan Alamat"}
              </button>
            </div>
          </form>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
