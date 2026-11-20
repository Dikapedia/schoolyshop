import { adminRequest } from "./client";

/** Batas maksimum `perPage` yang diterima backend. */
export const ADMIN_PER_PAGE = 50;

export type AdminPaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type AdminPaginatedResponse<T> = {
  data: T[];
  meta?: AdminPaginationMeta;
};

function buildQuery(
  params: Record<string, string | number | undefined | null>,
): URLSearchParams {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }

  return query;
}

/**
 * Ambil seluruh baris dari endpoint berpaginasi.
 *
 * Halaman pertama diminta dengan `perPage=50`, lalu sisa halaman diambil
 * paralel. Dipakai untuk endpoint yang masih difilter/dipaginasi di client
 * agar UI tidak kehilangan data setelah halaman pertama.
 */
export async function fetchAllAdminPages<T>(
  path: string,
  params: Record<string, string | number | undefined | null> = {},
): Promise<T[]> {
  const query = buildQuery(params);
  query.set("page", "1");
  query.set("perPage", String(ADMIN_PER_PAGE));

  const first = await adminRequest<AdminPaginatedResponse<T> | T[]>(
    `${path}?${query.toString()}`,
  );
  if (Array.isArray(first)) return first;
  const rows = Array.isArray(first?.data) ? [...first.data] : [];
  const totalPages = Math.max(1, first?.meta?.totalPages ?? 1);

  if (totalPages <= 1) return rows;

  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => {
      const nextQuery = new URLSearchParams(query);
      nextQuery.set("page", String(index + 2));
      return adminRequest<AdminPaginatedResponse<T>>(
        `${path}?${nextQuery.toString()}`,
      );
    }),
  );

  for (const page of remaining) {
    if (Array.isArray(page?.data)) rows.push(...page.data);
  }

  return rows;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const JAKARTA_TIME_ZONE = "Asia/Jakarta";

function jakartaParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: JAKARTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
  };
}

/** Format tanggal backend (ISO) menjadi `12 Okt 2026` waktu Jakarta. */
export function formatAdminDate(value: string | null | undefined): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const { year, month, day } = jakartaParts(date);
  const monthLabel = MONTHS_SHORT[Number(month) - 1] ?? month;

  return `${Number(day)} ${monthLabel} ${year}`;
}

/** Format tanggal + jam backend menjadi `12 Okt 2026, 14:32`. */
export function formatAdminDateTime(
  value: string | null | undefined,
): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const { year, month, day, hour, minute } = jakartaParts(date);
  const monthLabel = MONTHS_SHORT[Number(month) - 1] ?? month;

  return `${Number(day)} ${monthLabel} ${year}, ${hour}:${minute}`;
}

export function formatAdminRupiah(value: number | null | undefined): string {
  return `Rp${(value ?? 0).toLocaleString("id-ID")}`;
}

export function adminInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const AVATAR_CLASSES = [
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-violet-50 text-violet-700",
  "bg-rose-50 text-rose-700",
];

export function adminAvatarClass(seed: number): string {
  return AVATAR_CLASSES[Math.abs(seed) % AVATAR_CLASSES.length];
}
