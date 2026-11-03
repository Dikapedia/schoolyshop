import type { ReturnRequest } from "../returns";

/**
 * Permintaan pengembalian demo untuk akun `user-1`.
 *
 * TODO(backend): hapus seed ini setelah GET /returns tersedia.
 */
export const SEED_RETURNS: Record<string, ReturnRequest[]> = {
  "user-1": [
    {
      orderId: "order-003",
      items: [
        {
          productId: "prod-104",
          name: "Baju Seragam",
          qty: 2,
          reason: "Ukuran tidak cocok",
        },
      ],
      submittedAt: "2025-09-22T12:00:00.000Z",
    },
  ],
};
