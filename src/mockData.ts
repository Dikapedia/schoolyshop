"use client";

export function initMockData() {
  const flagKey = "schooly.mock.initialized";
  if (window.localStorage.getItem(flagKey) === "true") return;
  window.localStorage.setItem(flagKey, "true");

  // User ID
  const userId = "user-1";

  // Orders
  const orders = [
    // Completed order (already received)
    {
      id: "order-001",
      date: "2025-09-15T10:30:00.000Z",
      items: [
        { productId: "prod-101", name: "Buku Matematika SD", qty: 2, price: 50000 },
        { productId: "prod-102", name: "Alat Tulis 10 pcs", qty: 1, price: 25000 }
      ],
      total: 125000,
      status: "Selesai"
    },
    // Order currently being shipped
    {
      id: "order-002",
      date: "2025-10-01T14:00:00.000Z",
      items: [
        { productId: "prod-103", name: "Tas Sekolah", qty: 1, price: 200000 }
      ],
      total: 200000,
      status: "Dikirim"
    },
    // Order with return request in progress
    {
      id: "order-003",
      date: "2025-09-20T09:15:00.000Z",
      items: [
        { productId: "prod-104", name: "Baju Seragam", qty: 2, price: 75000 }
      ],
      total: 150000,
      status: "Dalam Pengembalian"
    }
  ];

  // Returns
  const returns = [
    {
      orderId: "order-003",
      items: [
        { productId: "prod-104", name: "Baju Seragam", qty: 2, reason: "Ukuran tidak cocok" }
      ],
      submittedAt: "2025-09-22T12:00:00.000Z"
    }
  ];

  // Invoices (simple string placeholder)
  const invoices = {
    "order-001": "invoice-001.pdf",
    "order-002": "invoice-002.pdf",
    "order-003": "invoice-003.pdf"
  };

  // Store in localStorage per user
  const ordersKey = "schooly.orders";
  const returnsKey = "schooly.returns";
  const invoicesKey = "schooly.invoices";

  const existingOrders = JSON.parse(window.localStorage.getItem(ordersKey) || "{}") as Record<string, any[]>;
  existingOrders[userId] = orders;
  window.localStorage.setItem(ordersKey, JSON.stringify(existingOrders));

  const existingReturns = JSON.parse(window.localStorage.getItem(returnsKey) || "{}") as Record<string, any[]>;
  existingReturns[userId] = returns;
  window.localStorage.setItem(returnsKey, JSON.stringify(existingReturns));

  const existingInvoices = JSON.parse(window.localStorage.getItem(invoicesKey) || "{}") as Record<string, Record<string, string>>;
  existingInvoices[userId] = invoices;
  window.localStorage.setItem(invoicesKey, JSON.stringify(existingInvoices));
}
