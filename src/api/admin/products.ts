import { ApiError, errorFromResponse } from "../errors";
import { adminRequest, ADMIN_API_URL } from "./client";
import { getAdminSellers } from "./sellers";
import { fetchAllAdminPages } from "./shared";

export type ProductStatus = "Aktif" | "Nonaktif";

export type AdminProductVariant = {
  id: number;
  sku: string;
  size: string;
  stock: number;
  priceAdjustment: number;
};

export type AdminProduct = {
  id: number;
  name: string;
  seller: string;
  sellerId?: number;
  category: string;
  categoryId?: number;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  isNew?: boolean;
  tag?: string;
  weight?: number;
  image?: string | null;
  featured?: boolean;
  variants?: AdminProductVariant[];
};

export type AdminProductInput = {
  name: string;
  seller: string;
  sellerId?: number;
  category: string;
  categoryId?: number;
  price: number;
  stock: number;
  description: string;
  status: ProductStatus;
};

export type AdminCategory = {
  id: number;
  name: string;
  description: string;
  productCount?: number;
};

export type AdminCategoryInput = Omit<AdminCategory, "id" | "productCount">;

export const CATEGORY_OPTIONS = [
  "Makanan",
  "Minuman",
  "Fashion",
  "ATK",
  "Kerajinan",
  "Lainnya",
];

type AdminProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  tag: string;
  image: string | null;
  featured: boolean;
  weight: number;
  status: ProductStatus;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  stock: number;
  variants?: Array<{
    id: number;
    sku: string;
    size: string;
    stock: number;
    priceAdjustment: number;
  }>;
  isNew: boolean;
};

type AdminCategoryRow = {
  id: number;
  name: string;
  description: string;
  productCount?: number;
};

function mapProduct(row: AdminProductRow): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    seller: row.sellerName,
    sellerId: row.sellerId,
    category: row.categoryName,
    categoryId: row.categoryId,
    price: row.price,
    stock: row.stock,
    status: row.status,
    description: row.description,
    isNew: row.isNew,
    tag: row.tag,
    weight: row.weight,
    image: row.image,
    featured: row.featured,
    variants: Array.isArray(row.variants) ? row.variants : [],
  };
}

function mapCategory(row: AdminCategoryRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    productCount: row.productCount,
  };
}

async function resolveCategoryId(input: {
  category?: string;
  categoryId?: number;
}): Promise<number> {
  if (input.categoryId) return input.categoryId;

  const categories = await getAdminCategories();
  const match = categories.find(
    (category) => category.name === input.category,
  );

  if (!match) {
    throw new ApiError(
      "VALIDATION",
      `Kategori "${input.category ?? "-"}" tidak ditemukan.`,
    );
  }

  return match.id;
}

async function resolveSellerId(input: {
  seller?: string;
  sellerId?: number;
}): Promise<number> {
  if (input.sellerId) return input.sellerId;

  const sellers = await getAdminSellers();
  const match = sellers.find((seller) => seller.name === input.seller);

  if (!match) {
    throw new ApiError(
      "VALIDATION",
      `Penjual "${input.seller ?? "-"}" tidak ditemukan.`,
    );
  }

  return match.id;
}

/** GET /admin/products */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  const rows = await fetchAllAdminPages<AdminProductRow>("/admin/products");
  return rows.map(mapProduct);
}

/** POST /admin/products */
export async function createAdminProduct(
  input: AdminProductInput,
): Promise<AdminProduct> {
  const [categoryId, sellerId] = await Promise.all([
    resolveCategoryId(input),
    resolveSellerId(input),
  ]);

  const row = await adminRequest<AdminProductRow>("/admin/products", {
    method: "POST",
    body: {
      name: input.name,
      description: input.description,
      price: input.price,
      tag: "Umum",
      weight: 1000,
      categoryId,
      sellerId,
      status: input.status,
      stock: input.stock,
    },
  });

  return mapProduct(row);
}

/** PATCH /admin/products/:id */
export async function updateAdminProduct(
  id: number,
  input: Partial<AdminProductInput>,
): Promise<AdminProduct> {
  const body: Record<string, unknown> = {};

  if (input.name !== undefined) body.name = input.name;
  if (input.description !== undefined) body.description = input.description;
  if (input.price !== undefined) body.price = input.price;
  if (input.status !== undefined) body.status = input.status;
  if (input.stock !== undefined) body.stock = input.stock;

  if (input.category !== undefined || input.categoryId !== undefined) {
    body.categoryId = await resolveCategoryId(input);
  }

  if (input.seller !== undefined || input.sellerId !== undefined) {
    body.sellerId = await resolveSellerId(input);
  }

  const row = await adminRequest<AdminProductRow>(`/admin/products/${id}`, {
    method: "PATCH",
    body,
  });

  return mapProduct(row);
}

/** DELETE /admin/products/:id */
export function deleteAdminProduct(id: number): Promise<void> {
  return adminRequest<void>(`/admin/products/${id}`, { method: "DELETE" });
}

/**
 * POST /admin/products/:id/image (multipart/form-data).
 *
 * `request()` hanya mengirim JSON, jadi unggahan memakai fetch langsung dengan
 * cookie sesi yang sama.
 */
export async function uploadAdminProductImage(
  id: number,
  file: File,
): Promise<AdminProduct> {
  const form = new FormData();
  form.append("image", file);

  let response: Response;
  try {
    response = await fetch(`${ADMIN_API_URL}/admin/products/${id}/image`, {
      method: "POST",
      body: form,
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      "NETWORK",
      "Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.",
    );
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    throw errorFromResponse(response.status, payload);
  }

  const row = (await response.json()) as AdminProductRow;
  return mapProduct(row);
}

/** GET /admin/categories */
export async function getAdminCategories(): Promise<AdminCategory[]> {
  const payload = await adminRequest<
    AdminCategoryRow[] | { data?: AdminCategoryRow[] }
  >("/admin/categories");
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return rows.map(mapCategory);
}

/** POST /admin/categories */
export async function createAdminCategory(
  input: AdminCategoryInput,
): Promise<AdminCategory> {
  const row = await adminRequest<AdminCategoryRow>("/admin/categories", {
    method: "POST",
    body: input,
  });

  return mapCategory(row);
}

/** PATCH /admin/categories/:id */
export async function updateAdminCategory(
  id: number,
  input: Partial<AdminCategoryInput>,
): Promise<AdminCategory> {
  const row = await adminRequest<AdminCategoryRow>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: input,
  });

  return mapCategory(row);
}

/** DELETE /admin/categories/:id */
export function deleteAdminCategory(id: number): Promise<void> {
  return adminRequest<void>(`/admin/categories/${id}`, { method: "DELETE" });
}
