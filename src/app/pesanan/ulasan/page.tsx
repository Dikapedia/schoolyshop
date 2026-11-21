import { Suspense } from "react";
import UlasanView from "./ulasan-view";

export default function UlasanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Memuat halaman ulasan...
        </div>
      }
    >
      <UlasanView />
    </Suspense>
  );
}
