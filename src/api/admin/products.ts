import { ADMIN_PRODUCT_MOCKS } from "../mocks/admin/products";

export type ProductStatus = "Aktif" | "Nonaktif";

export type AdminProduct = {
  id: number;
  name: string;
  seller: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  isNew?: boolean;
};

export const SELLER_OPTIONS = [
  "Alwan",
  "Ismi",
  "Intan",
  "Budi",
  "Novita",
  "Ghofuur",
  "Kaji Ecoprint",
  "Penjual Siswa",
];

export const CATEGORY_OPTIONS = [
  "Makanan",
  "Minuman",
  "Fashion",
  "ATK",
  "Kerajinan",
  "Lainnya",
];

/**
 * TODO(backend): ganti dengan GET /admin/products?page=&search=&category=&
 * status=. Pagination saat ini dihitung di client.
 */
export function getAdminProducts(): AdminProduct[] {
  return ADMIN_PRODUCT_MOCKS;
}
