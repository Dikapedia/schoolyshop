import { z } from "zod";
import { request } from "./client";

const trackingRowSchema = z.object({
  orderId: z.number(),
  orderStatus: z.string(),
  courier: z.string(),
  service: z.string(),
  trackingNumber: z.string(),
  status: z.string(),
  recipientName: z.string(),
  shippingAddress: z.string(),
  history: z.array(
    z.object({
      id: z.number(),
      status: z.string(),
      location: z.string(),
      description: z.string(),
      occurredAt: z.string(),
    }),
  ),
});

export type TrackingHistory = {
  timestamp: string;
  location: string;
  description: string;
};

export type Tracking = {
  order_id: string;
  trackingNumber: string;
  courier: string;
  status: string;
  history: TrackingHistory[];
};

/** GET /shipments/track?q= */
export async function trackShipment(query: string): Promise<Tracking> {
  const row = await request(
    `/shipments/track?q=${encodeURIComponent(query)}`,
    {
      responseSchema: trackingRowSchema,
      statusMessages: { 404: "Pengiriman tidak ditemukan." },
    },
  );

  return {
    order_id: String(row.orderId),
    trackingNumber: row.trackingNumber,
    courier: [row.courier, row.service].filter(Boolean).join(" • "),
    status: row.status,
    // Backend mengirim event terbaru lebih dulu; UI menampilkan dari lama.
    history: [...row.history].reverse().map((event) => ({
      timestamp: new Date(event.occurredAt).toLocaleString("id-ID"),
      location: event.location || event.status,
      description: event.description,
    })),
  };
}
