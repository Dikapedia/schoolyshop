import { Suspense } from "react";
import ReturView from "./retur-view";

export default function ReturPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Memuat halaman pengembalian...
        </div>
      }
    >
      <ReturView />
    </Suspense>
  );
}
