export type AdminUser = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "Aktif" | "Nonaktif";
  role: string;
  verified: boolean;
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
};

type BaseUser = Pick<AdminUser, "id" | "name" | "email" | "joinedAt" | "status">;

const BASE_USERS: BaseUser[] = [
  { id: "USR001", name: "Gizza Ayuningtyas Kusumawardhani", email: "gizza.ayuningtyas@example.com", joinedAt: "2026-08-12", status: "Aktif" },
  { id: "USR002", name: "Dilah Sekar Arum Puspitasari", email: "dilah.sekar@gmail.com", joinedAt: "2024-01-15", status: "Aktif" },
  { id: "USR003", name: "Syifa Kirana Dewi Larasati", email: "syifa.larasati@gmail.com", joinedAt: "2024-01-18", status: "Aktif" },
  { id: "USR004", name: "Hardika Raden Arya Wicaksana", email: "hardika.arya@gmail.com", joinedAt: "2024-01-20", status: "Aktif" },
  { id: "USR005", name: "Rizal Aditya Danarjaya", email: "rizal.danarjaya@gmail.com", joinedAt: "2024-01-22", status: "Aktif" },
  { id: "USR006", name: "Imah Nuraini Sekar Kinasih", email: "imah.kinasih@gmail.com", joinedAt: "2024-01-25", status: "Aktif" },
  { id: "USR007", name: "Alin Citra Maharani Kusumastuti", email: "alin.kusumastuti@gmail.com", joinedAt: "2024-01-28", status: "Aktif" },
  { id: "USR008", name: "Reza Bagaskara Wiratama", email: "reza.wiratama@gmail.com", joinedAt: "2024-02-01", status: "Aktif" },
  { id: "USR009", name: "Danang Prabaswara Adinata", email: "danang.prabaswara@gmail.com", joinedAt: "2024-02-04", status: "Aktif" },
  { id: "USR010", name: "Nabila Putri Permatasari", email: "nabila.putri@gmail.com", joinedAt: "2024-02-08", status: "Aktif" },
  { id: "USR011", name: "Bagas Arya Pratama", email: "bagas.arya@gmail.com", joinedAt: "2024-02-12", status: "Aktif" },
  { id: "USR012", name: "Citra Dewi Anggraini", email: "citra.dewi@gmail.com", joinedAt: "2024-02-15", status: "Aktif" },
  { id: "USR013", name: "Fajar Nugroho Saputra", email: "fajar.nugroho@gmail.com", joinedAt: "2024-02-19", status: "Aktif" },
  { id: "USR014", name: "Intan Puspita Sari", email: "intan.puspita@gmail.com", joinedAt: "2024-02-22", status: "Aktif" },
  { id: "USR015", name: "Bayu Adi Wicaksono", email: "bayu.adi@gmail.com", joinedAt: "2024-02-26", status: "Aktif" },
  { id: "USR016", name: "Salsabila Rahma Putri", email: "salsabila.rahma@gmail.com", joinedAt: "2024-03-01", status: "Aktif" },
  { id: "USR017", name: "Raden Mas Panji Saputra", email: "panji.saputra@gmail.com", joinedAt: "2024-03-05", status: "Aktif" },
  { id: "USR018", name: "Anisa Fitriani", email: "anisa.fitriani@gmail.com", joinedAt: "2024-03-08", status: "Aktif" },
  { id: "USR019", name: "Dimas Prakoso Adi", email: "dimas.prakoso@gmail.com", joinedAt: "2024-03-12", status: "Aktif" },
  { id: "USR020", name: "Nadia Ayu Lestari", email: "nadia.ayu@gmail.com", joinedAt: "2024-03-15", status: "Aktif" },
  { id: "USR021", name: "Rama Dwi Saputra", email: "rama.dwi@gmail.com", joinedAt: "2024-03-19", status: "Aktif" },
  { id: "USR022", name: "Putri Amelia Sari", email: "putri.amelia@gmail.com", joinedAt: "2024-03-22", status: "Aktif" },
  { id: "USR023", name: "Andika Pratama", email: "andika.pratama@gmail.com", joinedAt: "2024-03-26", status: "Aktif" },
  { id: "USR024", name: "Larasati Wulandari", email: "larasati.wulan@gmail.com", joinedAt: "2024-03-29", status: "Aktif" },
  { id: "USR025", name: "Yoga Pratama Nugraha", email: "yoga.pratama@gmail.com", joinedAt: "2024-04-02", status: "Aktif" },
  { id: "USR026", name: "Melati Kusuma Dewi", email: "melati.kusuma@gmail.com", joinedAt: "2024-04-05", status: "Aktif" },
  { id: "USR027", name: "Farhan Maulana", email: "farhan.maulana@gmail.com", joinedAt: "2024-04-09", status: "Aktif" },
  { id: "USR028", name: "Aisyah Nur Fadillah", email: "aisyah.nur@gmail.com", joinedAt: "2024-04-12", status: "Aktif" },
  { id: "USR029", name: "Bima Sakti Pratama", email: "bima.sakti@gmail.com", joinedAt: "2024-04-16", status: "Aktif" },
  { id: "USR030", name: "Zahra Aulia Putri", email: "zahra.aulia@gmail.com", joinedAt: "2024-04-19", status: "Aktif" },
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_LONG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatUserDate(isoDate: string, style: "short" | "long" = "short"): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (style === "long") {
    return `${day} ${MONTHS_LONG[month - 1]} ${year}`;
  }
  return `${String(day).padStart(2, "0")} ${MONTHS_SHORT[month - 1]} ${year}`;
}

export const ADMIN_USERS: AdminUser[] = BASE_USERS.map((user, index) => {
  const totalOrders = index === 0 ? 4 : (index % 5) + 1;
  const processingOrders = 1;

  return {
    ...user,
    role: "Pengguna Umum / Pembeli",
    verified: true,
    totalOrders,
    completedOrders: totalOrders - processingOrders,
    processingOrders,
  };
});
