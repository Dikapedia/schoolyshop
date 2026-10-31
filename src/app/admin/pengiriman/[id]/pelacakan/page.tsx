"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckIcon, ChevronLeftIcon, TruckIcon } from "@/components/icons";
import { getAdminShipmentDetail } from "@/lib/shop/admin-shipments";

type StepState = "done" | "active" | "pending";

type TrackingStep = {
  title: string;
  time: string;
  description: string;
  state: StepState;
  badge: string;
};

const TRACKING_STEPS: TrackingStep[] = [
  {
    title: "Pengiriman berhasil dibuat",
    time: "14 Oktober 2026, 14:30 WIB",
    description:
      "Pengiriman ORD-001 telah berhasil dikonfirmasi dan tiket resi kurir JT8829103841 diterbitkan.",
    state: "done",
    badge: "Selesai",
  },
  {
    title: "Paket dijemput kurir dari Semarang",
    time: "14 Oktober 2026, 17:15 WIB",
    description:
      "Paket telah diserahkan kepada kurir J&T Express di Hub Logistik Semarang dan dipersiapkan untuk perjalanan antar-kota.",
    state: "done",
    badge: "Selesai",
  },
  {
    title: "Paket dalam perjalanan menuju kota tujuan",
    time: "15 Oktober 2026, 08:20 WIB",
    description:
      "Paket tiba di Transit Hub Jakarta dan sedang dijadwalkan untuk pengantaran ke tujuan (Jakarta Selatan).",
    state: "active",
    badge: "Sedang berlangsung",
  },
  {
    title: "Paket diterima pembeli",
    time: "Estimasi 16 Oktober 2026",
    description:
      "Paket belum diterima oleh Budi Santoso. Menunggu proses pengantaran kurir ke alamat tujuan.",
    state: "pending",
    badge: "Menunggu",
  },
];

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepIcon({ state, index }: { state: StepState; index: number }) {
  if (state === "done") {
    return (
      <span className="relative z-10 h-8 w-8 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-4 ring-white">
        <CheckIcon width={16} height={16} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative z-10 h-8 w-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white">
        <RefreshIcon />
      </span>
    );
  }
  return (
    <span className="relative z-10 h-8 w-8 shrink-0 rounded-full border border-slate-200 bg-slate-100 text-slate-400 text-sm font-semibold flex items-center justify-center ring-4 ring-white">
      {index + 1}
    </span>
  );
}

function StepBadge({ state, label }: { state: StepState; label: string }) {
  const tone =
    state === "done"
      ? "bg-emerald-50 text-emerald-700"
      : state === "active"
        ? "bg-blue-50 text-blue-700"
        : "bg-slate-100 text-slate-500";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${tone}`}>
      {label}
    </span>
  );
}

export default function PelacakanPengirimanPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminShipmentDetail(id);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Pengiriman tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Data pelacakan untuk pengiriman tersebut tidak tersedia.</p>
        <Link
          href="/admin/pengiriman"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeftIcon width={16} height={16} />
          Kembali ke Pengiriman
        </Link>
      </div>
    );
  }

  const steps = TRACKING_STEPS.map((step, index) => {
    if (index === 0) {
      return {
        ...step,
        description: `Pengiriman ${detail.id} telah berhasil dikonfirmasi dan tiket resi kurir ${detail.trackingNumber} diterbitkan.`,
      };
    }
    if (index === TRACKING_STEPS.length - 1) {
      return {
        ...step,
        description: `Paket belum diterima oleh ${detail.recipient}. Menunggu proses pengantaran kurir ke alamat tujuan.`,
      };
    }
    return step;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
            <span>&gt;</span>
            <Link href="/admin/pengiriman" className="hover:text-slate-600">Pengiriman &amp; Pengembalian</Link>
            <span>&gt;</span>
            <Link href={`/admin/pengiriman/${detail.id}`} className="hover:text-slate-600">Detail Pengiriman</Link>
            <span>&gt;</span>
            <span className="font-medium text-blue-600">Pelacakan Pengiriman</span>
          </div>
          <Link
            href={`/admin/pengiriman/${detail.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap"
          >
            <ChevronLeftIcon width={14} height={14} />
            Kembali ke Detail Pengiriman
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mt-3">
          <div className="flex items-start gap-3">
            <span className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TruckIcon width={22} height={22} />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pelacakan Pengiriman</h1>
              <p className="text-sm text-slate-600 mt-1">
                Monitoring pergerakan paket logistik pesanan secara berkala
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Sedang Dalam Perjalanan
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 whitespace-nowrap">
              Biteship Logistics Live Tracker: Simulasi Aktif
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900">Ringkasan Pengiriman</h2>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          <div>
            <p className="text-xs text-slate-500 mb-1">Nomor Pesanan</p>
            <p className="text-sm font-mono font-bold text-slate-900">{detail.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Nama Pembeli</p>
            <p className="text-sm font-semibold text-slate-900">{detail.recipient}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Item Produk</p>
            <p className="text-sm text-slate-700">{detail.product}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Kurir &amp; Layanan</p>
            <p className="text-sm text-slate-700">J&amp;T Express (Regular)</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Nomor Resi</p>
            <p className="text-sm font-mono font-semibold text-blue-600">{detail.trackingNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Kota Asal</p>
            <p className="text-sm text-slate-700">Semarang, Jawa Tengah</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500 mb-1">Kota Tujuan</p>
            <p className="text-sm text-slate-700">
              Jakarta Selatan, DKI Jakarta{" "}
              <span className="text-slate-500">(Jl. Pendidikan No. 45, Kebayoran Baru)</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Riwayat Perjalanan Paket</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Pembaruan status otomatis dari gateway kurir J&amp;T Express via Biteship API
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Sinkronisasi Terakhir
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">15 Okt 2026, 08:25 WIB</p>
          </div>
        </div>

        <ol className="relative mt-6 space-y-4 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-px before:bg-slate-200">
          {steps.map((step, index) => {
            const active = step.state === "active";
            const pending = step.state === "pending";
            return (
              <li key={step.title} className="relative flex gap-4">
                <StepIcon state={step.state} index={index} />
                <div
                  className={
                    active
                      ? "flex-1 rounded-xl border border-blue-200 bg-white p-4 shadow-md"
                      : `flex-1 py-1 ${pending ? "opacity-60" : ""}`
                  }
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        active ? "text-blue-700" : pending ? "text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <StepBadge state={step.state} label={step.badge} />
                    <span className="text-xs text-slate-400 sm:ml-auto">{step.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-6">
        <Link
          href={`/admin/pengiriman/${detail.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ChevronLeftIcon width={16} height={16} />
          Kembali ke Detail Pengiriman
        </Link>
      </div>
    </div>
  );
}
