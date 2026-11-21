import { Suspense } from "react";
import BayarView from "./bayar-view";

export default function BayarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Memuat halaman pembayaran...
        </div>
      }
    >
      <BayarView />
    </Suspense>
  );
}
