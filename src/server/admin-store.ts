import type {
  AdminDashboardStat,
  AdminDashboardSummary,
  AdminNotification,
} from "@/api/admin/dashboard";
import type { AdminOrderDetail, AdminOrderItem } from "@/api/admin/order-details";
import type { AdminOrder } from "@/api/admin/orders";
import type {
  AdminCategory,
  AdminCategoryInput,
  AdminProduct,
  AdminProductInput,
} from "@/api/admin/products";
import type {
  AdminReturn,
} from "@/api/admin/returns";
import type { AdminReturnDetail } from "@/api/admin/return-details";
import type {
  SellerProductRow,
  SellerReportDetail,
  SellerSalesRow,
} from "@/api/admin/sales-report";
import type { Seller, SellerInput } from "@/api/admin/sellers";
import type {
  AdminShipment,
  AdminShipmentDetail,
  AdminTrackingStep,
} from "@/api/admin/shipments";
import type { AdminUser } from "@/api/admin/users";
import { CATEGORY_OPTIONS } from "@/api/admin/products";
import { ADMIN_ORDER_MOCKS } from "@/api/mocks/admin/orders";
import {
  DEFAULT_ORDER_ADDRESS,
  ORD_001_MOCK,
  PRODUCT_META,
} from "@/api/mocks/admin/order-details";
import { ADMIN_PRODUCT_MOCKS } from "@/api/mocks/admin/products";
import {
  ADMIN_RETURN_MOCKS,
} from "@/api/mocks/admin/returns";
import {
  DEFAULT_RETURN_PHOTOS,
  DETAIL_OVERRIDES,
} from "@/api/mocks/admin/return-details";
import {
  ISMI_PRODUCTS,
  SALES_REPORT_MOCKS,
} from "@/api/mocks/admin/sales-report";
import { SELLER_MOCKS } from "@/api/mocks/admin/sellers";
import {
  ADMIN_SHIPMENT_MOCKS,
  ADMIN_TRACKING_STEP_MOCKS,
  DEFAULT_SHIPMENT_ADDRESS,
  SHIPMENT_OVERRIDES,
} from "@/api/mocks/admin/shipments";
import { BASE_USER_MOCKS } from "@/api/mocks/admin/users";

export class AdminHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AdminHttpError";
  }
}

type OrderRecord = AdminOrder & {
  createdAt: string;
  buyerType: string;
  verifiedAt?: string;
};

type AdminState = {
  products: AdminProduct[];
  categories: AdminCategory[];
  sellers: Seller[];
  users: AdminUser[];
  orders: OrderRecord[];
  shipments: AdminShipment[];
  returns: AdminReturn[];
};

const BUYER_TYPES: Record<string, string> = {
  "Budi Santoso": "Siswa • XI TKJ 2",
  "Ghofuur Ramadhan": "Siswa • XII Mesin",
  "Hardika Pratama": "Siswa • X RPL",
  "Reza Firmansyah": "Guru • Olahraga",
  "Kaji Saputra": "Guru • Seni Budaya",
  "Dimas Prakoso": "Siswa • XII Akuntansi 1",
  "Fajar Nugroho": "Siswa • XI RPL 2",
  "Raka Mahendra": "Siswa • X DKV",
  "Yoga Pratama": "Siswa • XII TKJ 1",
  "Nabila Putri": "Siswa • XI Tata Busana",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Makanan: "Snack, roti, dan makanan ringan kantin",
  Minuman: "Air mineral, susu kemasan, jus buah",
  Fashion:
    "Seragam, batik kreasi mandiri siswa, tote bag, dan busana sekolah.",
  ATK: "Buku tulis, pulpen, pensil 2B, dan modul belajar praktis",
  Kerajinan: "Hasil karya seni, anyaman siswa, dan cenderamata",
  Lainnya: "Perlengkapan umum, payung, dan aksesoris sekolah",
};

const globalForAdmin = globalThis as unknown as {
  __schoolyAdminState?: AdminState;
};

function seedOrders(): OrderRecord[] {
  return ADMIN_ORDER_MOCKS.map((order, index) => {
    const day = String(10 - index).padStart(2, "0");
    return {
      ...order,
      buyerType: BUYER_TYPES[order.customer] ?? "Siswa",
      createdAt: `2026-10-${day}T09:30:00+07:00`,
    };
  });
}

function seedUsers(): AdminUser[] {
  return BASE_USER_MOCKS.map((user, index) => {
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
}

function createState(): AdminState {
  return {
    products: ADMIN_PRODUCT_MOCKS.map((product) => ({ ...product })),
    categories: CATEGORY_OPTIONS.map((name, index) => ({
      id: index + 1,
      name,
      description: CATEGORY_DESCRIPTIONS[name] ?? "",
    })),
    sellers: SELLER_MOCKS.map((seller) => ({ ...seller })),
    users: seedUsers(),
    orders: seedOrders(),
    shipments: ADMIN_SHIPMENT_MOCKS.map((shipment) => ({ ...shipment })),
    returns: ADMIN_RETURN_MOCKS.map((item) => ({ ...item })),
  };
}

function state(): AdminState {
  return (globalForAdmin.__schoolyAdminState ??= createState());
}

function parseRupiah(value: string): number {
  return Number(value.replace(/\D/g, "")) || 0;
}

function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date)} WIB`;
}

function now(): string {
  return formatDateTime(new Date().toISOString());
}

function nextId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function requireProduct(id: number): AdminProduct {
  const product = state().products.find((item) => item.id === id);
  if (!product) throw new AdminHttpError(404, "Produk tidak ditemukan.");
  return product;
}

function requireCategory(id: number): AdminCategory {
  const category = state().categories.find((item) => item.id === id);
  if (!category) throw new AdminHttpError(404, "Kategori tidak ditemukan.");
  return category;
}

function requireSeller(id: number): Seller {
  const seller = state().sellers.find((item) => item.id === id);
  if (!seller) throw new AdminHttpError(404, "Penjual tidak ditemukan.");
  return seller;
}

function requireOrder(id: string): OrderRecord {
  const order = state().orders.find(
    (item) => item.id.toLowerCase() === id.toLowerCase(),
  );
  if (!order) throw new AdminHttpError(404, "Pesanan tidak ditemukan.");
  return order;
}

function requireShipment(id: string): AdminShipment {
  const shipment = state().shipments.find(
    (item) => item.id.toLowerCase() === id.toLowerCase(),
  );
  if (!shipment) throw new AdminHttpError(404, "Pengiriman tidak ditemukan.");
  return shipment;
}

function requireReturn(id: string): AdminReturn {
  const item = state().returns.find(
    (entry) => entry.id.toLowerCase() === id.toLowerCase(),
  );
  if (!item) throw new AdminHttpError(404, "Pengembalian tidak ditemukan.");
  return item;
}

function sellerStyle(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("guru")) {
    return {
      typeClass: "bg-violet-50 text-violet-700",
      avatarClass: "bg-violet-50 text-violet-600",
    };
  }
  if (lower.includes("karyawan")) {
    return {
      typeClass: "bg-amber-50 text-amber-700",
      avatarClass: "bg-amber-50 text-amber-600",
    };
  }
  return {
    typeClass: "bg-blue-50 text-blue-700",
    avatarClass: "bg-blue-50 text-blue-600",
  };
}

function normalizeSellerType(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("guru")) {
    return lower.includes("(") ? type : "Guru (Seni Budaya)";
  }
  if (lower.includes("karyawan")) {
    return lower.includes("(") || lower.includes("/")
      ? type
      : "Karyawan / TU";
  }
  return lower.includes("(") ? type : "Siswa (Kelas XI-RPL)";
}

function sellerInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "PS"
  );
}

function sellerFromInput(input: SellerInput, id: number): Seller {
  const type = normalizeSellerType(input.type);
  return {
    id,
    initials: sellerInitials(input.name),
    name: input.name.trim(),
    business: input.business.trim() || `Usaha ${input.name.trim()}`,
    type,
    kk: input.kk.trim() || "320101010101****",
    whatsapp: input.whatsapp?.trim() ?? "",
    address: input.address.trim() || "Belum diisi",
    ...sellerStyle(type),
  };
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export function getDashboardSummary(): AdminDashboardSummary {
  const data = state();
  const paidOrders = data.orders.filter(
    (order) => order.paymentStatus === "Berhasil",
  );
  const revenue = paidOrders.reduce(
    (total, order) => total + parseRupiah(order.total),
    0,
  );
  const refund = SALES_REPORT_MOCKS.reduce(
    (total, seller) => total + seller.refund,
    0,
  );
  const pendingOrders = data.orders.filter(
    (order) => order.orderStatus === "Menunggu Verifikasi",
  ).length;
  const newProducts = data.products.filter((product) => product.isNew).length;

  const stats: AdminDashboardStat[] = [
    {
      label: "Total Produk",
      value: `${data.products.length} Produk`,
      subtext: `+${newProducts} produk baru minggu ini`,
    },
    {
      label: "Total Pesanan",
      value: `${data.orders.length} Pesanan`,
      subtext: `${pendingOrders} menunggu, ${
        data.orders.length - pendingOrders
      } diproses/selesai`,
    },
    {
      label: "Total Transaksi",
      value: `${data.orders.length} Transaksi`,
      subtext: `${paidOrders.length} lunas, ${
        data.orders.length - paidOrders.length
      } pending bayar`,
    },
    {
      label: "Total User",
      value: `${data.users.length} User`,
      subtext: "Siswa, Guru, dan Civitas",
    },
    {
      label: "Total Pendapatan",
      value: formatRupiah(revenue),
      subtext: `${formatRupiah(revenue - refund)} setelah retur`,
    },
  ];

  const notifications: AdminNotification[] = [];

  for (const order of data.orders.filter(
    (item) => item.orderStatus === "Menunggu Verifikasi",
  )) {
    notifications.push({
      id: `order-${order.id}`,
      title: "Pesanan menunggu verifikasi",
      detail: `${order.id} · ${order.customer}`,
      href: `/admin/pesanan/${order.id}`,
    });
  }

  for (const item of data.returns.filter(
    (entry) => entry.status === "Menunggu Persetujuan",
  )) {
    notifications.push({
      id: `return-${item.id}`,
      title: "Pengembalian baru diajukan",
      detail: `${item.id} · ${item.customer}`,
      href: `/admin/pengiriman/pengembalian/${item.id}`,
    });
  }

  const lowStock = data.products.filter(
    (product) => product.status === "Aktif" && product.stock <= 5,
  );
  if (lowStock.length > 0) {
    notifications.push({
      id: "low-stock",
      title: "Stok produk menipis",
      detail: `${lowStock.length} produk di bawah batas minimum`,
      href: "/admin/produk",
    });
  }

  return { stats, notifications: notifications.slice(0, 5) };
}

/* ------------------------------------------------------------------ */
/* Pesanan                                                             */
/* ------------------------------------------------------------------ */

export function listOrders(params: URLSearchParams): AdminOrder[] {
  const search = params.get("search")?.toLowerCase() ?? "";
  const paymentStatus = params.get("paymentStatus");
  const orderStatus = params.get("orderStatus");
  const limit = Number(params.get("limit") ?? 0);

  let orders = [...state().orders].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );

  if (search) {
    orders = orders.filter((order) =>
      `${order.id} ${order.customer} ${order.product}`
        .toLowerCase()
        .includes(search),
    );
  }
  if (paymentStatus) {
    orders = orders.filter((order) => order.paymentStatus === paymentStatus);
  }
  if (orderStatus) {
    orders = orders.filter((order) => order.orderStatus === orderStatus);
  }
  if (limit > 0) orders = orders.slice(0, limit);

  return orders.map(({ verifiedAt, ...order }) => {
    void verifiedAt;
    return order;
  });
}

export function getOrderDetail(id: string): AdminOrderDetail {
  const order = requireOrder(id);

  if (order.id === ORD_001_MOCK.id) {
    return {
      ...ORD_001_MOCK,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    };
  }

  const total = parseRupiah(order.total);
  const meta = PRODUCT_META[order.product] ?? {
    seller: "Supplier Sekolah",
    sku: `SCH-${order.product
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 3)
      .toUpperCase()}-001`,
  };
  const firstName = order.customer.split(" ")[0].toLowerCase();
  const paid = order.paymentStatus === "Berhasil";
  const items: AdminOrderItem[] = [
    {
      name: order.product,
      sku: meta.sku,
      seller: meta.seller,
      quantity: 1,
      unitPrice: total,
      subtotal: total,
    },
  ];

  return {
    id: order.id,
    buyer: {
      name: order.customer,
      type: order.buyerType.includes("Guru") ? "Guru" : "Pelajar / Siswa",
      contact: "0812-0000-0000",
      email: `${firstName}@schooly.id`,
      orderedAt: formatDateTime(order.createdAt),
      address: DEFAULT_ORDER_ADDRESS,
    },
    transaction: {
      provider: "Midtrans Gateway",
      method: "Midtrans (BCA VA / QRIS)",
      transactionId: `TRX-${order.id.replace("-", "")}`,
      paidAt: paid ? formatDateTime(order.createdAt) : "-",
      settledLabel: paid
        ? "Midtrans Settle Confirmed"
        : "Menunggu Pembayaran",
    },
    warehouse: "Semarang Central",
    verifiedAt: order.verifiedAt ?? "-",
    items,
    summary: {
      subtotal: total,
      shippingLabel: "Promo Kampus",
      shippingCost: 0,
      total,
    },
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
  };
}

export function verifyOrder(id: string): AdminOrder {
  const order = requireOrder(id);
  order.orderStatus = "Diproses";
  order.verifiedAt = now();
  return {
    id: order.id,
    customer: order.customer,
    product: order.product,
    total: order.total,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    buyerType: order.buyerType,
    createdAt: order.createdAt,
  };
}

/* ------------------------------------------------------------------ */
/* Produk & kategori                                                   */
/* ------------------------------------------------------------------ */

export function listProducts(): AdminProduct[] {
  return state().products;
}

export function createProduct(input: AdminProductInput): AdminProduct {
  if (!input.name?.trim()) {
    throw new AdminHttpError(422, "Nama produk wajib diisi.");
  }
  const product: AdminProduct = {
    ...input,
    id: nextId(state().products),
    name: input.name.trim(),
    price: Number(input.price) || 0,
    stock: Number(input.stock) || 0,
    isNew: true,
  };
  for (const item of state().products) item.isNew = false;
  state().products = [product, ...state().products];
  return product;
}

export function updateProduct(
  id: number,
  input: Partial<AdminProductInput>,
): AdminProduct {
  const product = requireProduct(id);
  Object.assign(product, input, {
    price:
      input.price === undefined ? product.price : Number(input.price) || 0,
    stock:
      input.stock === undefined ? product.stock : Number(input.stock) || 0,
  });
  return product;
}

export function deleteProduct(id: number): void {
  requireProduct(id);
  state().products = state().products.filter((item) => item.id !== id);
}

export function listCategories(): AdminCategory[] {
  return state().categories;
}

export function createCategory(input: AdminCategoryInput): AdminCategory {
  const name = input.name?.trim();
  if (!name) throw new AdminHttpError(422, "Nama kategori wajib diisi.");
  if (
    state().categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    throw new AdminHttpError(409, "Kategori sudah ada.");
  }
  const category: AdminCategory = {
    id: nextId(state().categories),
    name,
    description: input.description?.trim() ?? "",
  };
  state().categories = [...state().categories, category];
  return category;
}

export function updateCategory(
  id: number,
  input: Partial<AdminCategoryInput>,
): AdminCategory {
  const category = requireCategory(id);
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new AdminHttpError(422, "Nama kategori wajib diisi.");
    const duplicate = state().categories.some(
      (item) =>
        item.id !== id && item.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) throw new AdminHttpError(409, "Kategori sudah ada.");

    if (name !== category.name) {
      for (const product of state().products) {
        if (product.category === category.name) product.category = name;
      }
    }
    category.name = name;
  }
  if (input.description !== undefined) {
    category.description = input.description.trim();
  }
  return category;
}

export function deleteCategory(id: number): void {
  const category = requireCategory(id);
  const used = state().products.some(
    (product) => product.category === category.name,
  );
  if (used) {
    throw new AdminHttpError(
      409,
      "Kategori masih dipakai produk dan tidak dapat dihapus.",
    );
  }
  state().categories = state().categories.filter((item) => item.id !== id);
}

/* ------------------------------------------------------------------ */
/* Penjual                                                             */
/* ------------------------------------------------------------------ */

export function listSellers(): Seller[] {
  return state().sellers;
}

export function createSeller(input: SellerInput): Seller {
  if (!input.name?.trim()) {
    throw new AdminHttpError(422, "Nama penjual wajib diisi.");
  }
  const seller = sellerFromInput(
    { ...input, business: input.business ?? "" },
    nextId(state().sellers),
  );
  state().sellers = [seller, ...state().sellers];
  return seller;
}

export function updateSeller(
  id: number,
  input: Partial<SellerInput>,
): Seller {
  const seller = requireSeller(id);
  const merged: SellerInput = {
    name: input.name ?? seller.name,
    business: input.business ?? seller.business,
    type: input.type ?? seller.type,
    kk: input.kk ?? seller.kk,
    address: input.address ?? seller.address,
    whatsapp: input.whatsapp ?? seller.whatsapp,
  };
  Object.assign(seller, sellerFromInput(merged, id));
  return seller;
}

/* ------------------------------------------------------------------ */
/* User                                                                */
/* ------------------------------------------------------------------ */

export function listUsers(): AdminUser[] {
  return state().users;
}

export function getUser(id: string): AdminUser {
  const user = state().users.find(
    (item) => item.id.toLowerCase() === id.toLowerCase(),
  );
  if (!user) throw new AdminHttpError(404, "User tidak ditemukan.");
  return user;
}

/* ------------------------------------------------------------------ */
/* Pengiriman                                                          */
/* ------------------------------------------------------------------ */

function trackingNumber(courier: string): string {
  const prefix = courier.startsWith("JNE")
    ? "JNE"
    : courier.startsWith("J&T")
      ? "JT"
      : courier.startsWith("Biteship")
        ? "BTS"
        : "SC";
  return `${prefix}${String(Date.now()).slice(-10)}`;
}

function shipmentDetail(shipment: AdminShipment): AdminShipmentDetail {
  const override = SHIPMENT_OVERRIDES[shipment.id] ?? {};
  const courier = override.courier ?? shipment.courier;
  const service =
    override.service ??
    (courier.startsWith("J&T") ? "Regular Service" : "REG Service");
  const tracking =
    override.trackingNumber ??
    (shipment.trackingNumber === "Belum tersedia"
      ? "Belum tersedia"
      : shipment.trackingNumber);

  return {
    id: shipment.id,
    recipient: shipment.customer,
    product: shipment.product,
    quantity: 1,
    total: shipment.total,
    courier,
    service,
    trackingNumber: tracking,
    shippedAt: override.shippedAt ?? "14 Oktober 2026, 14:30 WIB",
    address: override.address ?? DEFAULT_SHIPMENT_ADDRESS,
    status: override.status ?? shipment.status,
  };
}

export function listShipments(): AdminShipment[] {
  return state().shipments;
}

export function getShipment(id: string): AdminShipmentDetail {
  return shipmentDetail(requireShipment(id));
}

export function getShipmentTracking(id: string): AdminTrackingStep[] {
  const shipment = requireShipment(id);
  if (shipment.id === "ORD-001") return ADMIN_TRACKING_STEP_MOCKS;

  const created = `Pengiriman ${shipment.id} dibuat untuk ${shipment.courier}.`;
  const base: AdminTrackingStep = {
    title: "Pengiriman berhasil dibuat",
    time: "Hari ini",
    description: created,
    state: "done",
    badge: "Selesai",
  };

  if (shipment.status === "Siap Dikirim") {
    return [
      {
        ...base,
        state: "pending",
        badge: "Menunggu",
        description:
          "Pengiriman belum dikonfirmasi. Pilih kurir untuk membuat resi.",
      },
    ];
  }

  const steps: AdminTrackingStep[] = [
    base,
    {
      title: "Paket dijemput kurir",
      time: "Hari ini",
      description: `Paket diserahkan kepada ${shipment.courier} dengan resi ${shipment.trackingNumber}.`,
      state: "done",
      badge: "Selesai",
    },
    {
      title: "Paket dalam perjalanan",
      time: "Hari ini",
      description: `Paket menuju alamat ${shipment.customer}.`,
      state: shipment.status === "Selesai" ? "done" : "active",
      badge: shipment.status === "Selesai" ? "Selesai" : "Sedang berlangsung",
    },
  ];

  if (shipment.status === "Selesai") {
    steps.push({
      title: "Paket diterima pembeli",
      time: "Hari ini",
      description: `Paket telah diterima oleh ${shipment.customer}.`,
      state: "done",
      badge: "Selesai",
    });
  } else {
    steps.push({
      title: "Paket diterima pembeli",
      time: "Menunggu konfirmasi",
      description: `Menunggu proses pengantaran ke ${shipment.customer}.`,
      state: "pending",
      badge: "Menunggu",
    });
  }

  return steps;
}

export function createShipment(orderId: string, courier: string): AdminShipment {
  const order = requireOrder(orderId);
  const existing = state().shipments.find((item) => item.id === order.id);

  if (existing) {
    if (existing.trackingNumber === "Belum tersedia") {
      existing.courier = courier;
      existing.trackingNumber = trackingNumber(courier);
      existing.status = "Dikirim";
    }
    return existing;
  }

  const shipment: AdminShipment = {
    id: order.id,
    customer: order.customer,
    product: order.product,
    total: order.total,
    courier,
    trackingNumber: trackingNumber(courier),
    status: "Dikirim",
  };
  state().shipments = [shipment, ...state().shipments];
  return shipment;
}

/* ------------------------------------------------------------------ */
/* Pengembalian                                                        */
/* ------------------------------------------------------------------ */

export function listReturns(): AdminReturn[] {
  return state().returns;
}

export function getReturnDetail(id: string): AdminReturnDetail {
  const base = requireReturn(id);
  const override = DETAIL_OVERRIDES[base.id] ?? {};

  return {
    id: base.id,
    status: base.status,
    submittedAt: base.submittedAt,
    decisionTime: "16 Okt 2026, 20:30 WIB",
    customer: base.customer,
    phone: "0812-3456-7890",
    verified: true,
    orderId: base.id,
    paymentMethod: "Virtual Account Mandiri / (Lunas)",
    product: base.product,
    price: "Rp120.000",
    size: "Size L",
    quantity: 1,
    sku: "SCH-BTK-001",
    category: "Ukuran Tidak Sesuai",
    reason: base.reason,
    buyerNote: "Mohon dibantu untuk memproses pengembalian barang ini.",
    photos: DEFAULT_RETURN_PHOTOS,
    refundMethod: "Tukar Size / Dana",
    ...override,
  };
}

export function approveReturn(id: string): AdminReturn {
  const item = requireReturn(id);
  item.status = "Menunggu Barang Kembali";
  return item;
}

export function rejectReturn(id: string, _reason?: string): AdminReturn {
  void _reason;
  const item = requireReturn(id);
  item.status = "Ditolak";
  return item;
}

/* ------------------------------------------------------------------ */
/* Laporan                                                             */
/* ------------------------------------------------------------------ */

export function listSalesReport(): SellerSalesRow[] {
  return SALES_REPORT_MOCKS;
}

export function getSalesReportDetail(id: string): SellerReportDetail {
  const seller = SALES_REPORT_MOCKS.find((row) => String(row.id) === id);
  if (!seller) throw new AdminHttpError(404, "Laporan penjual tidak ditemukan.");

  const products: SellerProductRow[] =
    seller.id === 1
      ? ISMI_PRODUCTS
      : [
          {
            id: 1,
            name: `Produk ${seller.business}`,
            sku: `SCH-${String(seller.id).padStart(3, "0")}`,
            category: "Kriya & Kerajinan",
            unitPrice: Math.round(seller.total / seller.sold),
            sold: seller.sold,
            total: seller.total,
            refund: seller.refund,
            net: seller.net,
            status:
              seller.refund > 0 ? "Selesai & Sebagian Retur" : "Selesai",
            statusTone: seller.refund > 0 ? "warning" : "success",
          },
        ];

  const totals = products.reduce(
    (acc, product) => ({
      sold: acc.sold + product.sold,
      total: acc.total + product.total,
      refund: acc.refund + product.refund,
      net: acc.net + product.net,
    }),
    { sold: 0, total: 0, refund: 0, net: 0 },
  );

  return {
    seller,
    period: "01 Okt 2026 - 31 Okt 2026",
    products,
    totals,
  };
}
