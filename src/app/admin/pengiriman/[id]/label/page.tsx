"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeftIcon, PrinterIcon } from "@/components/icons";
import { getAdminShipmentDetail } from "@/lib/shop/admin-shipments";

const BARCODE_PATTERN =
  "1101001011010010110100110100101101001011011010010110100101101101001011010010110110100101101001011011010010110100101101001011010010110100101101001011010010110100101101";

function Barcode() {
  return (
    <svg
      viewBox={`0 0 ${BARCODE_PATTERN.length} 48`}
      preserveAspectRatio="none"
      className="h-14 w-full text-slate-900"
      aria-label="Barcode nomor resi"
      role="img"
    >
      {[...BARCODE_PATTERN].map((bit, index) =>
        bit === "1" ? (
          <rect key={index} x={index} y="0" width="1" height="48" fill="currentColor" />
        ) : null,
      )}
    </svg>
  );
}

export default function PratinjauLabelPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const detail = getAdminShipmentDetail(id);

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Pengiriman tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mt-1">Label untuk pengiriman tersebut tidak tersedia.</p>
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

  const recipientAddress = detail.address.replace(/,\s*12150$/, "");

  return (
    <div>
      <style>{`
        @media print {
          @page { size: 100mm 150mm; margin: 0; }
          body * { visibility: hidden; }
          #label-print, #label-print * { visibility: visible; }
          #label-print {
            position: fixed;
            inset: 0;
            width: 100mm;
            height: 150mm;
            max-width: none;
            margin: 0;
            border: none;
            box-shadow: none;
            overflow: hidden;
          }
        }
      `}</style>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-slate-600">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/admin/pengiriman" className="hover:text-slate-600">Pengiriman &amp; Pengembalian</Link>
          <span>&gt;</span>
          <Link href={`/admin/pengiriman/${detail.id}`} className="hover:text-slate-600">Detail Pengiriman</Link>
          <span>&gt;</span>
          <span className="font-medium text-blue-600">Pratinjau Label</span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pratinjau Label Pengiriman</h1>
            <p className="text-sm text-slate-600 mt-1">
              Label pengiriman standar Biteship untuk paket pesanan #{detail.id}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Siap Cetak (Thermal 100×150 mm)
            </span>
            <Link
              href={`/admin/pengiriman/${detail.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ChevronLeftIcon width={15} height={15} />
              <span className="leading-tight text-left">
                Kembali ke
                <br />
                Detail Pengiriman
              </span>
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              <PrinterIcon width={15} height={15} />
              <span className="leading-tight text-left">
                Cetak
                <br />
                Label
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          id="label-print"
          className="relative flex min-h-[630px] w-full max-w-[420px] flex-col border border-slate-900 bg-white p-5 shadow-xl"
        >
          <span className="absolute -top-2.5 right-3 rounded-sm bg-amber-300 px-2 py-0.5 text-[8px] font-bold tracking-wide text-amber-950 shadow-sm print:hidden">
            SIMULASI PROTOTYPE
          </span>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black leading-none text-[#e30613]">J&amp;T</span>
                <span className="text-lg font-black leading-none tracking-tight text-slate-900">EXPRESS</span>
              </div>
              <div className="mt-1.5 inline-block bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                EZ (REGULER)
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-500">
                Kode Sortir Wilayah
              </p>
              <p className="text-xl font-black tracking-tight text-slate-900">JKT-KB05</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-500">
              Nomor Resi Pengiriman
            </p>
            <div className="mt-1 border border-slate-900 p-2">
              <Barcode />
            </div>
            <p className="mt-1.5 text-center font-mono text-base font-bold tracking-[0.25em] text-slate-900">
              {detail.trackingNumber}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-dashed border-slate-300 pt-3 text-[10px] leading-snug">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-500">
                Kepada (Penerima)
              </p>
              <p className="mt-1 text-xs font-bold text-slate-900">{detail.recipient}</p>
              <p className="text-slate-700">0812-3456-7890</p>
              <p className="mt-1 text-slate-700">{recipientAddress}</p>
              <div className="mt-1.5 inline-block bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
                KODE POS: 12150
              </div>
            </div>
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-500">
                Dari (Pengirim)
              </p>
              <p className="mt-1 text-xs font-bold text-slate-900">Schooly Shop</p>
              <p className="text-slate-600">(Admin / Gudang Kampus)</p>
              <p className="text-slate-700">Telp: 0821-9876-5432</p>
              <p className="mt-1 text-slate-700">
                Kampus Schooly Shop, Jl. Pembina No. 12, Jakarta Barat
              </p>
              <p className="mt-1 text-[9px] italic text-slate-500">Verified Campus Store</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 border-t border-dashed border-slate-300 pt-3 text-[10px]">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">No. Pesanan</p>
              <p className="font-mono font-bold text-slate-900">#{detail.id}</p>
            </div>
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">Berat Paket</p>
              <p className="font-semibold text-slate-900">0.35 kg (350 gr)</p>
            </div>
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">Kuantitas</p>
              <p className="font-semibold text-slate-900">{detail.quantity} pcs</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-4 border-t border-dashed border-slate-300 pt-3">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">Isi Paket:</p>
              <p className="text-xs font-bold text-slate-900">{detail.product}</p>
              <p className="text-[9px] text-slate-500">Seragam Sekolah / Atasan Katun Premium</p>
            </div>
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                Tipe Pembayaran
              </p>
              <span className="mt-1 inline-block bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                NON-COD (LUNAS)
              </span>
              <p className="mt-1 text-[10px] text-slate-700">
                Nilai: <span className="font-bold text-slate-900">{detail.total}</span>
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-300 pt-1.5 text-[7px] text-slate-500">
            <span>Biteship Partner Engine v4.2</span>
            <span>Waktu Cetak: 24/10/2023 14:32 WIB</span>
            <span>Sheet 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
