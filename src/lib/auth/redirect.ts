/**
 * Memastikan parameter ?next= hanya berisi path internal, agar tidak bisa
 * dipakai untuk mengarahkan pengguna ke situs lain (open redirect).
 */
export function safeNextPath(next: string | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  if (next.startsWith("/login") || next.startsWith("/daftar")) return "/";
  return next;
}

export const ADMIN_HOME = "/admin";
