import { z } from "zod";
import { PAYMENT_BANK_MOCKS } from "./mocks/payments";

export const paymentBankSchema = z.object({
  id: z.string(),
  name: z.string(),
  vaNumber: z.string(),
});
export type PaymentBank = z.infer<typeof paymentBankSchema>;

/**
 * Daftar bank Virtual Account untuk halaman pembayaran.
 *
 * TODO(backend): ganti mock dengan daftar bank/nomor VA yang berasal dari
 * POST /payments dan status pembayaran dari GET /payments/:id.
 */
export function listPaymentBanks(): PaymentBank[] {
  return paymentBankSchema.array().parse(PAYMENT_BANK_MOCKS);
}

export function getPaymentBank(id: string): PaymentBank | undefined {
  return listPaymentBanks().find((bank) => bank.id === id);
}
