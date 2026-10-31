"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import BatikProductIllustration from "@/components/admin/BatikProductIllustration";
import {
  ChatIcon,
  CheckIcon,
  ChevronLeftIcon,
  InfoIcon,
} from "@/components/icons";
import { getAdminReturnDetail } from "@/lib/shop/admin-return-details";

type StepTone = "done" | "rejected" | "closed";

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V15M12 15L7.5 10.5M12 15L16.5 10.5M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11.5A8 8 0 015.7 18.6L3 20L4.4 17.4A8 8 0 1120 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8.5C9 8.5 9.5 8 10 8C10.5 8 11 9 11 9.5C11 10 10.5 10.5 10.5 11C10.5 11.5 11.5 13 12.5 13.5C13 13.7 13.5 13.5 14 13C14.3 12.7 14.5 12.5 15 12.5C15.5 12.5 16 13.5 16 14C16 14.5 15 15 14.5 15C11.5 15 8.5 12 8.5 9.5C8.5 9 8.5 8.5 9 8.5Z" fill="currentColor" />
    </svg>
  );
}

const STEPS: { title: string; detail: string; status: string; tone: StepTone }[] = [
  {
    title: "Pengajuan Diajukan",
    detail: "16 Okt 2026, 09:30 WIB",
    status: "Selesai",
    tone: "done",
  },
  {
    title: "Ditolak Admin",
    detail: "16 Okt 2026, 10:15 WIB",
    status: "Ditolak",
    tone: "rejected",
  },
  {
    title: "Status Akhir",
    detail: "Kasus ditutup / tidak ada pengiriman tercatat",
    status: "Ditutup",
    tone: "closed",
  },
];

const DOT_CLASS: Record<StepTone, string> = {
  done: "border-emerald-500 bg-emerald-500",
  rejected: "border-red-500 bg-red-500 ring-4 ring-red-100",
  closed: "border-slate-300 bg-white",
};

const STATUS_CLASS: Record<StepTone, string> = {
  done: "text-emerald-600",
  rejected: "text-red-600",
  closed: "text-slate-400",
};

export default function PengembalianDitolakPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminReturnDetail(id);
  const [showBanner, setShowBanner] = useState(true);

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

  const initials = detail.customer
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const productName = detail.product.replace(/\s*\(Size L\)$/, "");
  const paymentLabel = detail.paymentMethod.split("/")[0].trim();
  const decidedAt = "16 Okt 2026, 10:15 WIB";
  const whatsappHref = `https://wa.me/${detail.phone.replace(/\D/g, "").replace(/^0/, "62")}`;

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin/pengiriman" className="hover:text-slate-600">Pengiriman &amp; Pengembalian</Link>
          <span>&gt;</span>
          <Link href="/admin/pengiriman/pengembalian" className="hover:text-slate-600">Klaim Retur</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Detail {detail.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Detail Pengajuan Pengembalian Barang
            </h1>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Pengajuan Ditolak
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              No. Pengajuan: <span className="font-semibold text-slate-700">{detail.id}</span>
              <span className="mx-1.5">•</span>
              Tanggal Pengajuan: <span className="font-medium text-slate-700">{detail.submittedAt}</span>
            </p>
          </div>
          <Link
            href="/admin/pengiriman/pengembalian"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ChevronLeftIcon width={15} height={15} />
            Kembali ke Daftar Pengembalian
          </Link>
        </div>
      </div>

      {showBanner && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <XCircleIcon className="mt-0.5 shrink-0 text-red-500" />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-red-700">Pengajuan Pengembalian Ditolak</h2>
            <p className="text-sm text-red-700/80 mt-1 leading-relaxed">
              Pengajuan pengembalian {detail.id} telah ditolak pada {decidedAt}. Alasan penolakan telah
              dikirimkan ke pembeli ({detail.customer}).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="rounded-md p-1 text-red-500 hover:bg-red-100 transition"
            aria-label="Tutup banner"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Informasi Pembeli &amp; Pesanan</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                <CheckIcon width={13} height={13} />
                Akun Terverifikasi
              </span>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{detail.customer}</p>
                <p className="text-xs text-slate-500 mt-0.5">{detail.phone}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Siswa SMA Kelas XII IPA • NIS: 25240081
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Pesanan Terkait</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-mono font-bold text-slate-900">#{detail.orderId}</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Lunas
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Metode Pembayaran</p>
                <p className="text-sm font-semibold text-slate-900">{paymentLabel}</p>
                <p className="text-xs text-slate-500 mt-0.5">Waktu Transaksi: 14 Okt 2026, 14:20 WIB</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Produk yang Dikembalikan</h2>
              <span className="text-xs text-slate-500 whitespace-nowrap">{detail.quantity} Barang Diajukan</span>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="h-28 w-full sm:w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                <BatikProductIllustration variant="product" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  Seragam Resmi SMA
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-2">{productName}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Ukuran: {detail.size}</span>
                  <span>Jumlah: {detail.quantity} pcs</span>
                  <span>SKU: {detail.sku}</span>
                </div>
              </div>
              <div className="shrink-0 border-t border-slate-100 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                <p className="text-xs text-slate-500">Nilai Retur</p>
                <p className="text-xl font-bold text-blue-600 mt-0.5">{detail.price}</p>
                <span className="mt-1.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  100% Nilai Klaim
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Alasan Pengembalian &amp; Catatan</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                {detail.category}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">Uraian Alasan</p>
              <p className="text-sm text-slate-700 leading-relaxed">{detail.reason}</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">Catatan Pembeli</p>
              <div className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <ChatIcon width={16} height={16} className="mt-0.5 shrink-0 text-blue-500" />
                <div>
                  <p className="text-sm text-slate-700 leading-relaxed">{detail.buyerNote}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Catatan diketik bersama formulir klaim retur online.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Bukti Foto dari Pembeli</h2>
              <span className="text-xs text-slate-500">2 Foto Terlampir</span>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <figure>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                  <BatikProductIllustration variant="photo-1" />
                </div>
                <figcaption className="mt-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Foto Kemeja Batik</p>
                    <p className="text-xs text-slate-500 mt-0.5">Fisik Produk Lengkap</p>
                    <p className="text-[11px] text-slate-400 mt-1">Diunggah: 16 Okt 2026, 09:26 WIB</p>
                  </div>
                  <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-emerald-500" />
                </figcaption>
              </figure>
              <figure>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                  <BatikProductIllustration variant="photo-2" />
                </div>
                <figcaption className="mt-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Label &amp; Hangtag</p>
                    <p className="text-xs text-slate-500 mt-0.5">Hangtag &amp; Size L Utuh</p>
                    <p className="text-[11px] text-slate-400 mt-1">Diunggah: 16 Okt 2026, 09:29 WIB</p>
                  </div>
                  <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-emerald-500" />
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

        <aside className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 xl:sticky xl:top-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Ringkasan Keputusan
            </p>
            <h2 className="text-base font-bold text-slate-900 mt-1">Status Keputusan &amp; Tindak Lanjut</h2>

            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
                <XCircleIcon className="h-3 w-3" />
                Ditolak
              </span>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-red-700/80">Ditolak oleh</dt>
                  <dd className="font-semibold text-red-900 text-right">Admin Pengelola</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-red-700/80">Waktu Keputusan</dt>
                  <dd className="font-semibold text-red-900 text-right">{decidedAt}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-slate-700">Alasan Penolakan</p>
                <InfoIcon width={16} height={16} className="shrink-0 text-red-500" />
              </div>
              <span className="mt-2 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 ring-1 ring-red-200">
                Tidak Memenuhi Ketentuan Retur!
              </span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Barang telah dicuci atau segel/hangtag toko terlepas sehingga tidak memenuhi syarat
                penukaran barang sesuai S&amp;K Retur Schooly Shop.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-[11px] text-slate-600 italic leading-relaxed">
                “Mohon maaf, permohonan pengembalian atau tukar ukuran tidak dapat diproses karena produk
                tidak memenuhi kriteria pengembalian barang baru Schooly Shop.”
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-bold text-slate-900">Progres Retur</p>
              <ol className="mt-3 border-l border-slate-200 pl-4">
                {STEPS.map((step) => (
                  <li key={step.title} className="relative pb-5 last:pb-0">
                    <span
                      className={`absolute -left-[22.5px] top-0.5 h-3.5 w-3.5 rounded-full border-2 ${DOT_CLASS[step.tone]}`}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-semibold ${step.tone === "closed" ? "text-slate-400" : "text-slate-900"}`}>
                        {step.title}
                      </p>
                      <span className={`text-[10px] font-semibold whitespace-nowrap ${STATUS_CLASS[step.tone]}`}>
                        {step.status}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-relaxed ${step.tone === "closed" ? "text-slate-400" : "text-slate-500"}`}>
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <DownloadIcon />
                Unduh Bukti Penolakan (PDF)
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                <WhatsAppIcon />
                Hubungi Pembeli via WhatsApp
              </a>
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
              <div className="flex items-start gap-2.5">
                <InfoIcon width={16} height={16} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Klarifikasi dengan Pembeli</p>
                  <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                    Jika pembeli mengajukan sanggahan atau pertanyaan terkait alasan penolakan, sampaikan
                    penjelasan sesuai ketentuan retur resmi melalui CS Schooly Shop.
                  </p>
                </div>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Buka Riwayat Percakapan CS →
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
