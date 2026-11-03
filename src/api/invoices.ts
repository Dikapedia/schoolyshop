import { z } from "zod";
import { INVOICE_DETAIL_MOCK } from "./mocks/invoices";

export const invoiceDetailSchema = z.object({
  customerName: z.string(),
  customerType: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  shippingAddress: z.string(),
  shippingPostalCode: z.string(),
  recipient: z.string(),
  paymentMethod: z.string(),
  virtualAccountNumber: z.string(),
});
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;

/**
 * TODO(backend): ganti dengan GET /orders/:id/invoice dan konfirmasi apakah
 * data konsumen diambil dari snapshot pesanan atau profil terkini.
 */
export function getInvoiceDetail(orderId: string): InvoiceDetail {
  void orderId;
  return invoiceDetailSchema.parse(INVOICE_DETAIL_MOCK);
}
