import { Suspense } from "react";
import TerimaPesananView from "./terima-view";

export default function TerimaPesananPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Memuat halaman penerimaan pesanan...
        </div>
      }
    >
      <TerimaPesananView />
    </Suspense>
  );
}
