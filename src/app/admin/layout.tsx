import { Suspense } from "react";
import type { ReactNode } from "react";
import AdminShell from "./admin-shell";

function AdminShellFallback() {
  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <aside className="w-64 flex-shrink-0 overflow-hidden bg-[#0d47b8] text-white">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 12V16C6 17.6569 8.68629 19 12 19C15.3137 19 18 17.6569 18 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 10V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold leading-tight">Schooly Shop</div>
              <div className="text-xs text-blue-100/90 leading-tight">Admin Management</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="rounded-lg border border-transparent">
              <div className="h-12 rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="flex h-16 border-b border-slate-200 items-center bg-white px-6">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-900 transition"
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 max-w-md">
            <div className="h-10 rounded-lg border border-slate-200 bg-slate-100" />
          </div>
          <div className="flex-shrink-0" />
        </header>
        <div className="p-6">
          <div className="h-44 rounded-xl border border-slate-200 bg-white" />
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
