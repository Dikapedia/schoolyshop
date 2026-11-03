# Schooly Shop

Toko belanja daring internal sekolah (SMK Suka Maju) untuk menjual produk kreatif warga sekolah — seragam, alat tulis, kerajinan, dan karya siswa. Semua data dimuat dari mock data lokal.

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
| Font | next/font (Geist Sans/Mono, Inter) |
| Linting | ESLint 9 |
| Bundler | Turbopack |

> **Catatan**: Project ini hanya frontend. Seluruh akses data melewati lapisan `src/api/`; data produk, user, dan session masih memakai adapter mock di `src/api/mocks/` (bukan database). Kontrak dan kebutuhan backend didokumentasikan di [`docs/frontend-needs.md`](docs/frontend-needs.md).

---

## Fitur

### Toko (Publik)

- **Beranda** — Hero banner, tampilkan produk unggulan
- **Katalog Produk** — Filter kategori, pencarian produk
- **Detail Produk** — Informasi varian, harga, tambah ke keranjang
- **Keranjang Belanja** — Tambah/hapus item, update qty, persist via `localStorage`

### Panel Pengguna (Login Required)

- **Profil** — Data akun & alamat
- **Alamat** — Tambah/edit alamat pengiriman
- **Pusat Bantuan** — FAQ, kontak admin via WhatsApp, catatan operasional
- **Pesanan** — Route rencana (belum diimplementasikan)

### Autentikasi

- **Login** — Autentikasi dummy (mode mock aktif via `NEXT_PUBLIC_USE_MOCK_AUTH=true`)
- **Registrasi** — Buat akun baru (tersimpan di `localStorage`)
- **Logout** — Hapus session

### Halaman Lainnya

- **Syarat & Ketentuan**
- **Kebijakan Privasi**
- **Admin** — Placeholder (belum diimplementasikan)

---

## Struktur Direktori

```
schollyshop/
├── src/
│   ├── app/                    # Routes App Router
│   │   ├── (auth)/            # Group auth: /login, /daftar
│   │   ├── admin/             # /admin (placeholder)
│   │   ├── produk/            # /produk, /produk/[slug]
│   │   ├── keranjang/         # /keranjang
│   │   ├── profil/            # /profil, /profil/alamat, /profil/bantuan
│   │   ├── kebijakan-privasi/ # /kebijakan-privasi
│   │   ├── syarat-ketentuan/  # /syarat-ketentuan
│   │   └── page.tsx           # / (home)
│   ├── components/
│   │   ├── icons.tsx
│   │   ├── auth/              # LoginForm, RegisterForm, BrandPanel
│   │   └── shop/              # CartView, Hero, KatalogProduk, ProductCard,
│   │                          # ProductDetail, SiteFooter, SiteHeader
│   ├── api/                   # Lapisan API & kontrak request/response
│   │   ├── auth.ts, products.ts, cart.ts, checkout.ts
│   │   ├── orders.ts, returns.ts, reviews.ts, users.ts
│   │   ├── admin/             # Kontrak khusus panel admin
│   │   └── mocks/             # Seluruh data mock + adapter localStorage
│   └── lib/
│       ├── site.ts            # Konfigurasi sekolah, WhatsApp number
│       ├── format.ts          # Utility format harga/dan
│       ├── fonts.ts           # next/font definitions
│       ├── cx.ts              # Class name helper
│       └── auth/              # validasi form & redirect
├── docs/
│   └── frontend-needs.md      # Kebutuhan frontend terhadap backend per halaman
├── public/
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Persyaratan Sistem

- **Node.js** ≥ 18.0 (rekomendasi ≥ 20)
- **npm** ≥ 9
- Browser modern (Chrome, Firefox, Edge, Safari)

---

## Setup & Instalasi

### 1. Clone / Download Project

```bash
git clone <repo-url>
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
npm start
```

---

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@schoolyshop.test` | `Admin12345` |
| User | `user@schoolyshop.test` | `User12345` |

> **Catatan**: Semua akun bersifat dummy (mock) dan disimpan di `localStorage`. Tidak ada backend/database yang terhubung saat ini.

---

## 🔄 Alur Penggunaan

### Alur Belanja

```
Beranda → Katalog Produk → Detail Produk
    → Tambah ke Keranjang → /keranjang
    → Login → Checkout
```

### Alur Login

```
Beranda → Klik "Masuk" → /login
    → Masukkan email & password → Profil
```

### Alur Pusat Bantuan

```
Header → Klik "Bantuan" → /profil/bantuan
    → Baca FAQ → Hubungi via WhatsApp
```

---

## Catatan Pengembangan

- **Lapisan API**: Semua pengambilan data berada di `src/api/` (satu file per domain). Komponen tidak lagi mengakses `localStorage` atau `fetch` secara langsung.
- **Mode Dummy**: Set `NEXT_PUBLIC_USE_MOCK_AUTH=true` (default) untuk menggunakan akun dummy. Jika ada backend, set ke `false` dan isi `NEXT_PUBLIC_API_URL`.
- **Data Mock**: Seluruh data contoh berada di `src/api/mocks/`, termasuk seed pesanan, retur, produk, dan data admin.
- **Session & Cart**: Disimpan di `localStorage`, bukan `httpOnly cookie` — cocok untuk demo, bukan production.
- **Kontrak Backend**: Lihat `docs/frontend-needs.md` untuk daftar endpoint dan `TODO(backend)` per halaman.
