import { adminRequest } from "./client";
import {
  mapPaymentStatus,
  type OrderStatus,
  type PaymentStatus,
} from "./orders";
import { formatAdminDateTime } from "./shared";

export type AdminOrderItem = {
  name: string;
  sku: string;
  seller: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  weight?: number;
};

export type AdminOrderDetail = {
  id: string;
  shippingAreaId?: string;
  buyer: {
    name: string;
    type: string;
    contact: string;
    email: string;
    orderedAt: string;
    address: string;
  };
  transaction: {
    provider: string;
    method: string;
    transactionId: string;
    paidAt: string;
    settledLabel: string;
  };
  warehouse: string;
  verifiedAt: string;
  items: AdminOrderItem[];
  summary: {
    subtotal: number;
    shippingLabel: string;
    shippingCost: number;
    total: number;
  };
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalWeight?: number;
};

type AdminOrderDetailRow = {
  id: number;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus: string;
  paymentMethod: string | null;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping?: {
    label?: string | null;
    recipientName?: string;
    phone?: string;
    address?: string | null;
    areaId?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  } | null;
  courier?: {
    name?: string;
    service?: string;
  } | null;
  items?: Array<{
    productName: string;
    variantSku?: string | null;
    seller?: { label?: string } | null;
    qty: number;
    unitPrice: number;
    subtotal: number;
    weight?: number;
  }>;
  sellers?: Array<{ label?: string }>;
  summary?: {
    subtotal: number;
    shippingCost: number;
    total: number;
  };
  payment?: {
    paymentId: number;
    methodLabel?: string | null;
    status?: string;
    paidAt?: string | null;
  } | null;
  verifiedAt?: string | null;
  createdAt: string;
};

function composeAddress(row: AdminOrderDetailRow): string {
  const shipping = row.shipping;

  if (!shipping) return "-";

  return [
    shipping.address,
    shipping.district,
    shipping.city,
    shipping.province,
    shipping.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function mapAdminOrderDetail(
  row: AdminOrderDetailRow,
): AdminOrderDetail {
  const items = Array.isArray(row.items) ? row.items : [];
  const summary = row.summary ?? {
    subtotal: 0,
    shippingCost: 0,
    total: 0,
  };
  const shippingLabel =
    row.shipping?.label ||
    [row.courier?.name, row.courier?.service].filter(Boolean).join(" ") ||
    "Ongkos Kirim";
  const sellerLabel =
    row.sellers
      ?.map((seller) => seller.label)
      .filter(Boolean)
      .join(", ") || "Schooly Shop";

  return {
    id: String(row.id),
    shippingAreaId: row.shipping?.areaId,
    buyer: {
      name: row.buyer?.name ?? "-",
      type: "Pembeli",
      contact: row.buyer?.phone || row.shipping?.phone || "-",
      email: row.buyer?.email ?? "-",
      orderedAt: formatAdminDateTime(row.createdAt),
      address: composeAddress(row),
    },
    transaction: {
      provider: row.payment ? "Midtrans" : "-",
      method: row.payment?.methodLabel || row.paymentMethod || "-",
      transactionId: row.payment ? String(row.payment.paymentId) : "-",
      paidAt: formatAdminDateTime(row.payment?.paidAt),
      settledLabel: mapPaymentStatus(
        row.payment?.status ?? row.paymentStatus,
      ),
    },
    warehouse: sellerLabel,
    verifiedAt: formatAdminDateTime(row.verifiedAt),
    items: items.map((item) => ({
      name: item.productName,
      sku: item.variantSku || "-",
      seller: item.seller?.label || "-",
      quantity: item.qty,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      weight: item.weight,
    })),
    summary: {
      subtotal: summary.subtotal,
      shippingLabel,
      shippingCost: summary.shippingCost,
      total: summary.total,
    },
    orderStatus: row.orderStatus ?? row.status,
    paymentStatus: mapPaymentStatus(row.paymentStatus),
    totalWeight: items.reduce((sum, item) => sum + (item.weight ?? 1000) * item.qty, 0),
  };
}

/** GET /admin/orders/:id */
export async function getAdminOrderDetail(
  id: string,
): Promise<AdminOrderDetail> {
  const row = await adminRequest<AdminOrderDetailRow>(`/admin/orders/${id}`);
  return mapAdminOrderDetail(row);
}
