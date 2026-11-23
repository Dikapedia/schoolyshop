import { API_URL, request, type RequestOptions } from "../client";

/**
 * Pintu keluar HTTP khusus panel admin.
 *
 * Secara default request admin menuju backend yang sama dengan auth
 * (`NEXT_PUBLIC_API_URL`). `NEXT_PUBLIC_ADMIN_API_URL` bisa dipakai bila panel
 * admin diarahkan ke origin API yang berbeda dari API publik.
 */
export const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || API_URL;

export function adminRequest<T>(
  path: string,
  options: Omit<RequestOptions<T>, "baseUrl"> = {},
): Promise<T> {
  return request<T>(path, { ...options, baseUrl: ADMIN_API_URL });
}
