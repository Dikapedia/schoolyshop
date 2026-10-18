import { useMemo, useSyncExternalStore } from "react";

// Keranjang sederhana di browser (localStorage) agar tombol
// "Tambah ke Keranjang" dan angka di header berfungsi.
// Ganti dengan keranjang dari API backend bila diperlukan.

const KEY = "schooly.cart";
const EVENT = "schooly:cart";

export type CartLine = { productId: string; qty: number; selected?: boolean };

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): CartLine[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? (value as CartLine[]) : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function addToCart(productId: string, qty = 1): void {
  const lines = parse(readRaw());
  const index = lines.findIndex((l) => l.productId === productId);
  if (index >= 0) {
    lines[index] = { ...lines[index], qty: lines[index].qty + qty };
  } else {
    lines.push({ productId, qty });
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // penyimpanan tidak tersedia
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Tambah ke keranjang dengan cek login — return true jika berhasil, false jika butuh login. */
export function addToCartWithAuth(productId: string, qty = 1): boolean {
  const sessionRaw = 
    window.localStorage.getItem("schooly.session") ??
    window.sessionStorage.getItem("schooly.session");
  if (!sessionRaw) {
    return false;
  }
  addToCart(productId, qty);
  return true;
}

function readSessionRaw(): string {
  try {
    return (
      window.localStorage.getItem("schooly.session") ??
      window.sessionStorage.getItem("schooly.session") ??
      ""
    );
  } catch {
    return "";
  }
}

function sessionSubscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener("schooly:session", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("schooly:session", onChange);
  };
}

export function hasSession(): boolean {
  return readSessionRaw().length > 0;
}

/** Jumlah total barang di keranjang (0 saat render di server atau belum login). */
export function useCartCount(): number {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const sessionRaw = useSyncExternalStore(sessionSubscribe, readSessionRaw, () => "");
  return useMemo(() => {
    if (!sessionRaw) return 0;
    return parse(raw).reduce((sum, l) => sum + l.qty, 0);
  }, [raw, sessionRaw]);
}

export function useCart(): CartLine[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const sessionRaw = useSyncExternalStore(sessionSubscribe, readSessionRaw, () => "");
  return useMemo(() => {
    if (!sessionRaw) return [];
    return parse(raw);
  }, [raw, sessionRaw]);
}

export function updateCartQuantity(productId: string, delta: number): CartLine[] {
  const lines = parse(readRaw());
  const index = lines.findIndex((l) => l.productId === productId);
  if (index < 0) return parse(readRaw());
  const newQty = Math.max(1, lines[index].qty + delta);
  lines[index].qty = newQty;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(EVENT));
  return lines;
}

export function removeFromCart(productId: string): CartLine[] {
  const lines = parse(readRaw()).filter((l) => l.productId !== productId);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(EVENT));
  return lines;
}

export function clearCart(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(EVENT));
}
