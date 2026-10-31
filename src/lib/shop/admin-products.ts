// DATA CONTOH. Ganti dengan data dari API backend saat sudah tersedia.

export type ProductStatus = "Aktif" | "Nonaktif";

export type AdminProduct = {
  id: number;
  name: string;
  seller: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  isNew?: boolean;
};

export const SELLER_OPTIONS = [
  "Alwan",
  "Ismi",
  "Intan",
  "Budi",
  "Novita",
  "Ghofuur",
  "Kaji Ecoprint",
  "Penjual Siswa",
];

export const CATEGORY_OPTIONS = [
  "Makanan",
  "Minuman",
  "Fashion",
  "ATK",
  "Kerajinan",
  "Lainnya",
];

export const initialAdminProducts: AdminProduct[] = [
  {
    id: 1,
    name: "Tote Bag Batik",
    seller: "Alwan",
    category: "Kerajinan",
    price: 35000,
    stock: 15,
    status: "Aktif",
    description:
      "Tote bag motif batik khas kreasi kriya siswa bahan kanvas premium kuat dan ramah lingkungan.",
  },
  {
    id: 2,
    name: "Tas Batik",
    seller: "Ismi",
    category: "Fashion",
    price: 75000,
    stock: 8,
    status: "Aktif",
    description:
      "Tas batik dengan motif parang klasik, dijahit rapi oleh siswa jurusan tata busana dengan bahan kain pilihan.",
  },
  {
    id: 3,
    name: "Dompet Batik",
    seller: "Intan",
    category: "Kerajinan",
    price: 25000,
    stock: 20,
    status: "Aktif",
    description:
      "Dompet batik berukuran praktis dengan lapisan dalam yang kuat, cocok untuk kebutuhan sehari-hari.",
  },
  {
    id: 4,
    name: "Tempat Pensil Batik",
    seller: "Budi",
    category: "ATK",
    price: 15000,
    stock: 0,
    status: "Nonaktif",
    description:
      "Tempat pensil bermotif batik dengan bahan kanvas tebal, ringan dan muat banyak alat tulis.",
  },
  {
    id: 5,
    name: "Roti Maryam Coklat Keju Lumer",
    seller: "Ghofuur",
    category: "Makanan",
    price: 12000,
    stock: 30,
    status: "Aktif",
    description:
      "Roti maryam dengan isian coklat dan keju lumer, dibuat segar oleh siswa program wirausaha muda.",
  },
  {
    id: 6,
    name: "Mug Ecoprint",
    seller: "Kaji Ecoprint",
    category: "Kerajinan",
    price: 25000,
    stock: 10,
    status: "Aktif",
    isNew: true,
    description:
      "Mug ecoprint adalah mug atau cangkir yang dihias menggunakan teknik ecoprint, yaitu teknik mencetak motif alami dari daun, bunga, atau tumbuhan pada permukaan benda.",
  },
];
