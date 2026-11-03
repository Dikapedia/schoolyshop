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
  description: z.string().optional(),
});
export type Product = z.infer<typeof productSchema>;

/**
 * Validasi mock dengan skema yang sama dengan response API.
 * TODO(backend): ganti PRODUCT_MOCKS dengan GET /products setelah endpoint
 * tersedia; pertahankan validasi productSchema di batas API.
 */
const products: Product[] = productSchema.array().parse(PRODUCT_MOCKS);

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

/** Cari satu produk berdasarkan ID. */
export function getProductById(id: string): Product | undefined {
  // TODO(backend): ganti dengan GET /products/:id.
  return products.find((product) => product.id === id);
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
