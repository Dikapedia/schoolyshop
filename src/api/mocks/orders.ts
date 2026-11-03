import type { Order } from "../orders";

/**
 * Pesanan demo untuk akun `user-1`.
 *
 * TODO(backend): hapus seed ini setelah GET /orders tersedia.
 */
export const SEED_ORDERS: Record<string, Order[]> = {
  "user-1": [
    {
      id: "order-001",
      date: "2025-09-15T10:30:00.000Z",
      items: [
        {
          productId: "prod-101",
          name: "Buku Matematika SD",
          qty: 2,
          price: 50000,
        },
        {
          productId: "prod-102",
          name: "Alat Tulis 10 pcs",
          qty: 1,
          price: 25000,
        },
      ],
      total: 125000,
      status: "Selesai",
    },
    {
      id: "order-002",
      date: "2025-10-01T14:00:00.000Z",
      items: [
        {
          productId: "prod-103",
          name: "Tas Sekolah",
          qty: 1,
          price: 200000,
        },
      ],
      total: 200000,
      status: "Dikirim",
    },
    {
      id: "order-003",
      date: "2025-09-20T09:15:00.000Z",
      items: [
        {
          productId: "prod-104",
          name: "Baju Seragam",
          qty: 2,
          price: 75000,
        },
      ],
      total: 150000,
      status: "Dalam Pengembalian",
    },
  ],
};
