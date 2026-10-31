"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import BatikProductIllustration from "@/components/admin/BatikProductIllustration";
import {
  ChatIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  InfoIcon,
} from "@/components/icons";
import { getAdminReturnDetail } from "@/lib/shop/admin-return-details";

type StepTone = "done" | "active" | "pending";

function SwapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8H20L16 4M20 16H4L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 21H20M5 21V5L12 2L19 5V21M9 9H10.5M13.5 9H15M9 13H10.5M13.5 13H15M10 21V17H14V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13M12 17H12.01M10.3 3.9L2.7 17.1A2 2 0 004.4 20H19.6A2 2 0 0021.3 17.1L13.7 3.9A2 2 0 0010.3 3.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

const STEPS: { title: string; detail: string; status: string; tone: StepTone }[] = [
  {
    title: "Pengajuan Diajukan",
    detail: "16 Okt 2026, 09:30 WIB",
    status: "Selesai",
    tone: "done",
  },
  {
    title: "Disetujui Admin",
    detail: "16 Okt 2026, 10:15 WIB",
    status: "Selesai",
    tone: "done",
  },
  {
    title: "Pembeli Mengirim Barang",
    detail: "Menunggu nomor resi dari pembeli",
    status: "Dalam Proses",
    tone: "active",
  },
  {
    title: "Pengecekan Barang di Gudang",
    detail: "Pemeriksaan fisik & kesesuaian hangtag",
    status: "Menunggu",
    tone: "pending",
  },
  {
    title: "Kirim Barang Baru / Selesai",
    detail: "Pengiriman kemeja Batik Size M",
    status: "Menunggu",
    tone: "pending",
  },
];

const DOT_CLASS: Record<StepTone, string> = {
  done: "border-emerald-500 bg-emerald-500",
  active: "border-blue-600 bg-blue-600 ring-4 ring-blue-100",
  pending: "border-slate-300 bg-white",
};

const STATUS_CLASS: Record<StepTone, string> = {
  done: "text-emerald-600",
  active: "text-blue-600",
  pending: "text-slate-400",
};

export default function PengembalianDisetujuiPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminReturnDetail(id);
  const [showBanner, setShowBanner] = useState(true);
  const [reminderSent, setReminderSent] = useState(false);

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
  const approvedAt = "16 Okt 2026, 10:15 WIB";

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
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Detail Pengajuan Pengembalian Barang
              </h1>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Disetujui - Menunggu Pengiriman Barang
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
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
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircleIcon width={22} height={22} className="mt-0.5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-emerald-800">Pengajuan Disetujui Berhasil Diproses</h2>
            <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
              Pengajuan pengembalian {detail.id} berhasil disetujui pada {approvedAt}. Instruksi retur dan
              alamat gudang telah dikirimkan ke pembeli ({detail.customer}).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="rounded-md p-1 text-emerald-600 hover:bg-emerald-100 transition"
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
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
                  Seragam Resmi Sekolah
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
              <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <ChatIcon width={16} height={16} className="mt-0.5 shrink-0 text-slate-400" />
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
                    <p className="text-xs text-slate-500 mt-0.5">Foto Produk Lengkap</p>
                    <p className="text-[11px] text-slate-400 mt-1">Diunggah: 16 Okt 2026, 09:20 WIB</p>
                  </div>
                  <CheckCircleIcon width={16} height={16} className="mt-0.5 shrink-0 text-emerald-500" />
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
                  <CheckCircleIcon width={16} height={16} className="mt-0.5 shrink-0 text-emerald-500" />
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

            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
                <CheckIcon width={12} height={12} />
                Disetujui
              </span>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-emerald-700/80">Disetujui oleh</dt>
                  <dd className="font-semibold text-emerald-900 text-right">Admin Pengelola</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-emerald-700/80">Waktu Verifikasi</dt>
                  <dd className="font-semibold text-emerald-900 text-right">{approvedAt}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <SwapIcon />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Solusi Retur Terpilih</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    Tukar Ukuran (Size L → Size M)
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Stok Size M tersedia di Gudang Pusat (24 unit)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <BuildingIcon />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alamat Tujuan Gudang</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">Gudang Pusat Schooly Shop</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan 12160
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
              <WarningIcon />
              <div>
                <p className="text-xs font-semibold">Batas kirim</p>
                <p className="text-xs mt-0.5">18 Okt 2026, 23:59 WIB</p>
              </div>
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
                      <p className="text-xs font-semibold text-slate-900">{step.title}</p>
                      <span className={`text-[10px] font-semibold whitespace-nowrap ${STATUS_CLASS[step.tone]}`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
              <div className="flex items-start gap-2.5">
                <InfoIcon width={16} height={16} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Butuh Hubungi Pembeli?</p>
                  <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                    Gunakan kontak resmi WhatsApp Schooly Shop untuk mengingatkan {detail.customer}{" "}
                    mengirimkan resi sebelum batas waktu 18 Okt.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReminderSent(true)}
                disabled={reminderSent}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-emerald-600 disabled:cursor-default transition"
              >
                {reminderSent ? "Pengingat berhasil dikirim" : "Kirim Pesan Pengingat →"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
