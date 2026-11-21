"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import { resolveImageUrl } from "@/lib/image-url";
import { formatRupiah } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import {
  refreshCustomerCart,
  useCustomerCart,
} from "@/api/customer/cart";
import {
  ensureCustomerAddress,
  listCustomerAddresses,
} from "@/api/customer/addresses";
import {
  createCustomerCheckout,
  listCustomerShippingRates,
} from "@/api/customer/checkout";
import type {
  CustomerAddress,
  CustomerShippingRate,
} from "@/api/customer/schemas";

const STEPS = ["Keranjang", "Alamat & Pengiriman", "Pembayaran", "Selesai"] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const session = useSession();
  const cart = useCustomerCart();

  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [rates, setRates] = useState<CustomerShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<string>("");
  const [cartReadyFor, setCartReadyFor] = useState<string | null>(null);
  const [addressesFor, setAddressesFor] = useState<string | null>(null);
  const [ratesFor, setRatesFor] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const hydrated = useHydrated();
  const sessionId = session?.id ?? "";
  const cartReady = sessionId !== "" && cartReadyFor === sessionId;
  const loadingAddresses = sessionId !== "" && addressesFor !== sessionId;

  useEffect(() => {
    if (!session && hydrated) {
      router.replace(`/login?next=${encodeURIComponent("/checkout")}`);
    }
  }, [session, router, hydrated]);

  useEffect(() => {
    if (!session) return;

    const id = session.id;
    let active = true;

    refreshCustomerCart()
      .catch(() => undefined)
      .finally(() => {
        if (active) setCartReadyFor(id);
      });

    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const id = session.id;
    let active = true;

    listCustomerAddresses()
      .then(async (list) => {
        if (list.length > 0) return list;
        const created = await ensureCustomerAddress({
          recipientName: session.name,
        });
        return [created];
      })
      .then((list) => {
        if (!active) return;
        setAddresses(list);
        const primary = list.find((address) => address.isPrimary) ?? list[0];
        setSelectedAddress(primary?.id ?? null);
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setAddressesFor(id);
      });

    return () => {
      active = false;
    };
  }, [session]);

  const address = useMemo(
    () => addresses.find((item) => item.id === selectedAddress) ?? null,
    [addresses, selectedAddress],
  );

  const loadingRates = Boolean(address) && ratesFor !== address?.id;
  const activeRates = address && ratesFor === address.id ? rates : [];

  useEffect(() => {
    if (!address) return;

    const id = address.id;
    let active = true;

    listCustomerShippingRates({ destinationAreaId: address.areaId })
      .then((list) => {
        if (!active) return;
        setRates(list);
        const cheapest = [...list].sort((a, b) => a.price - b.price)[0];
        setSelectedRate(cheapest ? String(cheapest.id) : "");
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setRatesFor(id);
      });

    return () => {
      active = false;
    };
  }, [address]);

  useEffect(() => {
    if (cartReady && cart.data.length === 0 && !submitting) {
      router.replace("/keranjang");
    }
  }, [cartReady, cart.data.length, router, submitting]);

  const shippingRate = activeRates.find((rate) => String(rate.id) === selectedRate) ?? null;
  const subtotal = cart.total;
  const shippingFee = shippingRate?.price ?? 0;
  const total = subtotal + shippingFee;

  async function handleCheckout() {
    if (!address || !shippingRate || cart.data.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await createCustomerCheckout({
        addressId: address.id,
        shippingRateId: shippingRate.id,
      });

      await refreshCustomerCart().catch(() => undefined);
      router.push(`/pesanan/bayar?id=${result.orderId}`);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause));
      setSubmitting(false);
    }
  }

  if (!session) return null;

  if (!cartReady) {
    return (
      <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50`}>
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center text-sm text-slate-500">
          Memuat keranjang...
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (cart.data.length === 0) {
    return (
      <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50`}>
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">Keranjang masih kosong</p>
            <Link
              href="/#katalog"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Mulai Belanja
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-5">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/keranjang" className="hover:text-blue-600">
              Keranjang Belanja
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">Checkout</span>
          </nav>

          <ol className="mb-8 flex items-center justify-end gap-2 text-xs" aria-label="Langkah checkout">
            {STEPS.map((step, index) => {
              const isCurrent = index === 1;
              const isDone = index < 1;
              return (
                <li key={step} className="flex items-center gap-1.5">
                  {index > 0 && <span aria-hidden className="h-px w-4 bg-slate-200 sm:w-6" />}
                  <span
                    className={
                      isDone
                        ? "grid h-6 w-6 place-items-center rounded-full bg-green-600 text-xs font-bold text-white"
                        : isCurrent
                          ? "grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white"
                          : "grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-500"
                    }
                  >
                    {index + 1}
                  </span>
                  <span className={isDone || isCurrent ? "font-semibold text-slate-900" : "text-slate-400"}>
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-4">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    1. Alamat Pengiriman
                  </h2>
                  <Link
                    href="/profil/alamat"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Kelola Alamat
                  </Link>
                </div>

                {loadingAddresses ? (
                  <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                ) : addresses.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center">
                    <p className="text-sm text-slate-600">Belum ada alamat tersimpan.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {addresses.map((item) => (
                      <label
                        key={item.id}
                        className={
                          "flex cursor-pointer flex-col gap-2 rounded-xl border p-4 " +
                          (selectedAddress === item.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 hover:bg-slate-50")
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="address"
                              value={item.id}
                              checked={selectedAddress === item.id}
                              onChange={() => setSelectedAddress(item.id)}
                              className="h-4 w-4 accent-blue-600"
                            />
                            <span className="text-sm font-bold">{item.label}</span>
                          </div>
                          {item.isPrimary && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-700">{item.recipientName}</p>
                        <p className="text-xs text-slate-600">{item.phone}</p>
                        <p className="text-xs text-slate-700">
                          {[item.address, item.district, item.city, item.province]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-xs text-slate-500">Kode Pos: {item.postalCode}</p>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </span>
                    2. Pilih Pengiriman
                  </h2>
                </div>

                <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-bold">Titik Asal: Koperasi {site.school}</p>
                    <p className="text-xs text-slate-500">Jl. Ir. H. Juanda No. 93, Dago, Bandung</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Tujuan: {address?.recipientName ?? "—"}</p>
                    <p className="max-w-[220px] truncate text-xs text-slate-500">
                      {address ? [address.district, address.city].filter(Boolean).join(", ") : "Pilih alamat"}
                    </p>
                  </div>
                </div>

                {loadingRates ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                    ))}
                  </div>
                ) : activeRates.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                    Tarif pengiriman belum tersedia untuk alamat ini.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeRates.map((rate) => {
                      const active = selectedRate === String(rate.id);
                      return (
                        <label
                          key={String(rate.id)}
                          className={
                            "flex cursor-pointer items-center gap-3 rounded-xl border p-4 " +
                            (active ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:bg-slate-50")
                          }
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={String(rate.id)}
                            checked={active}
                            onChange={() => setSelectedRate(String(rate.id))}
                            className="h-5 w-5 accent-blue-600"
                          />
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
                            {rate.courier.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">
                                {rate.courier} {rate.service}
                              </span>
                              {rate.badge && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  {rate.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {rate.description || rate.eta}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            {formatRupiah(rate.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Ringkasan Pesanan</h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {cart.itemCount} item
                </span>
              </div>

              <div className="mb-4 space-y-3">
                {cart.data.map((item) => {
                  const image = resolveImageUrl(item.product.image);
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {image ? (
                          <Image src={image} alt="" fill sizes="56px" className="object-cover" />
                        ) : (
                          <span className="grid h-full place-items-center text-lg">📦</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-xs font-semibold text-slate-900">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.product.seller.label} • {item.qty} barang
                          {item.variant ? ` • ${item.variant.size}` : ""}
                        </p>
                        <p className="text-xs font-bold text-slate-900">
                          {formatRupiah(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <dl className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Subtotal Produk</dt>
                  <dd className="font-semibold text-slate-900">{formatRupiah(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">
                    Ongkos Kirim
                    {shippingRate ? ` (${shippingRate.courier} ${shippingRate.service})` : ""}
                  </dt>
                  <dd className="font-semibold text-slate-900">{formatRupiah(shippingFee)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Biaya Layanan Kampus</dt>
                  <dd className="font-bold text-emerald-600">Rp 0 (Bebas Biaya)</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">Total Pembayaran</p>
                  <p className="text-[10px] text-slate-500">Termasuk pajak &amp; kas OSIS</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatRupiah(total)}</p>
              </div>

              <button
                type="button"
                disabled={!address || !shippingRate || submitting}
                onClick={handleCheckout}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
              >
                {submitting ? "Membuat Pesanan..." : "Lanjut ke Pembayaran"}
                {!submitting && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-500">
                Pesanan dibuat di server dan dilanjutkan ke pembayaran Virtual Account.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
