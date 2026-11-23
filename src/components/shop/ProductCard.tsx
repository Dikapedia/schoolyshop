"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckIcon, PlusIcon } from "@/components/icons";
import ProductImage from "./ProductImage";
import { formatRupiah } from "@/lib/format";
import { addToCustomerCartBySlug } from "@/api/customer/cart";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import type { Product, SellerRole } from "@/api/products";
import { cx } from "@/lib/cx";
import { useRouter } from "next/navigation";

const SELLER_STYLE: Record<SellerRole, { badge: string; dot: string; letter: string }> = {
  Guru: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-600",
    letter: "G",
  },
  Siswa: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    letter: "S",
  },
  Karyawan: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    letter: "K",
  },
};

type AddState = "idle" | "loading" | "added" | "error";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const session = useSession();
  const [state, setState] = useState<AddState>("idle");
  const [error, setError] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const seller = SELLER_STYLE[product.seller.role];
  const href = `/produk/${product.slug}`;
  const outOfStock = product.stock <= 0;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleAdd() {
    if (outOfStock) return;
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(href)}`);
      return;
    }

    setState("loading");
    setError("");

    try {
      await addToCustomerCartBySlug({ slug: product.slug });
      setState("added");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), 1500);
    } catch (cause: unknown) {
      setState("error");
      setError(getApiErrorMessage(cause, "Gagal menambahkan ke keranjang."));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/3] bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)]">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(min-width: 1024px) 211px, (min-width: 640px) 33vw, 50vw"
        />
        <span className="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 shadow-sm">
          {product.tag}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-900">
          <Link href={href} className="hover:text-blue-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-base font-bold text-blue-600">
          {formatRupiah(product.price)}
        </p>

        <span
          className={cx(
            "mt-2 inline-flex max-w-full items-center gap-1.5 self-start rounded-full border py-0.5 pl-0.5 pr-2 text-[11px] font-medium",
            seller.badge,
          )}
        >
          <span
            aria-hidden
            className={cx(
              "grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white",
              seller.dot,
            )}
          >
            {seller.letter}
          </span>
          <span className="truncate">{product.seller.label}</span>
        </span>

        <button
          type="button"
          onClick={handleAdd}
          disabled={state === "loading" || outOfStock}
          aria-live="polite"
          className={cx(
            "mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition disabled:opacity-60",
            outOfStock
              ? "bg-slate-300"
              : state === "added"
                ? "bg-emerald-600"
                : state === "error"
                  ? "bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          {outOfStock ? (
            "Stok Habis"
          ) : state === "added" ? (
            <>
              <CheckIcon width={14} height={14} />
              Ditambahkan
            </>
          ) : state === "loading" ? (
            "Menambahkan..."
          ) : (
            <>
              <PlusIcon width={14} height={14} />
              Tambah ke Keranjang
            </>
          )}
        </button>
        {state === "error" && (
          <p className="mt-1 text-[10px] font-medium text-red-600">{error}</p>
        )}
      </div>
    </article>
  );
}
