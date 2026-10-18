"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, ImageIcon, PlusIcon } from "@/components/icons";
import { formatRupiah } from "@/lib/format";
import { addToCartWithAuth } from "@/lib/shop/cart";
import type { Product, SellerRole } from "@/lib/shop/products";
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

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const seller = SELLER_STYLE[product.seller.role];
  const href = `/produk/${product.slug}`;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleAdd() {
    if (!addToCartWithAuth(product.id)) {
      router.push(`/login?next=${encodeURIComponent(href)}`);
      return;
    }
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/3] bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 211px, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span className="grid h-full place-items-center text-slate-300">
            <ImageIcon width={32} height={32} />
          </span>
        )}
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
          aria-live="polite"
          className={cx(
            "mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition",
            added ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          {added ? (
            <>
              <CheckIcon width={14} height={14} />
              Ditambahkan
            </>
          ) : (
            <>
              <PlusIcon width={14} height={14} />
              Tambah ke Keranjang
            </>
          )}
        </button>
      </div>
    </article>
  );
}
