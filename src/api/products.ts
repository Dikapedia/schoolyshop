import { z } from "zod";
import { PRODUCT_MOCKS } from "./mocks/products";

export const CATEGORIES = [
  "Pakaian Sekolah",
  "Alat Tulis",
  "Kerajinan",
  "Perlengkapan Sekolah",
  "Makanan",
  "Minuman",
  "Lainnya",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const sellerRoleSchema = z.enum(["Guru", "Siswa", "Karyawan"]);
export type SellerRole = z.infer<typeof sellerRoleSchema>;

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.enum(CATEGORIES),
  price: z.number(),
  tag: z.string(),
  seller: z.object({
    label: z.string(),
    role: sellerRoleSchema,
  }),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
});
export type Product = z.infer<typeof productSchema>;

/**
 * Validasi mock dengan skema yang sama dengan response API.
 * TODO(backend): ganti PRODUCT_MOCKS dengan GET /products setelah endpoint
 * tersedia; pertahankan validasi productSchema di batas API.
 */
/**
 * Galeri 4 gambar per produk (utama + 3 varian) yang disimpan di /public/products.
 * p1.png / p1a.png / p1b.png / p1c.png, dst.
 */
const PRODUCT_GALLERIES = new Map(
  PRODUCT_MOCKS.map((product) => [
    product.id,
    [
      `/products/${product.id}.png`,
      `/products/${product.id}a.png`,
      `/products/${product.id}b.png`,
      `/products/${product.id}c.png`,
    ],
  ]),
);

const products: Product[] = productSchema
  .array()
  .parse(PRODUCT_MOCKS)
  .map((product) => ({
    ...product,
    images: product.images ?? PRODUCT_GALLERIES.get(product.id),
  }));

/**
 * Daftar produk untuk katalog.
 *
 * TODO(backend): pindahkan filter kategori, pencarian, price bucket, dan
 * pagination ke query GET /products (mis. ?category=&q=&minPrice=&page=).
 */
export function listProducts(): Product[] {
  return products;
}

/** Cari satu produk berdasarkan slug. */
export function getProductBySlug(slug: string): Product | undefined {
  // TODO(backend): ganti dengan GET /products/:slug.
  return products.find((product) => product.slug === slug);
}

/**
 * Pemetaan ID produk lama dari seed pesanan demo ke produk katalog saat ini.
 *
 * Seed pesanan lama memakai `prod-101`...`prod-104`, sedangkan katalog
 * memakai `p1`...`p24`. Tanpa pemetaan ini, ulasan dari pesanan demo tidak
 * bisa diarahkan ke halaman produk yang benar.
 */
const LEGACY_PRODUCT_IDS: Record<string, string> = {
  "prod-101": "p3",
  "prod-102": "p12",
  "prod-103": "p4",
  "prod-104": "p1",
};

/** Normalisasi ID produk lama ke ID katalog yang berlaku. */
export function resolveProductId(id: string): string {
  return LEGACY_PRODUCT_IDS[id] ?? id;
}

/** Cari satu produk berdasarkan ID. */
export function getProductById(id: string): Product | undefined {
  // TODO(backend): ganti dengan GET /products/:id.
  const normalizedId = resolveProductId(id);
  return products.find((product) => product.id === normalizedId);
}

/**
 * Produk lain di kategori yang sama (maksimal `limit`).
 *
 * TODO(backend): konfirmasi apakah rekomendasi dihitung backend atau tetap
 * di frontend; bila backend, gunakan GET /products/:id/related.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = products.filter(
    (item) => item.category !== product.category && item.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
