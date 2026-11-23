import { adminRequest } from "./client";
import {
  fetchAllAdminPages,
  formatAdminDateTime,
  formatAdminRupiah,
} from "./shared";

export type ShipmentStatus = "Siap Dikirim" | "Dikirim" | "Selesai";

export type AdminShipment = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  total: string;
  courier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  itemCount?: number;
  hasShipment?: boolean;
};

export type AdminShipmentDetail = {
  id: string;
  orderId?: string;
  customer: string;
  recipient: string;
  phone: string;
  product: string;
  quantity: number;
  total: string;
  courier: string;
  service: string;
  trackingNumber: string;
  shippedAt: string;
  address: string;
  status: ShipmentStatus;
  labelUrl?: string | null;
  courierLink?: string | null;
  deliveredAt?: string;
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

type AdminShipmentRow = {
  id: number | null;
  orderId: number;
  customerName: string;
  recipientName: string;
  productName: string | null;
  itemCount: number;
  total: number;
  courier: string | null;
  service: string | null;
  trackingNumber: string | null;
  status: ShipmentStatus;
  orderStatus: string;
  shippedAt: string | null;
  createdAt: string;
};

type AdminShipmentDetailRow = {
  id: number;
  orderId: number;
  status: ShipmentStatus;
  orderStatus: string;
  labelUrl?: string | null;
  courierLink?: string | null;
  trackingNumber: string | null;
  courier: string | null;
  service: string | null;
  shippedAt: string;
  deliveredAt?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  recipientName: string;
  phone: string;
  address: string;
  total: number;
  itemCount: number;
  productName: string | null;
  items?: Array<{
    productName: string;
    qty: number;
  }>;
};

type TrackingEventRow = {
  id: number;
  status: string;
  location: string | null;
  description: string | null;
  occurredAt: string;
};

function mapShipmentRow(row: AdminShipmentRow): AdminShipment {
  return {
    id: String(row.id ?? row.orderId),
    orderId: String(row.orderId),
    customer: row.customerName,
    product: row.productName ?? "-",
    total: formatAdminRupiah(row.total),
    courier: row.courier || "Belum dipilih",
    trackingNumber: row.trackingNumber || "Belum tersedia",
    status: row.status,
    itemCount: row.itemCount,
    hasShipment: row.id !== null,
  };
}

export function mapShipmentDetail(
  row: AdminShipmentDetailRow,
): AdminShipmentDetail {
  return {
    id: String(row.id),
    orderId: String(row.orderId),
    customer: row.customerName,
    recipient: row.recipientName,
    phone: row.phone || "-",
    product: row.items?.[0]?.productName ?? row.productName ?? "-",
    quantity: row.itemCount ?? row.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0,
    total: formatAdminRupiah(row.total),
    courier: row.courier || "-",
    service: row.service || "-",
    trackingNumber: row.trackingNumber || "-",
    shippedAt: formatAdminDateTime(row.shippedAt),
    address: row.address || "-",
    status: row.status,
    labelUrl: row.labelUrl,
    courierLink: row.courierLink,
    deliveredAt: row.deliveredAt
      ? formatAdminDateTime(row.deliveredAt)
      : undefined,
  };
}

export type ShippingRateView = {
  id: string | number;
  code: string;
  courier: string;
  service: string;
  description: string;
  price: number;
  eta: string;
  badge: string | null;
};

/** GET /shipping/rates?destinationAreaId=&weight=&courier= */
export async function getAdminShippingRates(params: {
  destinationAreaId?: string;
  weight?: number;
  courier?: string;
} = {}): Promise<ShippingRateView[]> {
  const query = new URLSearchParams();
  if (params.destinationAreaId) query.set("destinationAreaId", params.destinationAreaId);
  if (params.weight) query.set("weight", String(params.weight));
  if (params.courier) query.set("courier", params.courier);

  const payload = await adminRequest<
    { data?: ShippingRateView[] } | ShippingRateView[]
  >(`/shipping/rates${query.toString() ? `?${query.toString()}` : ""}`);

  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return rows;
}

export async function getAdminShipments(): Promise<AdminShipment[]> {
  const rows = await fetchAllAdminPages<AdminShipmentRow>("/admin/shipments");
  return rows.map(mapShipmentRow);
}

/** GET /admin/shipments/:id */
export async function getAdminShipmentDetail(
  id: string,
): Promise<AdminShipmentDetail> {
  const row = await adminRequest<AdminShipmentDetailRow>(
    `/admin/shipments/${id}`,
  );
  return mapShipmentDetail(row);
}

/** GET /admin/shipments/:id/tracking */
export async function getAdminShipmentTracking(
  id: string,
): Promise<AdminTrackingStep[]> {
  const payload = await adminRequest<
    { data?: TrackingEventRow[] } | TrackingEventRow[]
  >(`/admin/shipments/${id}/tracking`);
  const events = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  // Backend mengirim event terbaru lebih dulu; UI menampilkan perjalanan
  // dari kejadian paling lama ke paling baru.
  const ordered = [...events].reverse();

  return ordered.map((event, index) => ({
    title: event.status,
    time: formatAdminDateTime(event.occurredAt),
    description:
      [event.location, event.description].filter(Boolean).join(" — ") ||
      event.status,
    state: index === ordered.length - 1 ? "active" : "done",
    badge: event.status,
  }));
}

/** POST /admin/shipments */
export async function createAdminShipment(
  orderId: string,
  courier = BITESHIP_COURIER,
  service = "Regular",
  shippingRateId?: string | number,
): Promise<AdminShipment> {
  const row = await adminRequest<AdminShipmentDetailRow>("/admin/shipments", {
    method: "POST",
    body: {
      orderId: Number(orderId),
      ...(shippingRateId !== undefined
        ? { shippingRateId }
        : { courier, service }),
    },
  });

  return {
    id: String(row.id),
    orderId: String(row.orderId),
    customer: row.customerName,
    product: row.productName ?? "-",
    total: formatAdminRupiah(row.total),
    courier: row.courier || "Belum dipilih",
    trackingNumber: row.trackingNumber || "Belum tersedia",
    status: row.status,
    itemCount: row.itemCount,
    hasShipment: true,
  };
}
