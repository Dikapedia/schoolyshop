# Schooly Shop

Toko belanja daring internal sekolah (SMK Suka Maju) untuk menjual produk kreatif warga sekolah — seragam, alat tulis, kerajinan, dan karya siswa. Data produk dan transaksi dimuat dari mock lokal, sedangkan sesi login dan keranjang disimpan di browser.

---

## Daftar Isi

- [Teknologi](#teknologi)
- [Fitur](#fitur)
- [Struktur Direktori](#struktur-direktori)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Setup & Instalasi](#setup--instalasi)
- [Akun Demo](#akun-demo)
- [Alur Penggunaan](#alur-penggunaan)

---

## Teknologi

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 (Turbopack) |
| Validasi kontrak | Zod |
| Font | next/font (Inter) |
| Linting | ESLint 9 |
| Bundler | Turbopack |

> **Catatan**: Project ini hanya frontend. Seluruh akses data melewati lapisan `src/api/`; data domain seperti produk, pesanan, dan pembayaran masih memakai adapter mock di `src/api/mocks/` (bukan database), sedangkan sesi login disimpan di browser. Kontrak backend ada di [`docs/frontend-needs.md`](docs/frontend-needs.md) dan inventaris struktur ada di [`docs/struktur-dan-hasil.md`](docs/struktur-dan-hasil.md).

---

## Fitur

### Toko (Publik)

- **Beranda** — Hero banner, tampilkan produk unggulan
- **Katalog Produk** — Filter kategori, pencarian produk
- **Detail Produk** — Informasi varian, harga, tambah ke keranjang
- **Keranjang Belanja** — Tambah/hapus item, update qty, persist via `localStorage`

### Panel Pengguna (Login Required)

- **Profil** — Ubah nama, email, nomor HP, dan kata sandi
- **Alamat** — Tambah/edit alamat pengiriman
- **Checkout** — Pilih alamat dan kurir, lalu lanjut ke pembayaran
- **Pembayaran** — Pilih bank Virtual Account (mock) dan salin nomor VA
- **Pesanan** — Riwayat pesanan, invoice, lacak, terima, retur, ulasan, dan status pengembalian
- **Pusat Bantuan** — FAQ, kontak admin via WhatsApp, catatan operasional

### Autentikasi

- **Login** — Autentikasi dummy (mode mock aktif via `NEXT_PUBLIC_USE_MOCK_AUTH=true`), redirect sesuai role
- **Registrasi** — Buat akun baru (tersimpan di `localStorage`)
- **Lupa Sandi** — Kirim instruksi reset (simulasi, belum terhubung backend)
- **Reset Sandi** — Atur kata sandi baru lewat tautan `?token=` (simulasi)
- **Logout** — Hapus session

### Halaman Lainnya

- **Syarat & Ketentuan**
- **Kebijakan Privasi**
- **Admin** — Panel manajemen (mock): dashboard, data user, penjual, produk/kategori, pesanan/verifikasi, pengiriman/retur, laporan, dan profil admin

---

## Struktur Direktori

```
schollyshop/
├── src/
│   ├── app/                    # Routes App Router
│   │   ├── (auth)/            # /login, /daftar, /lupa-sandi, /reset-sandi
│   │   ├── admin/             # Dashboard, user, penjual, produk, pesanan,
│   │   │                      # pengiriman, retur, laporan, profil admin
│   │   ├── checkout/          # /checkout, /checkout/pembayaran
│   │   ├── pesanan/           # /pesanan, invoice, lacak, retur, terima, ulasan
│   │   ├── produk/            # /produk, /produk/[slug]
│   │   ├── keranjang/         # /keranjang
│   │   ├── profil/            # /profil, /profil/alamat, /profil/bantuan
│   │   ├── kebijakan-privasi/ # /kebijakan-privasi
│   │   ├── syarat-ketentuan/  # /syarat-ketentuan
│   │   └── page.tsx           # / (home)
│   ├── components/
│   │   ├── icons.tsx
│   │   ├── auth/              # LoginForm, RegisterForm, ForgotPasswordForm,
│   │   │                      # ResetPasswordForm, Field, FormParts, BrandPanel
│   │   ├── admin/             # Komponen panel admin
│   │   └── shop/              # CartView, Hero, KatalogProduk, ProductCard,
│   │                          # ProductDetail, SiteFooter, SiteHeader
│   ├── api/                   # Lapisan API & kontrak request/response
│   │   ├── auth.ts, products.ts, cart.ts, checkout.ts
│   │   ├── addresses.ts, orders.ts, returns.ts, reviews.ts, users.ts
│   │   ├── payments.ts, invoices.ts, shipments.ts
│   │   ├── client.ts, errors.ts, bootstrap.ts
│   │   ├── admin/             # Kontrak khusus panel admin
│   │   └── mocks/             # Seluruh data mock + adapter localStorage
│   └── lib/
│       ├── site.ts            # Konfigurasi sekolah, WhatsApp number
│       ├── format.ts          # Utility format harga/dan
│       ├── fonts.ts           # next/font definitions
│       ├── cx.ts              # Class name helper
│       └── auth/              # validasi form & redirect
├── docs/
│   ├── frontend-needs.md      # Kebutuhan frontend terhadap backend per halaman
│   └── struktur-dan-hasil.md  # Inventaris struktur folder, file, dan output
├── public/
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Persyaratan Sistem

- **Node.js** ≥ 20.9.0 (sesuai Next.js 16; disarankan LTS terbaru)
- **npm** ≥ 9
- Browser modern (Chrome, Firefox, Edge, Safari)

---

## Setup & Instalasi

### 1. Clone / Download Project

```bash
git clone https://github.com/Dikapedia/schoolyshop.git
cd schollyshop
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Copy Konfigurasi Env

```bash
cp .env.example .env.local
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka browser:

```
http://localhost:3000
```

### 5. (Opsional) Build Production

```bash
npm run build
npm run start
```

---

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@schoolyshop.test` | `Admin12345` |
| User | `user@gmail.test` | `12345` |
| Nonaktif | `nonaktif@schoolyshop.test` | `User12345` |

> **Catatan**: Akun demo berasal dari seed mock; akun hasil registrasi disimpan di `localStorage`. Tidak ada backend/database yang terhubung saat ini.

---

## 🔄 Alur Penggunaan

### Alur Belanja

```
Beranda → Katalog Produk → Detail Produk
    → Tambah ke Keranjang → /keranjang
    → Login → Checkout → /checkout/pembayaran
```

### Alur Login

```
Beranda → Klik "Masuk" → /login
    → Masukkan email & password
    → User diarahkan ke Profil, Admin diarahkan ke /admin
```

### Alur Lupa Sandi

```
Login → "Lupa kata sandi?" → /lupa-sandi
    → Kirim instruksi (simulasi) → /reset-sandi?token=...
    → /login?reset=1
```

> Reset kata sandi masih simulasi frontend; endpoint backend belum tersedia.

### Alur Pusat Bantuan

```
Header → Klik "Bantuan" → /profil/bantuan
    → Baca FAQ → Hubungi via WhatsApp
```

---

## Catatan Pengembangan

- **Lapisan API**: Semua pengambilan data berada di `src/api/` (satu file per domain). Komponen tidak mengakses `localStorage` atau `fetch` secara langsung.
- **Mode Dummy**: Set `NEXT_PUBLIC_USE_MOCK_AUTH=true` (default) untuk menggunakan akun dummy. Jika ada backend, set ke `false` dan isi `NEXT_PUBLIC_API_URL`.
- **Data Mock**: Seluruh data contoh berada di `src/api/mocks/`, termasuk seed produk, pesanan, retur, pembayaran (8 bank VA), dan data admin.
- **Session & Cart**: Sesi disimpan di `localStorage` (jika "Ingat saya") atau `sessionStorage`; keranjang disimpan di `localStorage`. Bukan `httpOnly cookie` — cocok untuk demo, bukan production.
- **Fitur Simulasi**: Lupa/reset kata sandi, pembayaran VA, dan data pesanan masih berupa simulasi frontend dengan penanda `TODO(backend)`.
- **Kontrak Backend**: Lihat `docs/frontend-needs.md` untuk daftar endpoint dan `TODO(backend)` per halaman.
- **Struktur & Output**: Lihat `docs/struktur-dan-hasil.md` untuk inventaris folder, rute, dan hasil tiap halaman.
