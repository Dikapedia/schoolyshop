"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/lib/auth/use-session";

type Tracking = {
  order_id: string;
  courier: string;
  status: string;
  history: { timestamp: string; location: string; description: string }[];
};

const DEFAULT_MAP_CENTER = [-6.9667, 110.4167];
const DEFAULT_MAP_ZOOM = 13;

export default function LacakPengirimanPage() {
  const router = useRouter();
  const session = useSession();
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session && mounted) {
      router.replace("/login?next=/pesanan/lacak");
    }
  }, [session, router, mounted]);

  function handleTrack() {
    if (!search.trim()) {
      setError("Masukkan nomor resi atau ID pesanan.");
      return;
    }
    // Simulated tracking response
    const demo: Tracking = {
      order_id: search,
      courier: "JNE Express",
      status: "Dalam Perjalanan",
      history: [
        { timestamp: "2025-01-15 09:30", location: "Gudang Utama Koperasi SMAN 1 Semarang", description: "Pesanan telah diterima dan dikemas" },
        { timestamp: "2025-01-15 14:45", location: "Cikampek Semarang", description: "Barang berada di gudang pra-pengiriman" },
        { timestamp: "2025-01-16 09:15", location: "Bandung Pusat", description: "Barang telah keluar dari gudang" },
        { timestamp: "2025-01-16 14:30", location: "Tujuan", description: "Barang siap dikirim ke alamat" },
      ],
    };
    setTracking(demo);
    setError("");
  }

  if (!session) return null;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="mb-4 text-2xl font-bold">Lacak Pengiriman</h1>

          {/* Search */}
          <div className="mb-6 flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Masukkan nomor resi / ID pesanan"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleTrack}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Lacak
            </button>
          </div>

                {/* Map */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="mb-3 text-lg font-bold">Peta Pengiriman (Kota Semarang)</h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.628927236514!2d110.4166631154614!3d-6.966699695007516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70586b6b8e967d%3A0x8df1d9ac9b7f8c4e!2sSemarang%2C%20Central%20Java%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1728923456789!5m2!1sen!2sid"
                      title="Peta‑pengiriman"
                    />
                  </div>
                </div>

          {/* Tracking Result */}
          {tracking && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{tracking.order_id}</p>
                  <p className="text-xs text-slate-500">{tracking.courier} • {tracking.status}</p>
                </div>
                <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Salin Resi
                </button>
              </div>
              <div className="space-y-4">
                {tracking.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${i === tracking.history.length - 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 border-l border-slate-200 pl-3">
                      <p className="text-xs font-semibold">{h.timestamp}</p>
                      <p className="text-sm text-slate-700">{h.location}</p>
                      <p className="text-xs text-slate-500">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}