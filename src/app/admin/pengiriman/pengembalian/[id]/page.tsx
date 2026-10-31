"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import BatikProductIllustration from "@/components/admin/BatikProductIllustration";
import { CheckIcon, ChevronLeftIcon } from "@/components/icons";
import { getAdminReturnDetail } from "@/lib/shop/admin-return-details";

type ConfirmAction = "accepted" | "rejected";

function RejectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DetailPengembalianPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminReturnDetail(id);
  const [note, setNote] = useState("");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Pengajuan pengembalian tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Data pengajuan dengan nomor tersebut tidak tersedia.</p>
        <Link
          href="/admin/pengiriman/pengembalian"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeftIcon width={16} height={16} />
          Kembali ke Daftar Pengembalian
        </Link>
      </div>
    );
  }

  const displayStatus = detail.status;
  const statusClass = "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin/pengiriman" className="hover:text-slate-600">Pengiriman &amp; Pengembalian</Link>
          <span>&gt;</span>
          <Link href="/admin/pengiriman/pengembalian" className="hover:text-slate-600">Retur Barang</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Detail {detail.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mt-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Detail Pengajuan Pengembalian Barang
              </h1>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                {displayStatus}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Nomor Pengajuan: <span className="font-semibold text-slate-700">{detail.id}</span>
              <span className="mx-1.5">•</span>
              Tanggal Pengajuan: <span className="font-medium text-slate-700">{detail.submittedAt}</span>
            </p>
          </div>
          <Link
            href="/admin/pengiriman/pengembalian"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ChevronLeftIcon width={15} height={15} />
            <span className="leading-tight text-left">
              Kembali ke
              <br />
              Daftar Pengembalian
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Informasi Pembeli &amp; Pesanan</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 whitespace-nowrap">
                <CheckIcon width={13} height={13} />
                Akun Terverifikasi
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Nama Pembeli</p>
                <p className="text-sm font-semibold text-slate-900">{detail.customer}</p>
                <p className="text-xs text-slate-500 mt-0.5">{detail.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">ID Pesanan Asli</p>
                <p className="text-sm font-mono font-bold text-slate-900">{detail.orderId}</p>
                <p className="text-xs text-slate-500 mt-0.5">{detail.paymentMethod}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Produk yang Dikembalikan</h2>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {detail.quantity} Barang Disajikan
              </span>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="h-28 w-full sm:w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                <BatikProductIllustration variant="product" />
              </div>
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                  Delegasi Sekolah Siswa
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-2">{detail.product}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{detail.price}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Ukuran: {detail.size}</span>
                  <span>Jumlah: {detail.quantity} pcs</span>
                  <span>SKU: {detail.sku}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Alasan Pengembalian &amp; Catatan</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                Kategori: {detail.category}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">Alasan Utama</p>
              <p className="text-sm text-slate-700 leading-relaxed">{detail.reason}</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">Catatan Pembeli</p>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-slate-700 leading-relaxed">
                {detail.buyerNote}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Bukti Foto dari Pembeli</h2>
              <span className="text-xs text-slate-500">{detail.photos.length} foto terlampir dari pembeli</span>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detail.photos.map((photo, index) => (
                <figure key={photo.label}>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                    <BatikProductIllustration variant={index === 0 ? "photo-1" : "photo-2"} />
                  </div>
                  <figcaption className="mt-2">
                    <p className="text-xs font-semibold text-slate-700">{photo.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{photo.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>

        <aside className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 xl:sticky xl:top-24">
            <h2 className="text-base font-bold text-slate-900">Keputusan Admin</h2>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Total Pengembalian</span>
                <span className="font-bold text-slate-900">{detail.price}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Waktu Pengajuan</span>
                <span className="text-slate-700 text-right">{detail.decisionTime}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Metode Pengembalian</span>
                <span className="text-slate-700 text-right">{detail.refundMethod}</span>
              </div>
            </div>

            <label htmlFor="catatan-admin" className="block text-sm font-semibold text-slate-700 mt-5 mb-1.5">
              Catatan Internal / Catatan Admin (Opsional)
            </label>
            <textarea
              id="catatan-admin"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: Barang sesuai ukuran M, proses penukaran disetujui oleh admin gudang."
              className="w-full rounded-lg border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setConfirmAction("accepted")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                <CheckIcon width={16} height={16} />
                Terima Pengembalian
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("rejected")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <RejectIcon />
                Tolak Pengembalian
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-[11px] text-amber-800 leading-relaxed">
              Keputusan ini memengaruhi proses pengembalian dana atau penukaran barang dan tidak dapat
              dibatalkan setelah disimpan.
            </div>
          </div>
        </aside>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#071b45]/60 backdrop-blur-sm"
            onClick={() => setConfirmAction(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {confirmAction === "accepted" ? "Terima Pengembalian?" : "Tolak Pengembalian?"}
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {confirmAction === "accepted"
                ? "Pengajuan akan diproses ke tahap pengembalian dana atau penukaran barang sesuai metode yang dipilih."
                : "Pengajuan akan ditolak dan pembeli akan menerima informasi bahwa pengembalian tidak dapat diproses."}
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = confirmAction === "accepted" ? "disetujui" : "ditolak";
                  setConfirmAction(null);
                  router.push(`/admin/pengiriman/pengembalian/${detail.id}/${target}`);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  confirmAction === "accepted"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmAction === "accepted" ? "Ya, Terima" : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
