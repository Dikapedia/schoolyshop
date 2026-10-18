// Pengaturan umum situs. Ubah di sini, lalu semua halaman ikut berubah.
export const site = {
  name: "Schooly Shop",
  // Nama sekolah yang tampil di beranda, login, dan registrasi.
  school: "SMK Suka Maju",
  // Contoh alamat. Ganti dengan alamat sekolah yang sebenarnya.
  address: "Jl. Meraih Bunga Tidur Melalui Kreativitas",
  // Contoh nomor WhatsApp admin. Ganti dengan nomor yang sebenarnya.
  whatsapp: { display: "+62 812-3456-7890", number: "6281234567890" },
} as const;

export function whatsappLink(text?: string): string {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${site.whatsapp.number}${query}`;
}
