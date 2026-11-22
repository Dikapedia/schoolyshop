import { z } from "zod";
import { resolveImageUrl } from "@/lib/image-url";
import { useAsyncData } from "@/lib/use-async-data";
import {
  getCustomerProduct,
  getRelatedCustomerProducts,
  listAllCustomerProducts,
  listCustomerCategories,
} from "./customer/catalog";
import type {
  CustomerCategory,
  CustomerProduct,
  CustomerProductDetail,
  CustomerProductVariant,
} from "./customer/schemas";
import { isApiError } from "./errors";

export const sellerRoleSchema = z.enum(["Guru", "Siswa", "Karyawan"]);
export type SellerRole = z.infer<typeof sellerRoleSchema>;

export type ProductVariant = CustomerProductVariant;

export type Product = {
  /** ID numerik backend sebagai string agar konsisten dengan sesi/ulasan. */
  id: string;
  /** ID numerik backend untuk endpoint ber-basis-ID (related, dst). */
  numericId: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  tag: string;
  seller: {
    id: number | null;
    label: string;
    role: SellerRole;
  };
  /** URL absolut siap dipakai `next/image`; `null` bila produk tanpa gambar. */
  image: string | null;
  images: string[];
  description: string;
  /** Total stok gabungan seluruh varian. */
  stock: number;
  weight: number;
  featured: boolean;
  variants: ProductVariant[];
};

export type ProductDetail = Product;

/**
 * Kategori dinamis dari backend (`GET /categories`), jadi kategori yang
 * dibuat admin ikut muncul di filter katalog.
 */
export type CatalogCategory = CustomerCategory;
export type Category = string;

/**
 * `GET /products` mengembalikan role sebagai string. Normalisasi ke enum
 * frontend agar pemetaan gaya per role tetap aman; nilai tak dikenal
 * dikembalikan sebagai "Karyawan" (role netral).
 */
function toSellerRole(value: string): SellerRole {
  if (value === "Guru" || value === "Siswa") return value;
  return "Karyawan";
}

function mapVariant(
  variant: CustomerProductVariant,
): ProductVariant {
  return {
    id: variant.id,
    sku: variant.sku,
    size: variant.size,
    stock: variant.stock,
    priceAdjustment: variant.priceAdjustment,
  };
}

function toProduct(
  row: CustomerProduct | CustomerProductDetail,
): Product {
  const image = resolveImageUrl(row.image);
  const variants =
    "variants" in row ? row.variants.map(mapVariant) : [];

  return {
    id: String(row.id),
    numericId: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    categorySlug: row.categorySlug,
    price: row.price,
    tag: row.tag,
    seller: {
      id: row.seller.id,
      label: row.seller.label,
      role: toSellerRole(row.seller.role),
    },
    image,
    images: image ? [image] : [],
    description: row.description,
    stock: row.stock,
    weight: row.weight,
    featured: row.featured,
    variants,
  };
}

/* ------------------------------------------------------------------ */
/* Produk                                                              */
/* ------------------------------------------------------------------ */

let productsPromise: Promise<Product[]> | null = null;

/**
 * Seluruh produk aktif di katalog. Hasil di-cache selama sesi browser agar
 * beberapa komponen (hero, seksi, katalog) tidak memuat dua kali; panggil
 * `refreshProducts()` setelah mutasi bila perlu data segar.
 */
export function listProducts(): Promise<Product[]> {
  if (!productsPromise) {
    productsPromise = listAllCustomerProducts()
      .then((rows) => rows.map(toProduct))
      .catch((error: unknown) => {
        productsPromise = null;
        throw error;
      });
  }

  return productsPromise;
}

/** Buang cache katalog, lalu muat ulang produk terbaru. */
export function refreshProducts(): Promise<Product[]> {
  productsPromise = null;
  return listProducts();
}

/**
 * Produk detail berdasarkan slug. Mengembalikan `null` bila 404 agar
 * halaman dapat menampilkan not-found tanpa perlu menangkap error.
 */
export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const row = await getCustomerProduct(slug);
    return toProduct(row);
  } catch (error) {
    if (isApiError(error) && error.status === 404) return null;
    throw error;
  }
}

/** Produk lain yang direkomendasikan backend untuk produk yang sama. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const rows = await getRelatedCustomerProducts(product.numericId, limit);
  return rows.map(toProduct);
}

/* ------------------------------------------------------------------ */
/* Kategori                                                            */
/* ------------------------------------------------------------------ */

let categoriesPromise: Promise<CatalogCategory[]> | null = null;

export function listCategories(): Promise<CatalogCategory[]> {
  if (!categoriesPromise) {
    categoriesPromise = listCustomerCategories()
      .catch((error: unknown) => {
        categoriesPromise = null;
        throw error;
      });
  }

  return categoriesPromise;
}

export function refreshCategories(): Promise<CatalogCategory[]> {
  categoriesPromise = null;
  return listCategories();
}

/* ------------------------------------------------------------------ */
/* Hook client                                                         */
/* ------------------------------------------------------------------ */

export function useProducts() {
  return useAsyncData("catalog:products", () => listProducts());
}

export function useCategories() {
  return useAsyncData("catalog:categories", () => listCategories());
}

export type ProductPageData = {
  product: Product;
  related: Product[];
};

/** Muat produk detail beserta produk terkait dalam satu request beruntun. */
export function useProductPage(slug: string) {
  return useAsyncData(`product:${slug}`, async () => {
    const product = await getProductBySlug(slug);
    if (!product) return null;
    const related = await getRelatedProducts(product, 4);
    return { product, related };
  });
}

/* ------------------------------------------------------------------ */
/* Kompatibilitas ulasan lokal                                         */
/* ------------------------------------------------------------------ */

/**
 * Pemetaan ID produk lama dari seed pesanan demo ke produk katalog saat ini.
 * Ulasan masih disimpan lokal (TODO #2), jadi kunci `prod-1xx` lama tetap
 * diterjemahkan agar riwayat demo bisa diarahkan ke halaman produk.
 */
const LEGACY_PRODUCT_IDS: Record<string, string> = {
  "prod-101": "3",
  "prod-102": "12",
  "prod-103": "4",
  "prod-104": "1",
};

export function resolveProductId(id: string): string {
  return LEGACY_PRODUCT_IDS[id] ?? id;
}
