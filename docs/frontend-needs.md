# Kebutuhan Frontend terhadap Backend

Dokumen ini adalah hasil agregasi kontrak API dan penanda `TODO(backend)` dari
refactor frontend pada issue [#3](https://github.com/Dikapedia/schoolyshop/issues/3)
dan integrasi alur lupa/reset kata sandi pada issue
[#5](https://github.com/Dikapedia/schoolyshop/issues/5).
Isinya menjadi acuan diskusi dengan tim backend; belum ada endpoint yang
diimplementasikan di backend pada refactor ini.

## 1. Konvensi umum

### Base URL dan mode mock

- Base URL: `NEXT_PUBLIC_API_URL` (lihat `.env.example`).
- Auth demo: `NEXT_PUBLIC_USE_MOCK_AUTH=true` memakai akun lokal.
- Semua data domain lain masih berasal dari adapter mock di `src/api/mocks/`.
  Pergantian ke API nyata dilakukan per modul di `src/api/*`.

### Autentikasi dan sesi

- Frontend saat ini menyimpan sesi di `localStorage`/`sessionStorage`.
- Backend disarankan memakai cookie `httpOnly` + endpoint `GET /auth/me`.
- Endpoint yang dibutuhkan: `POST /auth/login`, `POST /auth/register`,
  `POST /auth/logout`, `GET /auth/me`, `PATCH /users/me/password`,
  `POST /auth/forgot-password`, `POST /auth/reset-password`.
- Token reset sebaiknya opaque, berumur pendek, sekali pakai, dan tidak
  membocorkan apakah email terdaftar. Respons `POST /auth/forgot-password`
  harus selalu terlihat berhasil. `TODO(backend)`: tentukan masa berlaku
  token, status error untuk token kedaluwarsa (404/410/422), dan rate-limit
  (mis. 429 + `Retry-After`).

### Format error

Semua error melewati `src/api/errors.ts` dan memiliki bentuk konseptual:

```json
{
  "code": "VALIDATION",
  "message": "Pesan yang aman ditampilkan ke pengguna",
  "details": {}
}
```

Pemetaan status yang sudah ditangani frontend:

| Status | Kode frontend | Perilaku |
| --- | --- | --- |
| 401 | `UNAUTHENTICATED` / `INVALID_CREDENTIALS` | Arahkan ke login atau tampilkan kredensial salah |
| 403 | `FORBIDDEN` / `ACCOUNT_INACTIVE` | Tampilkan pesan akses/akun nonaktif |
| 404 | `NOT_FOUND` | Tampilkan data tidak ditemukan |
| 409 | `CONFLICT` / `EMAIL_TAKEN` | Tampilkan konflik data, mis. email terdaftar |
| 422 | `VALIDATION` | Tampilkan pesan validasi per field bila tersedia |
| 500 | `SERVER` | Tampilkan pesan umum dan opsi coba lagi |

`TODO(backend)`: konfirmasi nama field payload error dan apakah validasi
per-field dikirim sebagai `details.fields` atau format lain.

### Pagination, filter, dan sorting

Banyak halaman saat ini memfilter dan memotong data di client. Backend perlu
menyediakan query parameter yang konsisten, misalnya:

```text
?page=1&perPage=10&search=&status=&category=&sort=
```

`TODO(backend)`: tentukan format metadata pagination
(`{ data, meta: { page, perPage, total, totalPages } }`) dan batas maksimum
`perPage`.

## 2. Ringkasan endpoint yang dibutuhkan

| Domain | Endpoint utama |
| --- | --- |
| Auth | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me`, `PATCH /users/me/password`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| Produk | `GET /products`, `GET /products/:slug`, `GET /products/:id/related` |
| Keranjang | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart` |
| Alamat | `GET /users/me/addresses`, `POST /users/me/addresses`, `PATCH /users/me/addresses/:id`, `DELETE /users/me/addresses/:id` |
| Checkout | `GET /shipping/rates`, `POST /checkouts`, `GET /checkouts/:id` |
| Pesanan | `GET /orders`, `GET /orders/:id`, `POST /orders/:id/receive`, `GET /orders/:id/invoice` |
| Pembayaran | `POST /payments`, `GET /payments/:id`, webhook Midtrans |
| Pengembalian | `GET /returns`, `POST /returns`, `POST /returns/:id/photos` |
| Ulasan | `GET /reviews`, `POST /orders/:id/reviews` |
| Pelacakan | `GET /shipments/track?q=` |
| Admin pesanan | `GET /admin/orders`, `GET /admin/orders/:id`, `POST /admin/orders/:id/verify` |
| Admin pengiriman | `GET /admin/shipments`, `GET /admin/shipments/:id`, `POST /admin/shipments`, `GET /admin/shipments/:id/tracking` |
| Admin pengembalian | `GET /admin/returns`, `GET /admin/returns/:id`, `POST /admin/returns/:id/approve`, `POST /admin/returns/:id/reject` |
| Admin produk | `GET /admin/products`, `POST /admin/products`, `PATCH /admin/products/:id`, `DELETE /admin/products/:id`, `GET /admin/categories`, `POST /admin/categories` |
| Admin penjual | `GET /admin/sellers`, `POST /admin/sellers`, `PATCH /admin/sellers/:id` |
| Admin user | `GET /admin/users`, `GET /admin/users/:id` |
| Admin laporan | `GET /admin/dashboard/summary`, `GET /admin/reports/sales`, `GET /admin/reports/sales/:sellerId` |

## 3. Kebutuhan per halaman

### Publik

#### `/` (Beranda)

- **Data:** produk unggulan, jumlah produk, nama sekolah, tautan WhatsApp.
- **Aksi:** jelajahi katalog, buka detail produk, tambah ke keranjang.
- **Endpoint:** `GET /products?featured=true&limit=8`,
  `GET /products?limit=1` untuk jumlah katalog (atau `meta.total`).
- **TODO(backend):** konfirmasi apakah "produk unggulan" punya flag khusus
  atau hanya produk terbaru.

#### `/produk` (Katalog)

- **Data:** seluruh produk, kategori, harga, seller, jumlah per kategori.
- **Aksi:** pencarian, filter kategori/harga, sorting, pagination, tambah ke
  keranjang.
- **Endpoint:** `GET /products?q=&category=&minPrice=&maxPrice=&sort=&page=`.
- **TODO(backend):** filter harga saat ini berupa bucket tetap
  (`<20rb`, `20–50rb`, `50–100rb`, `>100rb`); konfirmasi apakah backend
  menerima `minPrice`/`maxPrice` atau bucket id.

#### `/produk/[slug]` (Detail Produk)

- **Data:** detail produk, deskripsi, seller, produk terkait.
- **Aksi:** pilih ukuran/varian, tambah ke keranjang, buka produk terkait.
- **Endpoint:** `GET /products/:slug`, `GET /products/:id/related`.
- **TODO(backend):** varian ukuran (`S`, `M`, `L`, `XL`, `XXL`) dan stok per
  varian masih hardcoded di UI. Perlu kontrak `variants[]` berisi `sku`,
  `size`, `stock`, dan `priceAdjustment` bila ada.

#### `/keranjang`

- **Data:** item keranjang, qty, subtotal, produk, status login.
- **Aksi:** ubah qty, hapus item, pilih item, lanjut checkout.
- **Endpoint:** `GET /cart`, `PATCH /cart/items/:productId`,
  `DELETE /cart/items/:productId`.
- **TODO(backend):** voucher dan biaya layanan masih tampilan statis; perlu
  endpoint validasi voucher bila fitur ini diaktifkan.

#### `/login` dan `/daftar`

- **Data:** sesi, role, status akun.
- **Aksi:** login (opsional "ingat saya"), registrasi, redirect sesuai role.
- **Endpoint:** `POST /auth/login`, `POST /auth/register`.
- **TODO(backend):** kontrak respons login diasumsikan `{ id, name, email,
  role }`. Konfirmasi apakah backend mengirim token, cookie, atau keduanya.

#### `/lupa-sandi`

- **Data:** email akun.
- **Aksi:** kirim permintaan instruksi reset.
- **Endpoint:** `POST /auth/forgot-password` dengan body `{ email }`.
- **Perilaku UI:** pesan sukses selalu sama, yaitu "Jika email terdaftar,
  instruksi reset kata sandi telah dikirim. Periksa kotak masuk Anda." Jangan
  bedakan respons untuk email terdaftar dan tidak terdaftar.
- **TODO(backend):** tentukan rate-limit per email/IP, masa berlaku token,
  apakah token sekali pakai, template email, dan apakah endpoint mengembalikan
  `204` atau body JSON. Frontend saat ini menganggap respons sukses tanpa body.

#### `/reset-sandi?token=...`

- **Data:** token dari query string dan kata sandi baru.
- **Aksi:** atur ulang kata sandi, lalu masuk dengan kata sandi baru.
- **Endpoint:** `POST /auth/reset-password` dengan body `{ token, password }`.
- **Perilaku UI:** tanpa `token`, halaman langsung menampilkan "Tautan reset
  tidak valid atau tidak lengkap." Token tidak valid/kedaluwarsa dari backend
  (404/422) ditampilkan sebagai "Tautan reset tidak valid atau sudah
  kedaluwarsa. Silakan minta tautan baru."
- **TODO(backend):** konfirmasi format token (opaque/JWT), masa berlaku,
  single-use, aturan password (minimal 8 karakter di UI), dan apakah semua
  sesi lama dicabut setelah reset. Tidak ada environment variable baru;
  frontend memakai `NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_USE_MOCK_AUTH`.

#### `/kebijakan-privasi`, `/syarat-ketentuan`, `/profil/bantuan`

- **Data:** konten statis dan FAQ.
- **Aksi:** navigasi, buka WhatsApp admin.
- **Endpoint:** tidak ada untuk saat ini.
- **TODO(backend):** bila konten ingin dikelola admin, sediakan
  `GET /content/pages/:slug` dan `GET /content/faqs`.

### Checkout dan pembayaran

#### `/checkout`

- **Data:** item keranjang, alamat user, opsi kurir, tarif, total.
- **Aksi:** pilih alamat, pilih kurir, lanjut ke pembayaran.
- **Endpoint:** `GET /users/me/addresses`, `GET /shipping/rates`,
  `POST /checkouts`.
- **TODO(backend):** titik asal pengiriman, berat paket, dan tarif masih
  hardcoded. Perlu parameter `originId`, `destinationId`, `weightGram`, dan
  `courier` untuk Biteship/rajaongkir.

#### `/checkout/pembayaran`

- **Data:** total tagihan, metode pembayaran, nomor VA, countdown, ringkasan.
- **Aksi:** pilih metode bayar, salin nomor VA, bayar.
- **Endpoint:** `POST /payments`, `GET /payments/:id`, webhook Midtrans.
- **TODO(backend):** nomor VA `8801 2025 0101 001`, daftar bank, dan metode
  pembayaran masih statis. Perlu response payment gateway berisi
  `paymentId`, `method`, `vaNumber`, `expiresAt`, `status`.

### Pesanan pengguna

#### `/pesanan`

- **Data:** riwayat pesanan per user, status, total, item pertama.
- **Aksi:** cetak invoice, lacak, terima pesanan, beri ulasan, ajukan retur.
- **Endpoint:** `GET /orders`, `GET /orders/:id`, `POST /orders/:id/receive`.
- **TODO(backend):** kartu pesanan menampilkan seller "Bu Siti Aminah, M.Pd."
  dan label "Lunas - Virtual Account BCA" secara statis; perlu data seller,
  metode bayar, dan status pembayaran per pesanan.

#### `/pesanan/invoice`

- **Data:** detail invoice, konsumen, alamat kirim, item, pembayaran.
- **Aksi:** cetak, unduh PDF, cetak layout, simpan PDF (tombol belum aktif).
- **Endpoint:** `GET /orders/:id`, `GET /orders/:id/invoice`.
- **TODO(backend):** data konsumen/alamat/metode bayar masih memakai satu mock
  yang sama untuk semua invoice. Perlu snapshot data saat checkout.

#### `/pesanan/lacak`

- **Data:** hasil pelacakan kurir, riwayat perjalanan, peta.
- **Aksi:** cari berdasarkan resi/ID pesanan, salin resi.
- **Endpoint:** `GET /shipments/track?q=`.
- **TODO(backend):** waktu, status, dan lokasi berasal dari webhook kurir.
  Konfirmasi format waktu dan apakah satu pesanan bisa punya beberapa resi.

#### `/pesanan/retur`

- **Data:** detail pesanan dan item yang bisa diretur.
- **Aksi:** isi alasan per item, kirim permintaan.
- **Endpoint:** `GET /orders/:id`, `POST /returns`.
- **TODO(backend):** upload foto barang dan validasi kelayakan retur belum
  ada kontraknya. Perlu `POST /returns/:id/photos` atau multipart upload.

#### `/pesanan/status-pengembalian`

- **Data:** daftar permintaan retur user dan statusnya.
- **Aksi:** melihat status.
- **Endpoint:** `GET /returns`.
- **TODO(backend):** status retur belum ada di model frontend; perlu
  `status`, `decisionAt`, `refundMethod`, dan `adminNote`.

#### `/pesanan/terima`

- **Data:** detail pesanan, info pengiriman, item, total.
- **Aksi:** konfirmasi pesanan diterima.
- **Endpoint:** `GET /orders/:id`, `POST /orders/:id/receive`.
- **TODO(backend):** kurir, resi, dan alamat masih statis di UI. Perlu data
  shipment terkait pesanan.

#### `/pesanan/ulasan`

- **Data:** item pesanan yang bisa diulas.
- **Aksi:** rating bintang dan komentar per produk, kirim ulasan.
- **Endpoint:** `POST /orders/:id/reviews`.
- **TODO(backend):** tentukan apakah satu item boleh diulas lebih dari sekali,
  apakah ulasan bisa diedit, dan moderasi ulasan.

#### `/pesanan/ulasan/riwayat`

- **Data:** daftar ulasan user.
- **Aksi:** melihat ulasan.
- **Endpoint:** `GET /reviews`.

### Profil pengguna

#### `/profil`

- **Data:** nama, email, telepon, tanggal daftar, status verifikasi.
- **Aksi:** ubah nama/email/telepon, ubah kata sandi, logout.
- **Endpoint:** `GET /users/me`, `PATCH /users/me`,
  `PATCH /users/me/password`.
- **TODO(backend):** tanggal daftar dan status verifikasi masih statis.
  Nomor telepon saat ini disimpan sebagai satu nilai global di browser, bukan
  per user.

#### `/profil/alamat`

- **Data:** daftar alamat user, badge, alamat utama.
- **Aksi:** tambah/edit/hapus alamat, jadikan utama.
- **Endpoint:** `GET/POST/PATCH/DELETE /users/me/addresses`.
- **TODO(backend):** validasi alamat Biteship (kecamatan/kode pos) belum
  tersedia. Perlu kontrak `areaId`, `district`, `city`, `province`, dan
  `postalCode`.

### Admin

#### `/admin` (Dashboard)

- **Data:** total produk, pesanan, transaksi, user, pendapatan, 5 pesanan
  terbaru.
- **Aksi:** navigasi ke modul admin, buka detail pesanan.
- **Endpoint:** `GET /admin/dashboard/summary`,
  `GET /admin/orders?limit=5&sort=createdAt:desc`.
- **TODO(backend):** angka dashboard saat ini mock dan tidak diturunkan dari
  data produk/pesanan lain. Definisikan periode dan rumus pendapatan bersih.

#### `/admin/data-user`

- **Data:** daftar user, total user, pencarian, pagination.
- **Aksi:** cari, buka detail user.
- **Endpoint:** `GET /admin/users?page=&search=`.

#### `/admin/data-user/[id]`

- **Data:** profil user, total pesanan, pesanan selesai/dalam proses.
- **Aksi:** kembali ke daftar, lihat aktivitas.
- **Endpoint:** `GET /admin/users/:id`.

#### `/admin/pesanan`

- **Data:** daftar pesanan, status bayar, status pesanan, ringkasan count.
- **Aksi:** filter, cari, buka detail, verifikasi.
- **Endpoint:** `GET /admin/orders?page=&search=&paymentStatus=&orderStatus=`.

#### `/admin/pesanan/[id]`

- **Data:** detail pembeli, transaksi, gudang, item, ringkasan, status.
- **Aksi:** verifikasi pesanan, buka modal konfirmasi.
- **Endpoint:** `GET /admin/orders/:id`.

#### `/admin/pesanan/[id]/verifikasi`

- **Data:** detail pesanan yang akan diverifikasi.
- **Aksi:** setujui/tolak verifikasi.
- **Endpoint:** `GET /admin/orders/:id`, `POST /admin/orders/:id/verify`.
- **TODO(backend):** alasan penolakan dan status setelah verifikasi belum
  didefinisikan.

#### `/admin/pengiriman`

- **Data:** daftar pengiriman, status, kurir, resi, ringkasan count.
- **Aksi:** cari/filter, buat pengiriman, buka detail/label/pelacakan.
- **Endpoint:** `GET /admin/shipments`, `POST /admin/shipments`.
- **TODO(backend):** pembuatan resi memakai `Math.random` di frontend. Resi
  harus dibuat Biteship/kurir dan dikembalikan backend.

#### `/admin/pengiriman/[id]`

- **Data:** detail pengiriman, penerima, alamat, kurir, layanan, resi.
- **Aksi:** cetak label, lacak, kembali.
- **Endpoint:** `GET /admin/shipments/:id`.

#### `/admin/pengiriman/[id]/label`

- **Data:** label pengiriman, barcode, alamat tujuan.
- **Aksi:** cetak label.
- **Endpoint:** `GET /admin/shipments/:id`.
- **TODO(backend):** barcode masih pola statis; perlu data barcode/resi valid.

#### `/admin/pengiriman/[id]/pelacakan`

- **Data:** riwayat pelacakan pengiriman.
- **Aksi:** refresh status, kembali.
- **Endpoint:** `GET /admin/shipments/:id/tracking`.

#### `/admin/pengiriman/pengembalian`

- **Data:** daftar retur, ringkasan status, alasan, tanggal.
- **Aksi:** cari/filter, buka detail retur.
- **Endpoint:** `GET /admin/returns?page=&search=&status=`.
- **TODO(backend):** ringkasan jumlah per status saat ini mock dan tidak
  selalu sama dengan jumlah baris. Sebaiknya dihitung backend.

#### `/admin/pengiriman/pengembalian/[id]`

- **Data:** detail retur, pembeli, produk, alasan, foto, refund.
- **Aksi:** setujui/tolak retur.
- **Endpoint:** `GET /admin/returns/:id`.

#### `/admin/pengiriman/pengembalian/[id]/disetujui`

- **Data:** konfirmasi retur disetujui dan langkah berikutnya.
- **Aksi:** konfirmasi persetujuan.
- **Endpoint:** `POST /admin/returns/:id/approve`.
- **TODO(backend):** keputusan admin, waktu keputusan, dan metode refund perlu
  disimpan di server.

#### `/admin/pengiriman/pengembalian/[id]/ditolak`

- **Data:** konfirmasi retur ditolak.
- **Aksi:** konfirmasi penolakan.
- **Endpoint:** `POST /admin/returns/:id/reject`.
- **TODO(backend):** alasan penolakan wajib dikirim dan ditampilkan ke pembeli.

#### `/admin/penjual`

- **Data:** daftar penjual/supplier, jenis, nomor KK, kontak, alamat.
- **Aksi:** cari/filter, tambah penjual, edit penjual.
- **Endpoint:** `GET /admin/sellers`, `POST /admin/sellers`,
  `PATCH /admin/sellers/:id`.
- **TODO(backend):** nomor KK dan verifikasi identitas belum memiliki kontrak
  masking/akses. Ringkasan jumlah penjual di kartu atas masih statis.

#### `/admin/produk`

- **Data:** daftar produk, stok, status, statistik, seller, kategori.
- **Aksi:** cari/filter, tambah/edit/hapus produk, refresh, unduh CSV.
- **Endpoint:** `GET /admin/products`, `POST /admin/products`,
  `PATCH /admin/products/:id`, `DELETE /admin/products/:id`.
- **TODO(backend):** upload gambar produk belum ada; tambahkan multipart atau
  presigned URL. Ekspor CSV saat ini dibuat di client.

#### `/admin/produk/kategori`

- **Data:** kategori dan deskripsi.
- **Aksi:** tambah/edit/hapus kategori.
- **Endpoint:** `GET /admin/categories`, `POST /admin/categories`,
  `PATCH /admin/categories/:id`, `DELETE /admin/categories/:id`.
- **TODO(backend):** validasi apakah kategori yang masih dipakai produk boleh
  dihapus.

#### `/admin/laporan`

- **Data:** laporan penjualan per penjual, periode, total, refund, net.
- **Aksi:** filter tanggal/semester/penjual, unduh CSV, buka detail.
- **Endpoint:** `GET /admin/reports/sales?startDate=&endDate=&sellerId=`.
- **TODO(backend):** format tanggal dan periode akademik masih hardcoded;
  konfirmasi timezone (`Asia/Jakarta`) dan definisi laba bersih.

#### `/admin/laporan/[id]`

- **Data:** detail penjualan per seller, produk, total, refund, net.
- **Aksi:** unduh detail, kembali.
- **Endpoint:** `GET /admin/reports/sales/:sellerId`.

#### `/admin/profil`

- **Data:** profil admin, informasi sekolah, notifikasi.
- **Aksi:** simpan akun, ubah kata sandi, atur notifikasi/toko.
- **Endpoint:** `GET /users/me`, `PATCH /users/me`,
  `PATCH /users/me/password`, `PATCH /admin/settings`.
- **TODO(backend):** data sekolah di halaman ini masih statis dan berbeda dari
  `src/lib/site.ts`; perlu sumber konfigurasi tunggal.

## 4. Catatan bug/perilaku lama yang dipertahankan

Sesuai batasan issue, bug berikut **tidak diperbaiki** di refactor ini agar
perilaku tidak berubah:

1. **Status pesanan tidak tersimpan setelah "Pesanan Diterima".**
   Implementasi lama menulis ke key `schooly/orders` (garis miring), sedangkan
   pembacaan memakai `schooly.orders` (titik). Refactor mempertahankan key lama
   di `markOrderReceived()`.
2. **Nomor telepon profil tidak per user.** Nomor disimpan di key global
   `schooly.phone` dan tidak dimuat kembali saat halaman dibuka.
3. **Ubah kata sandi hanya berlaku untuk akun hasil registrasi.**
   Akun seed demo (`admin@schoolyshop.test`, `user@gmail.test`,
   `nonaktif@schoolyshop.test`) tidak tersimpan di `schooly.mock.users`,
   sehingga selalu gagal validasi kata sandi lama.
4. **Invoice memakai data konsumen yang sama untuk semua pesanan.**
   Sudah dipindahkan ke mock `INVOICE_DETAIL_MOCK`, tetapi belum per pesanan.
5. **Statistik dashboard admin tidak diturunkan dari data lain.**
   Angka "48 Produk", "10 Pesanan", dan pendapatan adalah mock terpisah.
6. **Ringkasan status retur admin tidak konsisten dengan daftar.**
   Kartu "Pengembalian Selesai" bernilai 2 sementara daftar mock hanya punya
   1 baris berstatus selesai; nilai lama dipertahankan.
7. **Ringkasan penjual di `/admin/penjual` masih statis** dan tidak berubah
   saat penjual ditambah/diedit.
8. **Label pembayaran dan seller pada kartu `/pesanan` masih statis**
   ("Lunas - Virtual Account BCA", "Bu Siti Aminah, M.Pd.").

## 5. Urutan integrasi yang disarankan

1. Auth + `GET /auth/me` + format error.
2. Produk dan kategori (read-only).
3. Alamat + tarif pengiriman + checkout draft.
4. Pesanan, pembayaran, invoice.
5. Retur, ulasan, pelacakan.
6. Seluruh modul admin.
7. Hapus `src/api/mocks`, bootstrap mock, dan seed demo setelah semua endpoint
   stabil.
