"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_USERS, formatUserDate } from "@/lib/shop/admin-users";

const PAGE_SIZE = 10;

export default function DataUserPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = ADMIN_USERS.filter((user) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.id.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startIndex = filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredUsers.length);

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Data User</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Data User</h1>
        <p className="text-sm text-slate-600 mt-1">Lihat dan pantau informasi akun pengguna Schooly Shop.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Total User</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{ADMIN_USERS.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Akun terdaftar</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-slate-200">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama atau ID user..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-slate-500 sm:ml-auto">
            Menampilkan {paginatedUsers.length} dari {filteredUsers.length} user
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide w-16">No.</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">ID User</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Nama Lengkap</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Email</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Tanggal Bergabung</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Status Akun</th>
                <th className="text-left py-3 px-6 font-semibold text-slate-600 uppercase text-xs tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-slate-100 last:border-0 transition-colors hover:bg-blue-50/30 ${
                    index % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6 text-slate-500">{startIndex + index}</td>
                  <td className="py-4 px-6 font-medium text-blue-600">{user.id}</td>
                  <td className="py-4 px-6 font-semibold text-[#0d47b8]">{user.name}</td>
                  <td className="py-4 px-6 text-slate-600">{user.email}</td>
                  <td className="py-4 px-6 text-slate-600">{formatUserDate(user.joinedAt)}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/data-user/${user.id}`}
                      title="Lihat detail user"
                      className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12S5 5 12 5C19 5 22 12 22 12S19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-slate-500">
                    User tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
          <p className="text-sm text-slate-500">
            Menampilkan {startIndex}-{endIndex} dari {filteredUsers.length} user
          </p>
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
              ‹ Sebelumnya
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
                  : "text-blue-600 border-blue-200 hover:bg-blue-50"
              }`}
            >
              Berikutnya ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
