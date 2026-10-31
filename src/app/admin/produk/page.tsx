"use client";

import { useState, type ReactNode } from "react";
import { formatRupiah } from "@/lib/format";
import {
  CATEGORY_OPTIONS,
  SELLER_OPTIONS,
  initialAdminProducts,
  type AdminProduct,
  type ProductStatus,
} from "@/lib/shop/admin-products";

type EditForm = {
  name: string;
  seller: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  status: ProductStatus;
};

const formatThousands = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const PAGE_SIZE = 5;

const emptyAddForm = (): EditForm => ({
  name: "",
  seller: "Kaji Ecoprint",
  category: "Kerajinan",
  price: "",
  stock: "",
  description: "",
  status: "Aktif",
});

function ProductThumb({ product }: { product: AdminProduct }) {
  const name = product.name.toLowerCase();
  const boxClass = product.isNew ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600";

  let icon: ReactNode;
  if (name.includes("dompet")) {
    icon = (
      <>
        <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6V18a2 2 0 0 0 2 2H20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name.includes("tempat pensil")) {
    icon = (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name.includes("roti")) {
    icon = (
      <>
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 21h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 8v3M12 8v3M17 8v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (name.includes("mug")) {
    icon = (
      <>
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 2v2M10 2v2M14 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else {
    icon = (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }

  return (
    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${boxClass}`}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {icon}
      </svg>
    </div>
  );
}

export default function KelolaProdukPage() {
  const [products, setProducts] = useState<AdminProduct[]>(initialAdminProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>(emptyAddForm);
  const [addError, setAddError] = useState("");
  const [toast, setToast] = useState(() => initialAdminProducts.some((p) => p.isNew));

  const totalProduk = products.length;
  const produkAktif = products.filter((p) => p.status === "Aktif").length;
  const produkNonaktif = totalProduk - produkAktif;
  const produkBaru = products.filter((p) => p.isNew).length;
  const persentaseAktif = totalProduk > 0 ? ((produkAktif / totalProduk) * 100).toFixed(1) : "0";

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = categoryFilter === "Semua Kategori" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "Semua Status" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startIndex = filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);

  const stats = [
    {
      label: "Total Produk",
      value: totalProduk,
      subtext: "item katalog",
      badge: `+${produkBaru} Baru`,
      badgeClass: "bg-emerald-50 text-emerald-700",
      showTrend: true,
      iconClass: "bg-blue-50 text-blue-600",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Produk Aktif",
      value: produkAktif,
      subtext: "siap jual",
      badge: `${persentaseAktif}% total`,
      badgeClass: "bg-emerald-50 text-emerald-700",
      showTrend: false,
      iconClass: "bg-emerald-50 text-emerald-600",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8.5 12L11 14.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Produk Nonaktif",
      value: produkNonaktif,
      subtext: "stok habis / arsip",
      badge: "Perlu Restok",
      badgeClass: "bg-red-50 text-red-600",
      showTrend: false,
      iconClass: "bg-red-50 text-red-400",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const openEdit = (product: AdminProduct) => {
    setAddOpen(false);
    setEditing(product);
    setForm({
      name: product.name,
      seller: product.seller,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      status: product.status,
    });
    setError("");
  };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
    setError("");
  };

  const handleSave = () => {
    if (!editing || !form) return;

    if (!form.name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Harga jual harus lebih dari 0.");
      return;
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Stok tidak boleh kosong atau negatif.");
      return;
    }

    const updated: AdminProduct = {
      ...editing,
      name: form.name.trim(),
      seller: form.seller,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description,
      status: form.status,
    };

    setProducts((prev) => prev.map((product) => (product.id === updated.id ? updated : product)));
    closeEdit();
  };

  const openAdd = () => {
    setEditing(null);
    setForm(null);
    setError("");
    setAddForm(emptyAddForm());
    setAddError("");
    setAddOpen(true);
  };

  const closeAdd = () => {
    setAddOpen(false);
    setAddError("");
  };

  const handleAdd = () => {
    if (!addForm.name.trim()) {
      setAddError("Nama produk wajib diisi.");
      return;
    }
    if (!addForm.price || Number(addForm.price) <= 0) {
      setAddError("Harga jual harus lebih dari 0.");
      return;
    }
    if (addForm.stock === "" || Number(addForm.stock) < 0) {
      setAddError("Stok awal tidak boleh kosong atau negatif.");
      return;
    }

    const nextId = products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1;

    const newProduct: AdminProduct = {
      id: nextId,
      name: addForm.name.trim(),
      seller: addForm.seller,
      category: addForm.category,
      price: Number(addForm.price),
      stock: Number(addForm.stock),
      description: addForm.description,
      status: addForm.status,
      isNew: true,
    };

    setProducts((prev) => [...prev.map((product) => ({ ...product, isNew: false })), newProduct]);
    setSearch("");
    setCategoryFilter("Semua Kategori");
    setStatusFilter("Semua Status");
    setPage(Math.max(1, Math.ceil((products.length + 1) / PAGE_SIZE)));
    setToast(true);
    closeAdd();
  };

  const handleDelete = (product: AdminProduct) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    setProducts((prev) => prev.filter((item) => item.id !== product.id));
    setPage(1);
  };

  const handleRefresh = () => {
    setSearch("");
    setCategoryFilter("Semua Kategori");
    setStatusFilter("Semua Status");
    setPage(1);
  };

  const handleDownload = () => {
    const rows = [
      ["No", "Nama Produk", "Supplier / Penjual", "Kategori", "Harga", "Stok", "Status"],
      ...filteredProducts.map((product, index) => [
        String(index + 1),
        product.name,
        product.seller,
        product.category,
        String(product.price),
        String(product.stock),
        product.status,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "kelola-produk.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-sm text-slate-400">Produk &gt; <span className="text-slate-600">Kelola Produk</span></div>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Kelola Produk</h1>
            <p className="text-sm text-slate-600 mt-1">
              Pantau ketersediaan stok, harga katalog, dan rincian produk mitra supplier Schooly Shop.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            {toast && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M8.5 12L11 14.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Produk berhasil ditambahkan</span>
                <button type="button" onClick={() => setToast(false)} className="ml-1 text-emerald-500 hover:text-emerald-700" aria-label="Tutup notifikasi">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block">Tambah</span>
                <span className="block">Produk</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{card.subtext}</p>
                <span className={`inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-full text-[11px] font-semibold ${card.badgeClass}`}>
                  {card.showTrend && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 7H21V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {card.badge}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.iconClass}`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 p-6 border-b border-slate-200">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama produk..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Semua Kategori</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                title="Unduh data produk"
                className="h-10 w-10 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center transition"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                title="Segarkan data"
                className="h-10 w-10 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center transition"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 21V16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 3V8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide w-16">No.</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Produk</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Supplier / Penjual</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Kategori</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Harga</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Stok</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b border-slate-100 last:border-0 transition ${
                    product.isNew
                      ? "bg-emerald-50/70 border-l-4 border-l-blue-600"
                      : product.status === "Nonaktif"
                        ? "bg-slate-50/80"
                        : "hover:bg-slate-50/40"
                  }`}
                >
                  <td className="py-4 px-6 text-slate-500">{startIndex + index}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <ProductThumb product={product} />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-900">{product.name}</span>
                        {product.isNew && (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            BARU
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{product.seller}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{formatRupiah(product.price)}</td>
                  <td className={`py-4 px-6 font-medium ${product.stock === 0 ? "text-red-600" : "text-slate-700"}`}>
                    {product.stock}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          product.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        title="Lihat produk"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12S5 5 12 5C19 5 22 12 22 12S19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        title="Edit produk"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16.5 3.5C16.8978 3.12132 17.5 3 18 3C18.5 3 19.1022 3.12132 19.5 3.5C19.8978 3.87868 20 4.5 20 5C20 5.5 19.8978 6.12132 19.5 6.5L7 19L3 19L3 15L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        title="Hapus produk"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition"
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
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-slate-500">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
          <p className="text-sm text-slate-500">
            {filteredProducts.length > 0
              ? `Menampilkan ${startIndex} - ${endIndex} dari ${filteredProducts.length} produk`
              : "Menampilkan 0 dari 0 produk"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className={`h-8 w-8 flex items-center justify-center border rounded-lg transition ${
                currentPage === 1
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
              aria-label="Halaman selanjutnya"
              className={`h-8 w-8 flex items-center justify-center border rounded-lg transition ${
                currentPage === totalPages
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-[100000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40" onClick={closeEdit} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.5 3.5C16.8978 3.12132 17.5 3 18 3C18.5 3 19.1022 3.12132 19.5 3.5C19.8978 3.87868 20 4.5 20 5C20 5.5 19.8978 6.12132 19.5 6.5L7 19L3 19L3 15L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Produk</h2>
                  <p className="text-sm text-slate-600">Perbarui informasi produk, harga jual, stok, atau status katalog.</p>
                </div>
              </div>
              <button onClick={closeEdit} className="text-slate-400 hover:text-slate-600" aria-label="Tutup">
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
                <label className="text-sm font-medium text-slate-700">Nama Produk <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Penjual / Supplier <span className="text-red-500">*</span></label>
                  <select
                    value={form.seller}
                    onChange={(e) => setForm((prev) => (prev ? { ...prev, seller: e.target.value } : prev))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SELLER_OPTIONS.map((seller) => (
                      <option key={seller}>{seller}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => (prev ? { ...prev, category: e.target.value } : prev))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Harga Jual (Rp) <span className="text-red-500">*</span></label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                    <input
                      value={formatThousands(form.price)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        setForm((prev) => (prev ? { ...prev, price: digits } : prev));
                      }}
                      inputMode="numeric"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Stok <span className="text-red-500">*</span></label>
                  <input
                    value={form.stock}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setForm((prev) => (prev ? { ...prev, stock: digits } : prev));
                    }}
                    inputMode="numeric"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Deskripsi Produk</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Status Katalog <span className="text-red-500">*</span></label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => (prev ? { ...prev, status: "Aktif" } : prev))}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition ${
                      form.status === "Aktif"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        form.status === "Aktif" ? "border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {form.status === "Aktif" && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </span>
                    <span>
                      <span className={`block text-sm font-semibold ${form.status === "Aktif" ? "text-blue-700" : "text-slate-800"}`}>
                        Aktifkan Produk
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">Tampil di katalog pembeli</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => (prev ? { ...prev, status: "Nonaktif" } : prev))}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition ${
                      form.status === "Nonaktif"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        form.status === "Nonaktif" ? "border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {form.status === "Nonaktif" && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </span>
                    <span>
                      <span className={`block text-sm font-semibold ${form.status === "Nonaktif" ? "text-blue-700" : "text-slate-800"}`}>
                        Nonaktifkan Produk
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">Sembunyikan dari katalog</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-200">
              <button type="button" onClick={closeEdit} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M8.5 12L11 14.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-[100000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40" onClick={closeAdd} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tambah Produk</h2>
                  <p className="text-sm text-slate-600">Lengkapi data formulir untuk mendaftarkan produk baru ke katalog Schooly Shop.</p>
                </div>
              </div>
              <button onClick={closeAdd} className="text-slate-400 hover:text-slate-600" aria-label="Tutup">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {addError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{addError}</div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">Nama Produk <span className="text-red-500">*</span></label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Mug Ecoprint"
                  className={`mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    addForm.name ? "bg-white" : "bg-blue-50/40"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Penjual / Supplier <span className="text-red-500">*</span></label>
                  <select
                    value={addForm.seller}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, seller: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SELLER_OPTIONS.map((seller) => (
                      <option key={seller}>{seller}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Harga Jual (Rp) <span className="text-red-500">*</span></label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                    <input
                      value={formatThousands(addForm.price)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        setAddForm((prev) => ({ ...prev, price: digits }));
                      }}
                      inputMode="numeric"
                      placeholder="25.000"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        addForm.price ? "bg-white" : "bg-blue-50/40"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Stok Awal <span className="text-red-500">*</span></label>
                  <input
                    value={addForm.stock}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setAddForm((prev) => ({ ...prev, stock: digits }));
                    }}
                    inputMode="numeric"
                    placeholder="10"
                    className={`mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      addForm.stock ? "bg-white" : "bg-blue-50/40"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Deskripsi Produk</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  placeholder="Mug ecoprint adalah mug atau cangkir yang dihias menggunakan teknik ecoprint, yaitu teknik mencetak motif alami dari daun, bunga, atau tumbuhan pada permukaan benda."
                  className={`mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    addForm.description ? "bg-white" : "bg-blue-50/40"
                  }`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Status Awal Katalog <span className="text-red-500">*</span></label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddForm((prev) => ({ ...prev, status: "Aktif" }))}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition ${
                      addForm.status === "Aktif"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        addForm.status === "Aktif" ? "border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {addForm.status === "Aktif" && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </span>
                    <span>
                      <span className={`block text-sm font-semibold ${addForm.status === "Aktif" ? "text-blue-700" : "text-slate-800"}`}>
                        Aktifkan Produk
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">Tampil di katalog pembeli</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddForm((prev) => ({ ...prev, status: "Nonaktif" }))}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition ${
                      addForm.status === "Nonaktif"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        addForm.status === "Nonaktif" ? "border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {addForm.status === "Nonaktif" && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </span>
                    <span>
                      <span className={`block text-sm font-semibold ${addForm.status === "Nonaktif" ? "text-blue-700" : "text-slate-800"}`}>
                        Nonaktifkan
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">Sembunyikan dari katalog</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-200">
              <button type="button" onClick={closeAdd} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Batal
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
