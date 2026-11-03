import { z } from "zod";
import {
  ApiError,
  errorFromResponse,
  type ApiErrorCode,
} from "./errors";

/**
 * Konfigurasi tunggal untuk peralihan mock → API nyata.
 *
 * - `NEXT_PUBLIC_USE_MOCK_AUTH=true` (default) memakai akun demo lokal.
 * - Data domain lain berasal dari adapter di `src/api/mocks` sampai endpoint
 *   backend tersedia.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false";

type RequestOptions<T> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  responseSchema?: z.ZodType<T>;
  /** Pesan khusus per status, mis. 401 saat login. */
  statusMessages?: Partial<Record<number, string>>;
  /** Kode khusus per status, mis. 409 saat registrasi. */
  statusCodes?: Partial<Record<number, ApiErrorCode>>;
};

/**
 * Satu-satunya pintu keluar HTTP untuk lapisan API.
 *
 * TODO(backend): tambahkan refresh token / penanganan 401 global bila
 * backend memakai cookie sesi dan endpoint refresh.
 */
export async function request<T>(
  path: string,
  options: RequestOptions<T> = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers,
    responseSchema,
    statusMessages,
    statusCodes,
  } = options;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "NETWORK",
      "Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.",
    );
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    const error = errorFromResponse(response.status, payload);
    const message = statusMessages?.[response.status];
    const code = statusCodes?.[response.status];

    if (message || code) {
      throw new ApiError(code ?? error.code, message ?? error.message, {
        status: response.status,
        details: error.details,
      });
    }

    throw error;
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => undefined);
  if (!responseSchema) return payload as T;

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError("SERVER", "Respons server tidak valid.", {
      status: response.status,
      details: { issues: parsed.error.issues },
    });
  }

  return parsed.data;
}
