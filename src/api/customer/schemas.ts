import { z } from "zod";

/**
 * Skema DTO backend untuk alur customer.
 *
 * Semua adapter di `src/api/customer/*` memvalidasi respons dengan skema ini
 * agar perubahan kontrak backend langsung terlihat sebagai error yang jelas,
 * bukan crash di komponen.
 */

export const sellerRefSchema = z.object({
  id: z.number().nullable(),
  label: z.string(),
  role: z.string(),
});
export type SellerRef = z.infer<typeof sellerRefSchema>;

export const paginationMetaSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/* ------------------------------------------------------------------ */
/* Katalog                                                             */
/* ------------------------------------------------------------------ */

export const productSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  tag: z.string(),
  image: z.string().nullable(),
  featured: z.boolean(),
  weight: z.number(),
  category: z.string(),
  categorySlug: z.string(),
  seller: sellerRefSchema,
  stock: z.number(),
});
export type CustomerProduct = z.infer<typeof productSummarySchema>;

export const productVariantSchema = z.object({
  id: z.number(),
  sku: z.string(),
  size: z.string(),
  stock: z.number(),
  priceAdjustment: z.number(),
});
export type CustomerProductVariant = z.infer<typeof productVariantSchema>;

export const productDetailSchema = productSummarySchema.extend({
  variants: z.array(productVariantSchema),
});
export type CustomerProductDetail = z.infer<typeof productDetailSchema>;

export const productListSchema = z.object({
  data: z.array(productSummarySchema),
  meta: paginationMetaSchema,
});

/* ------------------------------------------------------------------ */
/* Keranjang                                                           */
/* ------------------------------------------------------------------ */

export const cartItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  variantId: z.number().nullable(),
  qty: z.number(),
  unitPrice: z.number(),
  subtotal: z.number(),
  product: z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string().nullable(),
    seller: sellerRefSchema,
  }),
  variant: productVariantSchema.nullable(),
});
export type CustomerCartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  data: z.array(cartItemSchema),
  total: z.number(),
  itemCount: z.number(),
});
export type CustomerCart = z.infer<typeof cartSchema>;

/* ------------------------------------------------------------------ */
/* Alamat & pengiriman                                                 */
/* ------------------------------------------------------------------ */

export const addressSchema = z.object({
  id: z.number(),
  label: z.string(),
  recipientName: z.string(),
  phone: z.string(),
  address: z.string().nullable(),
  areaId: z.string(),
  district: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  note: z.string().nullable(),
  isPrimary: z.boolean(),
});
export type CustomerAddress = z.infer<typeof addressSchema>;

export const addressListSchema = z.object({ data: z.array(addressSchema) });

export const shippingRateSchema = z.object({
  id: z.union([z.number(), z.string()]),
  code: z.string(),
  courier: z.string(),
  service: z.string(),
  description: z.string(),
  price: z.number(),
  eta: z.string(),
  badge: z.string().nullable(),
});
export type CustomerShippingRate = z.infer<typeof shippingRateSchema>;

export const shippingRateListSchema = z.object({
  data: z.array(shippingRateSchema),
});

/* ------------------------------------------------------------------ */
/* Pesanan                                                             */
/* ------------------------------------------------------------------ */

export const orderStatusSchema = z.enum([
  "Menunggu Pembayaran",
  "Menunggu Verifikasi",
  "Diproses",
  "Dikirim",
  "Dalam Pengembalian",
  "Selesai",
  "Dibatalkan",
]);
export type CustomerOrderStatus = z.infer<typeof orderStatusSchema>;

export const paymentStatusSchema = z.enum([
  "unpaid",
  "pending",
  "paid",
  "partial_refund",
  "expired",
  "refunded",
]);
export type CustomerPaymentStatus = z.infer<typeof paymentStatusSchema>;

export const orderItemSchema = z.object({
  id: z.number(),
  productId: z.number().nullable(),
  productSlug: z.string(),
  productName: z.string(),
  productImage: z.string().nullable(),
  variantId: z.number().nullable(),
  variantSku: z.string().nullable(),
  variantSize: z.string().nullable(),
  seller: sellerRefSchema,
  unitPrice: z.number(),
  priceAdjustment: z.number(),
  qty: z.number(),
  subtotal: z.number(),
});
export type CustomerOrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  paymentStatus: paymentStatusSchema,
  paymentMethod: z.string().nullable(),
  subtotal: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  buyer: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  shipping: z.object({
    label: z.string().nullable(),
    recipientName: z.string(),
    phone: z.string(),
    address: z.string().nullable(),
    areaId: z.string(),
    district: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    note: z.string().nullable(),
  }),
  courier: z.object({
    code: z.string(),
    name: z.string(),
    service: z.string(),
    eta: z.string(),
  }),
  items: z.array(orderItemSchema),
  sellers: z.array(sellerRefSchema),
  verifiedAt: z.string().nullable(),
  verificationDecision: z.enum(["approve", "reject"]).nullable(),
  verificationReason: z.string().nullable(),
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CustomerOrder = z.infer<typeof orderSchema>;

export const orderListSchema = z.object({
  data: z.array(orderSchema),
  meta: paginationMetaSchema,
});

export const invoiceSchema = z.object({
  orderId: z.number(),
  invoiceNumber: z.string(),
  issuedAt: z.string(),
  customerName: z.string(),
  customerType: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  recipient: z.string(),
  shippingAddress: z.string(),
  shippingPostalCode: z.string(),
  shipping: orderSchema.shape.shipping,
  paymentMethod: z.string().nullable(),
  paymentStatus: paymentStatusSchema,
  virtualAccountNumber: z.string().nullable(),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  status: orderStatusSchema,
  courier: orderSchema.shape.courier,
});
export type CustomerInvoice = z.infer<typeof invoiceSchema>;

/* ------------------------------------------------------------------ */
/* Pembayaran                                                          */
/* ------------------------------------------------------------------ */

export const paymentViewSchema = z.object({
  paymentId: z.number(),
  orderId: z.number(),
  provider: z.string(),
  method: z.string(),
  methodLabel: z.string(),
  vaNumber: z.string(),
  billerCode: z.string().nullable(),
  amount: z.number(),
  expiresAt: z.string(),
  status: paymentStatusSchema,
  paidAt: z.string().nullable(),
  refundRequiredAt: z.string().nullable(),
  refundAmount: z.number().nullable(),
  createdAt: z.string(),
});
export type CustomerPayment = z.infer<typeof paymentViewSchema>;
