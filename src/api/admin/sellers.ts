import { SELLER_MOCKS } from "../mocks/admin/sellers";
import { readRaw, writeRaw } from "../mocks/storage";

export type Seller = {
  id: number;
  initials: string;
  name: string;
  business: string;
  type: string;
  typeClass: string;
  kk: string;
  address: string;
  whatsapp?: string;
  avatarClass: string;
};

const SELLERS_STORAGE_KEY = "schooly.admin.sellers";

/**
 * TODO(backend): ganti dengan GET /admin/sellers?page=&search=&type=.
 */
export function getDefaultAdminSellers(): Seller[] {
  return SELLER_MOCKS;
}

/**
 * Baca perubahan penjual yang tersimpan di browser.
 *
 * TODO(backend): ganti dengan data server; filter dan pagination sebaiknya
 * juga dilakukan backend.
 */
export function loadAdminSellers(): Seller[] | null {
  const raw = readRaw(SELLERS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const saved = JSON.parse(raw) as unknown;
    if (!Array.isArray(saved) || saved.length === 0) return null;
    return saved as Seller[];
  } catch {
    return null;
  }
}

/**
 * TODO(backend): ganti dengan POST/PATCH/DELETE /admin/sellers.
 */
export function saveAdminSellers(sellers: Seller[]): void {
  writeRaw(SELLERS_STORAGE_KEY, JSON.stringify(sellers));
}
