/**
 * Helper penyimpanan untuk adapter mock.
 *
 * Semua akses `localStorage` untuk data domain harus lewat API layer;
 * helper ini adalah satu-satunya tempat yang menyentuh storage browser
 * secara langsung untuk data mock.
 */

export function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Penyimpanan tidak tersedia; perilaku lama juga mengabaikan error ini.
  }
}

export function removeRaw(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // abaikan
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  writeRaw(key, JSON.stringify(value));
}

/**
 * Baca koleksi per-user. Mengembalikan `null` bila key belum ada atau
 * isinya tidak valid, agar halaman bisa membedakan "belum ada data"
 * dari "daftar kosong" seperti perilaku sebelumnya.
 */
export function readUserCollection<T>(
  key: string,
  userId: string,
): T[] | null {
  const raw = readRaw(key);
  if (!raw) return null;

  try {
    const all = JSON.parse(raw) as unknown;
    if (!all || typeof all !== "object" || Array.isArray(all)) return null;
    const value = (all as Record<string, unknown>)[userId];
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return null;
  }
}

export function readUserMap<T>(
  key: string,
): Record<string, T> | null {
  const raw = readRaw(key);
  if (!raw) return null;

  try {
    const all = JSON.parse(raw) as unknown;
    if (!all || typeof all !== "object" || Array.isArray(all)) return null;
    return all as Record<string, T>;
  } catch {
    return null;
  }
}

export function writeUserCollection<T>(
  key: string,
  userId: string,
  value: T[],
): void {
  const all = readUserMap<T[]>(key) ?? {};
  all[userId] = value;
  writeJson(key, all);
}
