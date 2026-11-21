import { API_URL } from "@/api/client";

/**
 * Ubah path gambar relatif dari backend menjadi URL absolut.
 *
 * Backend menyajikan unggahan di `/uploads/...` pada origin yang sama dengan
 * API. `NEXT_PUBLIC_API_URL` biasanya berakhiran `/api`, jadi bagian tersebut
 * dilepas sebelum digabung.
 */
export function resolveImageUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const origin = API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  if (!origin) return trimmed;

  return `${origin}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}
