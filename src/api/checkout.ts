import { z } from "zod";
import { SHIPPING_OPTION_MOCKS } from "./mocks/checkout";
import { readJson, writeJson } from "./mocks/storage";

const PENDING_CHECKOUT_KEY = "schooly.checkout.pending";

export const shippingOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  sub: z.string(),
  fee: z.number(),
  badge: z.string().optional(),
});
export type ShippingOption = z.infer<typeof shippingOptionSchema>;

export const pendingCheckoutSchema = z.object({
  addressId: z.string().optional(),
  shippingId: z.string().optional(),
  sessionId: z.string().optional(),
});
export type PendingCheckout = z.infer<typeof pendingCheckoutSchema>;

/**
 * Opsi pengiriman untuk halaman checkout.
 *
 * TODO(backend): ganti mock dengan GET /shipping/rates?addressId=&weight=
 * agar tarif dan estimasi berasal dari Biteship/kurir.
 */
export function listShippingOptions(): ShippingOption[] {
  return shippingOptionSchema.array().parse(SHIPPING_OPTION_MOCKS);
}

/**
 * Data pilihan checkout yang dibawa dari /checkout ke /checkout/pembayaran.
 *
 * TODO(backend): simpan draft checkout di server (POST /checkouts) agar
 * tidak hilang saat browser ditutup atau sesi berpindah perangkat.
 */
export function getPendingCheckout(): PendingCheckout | null {
  const raw = readJson<unknown>(PENDING_CHECKOUT_KEY, null);
  if (!raw) return null;

  const parsed = pendingCheckoutSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function savePendingCheckout(input: PendingCheckout): void {
  writeJson(PENDING_CHECKOUT_KEY, input);
}
