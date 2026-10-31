"use client";

import { useState } from "react";

const summaryCards = [
  {
    title: "Total Supplier Terdaftar",
    value: "5",
    badge: "+2 bulan ini",
    badgeClass: "bg-emerald-50 text-emerald-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    title: "Kategori Siswa",
    value: "3",
    badge: "Program Wirausaha Muda",
    badgeClass: "bg-blue-50 text-blue-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10V6L12 1L2 6V10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12V17C6 18.6569 8.68629 20 12 20C15.3137 20 18 18.6569 18 17V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    title: "Kategori Guru",
    value: "1",
    badge: "Produk Edukasi & Kreasi",
    badgeClass: "bg-violet-50 text-violet-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconClass: "bg-violet-50 text-violet-600",
  },
];

const initialSellers = [
  {
    id: 1,
    initials: "IS",
    name: "Ismi",
    business: "Batik Ismi",
    type: "Siswa (Kelas XI-RPL)",
    typeClass: "bg-blue-50 text-blue-700",
    kk: "320104580290****",
    avatarClass: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    initials: "IN",
    name: "Intan",
    business: "Kerajinan Intan",
    type: "Siswa (Kelas XII-Tata Busana)",
    typeClass: "bg-blue-50 text-blue-700",
    kk: "320104620381****",
    avatarClass: "bg-blue-50 text-blue-600",
  },
  {
    id: 3,
    initials: "AL",
    name: "Alwan",
    business: "Alwan Craft",
    type: "Siswa (Kelas X-DKV)",
    typeClass: "bg-blue-50 text-blue-700",
    kk: "320104710103****",
    avatarClass: "bg-blue-50 text-blue-600",
  },
  {
    id: 4,
    initials: "BU",
    name: "Budi",
    business: "Batik Budi",
    type: "Guru (Seni Budaya)",
    typeClass: "bg-violet-50 text-violet-700",
    kk: "320108020405****",
    avatarClass: "bg-violet-50 text-violet-600",
  },
  {
    id: 5,
    initials: "NO",
    name: "Novita",
    business: "Novita Collection",
    type: "Karyawan / TU",
    typeClass: "bg-amber-50 text-amber-700",
    kk: "320101150778****",
    avatarClass: "bg-amber-50 text-amber-600",
  },
];

const tabs = [
  { label: "Semua", count: 5 },
  { label: "Siswa", count: 3 },
  { label: "Guru", count: 1 },
  { label: "Karyawan", count: 1 },
];

export default function PenjualSupplierPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sellers, setSellers] = useState(initialSellers);
  const [selected, setSelected] = useState(initialSellers[0]);
  const [editForm, setEditForm] = useState({ name: "", business: "" });
  const [activeTab, setActiveTab] = useState("Semua");
  const [jenisPenjual, setJenisPenjual] = useState<"Siswa" | "Guru" | "Karyawan">("Siswa");

  const openEdit = (seller: (typeof sellers)[0]) => {
    setSelected(seller);
    setEditForm({ name: seller.name, business: seller.business });
    if (seller.type.toLowerCase().includes("guru")) setJenisPenjual("Guru");
    else if (seller.type.toLowerCase().includes("karyawan")) setJenisPenjual("Karyawan");
    else setJenisPenjual("Siswa");
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    const newName = editForm.name.trim() || selected.name;
    const newBusiness = editForm.business.trim() || selected.business;
    const initials = newName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("") || selected.initials;

    let updated: any = {
      name: newName,
      business: newBusiness,
      initials,
    };

    if (jenisPenjual === "Siswa") {
      updated = {
        ...updated,
        type: "Siswa (Kelas XI-RPL)",
        typeClass: "bg-blue-50 text-blue-700",
        avatarClass: "bg-blue-50 text-blue-600",
      };
    } else if (jenisPenjual === "Guru") {
      updated = {
        ...updated,
        type: "Guru (Seni Budaya)",
        typeClass: "bg-violet-50 text-violet-700",
        avatarClass: "bg-violet-50 text-violet-600",
      };
    } else {
      updated = {
        ...updated,
        type: "Karyawan / TU",
        typeClass: "bg-amber-50 text-amber-700",
        avatarClass: "bg-amber-50 text-amber-600",
      };
    }

    setSellers((prev) =>
      prev.map((seller) => {
        if (seller.id !== selected.id) return seller;
        return { ...seller, ...updated };
      })
    );
    setSelected((prev: any) => ({ ...prev, ...updated }));
    setEditOpen(false);
  };

  const tabs = [
    { label: "Semua", count: 5 },
    { label: "Siswa", count: 3 },
    { label: "Guru", count: 1 },
    { label: "Karyawan", count: 1 },
  ];

  return (
    <div className="relative">
      <div className={addOpen ? "" : ""}>
        <div className="mb-6">
          <div className="text-sm text-slate-400">Produk & Supplier &gt;</div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-1">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Data Penjual & Mitra Supplier</h1>
              <p className="text-sm text-slate-600 mt-1">Kelola registrasi, verifikasi identitas, dan status unit usaha civitas sekolah.</p>
            </div>
            <button type="button" onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tambah Penjual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {summaryCards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600">{card.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${card.badgeClass}`}>{card.badge}</span>
                  </div>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.iconClass}`}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 p-6 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.label
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.label ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50/60">
                  <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Lengkap & Toko</th>
                  <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Jenis Penjual</th>
                  <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">No. KK / Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold ${seller.avatarClass}`}>
                          {seller.initials}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{seller.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {seller.business}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${seller.typeClass}`}>
                        {seller.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-mono text-xs tracking-wide">{seller.kk}</span>
                        <button type="button" onClick={() => openEdit(seller)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-sm text-slate-500">Menampilkan 5 dari 5 supplier</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-slate-400 border border-slate-200 rounded-lg cursor-not-allowed">Sebelumnya</button>
              <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg">1</button>
              <button className="px-3 py-1.5 text-sm text-slate-400 border border-slate-200 rounded-lg cursor-not-allowed">Selanjutnya</button>
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[100000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setEditOpen(false)} />
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
                  <h2 className="text-lg font-bold text-slate-900">Edit Data Penjual/Supplier</h2>
                  <p className="text-sm text-slate-600">Perbarui informasi identitas, usaha, dan kontak mitra penjual Schooly Shop.</p>
                </div>
              </div>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Nomor KK (Kartu Keluarga) <span className="text-red-500">*</span></label>
                <input value={selected.kk.replace("****", "0000")} readOnly className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 text-slate-500 focus:outline-none" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Nomor KK (Kartu Keluarga) <span className="text-red-500">*</span></label>
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    16 Digit Terverifikasi
                  </span>
                </div>
                <input defaultValue={selected.kk} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-500 mt-1">Wajib 16 digit sesuai identitas resmi</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                <input value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Jenis Penjual <span className="text-red-500">*</span></label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setJenisPenjual("Siswa")} className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition ${jenisPenjual === "Siswa" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 10V6L12 1L2 6V10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 12V17C6 18.6569 8.68629 20 12 20C15.3137 20 18 18.6569 18 17V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium">Siswa</span>
                    {jenisPenjual === "Siswa" && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                  <button type="button" onClick={() => setJenisPenjual("Guru")} className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition ${jenisPenjual === "Guru" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium">Guru</span>
                    {jenisPenjual === "Guru" && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                  <button type="button" onClick={() => setJenisPenjual("Karyawan")} className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition ${jenisPenjual === "Karyawan" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="9" y1="22" x2="9" y2="22.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="15" y1="22" x2="15" y2="22.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="22" x2="12" y2="22.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="8" y="6" width="8" height="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium">Karyawan</span>
                    {jenisPenjual === "Karyawan" && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Nama Usaha / Toko <span className="text-red-500">*</span></label>
                <div className="mt-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input value={editForm.business} onChange={(e) => setEditForm((prev) => ({ ...prev, business: e.target.value }))} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <div className="mt-1 flex">
                  <div className="flex items-center gap-2 px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
                      <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.4 15.1C19.9444 16.8267 19.0807 18.4272 7.81987 19.647C6.57099 19.9988 5.24953 20.1758 3.92365 20.1701C2.59777 20.1643 1.28685 19.9762 0.0449219 19.6099L0 19.5L0.0449219 19.6099C1.28685 19.9762 2.59777 20.1643 3.92365 20.1701C5.24953 20.1758 6.57099 19.9988 7.81987 19.647C19.0807 18.4272 19.9444 16.8267 20.4 15.1C20.6951 14.1219 21.0034 12.8199 21 11.5C21 6.5 16.5 3 11 3C6.5 3 3 6.5 3 11.5C3 13.8 4.5 15.5 4.5 15.5L3 21L9.5 19.5C10.4095 19.6949 11.2156 20.7088 11 11.5C11.3 6.5 16.5 3 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    +62
                  </div>
                  <input placeholder="812-xxxx-xxxx" className="flex-1 px-3 py-2 rounded-r-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Digunakan untuk konfirmasi pesanan siswa dan notifikasi pencairan dana.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Alamat Lengkap / Lokasi Operasional</label>
                <textarea defaultValue={selected.address || ""} rows={4} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-500">Sertakan gedung/ruang laboratorium jika berada di area sekolah.</p>
                  <p className="text-xs text-slate-400">75/200</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Status Kemitraan Aktif</p>
                    <p className="text-xs text-slate-600">Terdaftar sejak 14 Januari 2024</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Terverifikasi</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-200">
              <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="button" onClick={handleSaveEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}