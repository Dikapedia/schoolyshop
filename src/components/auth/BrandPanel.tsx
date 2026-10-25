import Image from "next/image";
import {
  CreditCardIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from "@/components/icons";
import { site } from "@/lib/site";

export default function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[linear-gradient(165deg,#2f69e9_0%,#2656d4_55%,#1e40af_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
      {/* cahaya lembut di latar */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-40 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 ring-1 ring-white/25">
          <ShoppingBagIcon width={20} height={20} />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold leading-tight">Schooly Shop</span>
            <span className="rounded-full border border-cyan-200/40 bg-cyan-300/20 px-2 py-0.5 text-[10px] font-medium text-cyan-100">
              Resmi
            </span>
          </div>
          <p className="text-xs text-blue-100/80">{site.school}</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center py-8 text-center">
        <div className="rounded-2xl border border-white/25 bg-white/10 p-1.5 shadow-[0_0_60px_rgba(147,197,253,0.35)]">
<Image
          src="/images/auth-illustration.png"
          alt="Ilustrasi siswa menjual produk kreatif di pasar sekolah"
          fill
          priority
          className="object-cover rounded-xl"
        />
        </div>
        <h2 className="mt-8 text-2xl font-bold">
          Belanja Produk Kreatif Warga {site.school}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-blue-100/80">
          Ekosistem kewirausahaan eksklusif bagi siswa, dewan guru, dan tendik
          sekolah.
        </p>
      </div>

      <ul className="relative z-10 space-y-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
        <li className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15">
            <ShieldCheckIcon />
          </span>
          <div>
            <p className="text-sm font-semibold">
              Produk terkurasi dari siswa, guru &amp; karyawan
            </p>
            <p className="text-xs text-blue-100/80">
              Karya asli dan terverifikasi data kependidikan internal
            </p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15">
            <CreditCardIcon />
          </span>
          <div>
            <p className="text-sm font-semibold">Pembayaran aman via Midtrans</p>
            <p className="text-xs text-blue-100/80">
              Mendukung QRIS, Virtual Account, serta e-Wallet instan
            </p>
          </div>
        </li>
      </ul>
    </aside>
  );
}
