import { Suspense } from "react";
import InvoiceView from "./invoice-view";

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-slate-500">Memuat…</div>}>
      <InvoiceView />
    </Suspense>
  );
}
