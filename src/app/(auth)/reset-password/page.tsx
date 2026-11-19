import type { Metadata } from "next";
import ResetSandiPage from "../reset-sandi/page";

export const metadata: Metadata = { title: "Reset Kata Sandi | Schooly Shop" };

/**
 * Alias untuk tautan reset kata sandi yang dikirim template email backend.
 *
 * Email produksi mengarah ke `/reset-password?token=...`, sedangkan halaman
 * kanonik aplikasi adalah `/reset-sandi`. Halaman ini memakai ulang halaman
 * kanonik agar kedua tautan menampilkan form yang sama tanpa duplikasi.
 */
export default ResetSandiPage;
