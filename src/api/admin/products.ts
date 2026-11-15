import { request } from "../client";

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

export type AdminProductInput = Omit<AdminProduct, "id" | "isNew">;

export type AdminCategory = {
  id: number;
  name: string;
  description: string;
};

export type AdminCategoryInput = Omit<AdminCategory, "id">;

export const CATEGORY_OPTIONS = [
  "Makanan",
  "Minuman",
  "Fashion",
  "ATK",
  "Kerajinan",
  "Lainnya",
];

/** GET /admin/products */
export function getAdminProducts(): Promise<AdminProduct[]> {
  return request<AdminProduct[]>("/admin/products");
}

/** POST /admin/products */
export function createAdminProduct(
  input: AdminProductInput,
): Promise<AdminProduct> {
  return request<AdminProduct>("/admin/products", {
    method: "POST",
    body: input,
  });
}

/** PATCH /admin/products/:id */
export function updateAdminProduct(
  id: number,
  input: Partial<AdminProductInput>,
): Promise<AdminProduct> {
  return request<AdminProduct>(`/admin/products/${id}`, {
    method: "PATCH",
    body: input,
  });
}

/** DELETE /admin/products/:id */
export function deleteAdminProduct(id: number): Promise<void> {
  return request<void>(`/admin/products/${id}`, { method: "DELETE" });
}

/** GET /admin/categories */
export function getAdminCategories(): Promise<AdminCategory[]> {
  return request<AdminCategory[]>("/admin/categories");
}

/** POST /admin/categories */
export function createAdminCategory(
  input: AdminCategoryInput,
): Promise<AdminCategory> {
  return request<AdminCategory>("/admin/categories", {
    method: "POST",
    body: input,
  });
}

/** PATCH /admin/categories/:id */
export function updateAdminCategory(
  id: number,
  input: Partial<AdminCategoryInput>,
): Promise<AdminCategory> {
  return request<AdminCategory>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: input,
  });
}

/** DELETE /admin/categories/:id */
export function deleteAdminCategory(id: number): Promise<void> {
  return request<void>(`/admin/categories/${id}`, { method: "DELETE" });
}
