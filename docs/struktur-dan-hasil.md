# Inventaris Struktur Folder, File, dan Hasil Output

Dokumen ini menyajikan pemetaan terstruktur dari direktori, file, serta **hasil (output)** dari setiap komponen, rute halaman, dan adapter penyimpanan di dalam proyek **Schooly Shop** (SMK Suka Maju). Catatan: "hasil" di sini merujuk pada tampilan/fungsionalitas yang dirender oleh halaman serta data contoh (mock) yang dihasilkan, bukan kode sumber mentah.

---

## 1. Ikhtisar Arsitektur & Output Global

- **Framework**: Next.js 16 (App Router) dengan Turbopack.
- **Render Output**: Halaman publik dan panel interaktif dirender secara responsif (SSR/Client Component).
- **Data Layer**: Berjalan sepenuhnya di sisi klien menggunakan `localStorage` via adapter di `src/api/mocks/`. Data awal disebar (seeded) sekali saat peramban memuat aplikasi (`initializeLocalData()`).

---

## 2. Pohon Direktori dan Deskripsi Hasil

### `src/`
Direktori utama kode aplikasi.

#### `src/app/` (App Router - 41 Rute Halaman)
Setiap rute menghasilkan halaman web interaktif dengan keluaran spesifik:

1. **Halaman Publik (8 route)**
   - `/` (`src/app/page.tsx`): Menampilkan Beranda dengan banner promosi (Hero), section katalog produk unggulan, header, dan footer toko.
   - `/produk` (`src/app/produk/page.tsx`): Menampilkan Katalog Produk lengkap dengan filter kategori, pencarian, dan pilihan pengurutan harga.
   - `/produk/[slug]` (`src/app/produk/[slug]/page.tsx`): Halaman detail produk dinamis (berdasarkan slug), menampilkan deskripsi, informasi penjual/supplier, pilihan ukuran, dan produk terkait.
   - `/keranjang` (`src/app/keranjang/page.tsx`): Keranjang belanja interaktif yang menyimpan item di `localStorage`, menampilkan ringkasan subtotal dan tombol lanjut ke checkout.
   - `/checkout` (`src/app/checkout/page.tsx`): Alur pembayaran 4 tahap (Keranjang → Alamat → Pengiriman → Pembayaran). Menampilkan pilihan kurir (JNE, SiCepat, J&T, AnterAja) dan ringkasan biaya.
   - `/checkout/pembayaran` (`src/app/checkout/pembayaran/page.tsx`): Halaman konfirmasi pembayaran instan (mock Virtual Account BCA dengan hitung mundur).
   - `/kebijakan-privasi` (`src/app/kebijakan-privasi/page.tsx`): Dokumen statis kebijakan privasi data pengguna dan transaksi.
   - `/syarat-ketentuan` (`src/app/syarat-ketentuan/page.tsx`): Dokumen statis syarat dan ketentuan layanan pembelian di Schooly Shop.

2. **Autentikasi (2 route)**
   - `/login` (`src/app/(auth)/login/page.tsx`): Formulir masuk dengan akun demo atau akun terdaftar di peramban.
   - `/daftar` (`src/app/(auth)/daftar/page.tsx`): Formulir registrasi akun baru untuk komunitas sekolah.

3. **Pesanan Pembeli (8 route)**
   - `/pesanan` (`src/app/pesanan/page.tsx`): Riwayat pesanan per pengguna dengan tab status (Semua, Diproses, Dikirim, Selesai, Retur).
   - `/pesanan/invoice` (`src/app/pesanan/invoice/page.tsx`): Pratinjau nota/invoice resmi transaksi pesanan (cetak/unduh PDF).
   - `/pesanan/lacak` (`src/app/pesanan/lacak/page.tsx`): Pelacakan status pengiriman real-time berdasarkan nomor resi beserta peta titik pengiriman.
   - `/pesanan/retur` (`src/app/pesanan/retur/page.tsx`): Formulir pengajuan pengembalian (retur) barang beserta alasan dan unggahan foto bukti.
   - `/pesanan/terima` (`src/app/pesanan/terima/page.tsx`): Konfirmasi penerimaan paket pesanan oleh pembeli.
   - `/pesanan/ulasan` (`src/app/pesanan/ulasan/page.tsx`): Formulir penilaian bintang dan ulasan komentar produk.
   - `/pesanan/ulasan/riwayat` (`src/app/pesanan/ulasan/riwayat/page.tsx`): Daftar ulasan yang pernah dikirim pengguna.
   - `/pesanan/status-pengembalian` (`src/app/pesanan/status-pengembalian/page.tsx`): Status dan linimasa pengajuan retur barang.

4. **Profil Pembeli (3 route)**
   - `/profil` (`src/app/profil/page.tsx`): Pengelolaan data akun (nama, email, nomor WhatsApp, ubah kata sandi).
   - `/profil/alamat` (`src/app/profil/alamat/page.tsx`): Manajemen alamat pengiriman (tambah, edit, hapus, pilih alamat utama).
   - `/profil/bantuan` (`src/app/profil/bantuan/page.tsx`): Pusat bantuan, FAQ operasional, dan tautan langsung hubungi admin via WhatsApp.

5. **Panel Admin (20 route)**
   - `/admin` (`src/app/admin/page.tsx`): Dashboard utama admin (kartu statistik total produk, pesanan, pendapatan bersih, dan daftar pesanan terbaru).
   - `/admin/data-user` (`src/app/admin/data-user/page.tsx` & `[id]/page.tsx`): Daftar seluruh pengguna terdaftar beserta detail aktivitas per user.
   - `/admin/penjual` (`src/app/admin/penjual/page.tsx`): Manajemen data penjual dan mitra supplier (Siswa, Guru, Karyawan).
   - `/admin/produk` (`src/app/admin/produk/page.tsx` & `kategori/page.tsx`): Kelola daftar produk, stok, status aktif/nonaktif, dan kategori produk.
   - `/admin/pesanan` (`src/app/admin/pesanan/page.tsx`, `[id]/page.tsx`, `[id]/verifikasi/page.tsx`): Pemantauan dan verifikasi pembayaran pesanan masuk.
   - `/admin/pengiriman` (`src/app/admin/pengiriman/page.tsx`, `[id]/page.tsx`, `[id]/label/page.tsx`, `[id]/pelacakan/page.tsx`): Manajemen logistik, penerbitan nomor resi, cetak label pengiriman, dan pelacakan kurir.
   - `/admin/pengiriman/pengembalian` (`.../[id]/page.tsx`, `.../disetujui/page.tsx`, `.../ditolak/page.tsx`): Penanganan klaim retur barang (setujui/tolak klaim).
   - `/admin/laporan` (`src/app/admin/laporan/page.tsx` & `[id]/page.tsx`): Laporan penjualan berkala per penjual/supplier, total bruto, potongan retur, dan laba bersih.
   - `/admin/profil` (`src/app/admin/profil/page.tsx`): Pengaturan profil administrator, notifikasi, dan data instansi sekolah.

#### `src/api/` & `src/api/mocks/` (Lapisan Data & Mock Dataset)
Berisi fungsi kontrak API dan data tiruan yang menghasilkan dataset runtime berikut:
- **Produk (`src/api/mocks/products.ts`)**: 24 produk terkurasi dalam kategori Pakaian Sekolah, Kerajinan, Alat Tulis, Makanan, dan Minuman.
- **Akun Demo (`src/api/mocks/auth.ts`)**: Akun Admin (`admin@schoolyshop.test`, sandi `Admin12345`), Akun Siswa (`user@gmail.test`, sandi `12345`), dan Akun Nonaktif.
- **Pesanan (`src/api/mocks/orders.ts`)**: Seed pesanan demo untuk `user-1` (status Selesai, Dikirim, Dalam Pengembalian).
- **Pengiriman (`src/api/mocks/shipments.ts` & `checkout.ts`)**: 4 opsi tarif kurir (JNE, SiCepat, J&T, AnterAja) dan riwayat linimasa pelacakan logistik.
- **Retur & Invoice (`src/api/mocks/returns.ts` & `invoices.ts`)**: Data sampel pengajuan retur barang dan detail template nota/invoice PDF.
- **Admin Mocks (`src/api/mocks/admin/*`)**: Data statistik dashboard, daftar 30 user dasar, laporan penjualan per supplier (Ismi, Intan, Alwan, Budi, Novita), dan riwayat klaim retur.

#### `src/components/`
Komponen UI modular pembangun antarmuka:
- **`components/shop/`**: Header, Footer, Hero banner, Katalog Produk, Kartu Produk, Detail Produk, Keranjang.
- **`components/auth/`**: Formulir Login, Registrasi, Panel Merek (BrandPanel).
- **`components/admin/`**: Ilustrasi produk batik, modal konfirmasi pengiriman, dan verifikasi pesanan.

#### `src/lib/`
Konfigurasi dan utilitas penunjang:
- `site.ts`: Pengaturan identitas sekolah (SMK Suka Maju), alamat, dan generator tautan WhatsApp.
- `format.ts`: Pemformat mata uang Rupiah (`Rp...`).
- `fonts.ts`: Definisi font Geist Sans/Inter.
- `cx.ts`: Penggabung kelas CSS Tailwind.

### `docs/`
- `frontend-needs.md`: Dokumentasi kebutuhan endpoint backend dan kontrak API dari setiap halaman.

### `public/`
- Berisi aset statis: ikon SVG Next.js/Vercel, ilustrasi SVG produk batik (`admin-avatar.svg`), dan ilustrasi latar halaman autentikasi (`auth-illustration.png`).

---

## 3. Kesimpulan

Seluruh struktur direktori dan file di atas menghasilkan aplikasi e-commerce internal sekolah yang berfungsi penuh dengan data tiruan (mock), mencakup sisi publik (katalog & keranjang), panel pengguna (profil, alamat, riwayat pesanan, bantuan), serta panel manajemen admin yang komprehensif.
