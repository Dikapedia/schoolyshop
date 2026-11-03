import { PROFILE_PHONE_KEY } from "./mocks/keys";
import { readRaw, writeRaw } from "./mocks/storage";

/**
 * Nomor telepon profil yang tersimpan di browser.
 *
 * TODO(backend): profil lengkap (nama, email, telepon, tanggal daftar,
 * status verifikasi) seharusnya berasal dari GET /users/me.
 */
export function getProfilePhone(): string {
  return readRaw(PROFILE_PHONE_KEY) ?? "";
}

export function saveProfilePhone(phone: string[]): void {
  writeRaw(PROFILE_PHONE_KEY, phone.join(""));
}
