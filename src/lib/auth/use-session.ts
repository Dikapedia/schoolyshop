import { useMemo, useSyncExternalStore } from "react";
import { SESSION_EVENT, readSessionRaw } from "./session";
import type { Session } from "./types";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}

/** Sesi login saat ini, atau null (juga null saat render di server). */
export function useSession(): Session | null {
  const raw = useSyncExternalStore(subscribe, readSessionRaw, () => "");
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }, [raw]);
}
