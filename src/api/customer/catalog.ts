import { request } from "../client";
import {
  productDetailSchema,
  productListSchema,
  productSummarySchema,
  type CustomerProduct,
  type CustomerProductDetail,
  type CustomerProductVariant,
} from "./schemas";

/** GET /products */
export async function listCustomerProducts(params?: {
  q?: string;
  category?: string;
  featured?: boolean;
  perPage?: number;
}): Promise<CustomerProduct[]> {
  const query = new URLSearchParams();
  query.set("perPage", String(params?.perPage ?? 50));
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.featured !== undefined) {
    query.set("featured", String(params.featured));
  }

  const payload = await request(`/products?${query.toString()}`, {
    responseSchema: productListSchema,
  });

  return payload.data;
}

const detailCache = new Map<string, Promise<CustomerProductDetail>>();

/** GET /products/:slug */
export function getCustomerProduct(slug: string): Promise<CustomerProductDetail> {
  const cached = detailCache.get(slug);
  if (cached) return cached;

  const promise = request(`/products/${encodeURIComponent(slug)}`, {
    responseSchema: productDetailSchema,
  }).catch((error: unknown) => {
    detailCache.delete(slug);
    throw error;
  });

  detailCache.set(slug, promise);
  return promise;
}

/**
 * Cari produk backend berdasarkan slug katalog lokal.
 *
 * Halaman katalog masih memakai data mock, jadi saat menambah ke keranjang
 * kita perlu menerjemahkan slug menjadi ID produk backend.
 */
export async function resolveCustomerProductBySlug(
  slug: string,
): Promise<CustomerProductDetail> {
  return getCustomerProduct(slug);
}

/**
 * Pilih varian yang cocok. Produk pakaian punya beberapa ukuran, produk lain
 * biasanya hanya "All Size".
 */
export function pickProductVariant(
  variants: CustomerProductVariant[],
  size?: string,
): CustomerProductVariant | undefined {
  if (variants.length === 0) return undefined;

  if (size) {
    const exact = variants.find(
      (variant) => variant.size.toLowerCase() === size.toLowerCase(),
    );
    if (exact) return exact;
  }

  const inStock = variants.find((variant) => variant.stock > 0);
  return inStock ?? variants[0];
}

/** Validasi ringan untuk data produk yang datang dari katalog mock. */
export function parseCustomerProduct(input: unknown): CustomerProduct {
  return productSummarySchema.parse(input);
}
