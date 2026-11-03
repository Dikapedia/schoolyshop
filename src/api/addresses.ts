import { z } from "zod";
import { createDemoAddress } from "./mocks/addresses";
import {
  readRaw,
  readUserMap,
  writeUserCollection,
} from "./mocks/storage";

const ADDRESSES_KEY = "schooly.addresses";

export const addressSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  postalCode: z.string(),
  note: z.string(),
  badges: z.array(z.string()),
  isPrimary: z.boolean(),
  isPickupHub: z.boolean().optional(),
});
export type Address = z.infer<typeof addressSchema>;

/**
 * Daftar alamat milik user.
 *
 * TODO(backend): ganti dengan GET /users/me/addresses dan konfirmasi apakah
 * alamat utama ditandai backend atau dihitung frontend.
 */
export function listAddresses(userId: string | null): Address[] {
  if (!userId) return [];
  const all = readUserMap<unknown>(ADDRESSES_KEY);
  if (!all) return [];

  const parsed = addressSchema.array().safeParse(all[userId]);
  return parsed.success ? parsed.data : [];
}

/**
 * Simpan seluruh daftar alamat user.
 *
 * TODO(backend): ganti dengan POST/PATCH/DELETE /users/me/addresses per
 * perubahan alamat, bukan menulis ulang seluruh koleksi.
 */
export function saveAddresses(userId: string, addresses: Address[]): void {
  // Pertahankan perilaku lama: bila data lama rusak, jangan timpa.
  const raw = readRaw(ADDRESSES_KEY);
  if (raw) {
    try {
      const existing = JSON.parse(raw) as unknown;
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        return;
      }
    } catch {
      return;
    }
  }

  writeUserCollection(ADDRESSES_KEY, userId, addresses);
}

/**
 * Alamat demo untuk kondisi "belum punya alamat".
 *
 * TODO(backend): hapus setelah alamat default berasal dari backend.
 */
export function getDemoAddress(id?: string): Address {
  return createDemoAddress(id);
}

export function setPrimaryAddress(
  addresses: Address[],
  addressId: string,
): Address[] {
  return addresses.map((address) => ({
    ...address,
    isPrimary: address.id === addressId,
  }));
}

export function removeAddress(
  addresses: Address[],
  addressId: string,
): Address[] {
  const remaining = addresses.filter((address) => address.id !== addressId);
  if (remaining.length > 0 && !remaining.some((address) => address.isPrimary)) {
    remaining[0].isPrimary = true;
  }
  return remaining;
}
