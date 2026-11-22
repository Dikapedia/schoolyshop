import { request } from "../client";
import {
  categoryListSchema,
  productDetailSchema,
  productListSchema,
  productSummarySchema,
  relatedProductListSchema,
  type CustomerCategory,
  type CustomerProduct,
  type CustomerProductDetail,
  type CustomerProductVariant,
} from "./schemas";

const CATALOG_PER_PAGE = 50;

/** GET /products */
export async function listCustomerProducts(params?: {
  q?: string;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevan" | "termurah" | "termahal";
  perPage?: number;
}): Promise<CustomerProduct[]> {
  const query = new URLSearchParams();
  query.set("perPage", String(params?.perPage ?? CATALOG_PER_PAGE));
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.featured !== undefined) {
    query.set("featured", String(params.featured));
  }
  if (params?.minPrice !== undefined) {
    query.set("minPrice", String(params.minPrice));
  }
  if (params?.maxPrice !== undefined) {
    query.set("maxPrice", String(params.maxPrice));
  }
  if (params?.sort) query.set("sort", params.sort);

  const payload = await request(`/products?${query.toString()}`, {
    responseSchema: productListSchema,
  });

  return payload.data;
}

/**
 * Ambil seluruh produk aktif di katalog dengan paginasi penuh.
 * Halaman pertama memakai batas maksimal backend, sisa halaman diambil paralel.
 */
export async function listAllCustomerProducts(
  params?: {
    q?: string;
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: "relevan" | "termurah" | "termahal";
  },
): Promise<CustomerProduct[]> {
  const first = await request(`/products?${buildCatalogQuery(params, 1)}`, {
    responseSchema: productListSchema,
  });

  const pages = Array.from(
    { length: Math.max(0, first.meta.totalPages - 1) },
    (_, index) =>
      request(`/products?${buildCatalogQuery(params, index + 2)}`, {
        responseSchema: productListSchema,
      }),
  );

  const settled = await Promise.allSettled(pages);
  const extra: CustomerProduct[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled") extra.push(...result.value.data);
  }

  return [...first.data, ...extra];
}

function buildCatalogQuery(
  params: {
    q?: string;
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: "relevan" | "termurah" | "termahal";
  } | undefined,
  page: number,
): string {
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("perPage", String(CATALOG_PER_PAGE));
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.featured !== undefined) {
    query.set("featured", String(params.featured));
  }
  if (params?.minPrice !== undefined) {
    query.set("minPrice", String(params.minPrice));
  }
  if (params?.maxPrice !== undefined) {
    query.set("maxPrice", String(params.maxPrice));
  }
  if (params?.sort) query.set("sort", params.sort);
  return query.toString();
}

/** GET /categories */
export async function listCustomerCategories(): Promise<CustomerCategory[]> {
  const payload = await request("/categories", {
    responseSchema: categoryListSchema,
  });

  return payload.data;
}

/** GET /products/:slug */
export function getCustomerProduct(
  slug: string,
): Promise<CustomerProductDetail> {
  return request(`/products/${encodeURIComponent(slug)}`, {
    responseSchema: productDetailSchema,
  });
}

/**
 * Cari produk backend berdasarkan slug katalog.
 *
 * Halaman katalog memakai data backend, jadi saat menambah ke keranjang
 * produk ditemukan langsung lewat slug.
 */
export function resolveCustomerProductBySlug(
  slug: string,
): Promise<CustomerProductDetail> {
  return getCustomerProduct(slug);
}

/** GET /products/:id/related */
export function getRelatedCustomerProducts(
  id: number,
  limit = 4,
): Promise<CustomerProduct[]> {
  return request(
    `/products/${id}/related?limit=${Math.max(1, Math.min(20, limit))}`,
    { responseSchema: relatedProductListSchema },
  ).then((payload) => payload.data);
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

/** Validasi ringan untuk data produk yang datang dari backend. */
export function parseCustomerProduct(input: unknown): CustomerProduct {
  return productSummarySchema.parse(input);
}
