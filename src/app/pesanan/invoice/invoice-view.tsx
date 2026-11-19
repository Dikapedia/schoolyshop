"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/api/auth";
import { getInvoiceDetail, type InvoiceDetail } from "@/api/invoices";
import { listOrders, type Order } from "@/api/orders";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";

const INVOICE_ACTIONS = [
  { label: "Cetak", action: "print", icon: "🖨️" },
  { label: "Unduh PDF", action: "download", icon: "⬇️" },
  { label: "Cetak Lembar", action: "printLayout", icon: "📄" },
  { label: "Simpan PDF", action: "savePdf", icon: "💾" },
] as const;

/**
 * Susun file PDF invoice dari data pesanan.
 *
 * TODO(backend): setelah GET /orders/:id/invoice tersedia, unduhan bisa
 * langsung memakai URL file dari server.
 */
function buildInvoicePdf(order: Order, invoice: InvoiceDetail): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("INVOICE", margin, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`No. ${order.id}`, pageWidth - margin, y, { align: "right" });
  y += 18;
  doc.text(
    `Tanggal: ${new Date(order.date).toLocaleDateString("id-ID", { dateStyle: "long" })}`,
    margin,
    y,
  );
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.text(site.school, margin, y);
  doc.setFont("helvetica", "normal");
  y += 14;
  doc.text(
    "Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung",
    margin,
    y,
  );
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Ditagihkan kepada", margin, y);
  doc.setFont("helvetica", "normal");
  y += 14;
  doc.text(`${invoice.customerName} - ${invoice.customerType}`, margin, y);
  y += 14;
  doc.text(`${invoice.customerEmail} | ${invoice.customerPhone}`, margin, y);
  y += 14;
  const addressLines = doc.splitTextToSize(
    invoice.shippingAddress,
    pageWidth - margin * 2,
  );
  doc.text(addressLines, margin, y);
  y += addressLines.length * 12;
  doc.text(`Kode Pos: ${invoice.shippingPostalCode}`, margin, y);
  y += 14;
  doc.text(
    `Metode pembayaran: ${invoice.paymentMethod} (${invoice.virtualAccountNumber})`,
    margin,
    y,
  );
  y += 28;

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("Produk", margin, y);
  doc.text("Qty", pageWidth - margin - 140, y, { align: "right" });
  doc.text("Harga", pageWidth - margin - 70, y, { align: "right" });
  doc.text("Subtotal", pageWidth - margin, y, { align: "right" });
  y += 8;
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  for (const item of order.items) {
    const nameLines = doc.splitTextToSize(
      item.name,
      pageWidth - margin * 2 - 170,
    );
    if (y + nameLines.length * 12 > pageHeight - 140) {
      doc.addPage();
      y = margin;
    }
    doc.text(nameLines, margin, y);
    doc.text(String(item.qty), pageWidth - margin - 140, y, {
      align: "right",
    });
    doc.text(formatRupiah(item.price), pageWidth - margin - 70, y, {
      align: "right",
    });
    doc.text(
      formatRupiah(item.price * item.qty),
      pageWidth - margin,
      y,
      { align: "right" },
    );
    y += Math.max(nameLines.length * 12, 14) + 6;
  }

  y += 6;
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const totalsX = pageWidth - margin;
  const labelX = pageWidth - margin - 190;
  doc.text("Subtotal Produk", labelX, y);
  doc.text(formatRupiah(subtotal), totalsX, y, { align: "right" });
  y += 16;
  const other = Math.max(0, order.total - subtotal);
  doc.text("Pengiriman & Layanan", labelX, y);
  doc.text(other > 0 ? formatRupiah(other) : "Gratis", totalsX, y, {
    align: "right",
  });
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total", labelX, y);
  doc.text(formatRupiah(order.total), totalsX, y, { align: "right" });
  y += 34;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Terima kasih telah berbelanja di Schooly Shop.", margin, y);
  y += 12;
  doc.text("Invoice ini dibuat otomatis oleh sistem.", margin, y);

  return doc;
}

export default function InvoiceView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const hydrated = useHydrated();
  const id = searchParams.get("id") ?? "";
  const [notice, setNotice] = useState("");

  const { order, error } = useMemo(() => {
    if (!session) return { order: null, error: "" };
    if (!id) return { order: null, error: "ID pesanan belum diberikan." };
    const list = listOrders(session.id);
    if (list === null)
      return { order: null, error: "Belum ada riwayat pesanan." };
    const found = list.find((item: Order) => item.id === id) ?? null;
    return {
      order: found,
      error: found ? "" : "Pesanan tidak ditemukan.",
    };
  }, [session, id]);

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan");
    }
  }, [session, router, hydrated]);

  if (!session) return null;
  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {error ?? "Invoice tidak ditemukan."}
      </div>
    );
  }

  const invoice = getInvoiceDetail(order.id);
  const currentOrder = order;
  const subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  function handleAction(action: (typeof INVOICE_ACTIONS)[number]["action"]) {
    if (action === "print" || action === "printLayout") {
      window.print();
      return;
    }
    buildInvoicePdf(currentOrder, invoice).save(
      `invoice-${currentOrder.id}.pdf`,
    );
    setNotice("PDF invoice berhasil diunduh.");
    window.setTimeout(() => setNotice(""), 3000);
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 print:bg-white`}>
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 print:max-w-none print:px-0 print:py-0">
        {/* Header band */}
        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-400">Invoice</p>
            <p className="mt-0.5 text-2xl font-bold">{order.id}</p>
            <p className="mt-1 text-xs text-slate-400">
              Terbit: {new Date(order.date).toLocaleDateString("id-ID", { dateStyle: "long" })}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              Status Pesanan:{" "}
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                {order.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Komunitas</p>
            <p className="mt-0.5 text-xl font-bold">{site.school}</p>
            <p className="text-xs text-slate-500">Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung</p>
            <p className="text-xs text-slate-500">MIDTRANS Payment Gateway Terverifikasi OJK</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          {/* Left */}
          <div className="space-y-4">
            {/* Customer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Konsumen</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{invoice.customerName}</p>
                <p className="text-slate-500">{invoice.customerType}</p>
                <p className="text-slate-500">Email: {invoice.customerEmail}</p>
                <p className="text-slate-500">Kontak: <a href="tel:+6281234567890" className="font-semibold">{invoice.customerPhone}</a></p>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Alamat Envoi / Pengiriman</p>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-semibold">{invoice.customerName}</p>
                <p className="text-slate-500">{invoice.shippingAddress}</p>
                <p className="text-slate-500">Kode Pos: {invoice.shippingPostalCode}</p>
                <p className="text-slate-500">Diterima oleh: {invoice.recipient}</p>
                <p className="text-slate-500">Nomor WhatsApp: <a href="tel:+6281234567890" className="font-semibold">{invoice.customerPhone}</a></p>
              </div>
            </div>

            {/* Item & Totals */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Rincian Produk</p>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${item.name}`} className="flex items-center gap-3">
                    <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-base">🛍️</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.qty} unit × {formatRupiah(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formatRupiah(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-semibold text-slate-700">Subtotal Produk</span>
                <span className="font-bold text-blue-600">{formatRupiah(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span className="font-semibold text-slate-700">Biaya Layanan Kampus</span>
                <span className="font-semibold text-emerald-600">Gratis</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span className="font-semibold text-slate-700">Total Tagihan</span>
                <span className="font-bold text-blue-600">{formatRupiah(order.total)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 print:hidden">
              <p className="mb-3 text-xs font-semibold text-slate-400">Aksi Invoice</p>
              <div className="grid grid-cols-2 gap-3">
                {INVOICE_ACTIONS.map((a) => (
                  <button
                    key={a.action}
                    type="button"
                    onClick={() => handleAction(a.action)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="text-lg">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
              {notice && (
                <p className="mt-3 text-center text-xs font-semibold text-emerald-600" aria-live="polite">
                  {notice}
                </p>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Rincian Pembayaran</p>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">Lunas</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Metode Pembayaran</span>
                  <span className="font-medium">{invoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>VA Number / QRIS</span>
                  <span className="font-mono font-bold">{invoice.virtualAccountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Midtrans Payment Gateway</span>
                  <span className="font-medium">OJK &amp; Bank Indonesia</span>
                </div>
                <div className="flex justify-between">
                  <span>Batas Selesaikan</span>
                  <span className="font-medium">60 Menit</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-blue-600">
                  <span>Total Tagihan</span>
                  <span>{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400">Penjual &amp; Koperasi</p>
              <div className="space-y-1.5 text-sm text-slate-700">
                <p className="font-semibold">{site.school}</p>
                <p className="text-slate-500">Gedung B Lantai 1, Jl. Ir. H. Juanda No. 93, Kota Bandung</p>
                <p className="text-slate-500">Pengambilan mandiri atau kirim langsung ke kelas saat jam istirahat</p>
              </div>
              <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Butuh konfirmasi? Kontak Admin Koperasi: <a href="tel:+6281234567890" className="font-bold">+62 812-3456-7890</a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-xs font-semibold text-slate-400">Produk</p>
              <div className="space-y-2 text-xs">
                {order.items.map((it) => (
                  <div key={it.productId} className="flex justify-between">
                    <span className="text-slate-700">{it.name}</span>
                    <span className="font-semibold text-slate-900">{it.qty} × {formatRupiah(it.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
