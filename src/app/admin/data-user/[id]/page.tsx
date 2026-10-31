"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ADMIN_USERS, formatUserDate } from "@/lib/shop/admin-users";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function DetailUserPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const user = ADMIN_USERS.find((item) => item.id.toLowerCase() === id?.toLowerCase());

  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">User tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Data pengguna dengan ID tersebut tidak tersedia.</p>
        <Link
          href="/admin/data-user"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Kembali ke Data User
        </Link>
      </div>
    );
  }

  const activity = [
    {
      label: "Total Pesanan",
      value: user.totalOrders,
      description: "Keseluruhan order akun",
      valueClass: "text-slate-900",
      descriptionClass: "text-slate-500",
      iconClass: "bg-blue-50 text-blue-600",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Pesanan Selesai",
      value: user.completedOrders,
      description: "Berhasil diterima pembeli",
      valueClass: "text-emerald-600",
      descriptionClass: "text-emerald-600",
      iconClass: "bg-emerald-50 text-emerald-600",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8.5 12L11 14.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Pesanan Dalam Proses",
      value: user.processingOrders,
      description: "Sedang diproses vendor",
      valueClass: "text-orange-500",
      descriptionClass: "text-orange-500",
      iconClass: "bg-amber-50 text-amber-500",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5281 18.364 18.364C17.5281 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5281 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 4V9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/data-user" className="hover:text-slate-600">Data User</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Detail User</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Detail User</h1>
            <p className="text-sm text-slate-600 mt-1">Informasi lengkap akun pengguna Schooly Shop.</p>
          </div>
          <Link
            href="/admin/data-user"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Kembali ke Data User
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <span
                className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.status === "Aktif"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    user.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {user.status}
              </span>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="8" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M5 16C5 14.9 6.3 14 8 14C9.7 14 11 14.9 11 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 10H18M14 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  ID User: <span className="font-mono font-medium text-slate-700">{user.id}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                {user.verified && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Akun Terverifikasi
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-lg bg-white text-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Terdaftar Sejak</p>
              <p className="text-sm font-semibold text-slate-900">{formatUserDate(user.joinedAt, "long")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-lg font-bold text-slate-900">Informasi Akun</h2>
          </div>
          <span className="rounded-full bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1">
            Hanya Baca (View Only)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-y border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Nama Lengkap</span>
              <span className="text-sm font-semibold text-slate-900 text-right">{user.name}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">ID User</span>
              <span className="text-sm font-medium font-mono text-slate-700 text-right">{user.id}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Alamat Email</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 text-right">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 7L12 14L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {user.email}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-y border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Tanggal Bergabung</span>
              <span className="text-sm text-slate-700 text-right">{formatUserDate(user.joinedAt, "long")}</span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Status Akun</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user.status}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 shrink-0">Peran / Tipe Akun</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 15L11 11L15 14L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-lg font-bold text-slate-900">Aktivitas Pengguna</h2>
          </div>
          <p className="text-xs text-slate-500">Ringkasan transaksi roll</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activity.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-600">{item.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${item.valueClass}`}>{item.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconClass}`}>
                  {item.icon}
                </div>
              </div>
              <p className={`text-xs mt-2 ${item.descriptionClass}`}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
