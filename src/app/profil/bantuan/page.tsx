"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth/use-session";
import { inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const FAQS: FAQ[] = [
  {
    id: 1,
    question: "Bagaimana cara memesan produk?",
    answer:
      "Pilih produk seragam, alat tulis, atau kerajinan karya warga SMK, masukkan ke keranjang belanja, tentukan varian ukuran, lalu klik Checkout dan pilih metode pengiriman ke domisili atau ambil langsung di loket Koperasi Sekolah.",
  },
  {
    id: 2,
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menyediakan berbagai metode pembayaran termasuk transfer bank, e-wallet, dan cicilan 0%. Semua metode pembayaran aman dan terenkripsi.",
  },
  {
    id: 3,
    question: "Bagaimana cara melacak pengiriman?",
    answer:
      "Setelah melakukan pemesanan, Anda akan menerima nomor tracking melalui WhatsApp atau email. Gunakan nomor tersebut untuk melacak status pengiriman real-time di aplikasi kurir yang bekerja sama dengan kami.",
  },
  {
    id: 4,
    question: "Bagaimana cara mengajukan pengembalian barang?",
    answer:
      "Jika barang rusak atau tidak sesuai pesanan, hubungi Tim Admin melalui WhatsApp dalam waktu 24 jam setelah barang diterima. Kami akan memproses pengembalian dan penggantian barang dengan cepat.",
  },
  {
    id: 5,
    question: "Berapa lama batas waktu pembayaran?",
    answer:
      "Batas waktu pembayaran adalah 24 jam setelah melakukan pemesanan. Jika belum dibayar dalam waktu tersebut, pesanan akan otomatis dibatalkan oleh sistem.",
  },
  {
    id: 6,
    question: "Bagaimana cara menghubungi Admin secara langsung?",
    answer:
      "Anda dapat menghubungi Tim Admin melalui WhatsApp, email, atau datang langsung ke loket Koperasi Siswa di sekolah. Kami siap membantu Anda dengan respons cepat dan profesional.",
  },
];

export default function BantuanPage() {
  const session = useSession();
  const [expandedId, setExpandedId] = useState<number | null>(0);

  if (!session) {
    return (
      <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
        <SiteHeader />
        <main className="flex-1 px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Akses Ditolak</h1>
            <p className="mb-6 text-slate-600">Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
            <Link href="/login" className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
              Masuk
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb - full width left aligned */}
        <div className="bg-slate-50">
          <div className="px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Beranda
            </Link>
            <span className="text-slate-400">/</span>
            <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.906-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-slate-900">Pusat Bantuan</span>
          </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white" />
                </div>
              </div>
            <p className="mb-1 text-xs text-slate-500">Halo SMK!</p>
            <h1 className="mb-2 text-2xl font-bold">Butuh Bantuan?</h1>
            <p className="text-sm text-slate-600">
              Tim Admin Koperasi Schooly Shop {site.school} siap mendampingi kebutuhan akademik, seragam, dan transaksi Anda.
            </p>
          </div>

          {/* Contact Button */}
          <div className="mb-8 text-center">
            <a
              href="https://wa.me/6281122334411"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.737.732 5.363 2.122 7.61l-2.266 6.795 6.954-2.287c2.176 1.183 4.63 1.803 7.155 1.803 5.44 0 9.926-4.465 9.95-9.97.015-2.66-.648-5.158-1.88-7.4-1.233-2.242-2.973-4.25-5.148-5.684-2.176-1.434-4.694-2.207-7.236-2.207z" />
              </svg>
              Hubungi via WhatsApp
            </a>
            <p className="mt-3 text-sm text-slate-600">
              <svg className="mb-1 mr-1 inline h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Nomor Resmi Loket Koperasi Siswa: <span className="font-semibold">+62 811-2233-4411</span>
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
              <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="mb-4 text-sm text-slate-600">Jawaban cepat seputar transaksi & pengiriman sekolah</p>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-3 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                        {faq.id}
                      </div>
                      <p className="font-medium text-slate-900">{faq.question}</p>
                    </div>
                    <svg
                      className={`h-5 w-5 shrink-0 text-slate-400 transition ${expandedId === faq.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  {expandedId === faq.id && (
                    <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">Catatan Operasional</p>
                <p className="mt-1 text-sm text-amber-800">
                  Jika layanan WhatsApp sedang offline atau pesan dikirim di luar jam kerja (08:00-16:00 WIB), pesan Anda akan otomatis tercatat dan dijawab pada hari sekolah berikutnya oleh pengurus Koperasi Siswa Mandiri {site.school}.
                </p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
