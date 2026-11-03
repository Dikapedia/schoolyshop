/**
 * Format error terpusat untuk seluruh lapisan API.
 *
 * Selama backend belum tersedia, error dari mock juga dilempar sebagai
 * `ApiError` agar komponen hanya perlu menangani satu bentuk error.
 */
export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "SERVER"
  | "NETWORK"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_INACTIVE"
  | "EMAIL_TAKEN"
  | "UNKNOWN";

export type ApiErrorDetails = Record<string, unknown>;

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: ApiErrorDetails;

  constructor(
    code: ApiErrorCode,
    message: string,
    options: { status?: number; details?: ApiErrorDetails } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = options.status ?? 0;
    this.details = options.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Ambil pesan yang aman untuk ditampilkan dari error apa pun. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
): string {
  return isApiError(error) ? error.message : fallback;
}

function readServerMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const message = (payload as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : undefined;
}

/**
 * Petakan status HTTP ke kode dan pesan error standar.
 *
 * TODO(backend): sesuaikan bentuk payload error (mis. `{ message, errors }`)
 * dengan kontrak backend yang final.
 */
export function errorFromResponse(
  status: number,
  payload?: unknown,
): ApiError {
  const serverMessage = readServerMessage(payload);

  switch (status) {
    case 401:
      return new ApiError(
        "UNAUTHENTICATED",
        serverMessage ?? "Sesi Anda telah berakhir. Silakan masuk kembali.",
        { status },
      );
    case 403:
      return new ApiError(
        "FORBIDDEN",
        serverMessage ?? "Anda tidak memiliki akses ke resource ini.",
        { status },
      );
    case 404:
      return new ApiError(
        "NOT_FOUND",
        serverMessage ?? "Data yang diminta tidak ditemukan.",
        { status },
      );
    case 409:
      return new ApiError(
        "CONFLICT",
        serverMessage ?? "Data sudah digunakan.",
        { status },
      );
    case 422:
      return new ApiError(
        "VALIDATION",
        serverMessage ?? "Data yang dikirim tidak valid.",
        { status },
      );
    case 500:
      return new ApiError(
        "SERVER",
        serverMessage ?? "Terjadi kesalahan pada server. Silakan coba lagi.",
        { status },
      );
    default:
      return new ApiError(
        "UNKNOWN",
        serverMessage ?? "Terjadi kesalahan. Silakan coba lagi.",
        { status },
      );
  }
}
