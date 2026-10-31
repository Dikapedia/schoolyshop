export type ShipmentStatus = "Siap Dikirim" | "Dikirim" | "Selesai";

export type AdminShipment = {
  id: string;
  customer: string;
  product: string;
  total: string;
  courier: string;
  trackingNumber: string;
  status: ShipmentStatus;
};

export const ADMIN_SHIPMENTS: AdminShipment[] = [
  {
    id: "ORD-001",
    customer: "Budi Santoso",
    product: "Kemeja Batik",
    total: "Rp120.000",
    courier: "Belum dipilih",
    trackingNumber: "Belum tersedia",
    status: "Siap Dikirim",
  },
  {
    id: "ORD-003",
    customer: "Hardika Pratama",
    product: "Dompet Batik",
    total: "Rp65.000",
    courier: "Belum dipilih",
    trackingNumber: "Belum tersedia",
    status: "Siap Dikirim",
  },
  {
    id: "ORD-004",
    customer: "Reza Firmansyah",
    product: "Tas Anyaman",
    total: "Rp95.000",
    courier: "SiCepat REG",
    trackingNumber: "SC910284719",
    status: "Dikirim",
  },
  {
    id: "ORD-006",
    customer: "Dimas Prakoso",
    product: "Gantungan Kunci Kayu",
    total: "Rp35.000",
    courier: "SiCepat REG",
    trackingNumber: "SC820194812",
    status: "Selesai",
  },
  {
    id: "ORD-009",
    customer: "Yoga Pratama",
    product: "Dompet Batik",
    total: "Rp55.000",
    courier: "JNE REG",
    trackingNumber: "JNE71829013",
    status: "Dikirim",
  },
];

export type AdminShipmentDetail = {
  id: string;
  recipient: string;
  product: string;
  quantity: number;
  total: string;
  courier: string;
  service: string;
  trackingNumber: string;
  shippedAt: string;
  address: string;
  status: ShipmentStatus;
};

const SHIPMENT_OVERRIDES: Record<string, Partial<AdminShipmentDetail>> = {
  "ORD-001": {
    courier: "J&T Express",
    service: "Regular Service",
    trackingNumber: "JT8829103841",
    shippedAt: "14 Oktober 2026, 14:30 WIB",
    address:
      "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150",
    status: "Dikirim",
  },
};

const DEFAULT_ADDRESS =
  "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150";

export function getAdminShipmentDetail(id: string | undefined): AdminShipmentDetail | null {
  if (!id) return null;
  const shipment = ADMIN_SHIPMENTS.find((item) => item.id === id);
  if (!shipment) return null;

  const override = SHIPMENT_OVERRIDES[shipment.id] ?? {};
  const courier = override.courier ?? shipment.courier;
  const service = override.service ?? (courier.startsWith("J&T") ? "Regular Service" : "REG Service");
  const trackingNumber =
    override.trackingNumber ??
    (shipment.trackingNumber === "Belum tersedia"
      ? createTrackingNumber(courier)
      : shipment.trackingNumber);

  return {
    id: shipment.id,
    recipient: shipment.customer,
    product: shipment.product,
    quantity: 1,
    total: shipment.total,
    courier,
    service,
    trackingNumber,
    shippedAt: override.shippedAt ?? "14 Oktober 2026, 14:30 WIB",
    address: override.address ?? DEFAULT_ADDRESS,
    status: override.status ?? shipment.status,
  };
}

export const SHIPMENT_STATUS_OPTIONS: ShipmentStatus[] = [
  "Siap Dikirim",
  "Dikirim",
  "Selesai",
];

export const COURIER_OPTIONS = ["SiCepat REG", "JNE REG", "J&T Express", "Biteship Instant"];

export const BITESHIP_COURIER = "J&T Express";

export function createTrackingNumber(courier: string) {
  const prefix = courier.startsWith("JNE")
    ? "JNE"
    : courier.startsWith("J&T")
      ? "JT"
      : courier.startsWith("Biteship")
        ? "BTS"
        : "SC";
  const suffix = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${suffix}`;
}
