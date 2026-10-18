// DATA CONTOH. Ganti dengan data dari API backend saat sudah tersedia.
// Foto: isi `image` dengan path di folder public, misalnya "/products/batik.jpg".
// Tanpa `image`, kartu menampilkan kotak abu-abu pengganti.

export const CATEGORIES = [
  "Pakaian Sekolah",
  "Alat Tulis",
  "Kerajinan",
  "Perlengkapan Sekolah",
  "Makanan",
  "Minuman",
  "Lainnya",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type SellerRole = "Guru" | "Siswa" | "Karyawan";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // Rupiah
  tag: string; // label kecil di pojok foto
  seller: { label: string; role: SellerRole };
  image?: string;
  description?: string; // deskripsi panjang (opsional)
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "seragam-batik-sekolah-resmi",
    name: "Seragam Batik Sekolah Resmi",
    category: "Pakaian Sekolah",
    price: 120000,
    tag: "Pakaian",
    seller: { label: "Bu Siti (Guru)", role: "Guru" },
    description:
      "Seragam batik resmi sekolah dengan motif khas yang dirancang oleh guru seni. Bahan katun premium yang adem, tidak mudah kusut, dan nyaman dipakai seharian. Jahitan rapi serta tersedia dalam berbagai ukuran.",
  },
  {
    id: "p2",
    slug: "lampu-led-cnc-akrilik-meja-belajar",
    name: "Lampu LED CNC Akrilik Meja Belajar",
    category: "Kerajinan",
    price: 145000,
    tag: "Karya",
    seller: { label: "Ahmad (Siswa XI)", role: "Siswa" },
    description:
      "Lampu meja belajar berbahan akrilik dengan ukiran CNC presisi. Menggunakan LED hemat energi yang ramah mata. Cocok untuk meja belajar, dekorasi kamar, maupun hadiah. Karya orisinal siswa jurusan teknik.",
  },
  {
    id: "p3",
    slug: "buku-tulis-sekolah-berlogo-set-3",
    name: "Buku Tulis Sekolah Berlogo (Set 3)",
    category: "Alat Tulis",
    price: 12000,
    tag: "Tulis",
    seller: { label: "Toko Koperasi (Karyawan)", role: "Karyawan" },
    description:
      "Paket 3 buku tulis dengan sampul berlogo sekolah. Kertas putih halus yang nyaman untuk menulis dan tidak tembus. Isi 38 lembar per buku, cocok untuk kebutuhan belajar harian.",
  },
  {
    id: "p4",
    slug: "tas-kanvas-sekolah-lukis-tangan-estetik",
    name: "Tas Kanvas Sekolah Lukis Tangan Estetik",
    category: "Kerajinan",
    price: 85000,
    tag: "Handmade",
    seller: { label: "Siti (Siswa XII)", role: "Siswa" },
    description:
      "Tas kanvas tebal dengan lukisan tangan orisinal, setiap tas memiliki keunikan tersendiri. Kuat menahan beban buku dan perlengkapan sekolah. Cocok untuk gaya kasual sehari-hari.",
  },
  {
    id: "p5",
    slug: "kaos-olahraga-sekolah-dry-fit",
    name: "Kaos Olahraga Sekolah Dry-Fit",
    category: "Pakaian Sekolah",
    price: 75000,
    tag: "Sport",
    seller: { label: "Pak Budi (Karyawan)", role: "Karyawan" },
    description:
      "Kaos olahraga berbahan dry-fit yang cepat menyerap keringat dan menjaga tubuh tetap kering saat beraktivitas. Ringan, elastis, dan nyaman untuk kegiatan olahraga di sekolah.",
  },
  {
    id: "p6",
    slug: "gantungan-kunci-akrilik-logo-sekolah",
    name: "Gantungan Kunci Akrilik Logo Sekolah",
    category: "Kerajinan",
    price: 18000,
    tag: "Akrilik",
    seller: { label: "Dina (Siswa X)", role: "Siswa" },
    description:
      "Gantungan kunci akrilik bening dengan cetakan logo sekolah. Ringan, tidak mudah pecah, dan cocok untuk kenang-kenangan atau hadiah teman. Bisa dipesan dalam jumlah banyak untuk acara sekolah.",
  },
  {
    id: "p7",
    slug: "topi-sekolah-bordir-lambang-sekolah",
    name: "Topi Sekolah Bordir Lambang Sekolah",
    category: "Pakaian Sekolah",
    price: 45000,
    tag: "Topi",
    seller: { label: "Bu Rina (Guru)", role: "Guru" },
    description:
      "Topi sekolah dengan bordir lambang resmi. Bahan katun twill yang kuat dan nyaman, dilengkapi tali pengatur ukuran di belakang. Cocok untuk kegiatan lapangan dan upacara.",
  },
  {
    id: "p8",
    slug: "pulpen-metal-custom-grafir-logo-sekolah",
    name: "Pulpen Metal Custom Grafir Logo Sekolah",
    category: "Alat Tulis",
    price: 15000,
    tag: "Pena",
    seller: { label: "Toko Koperasi (Karyawan)", role: "Karyawan" },
    description:
      "Pulpen berbahan metal dengan grafir logo sekolah. Tampilan elegan, tinta hitam halus, dan awet. Pilihan tepat sebagai suvenir resmi acara sekolah.",
  },
  {
    id: "p9",
    slug: "keripik-singkong-balado-200-g",
    name: "Keripik Singkong Balado 200 g",
    category: "Makanan",
    price: 15000,
    tag: "Camilan",
    seller: { label: "Kantin Sekolah (Karyawan)", role: "Karyawan" },
    description:
      "Keripik singkong renyah dengan bumbu balado pedas manis. Dibuat dari singkong pilihan dan digoreng segar. Dikemas dalam kemasan 200 gram yang praktis.",
  },
  {
    id: "p10",
    slug: "es-kopi-susu-botol-250-ml",
    name: "Es Kopi Susu Botol 250 ml",
    category: "Minuman",
    price: 12000,
    tag: "Minuman",
    seller: { label: "Rafi (Siswa XII)", role: "Siswa" },
    description:
      "Es kopi susu segar dalam kemasan botol 250 ml. Perpaduan kopi lokal dan susu yang pas, disajikan dingin. Praktis dibawa ke sekolah atau kegiatan belajar.",
  },
  {
    id: "p11",
    slug: "jaket-almamater-smk",
    name: "Jaket Almamater SMK",
    category: "Pakaian Sekolah",
    price: 150000,
    tag: "Jaket",
    seller: { label: "Bu Rina (Guru)", role: "Guru" },
    description:
      "Jaket almamater resmi dengan bordir emas di dada. Bahan parasut tebal berlapis furing yang hangat dan nyaman. Wajib dimiliki setiap siswa baru.",
  },
  {
    id: "p12",
    slug: "pensil-warna-set-kayu-12",
    name: "Pensil Warna Set Kayu (12 Warna)",
    category: "Alat Tulis",
    price: 30000,
    tag: "Warna",
    seller: { label: "Toko Koperasi (Karyawan)", role: "Karyawan" },
    description:
      "Set 12 pensil warna berbahan kayu berkualitas dengan warna cerah dan mudah diraut. Dikemas dalam kotak kayu eksklusif, cocok untuk pelajaran seni.",
  },
  {
    id: "p13",
    slug: "tote-bag-ecoprint-daun",
    name: "Tote Bag Ecoprint Daun",
    category: "Kerajinan",
    price: 65000,
    tag: "Eco",
    seller: { label: "Siti (Siswa XII)", role: "Siswa" },
    description:
      "Tote bag kanvas dengan motif ecoprint daun asli, setiap helai unik dan ramah lingkungan. Kuat untuk belanja maupun membawa buku. Karya ekstrakurikuler kriya.",
  },
  {
    id: "p14",
    slug: "dasi-sekolah-bordir-smk",
    name: "Dasi Sekolah Bordir SMK",
    category: "Pakaian Sekolah",
    price: 25000,
    tag: "Dasi",
    seller: { label: "Bu Siti (Guru)", role: "Guru" },
    description:
      "Dasi sekolah resmi dengan bordir logo. Bahan satin halus yang rapi dan tidak mudah kusut. Dilengkapi pengait praktis yang mudah dipakai.",
  },
  {
    id: "p15",
    slug: "penggaris-kayu-ukir-nama",
    name: "Penggaris Kayu Ukir Nama",
    category: "Alat Tulis",
    price: 10000,
    tag: "Ukur",
    seller: { label: "Ahmad (Siswa XI)", role: "Siswa" },
    description:
      "Penggaris kayu 30 cm dengan ukiran nama custom memakai mesin CNC. Skala jelas dan presisi, awet untuk penggunaan harian.",
  },
  {
    id: "p16",
    slug: "tempat-pensil-kanvas-gulung",
    name: "Tempat Pensil Kanvas Gulung",
    category: "Alat Tulis",
    price: 25000,
    tag: "Wadah",
    seller: { label: "Dina (Siswa X)", role: "Siswa" },
    description:
      "Tempat pensil kanvas model gulung dengan banyak slot dan tali pengikat. Praktis dibawa, muat puluhan alat tulis. Dijahit tangan dengan rapi.",
  },
  {
    id: "p17",
    slug: "kaos-kelas-angkatan-custom",
    name: "Kaos Kelas Angkatan Custom",
    category: "Pakaian Sekolah",
    price: 85000,
    tag: "Custom",
    seller: { label: "Rafi (Siswa XII)", role: "Siswa" },
    description:
      "Kaos angkatan custom dengan desain sablon sesuai permintaan kelas. Bahan cotton combed adem, tersedia sablon depan belakang. Minimal pemesanan 12 pcs.",
  },
  {
    id: "p18",
    slug: "brownies-panggang-topping-keju",
    name: "Brownies Panggang Topping Keju",
    category: "Makanan",
    price: 20000,
    tag: "Kue",
    seller: { label: "Kantin Sekolah (Karyawan)", role: "Karyawan" },
    description:
      "Brownies panggang lembut dengan topping keju melimpah. Dibuat segar setiap pagi di dapur kantin. Cocok untuk camilan istirahat maupun bingkisan.",
  },
  {
    id: "p19",
    slug: "jus-jambu-biji-segar-300-ml",
    name: "Jus Jambu Biji Segar 300 ml",
    category: "Minuman",
    price: 10000,
    tag: "Segar",
    seller: { label: "Kantin Sekolah (Karyawan)", role: "Karyawan" },
    description:
      "Jus jambu biji asli tanpa pengawet, dibuat dari buah pilihan setiap hari. Segar, sehat, dan mengenyangkan. Dikemas dalam gelas 300 ml praktis.",
  },
  {
    id: "p20",
    slug: "notebook-spiral-cover-batik",
    name: "Notebook Spiral Cover Batik",
    category: "Alat Tulis",
    price: 22000,
    tag: "Note",
    seller: { label: "Toko Koperasi (Karyawan)", role: "Karyawan" },
    description:
      "Notebook spiral dengan sampul motif batik eksklusif. Kertas bergaris 70 lembar yang nyaman ditulis. Cocok untuk catatan pelajaran maupun jurnal.",
  },
  {
    id: "p21",
    slug: "pin-enamel-logo-sekolah",
    name: "Pin Enamel Logo Sekolah",
    category: "Kerajinan",
    price: 12000,
    tag: "Pin",
    seller: { label: "Dina (Siswa X)", role: "Siswa" },
    description:
      "Pin enamel logo sekolah dengan warna cerah dan lapisan glossy. Peniti belakang kuat, cocok untuk tas, jaket, maupun koleksi.",
  },
  {
    id: "p22",
    slug: "syal-rajut-hangat-sekolah",
    name: "Syal Rajut Hangat Sekolah",
    category: "Pakaian Sekolah",
    price: 55000,
    tag: "Rajut",
    seller: { label: "Bu Rina (Guru)", role: "Guru" },
    description:
      "Syal rajut tangan berwarna biru navy dengan bordir logo kecil. Hangat dan lembut, cocok untuk kegiatan luar ruangan maupun di kelas ber-AC.",
  },
  {
    id: "p23",
    slug: "donat-kentang-gula-halus-isi-4",
    name: "Donat Kentang Gula Halus (Isi 4)",
    category: "Makanan",
    price: 8000,
    tag: "Donat",
    seller: { label: "Kantin Sekolah (Karyawan)", role: "Karyawan" },
    description:
      "Paket 4 donat kentang empuk bertabur gula halus. Digoreng fresh setiap istirahat pertama. Manisnya pas, favorit siswa semua angkatan.",
  },
  {
    id: "p24",
    slug: "es-teh-manis-botol-300-ml",
    name: "Es Teh Manis Botol 300 ml",
    category: "Minuman",
    price: 8000,
    tag: "Teh",
    seller: { label: "Rafi (Siswa XII)", role: "Siswa" },
    description:
      "Es teh manis klasik dalam botol 300 ml. Disaring dari teh melati pilihan, manisnya pas dan menyegarkan. Laris untuk teman makan siang.",
  },
];

/** Cari satu produk berdasarkan slug. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Cari satu produk berdasarkan ID. */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Produk lain di kategori yang sama (maksimal `limit`). */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = products.filter(
    (p) => p.category !== product.category && p.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
