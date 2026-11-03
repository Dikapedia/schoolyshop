import { TRACKING_MOCK } from "./mocks/shipments";

export type TrackingHistory = {
  timestamp: string;
  location: string;
  description: string;
};

export type Tracking = {
  order_id: string;
  courier: string;
  status: string;
  history: TrackingHistory[];
};

/**
 * Lacak pengiriman berdasarkan nomor resi atau ID pesanan.
 *
 * TODO(backend): ganti dengan GET /shipments/track?q=...; konfirmasi juga
 * format timestamp, status kurir, dan apakah respons bisa berisi banyak
 * paket per pesanan.
 */
export function trackShipment(query: string): Tracking {
  return {
    order_id: query,
    ...TRACKING_MOCK,
  };
}
