"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` saat render server/hidrasi, `true` setelah klien aktif. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
