import { request } from "../client";
import { paymentViewSchema, type CustomerPayment } from "./schemas";

export const PAYMENT_METHODS = [
  { code: "BCA", label: "Virtual Account BCA", short: "BCA" },
  { code: "BNI", label: "Virtual Account BNI", short: "BNI" },
  { code: "MANDIRI", label: "Virtual Account Mandiri", short: "Mandiri" },
] as const;

export type PaymentMethodCode = (typeof PAYMENT_METHODS)[number]["code"];

const PAYMENT_IDS_KEY = "schooly.payment.ids";

function readPaymentIds(): Record<string, number> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PAYMENT_IDS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const result: Record<string, number> = {};
    for (const [orderId, paymentId] of Object.entries(parsed)) {
      if (typeof paymentId === "number") result[orderId] = paymentId;
    }
    return result;
  } catch {
    return {};
  }
}

function writePaymentIds(map: Record<string, number>): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PAYMENT_IDS_KEY, JSON.stringify(map));
  } catch {
    // penyimpanan tidak tersedia (mode privat, dll.)
  }
}

export function getRememberedPaymentId(orderId: number): number | null {
  return readPaymentIds()[String(orderId)] ?? null;
}

export function rememberPaymentId(orderId: number, paymentId: number): void {
  writePaymentIds({ ...readPaymentIds(), [String(orderId)]: paymentId });
}

export function forgetPaymentId(orderId: number): void {
  const map = readPaymentIds();
  delete map[String(orderId)];
  writePaymentIds(map);
}

/** POST /payments */
export async function createCustomerPayment(
  orderId: number,
  method: PaymentMethodCode | string,
): Promise<CustomerPayment> {
  const payment = await request("/payments", {
    method: "POST",
    body: { orderId, method },
    responseSchema: paymentViewSchema,
  });

  rememberPaymentId(orderId, payment.paymentId);
  return payment;
}

/** GET /payments/:id */
export function getCustomerPayment(paymentId: number): Promise<CustomerPayment> {
  return request(`/payments/${paymentId}`, {
    responseSchema: paymentViewSchema,
  });
}

/** POST /payments/:id/simulate (hanya tersedia di lingkungan non-produksi). */
export function simulateCustomerPayment(
  paymentId: number,
): Promise<CustomerPayment> {
  return request(`/payments/${paymentId}/simulate`, {
    method: "POST",
    responseSchema: paymentViewSchema,
  });
}

export const PAYMENT_SIMULATION_ENABLED =
  process.env.NODE_ENV !== "production";
