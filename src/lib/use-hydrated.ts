"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `true` hanya setelah hydration di browser.
 *
 * Dipakai untuk menunda redirect berbasis sesi sampai localStorage terbaca,
 * tanpa memanggil setState di dalam effect (yang memicu cascading render).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
