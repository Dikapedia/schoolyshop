import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";

const featured = [
  { label: "Pakaian Sekolah", href: "/produk?kategori=Pakaian%20Sekolah" },
  { label: "Alat Tulis", href: "/produk?kategori=Alat%20Tulis" },
  { label: "Kerajinan Siswa", href: "/produk?kategori=Kerajinan" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-start">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white"
          >
            S
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              Tentang {site.school}
            </p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400">
              {site.address}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Kategori Unggulan</p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
            {featured.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Pusat Bantuan</p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
            <li>Cara Belanja</li>
            <li>Titik Ambil Sekolah</li>
          </ul>
        </div>

        <a
          href={whatsappLink("Halo Admin, saya butuh bantuan di Schooly Shop.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-xs text-white transition hover:bg-white/10"
        >
          <PhoneIcon width={14} height={14} className="text-emerald-400" />
          Admin Sekolah {/* ({site.whatsapp.display})*/}
        </a>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500">
          {/* Tahun ditulis tetap sesuai desain (new Date() tidak boleh dipakai
              di sini karena proyek memakai cacheComponents). */}
          © 2026 {site.name} — {site.school}
        </p>
      </div>
    </footer>
  );
}
