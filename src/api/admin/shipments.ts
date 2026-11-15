import { request } from "../client";

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

/** GET /admin/shipments */
export function getAdminShipments(): Promise<AdminShipment[]> {
  return request<AdminShipment[]>("/admin/shipments");
}

/** GET /admin/shipments/:id */
export function getAdminShipmentDetail(
  id: string,
): Promise<AdminShipmentDetail> {
  return request<AdminShipmentDetail>(`/admin/shipments/${id}`);
}

/** GET /admin/shipments/:id/tracking */
export function getAdminShipmentTracking(
  id: string,
): Promise<AdminTrackingStep[]> {
  return request<AdminTrackingStep[]>(`/admin/shipments/${id}/tracking`);
}

/** POST /admin/shipments */
export function createAdminShipment(
  orderId: string,
  courier = BITESHIP_COURIER,
): Promise<AdminShipment> {
  return request<AdminShipment>("/admin/shipments", {
    method: "POST",
    body: { orderId, courier },
  });
}
