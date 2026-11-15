"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/api/errors";

/**
 * Loader data admin yang selalu lewat HTTP. `key` mengubah dependensi
 * pemuatan; `reload()` dipakai setelah mutasi.
 */
export function useAsyncData<T>(key: string, loader: () => Promise<T>) {
  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  });

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;

    loaderRef
      .current()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError("");
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(getApiErrorMessage(cause));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, tick]);

  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    setTick((value) => value + 1);
  }, []);

  return { data, loading, error, reload, setData };
}
