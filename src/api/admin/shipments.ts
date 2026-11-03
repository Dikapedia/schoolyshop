import {
  ADMIN_SHIPMENT_MOCKS,
  ADMIN_TRACKING_STEP_MOCKS,
  DEFAULT_SHIPMENT_ADDRESS,
  SHIPMENT_OVERRIDES,
} from "../mocks/admin/shipments";

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

export type AdminTrackingStep = {
  title: string;
  time: string;
  description: string;
  state: "done" | "active" | "pending";
  badge: string;
};

export const SHIPMENT_STATUS_OPTIONS: ShipmentStatus[] = [
  "Siap Dikirim",
  "Dikirim",
  "Selesai",
];

export const COURIER_OPTIONS = [
  "SiCepat REG",
  "JNE REG",
  "J&T Express",
  "Biteship Instant",
];

export const BITESHIP_COURIER = "J&T Express";

/**
 * TODO(backend): ganti dengan GET /admin/shipments?page=&search=&status=.
 */
export function getAdminShipments(): AdminShipment[] {
  return ADMIN_SHIPMENT_MOCKS;
}

/**
 * TODO(backend): ganti dengan GET /admin/shipments/:id. Beberapa field
 * (alamat, layanan, waktu kirim) masih diisi nilai contoh.
 */
export function getAdminShipmentDetail(
  id: string | undefined,
): AdminShipmentDetail | null {
  if (!id) return null;
  const shipment = ADMIN_SHIPMENT_MOCKS.find((item) => item.id === id);
  if (!shipment) return null;

  const override = SHIPMENT_OVERRIDES[shipment.id] ?? {};
  const courier = override.courier ?? shipment.courier;
  const service =
    override.service ??
    (courier.startsWith("J&T") ? "Regular Service" : "REG Service");
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
    address: override.address ?? DEFAULT_SHIPMENT_ADDRESS,
    status: override.status ?? shipment.status,
  };
}

/**
 * TODO(backend): ganti dengan GET /admin/shipments/:id/tracking dan
 * petakan status kurir ke state UI.
 */
export function getAdminShipmentTracking(
  id: string | undefined,
): AdminTrackingStep[] {
  void id;
  return ADMIN_TRACKING_STEP_MOCKS;
}

/**
 * TODO(backend): nomor resi seharusnya dibuat oleh Biteship/kurir, bukan
 * diacak di browser.
 */
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
