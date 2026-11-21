import { useEffect, useSyncExternalStore } from "react";
import { useSession } from "../auth";
import { request } from "../client";
import {
  pickProductVariant,
  resolveCustomerProductBySlug,
} from "./catalog";
import { cartSchema, type CustomerCart } from "./schemas";

const EMPTY_CART: CustomerCart = { data: [], total: 0, itemCount: 0 };

let cartState: CustomerCart = EMPTY_CART;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function setCart(next: CustomerCart): void {
  if (cartState === next) return;
  cartState = next;
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CustomerCart {
  return cartState;
}

function getServerSnapshot(): CustomerCart {
  return EMPTY_CART;
}

let inflight: Promise<CustomerCart> | null = null;

/** GET /cart */
export function refreshCustomerCart(): Promise<CustomerCart> {
  if (inflight) return inflight;

  inflight = request("/cart", { responseSchema: cartSchema })
    .then((cart) => {
      setCart(cart);
      return cart;
    })
    .catch((error: unknown) => {
      setCart(EMPTY_CART);
      throw error;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Keranjang server, disegarkan otomatis saat sesi berubah. */
export function useCustomerCart(): CustomerCart {
  const session = useSession();
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const sessionId = session?.id ?? "";

  useEffect(() => {
    if (!sessionId) {
      setCart(EMPTY_CART);
      return;
    }

    void refreshCustomerCart().catch(() => {
      // Header tetap menampilkan 0 bila sesi backend sudah kedaluwarsa.
    });
  }, [sessionId]);

  return cart;
}

/** Jumlah total barang untuk badge header. */
export function useCustomerCartCount(): number {
  return useCustomerCart().itemCount;
}

/** POST /cart/items */
export async function addCustomerCartItem(input: {
  productId: number;
  variantId?: number;
  qty?: number;
}): Promise<CustomerCart> {
  const cart = await request("/cart/items", {
    method: "POST",
    body: {
      productId: input.productId,
      ...(input.variantId === undefined ? {} : { variantId: input.variantId }),
      qty: input.qty ?? 1,
    },
    responseSchema: cartSchema,
  });

  setCart(cart);
  return cart;
}

/**
 * Tambah produk dari katalog lokal ke keranjang backend.
 *
 * Katalog masih memakai slug mock, jadi produk backend dicari lewat slug yang
 * sama. Varian dipilih dari ukuran yang dipilih pengguna.
 */
export async function addToCustomerCartBySlug(input: {
  slug: string;
  qty?: number;
  size?: string;
}): Promise<CustomerCart> {
  const product = await resolveCustomerProductBySlug(input.slug);
  const variant = pickProductVariant(product.variants, input.size);

  return addCustomerCartItem({
    productId: product.id,
    variantId: variant?.id,
    qty: input.qty ?? 1,
  });
}

/** PATCH /cart/items/:productId */
export async function updateCustomerCartItem(
  productId: number,
  qty: number,
): Promise<CustomerCart> {
  const cart = await request(`/cart/items/${productId}`, {
    method: "PATCH",
    body: { qty },
    responseSchema: cartSchema,
  });

  setCart(cart);
  return cart;
}

/** DELETE /cart/items/:productId */
export async function removeCustomerCartItem(
  productId: number,
): Promise<void> {
  await request<void>(`/cart/items/${productId}`, { method: "DELETE" });
  await refreshCustomerCart().catch(() => setCart(EMPTY_CART));
}

/** DELETE /cart */
export async function clearCustomerCart(): Promise<void> {
  await request<void>("/cart", { method: "DELETE" });
  setCart(EMPTY_CART);
}
