import Link from "next/link";
import { CheckIcon, ArrowRightIcon, ImageIcon } from "@/components/icons";
import { products } from "@/lib/shop/products";
import { site, whatsappLink } from "@/lib/site";

const secondaryButton =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(100deg,#f6faff_0%,#eaf2ff_55%,#dbeafe_100%)]">
      {/* cahaya hijau lembut di latar */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-200/40 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:py-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            100% Produk Kreatif Warga {site.school}
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Belanja Produk Kreatif Siswa &amp; Guru {site.school}
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
            &ldquo;Dukung wirausaha mandiri komunitas {site.school}. Semua
            produk terkurasi dan telah disetujui Admin.&rdquo;
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/#katalog"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Jelajahi Katalog
              <ArrowRightIcon width={16} height={16} />
            </Link>
            <a
              href={whatsappLink(
                "Halo Admin, saya ingin tahu cara menjual dan membeli di Schooly Shop.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryButton}
            >
              Pelajari Cara Jual &amp; Beli
            </a>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-600">
            <span aria-hidden className="flex -space-x-2">
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white">
                G
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-emerald-500 text-[10px] font-bold text-white">
                S
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-amber-500 text-[10px] font-bold text-white">
                K
              </span>
            </span>
            <span>Terbuka untuk Umum • Penjual Terverifikasi</span>
          </div>
        </div>

        {/* Kartu ekosistem */}
        <div className="rounded-2xl border border-white bg-white/90 p-5 shadow-xl shadow-blue-900/5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold tracking-wide text-blue-700">
                EKOSISTEM SEKOLAH
              </span>
              <h2 className="mt-3 text-base font-bold leading-snug text-slate-900">
                Pasar Mandiri Siswa, Pendidik &amp; Karyawan
              </h2>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckIcon width={14} height={14} className="text-emerald-500" />
                  Pembayaran QRIS dan Virtual Account
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon width={14} height={14} className="text-emerald-500" />
                  Garansi Kualitas &amp; Bebas Biaya Layanan
                </li>
              </ul>
            </div>

            {/* Foto pengganti. Ganti dengan foto produk asli. */}
            <div aria-hidden className="relative hidden h-28 w-36 shrink-0 sm:block">
              <div className="absolute left-0 top-3 grid h-24 w-[72px] -rotate-3 place-items-center rounded-xl bg-[linear-gradient(135deg,#334155,#64748b)] text-white/60 shadow-lg">
                <ImageIcon width={22} height={22} />
              </div>
              <div className="absolute right-0 top-0 grid h-24 w-[72px] rotate-2 place-items-center rounded-xl bg-[linear-gradient(135deg,#bfdbfe,#93c5fd)] text-white/80 shadow-lg">
                <ImageIcon width={22} height={22} />
              </div>
              <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {products.length}+ Karya Baru
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
