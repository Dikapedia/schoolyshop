import { request } from "../client";
import { addressListSchema, addressSchema, type CustomerAddress } from "./schemas";

export type CustomerAddressInput = {
  label: string;
  recipientName: string;
  phone: string;
  address?: string;
  areaId: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  note?: string;
  isPrimary?: boolean;
};

/** GET /users/me/addresses */
export async function listCustomerAddresses(): Promise<CustomerAddress[]> {
  const payload = await request("/users/me/addresses", {
    responseSchema: addressListSchema,
  });

  return payload.data;
}

/** POST /users/me/addresses */
export function createCustomerAddress(
  input: CustomerAddressInput,
): Promise<CustomerAddress> {
  return request("/users/me/addresses", {
    method: "POST",
    body: input,
    responseSchema: addressSchema,
  });
}

/** PATCH /users/me/addresses/{id} */
export function updateCustomerAddress(
  id: number,
  input: Partial<CustomerAddressInput>,
): Promise<CustomerAddress> {
  return request(`/users/me/addresses/${id}`, {
    method: "PATCH",
    body: input,
    responseSchema: addressSchema,
  });
}

/** DELETE /users/me/addresses/{id} */
export async function deleteCustomerAddress(id: number): Promise<void> {
  await request<void>(`/users/me/addresses/${id}`, { method: "DELETE" });
}

export type ShippingArea = {
  id: string;
  name: string;
  province: string | null;
  city: string | null;
  district: string | null;
  postalCode: string | null;
};

/**
 * Cari area Biteship pertama untuk kata kunci tertentu. Saat Biteship tidak
 * aktif backend mengembalikan array kosong, sehingga pemanggil memakai area
 * fallback.
 */
export async function findShippingArea(
  query: string,
): Promise<ShippingArea | null> {
  const payload = await request<{ data: ShippingArea[] }>(
    `/shipping/areas?q=${encodeURIComponent(query)}`,
  ).catch(() => ({ data: [] }));

  return payload.data[0] ?? null;
}

/**
 * Pastikan pengguna punya minimal satu alamat sebelum checkout.
 *
 * Backend mewajibkan `areaId`, jadi saat pengguna belum punya alamat kita
 * buat alamat demo dari data profil. Pengguna tetap bisa mengubahnya lewat
 * halaman profil.
 */
export async function ensureCustomerAddress(input: {
  recipientName: string;
  phone?: string;
}): Promise<CustomerAddress> {
  const existing = await listCustomerAddresses();
  if (existing.length > 0) return existing[0];

  const area = await findShippingArea("Bandung");

  return createCustomerAddress({
    label: "Alamat Utama",
    recipientName: input.recipientName,
    phone: input.phone?.trim() || "081200000000",
    address: area
      ? `Alamat demo, ${area.district ?? area.city ?? area.name}`
      : "Jl. Ir. H. Juanda No. 93, Dago, Coblong, Kota Bandung",
    areaId: area?.id ?? "bandung",
    district: area?.district ?? "Coblong",
    city: area?.city ?? "Kota Bandung",
    province: area?.province ?? "Jawa Barat",
    postalCode: area?.postalCode ?? "40115",
    note: "Alamat dibuat otomatis saat checkout. Silakan ubah di halaman profil.",
    isPrimary: true,
  });
}
