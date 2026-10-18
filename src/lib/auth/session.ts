import type { Session } from "./types";

// CATATAN: penyimpanan di browser ini hanya untuk tampilan (nama, peran).
// Keamanan sebenarnya harus dari backend, misalnya cookie httpOnly,
// dan setiap API wajib memeriksa peran di sisi server.

export const SESSION_KEY = "schooly.session";
export const SESSION_EVENT = "schooly:session";

/** Isi mentah sesi (string JSON) atau "" bila belum login. */
export function readSessionRaw(): string {
  try {
    return (
      window.localStorage.getItem(SESSION_KEY) ??
      window.sessionStorage.getItem(SESSION_KEY) ??
      ""
    );
  } catch {
    return "";
  }
}

export function saveSession(session: Session, remember: boolean): void {
  try {
    const target = remember ? window.localStorage : window.sessionStorage;
    const other = remember ? window.sessionStorage : window.localStorage;
    other.removeItem(SESSION_KEY);
    target.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // penyimpanan tidak tersedia (mode privat, dll.)
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getSession(): Session | null {
  const raw = readSessionRaw();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}
