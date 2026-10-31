"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CATEGORY_OPTIONS } from "@/lib/shop/admin-products";

type CategoryItem = {
  id: number;
  name: string;
  description: string;
};

type CategoryForm = {
  name: string;
  description: string;
};

const PAGE_SIZE = 6;

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Makanan: "Snack, roti, dan makanan ringan kantin",
  Minuman: "Air mineral, susu kemasan, jus buah",
  Fashion: "Seragam, batik kreasi mandiri siswa, tote bag, dan busana sekolah.",
  ATK: "Buku tulis, pulpen, pensil 2B, dan modul belajar praktis",
  Kerajinan: "Hasil karya seni, anyaman siswa, dan cenderamata",
  Lainnya: "Perlengkapan umum, payung, dan aksesoris sekolah",
};

const initialCategories: CategoryItem[] = CATEGORY_OPTIONS.map((name, index) => ({
  id: index + 1,
  name,
  description: CATEGORY_DESCRIPTIONS[name] ?? "",
}));

const emptyForm = (): CategoryForm => ({ name: "", description: "" });

function CategoryIcon({ name }: { name: string }) {
  let icon: ReactNode;

  if (name === "Makanan") {
    icon = (
      <>
        <path d="M4 2V8C4 9.10457 4.89543 10 6 10H7C8.10457 10 9 9.10457 9 8V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 10V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 2C20 5 18.5 7 16 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name === "Minuman") {
    icon = (
      <>
        <path d="M6 3H18L16.5 21H7.5L6 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.6 8H17.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3L14 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name === "Fashion") {
    icon = (
      <>
        <path d="M12 7C12 5.89543 12.8954 5 14 5C15.1046 5 16 4.10457 16 3C16 1.89543 15.1046 1 14 1C12.8954 1 12 1.89543 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7L3 13V18H21V13L12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name === "ATK") {
    icon = (
      <>
        <rect x="4" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7H12M8 11H12M8 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 8L21 11L15 17H12V14L18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name === "Kerajinan") {
    icon = (
      <>
        <path d="M14.5 6.5L17.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 3L21 6L12.5 14.5L9.5 11.5L18 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 11.5L6.5 14.5C5.5 15.5 5 17 5 18.5C3.5 18.5 2 19 1 20C3 21 6 21.5 8 20C9.5 19 11 17 11 15L12.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else {
    icon = (
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    );
  }

  return (
    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {icon}
      </svg>
    </div>
  );
}

export default function KategoriProdukPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [page, setPage] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [error, setError] = useState("");

  const filteredCategories = categories;

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startIndex = filteredCategories.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredCategories.length);

  const footerText =
    filteredCategories.length === categories.length && totalPages === 1
      ? `Menampilkan ${categories.length} dari ${categories.length} kategori terdaftar`
      : `Menampilkan ${startIndex} - ${endIndex} dari ${filteredCategories.length} kategori terdaftar`;

  const openAdd = () => {
    setEditing(null);
    setViewOnly(false);
    setForm(emptyForm());
    setError("");
    setPanelOpen(true);
  };

  const openEdit = (category: CategoryItem) => {
    setEditing(category);
    setViewOnly(false);
    setForm({ name: category.name, description: category.description });
    setError("");
    setPanelOpen(true);
  };

  const openView = (category: CategoryItem) => {
    setEditing(category);
    setViewOnly(true);
    setForm({ name: category.name, description: category.description });
    setError("");
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditing(null);
    setViewOnly(false);
    setError("");
  };

  const handleSave = () => {
    if (viewOnly) return;

    const name = form.name.trim();
    if (!name) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    const duplicate = categories.some(
      (category) => category.id !== editing?.id && category.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      setError("Nama kategori sudah ada.");
      return;
    }

    if (editing) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editing.id
            ? { ...category, name, description: form.description.trim() }
            : category
        )
      );
    } else {
      const nextId = categories.length > 0 ? Math.max(...categories.map((category) => category.id)) + 1 : 1;
      setCategories((prev) => [...prev, { id: nextId, name, description: form.description.trim() }]);
      setPage(Math.max(1, Math.ceil((categories.length + 1) / PAGE_SIZE)));
    }

    closePanel();
  };

  const handleDelete = (category: CategoryItem) => {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;
    setCategories((prev) => prev.filter((item) => item.id !== category.id));
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin/produk" className="hover:text-slate-600">Produk</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Kategori Produk</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Kategori Produk</h1>
            <p className="text-sm text-slate-600 mt-1">Mengelola kategori untuk mengelompokkan produk di Schooly Shop.</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tambah Kategori
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Kategori</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {categories.length} <span className="text-lg font-semibold">Kategori</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Kategori aktif di katalog</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3L12 10H3L8 3Z" fill="currentColor" opacity="0.75" />
                <circle cx="17" cy="7" r="3" fill="currentColor" opacity="0.5" />
                <rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" opacity="0.65" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-900">Daftar Kategori Aktif</h2>
        <span className="rounded-full bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1">
          {categories.length} Aktif
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide w-16">No.</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Kategori</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Deskripsi</th>
                <th className="text-center py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Jumlah Produk</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className={`border-b border-slate-100 last:border-0 transition-colors ${
                    panelOpen && !viewOnly && editing?.id === category.id
                      ? "bg-blue-50/70"
                      : "hover:bg-slate-50/40"
                  }`}
                >
                  <td className="py-4 px-6 text-slate-500">{startIndex + index}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <CategoryIcon name={category.name} />
                      <span className="font-medium text-slate-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-md">{category.description}</td>
                  <td className="py-4 px-6 text-center text-slate-400">—</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openView(category)}
                        title="Lihat kategori"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12S5 5 12 5C19 5 22 12 22 12S19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        title="Edit kategori"
                        className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16.5 3.5C16.8978 3.12132 17.5 3 18 3C18.5 3 19.1022 3.12132 19.5 3.5C19.8978 3.87868 20 4.5 20 5C20 5.5 19.8978 6.12132 19.5 6.5L7 19L3 19L3 15L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        title="Hapus kategori"
                        className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-500">
                    Kategori tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
          <p className="text-sm text-slate-500">{footerText}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                currentPage === 1
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-8 w-8 text-sm rounded-lg font-semibold transition ${
                  currentPage === pageNumber
                    ? "text-white bg-blue-600"
                    : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                currentPage === totalPages
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-[100000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40" onClick={closePanel} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${viewOnly ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-600"}`}>
                  {viewOnly ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12S5 5 12 5C19 5 22 12 22 12S19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : editing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16.5 3.5C16.8978 3.12132 17.5 3 18 3C18.5 3 19.1022 3.12132 19.5 3.5C19.8978 3.87868 20 4.5 20 5C20 5.5 19.8978 6.12132 19.5 6.5L7 19L3 19L3 15L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3L12 10H3L8 3Z" fill="currentColor" opacity="0.75" />
                      <circle cx="17" cy="7" r="3" fill="currentColor" opacity="0.5" />
                      <rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" opacity="0.65" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {viewOnly ? "Lihat Data Kategori" : editing ? "Edit Data Kategori" : "Tambah Kategori"}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {viewOnly
                      ? "Rincian informasi nama dan deskripsi kategori produk."
                      : editing
                        ? "Perbarui informasi nama dan deskripsi kategori produk."
                        : "Lengkapi informasi nama dan deskripsi kategori produk."}
                  </p>
                </div>
              </div>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-600" aria-label="Tutup">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-700">
                    Nama Kategori <span className="text-red-500">*</span>
                  </label>
                  {!viewOnly && <span className="text-xs text-slate-400">Wajib diisi</span>}
                </div>
                <div className="relative mt-1">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={viewOnly}
                    autoFocus={!editing && !viewOnly}
                    placeholder="Contoh: Elektronik"
                    className={`w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      viewOnly ? "bg-slate-50 text-slate-600" : ""
                    }`}
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.59 13.41L11 3.83C10.6 3.43 10.06 3.2 9.5 3.2H4C3.45 3.2 3 3.65 3 4.2V9.7C3 10.26 3.22 10.8 3.62 11.2L13.21 20.79C13.99 21.57 15.26 21.57 16.04 20.79L20.59 16.24C21.37 15.46 21.37 14.19 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                {!viewOnly && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    {editing
                      ? "Gunakan label singkat yang mudah dipahami oleh murid dan staf pengajar."
                      : "Gunakan label singkat yang mudah dipahami oleh staf dan siswa."}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Deskripsi Kategori</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  disabled={viewOnly}
                  rows={6}
                  maxLength={editing ? 150 : 250}
                  placeholder="Deskripsi singkat kategori produk..."
                  className={`mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    viewOnly ? "bg-slate-50 text-slate-600" : ""
                  }`}
                />
                <div className="flex items-start justify-between gap-3 mt-1.5">
                  <p className="text-xs text-slate-500">
                    Menjelaskan cakupan barang yang termasuk ke dalam kategori ini.
                  </p>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {editing ? `${form.description.length}/150` : "Maksimal 250 karakter"}
                  </span>
                </div>
              </div>

              {editing && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3.5 flex items-start gap-2.5">
                  <svg
                    className="mt-0.5 text-blue-500 shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Catatan:</span> Perubahan nama kategori akan langsung diperbarui pada seluruh produk terkait di katalog toko.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-200">
              {viewOnly ? (
                <button type="button" onClick={closePanel} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                  Tutup
                </button>
              ) : (
                <>
                  <button type="button" onClick={closePanel} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {editing ? "Simpan Perubahan" : "Simpan Kategori"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
