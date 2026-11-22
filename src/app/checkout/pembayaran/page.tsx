import { redirect } from "next/navigation";

/**
 * Halaman pembayaran lama digantikan oleh `/pesanan/bayar` yang memakai
 * Virtual Account dari backend. Redirect dipertahankan agar tautan lama tidak
 * berakhir di halaman mock.
 */
export default function PembayaranLamaPage() {
  redirect("/pesanan");
}
