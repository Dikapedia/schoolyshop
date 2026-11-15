import type { NextRequest } from "next/server";
import type {
  AdminCategoryInput,
  AdminProductInput,
} from "@/api/admin/products";
import type { SellerInput } from "@/api/admin/sellers";
import {
  AdminHttpError,
  approveReturn,
  createCategory,
  createProduct,
  createSeller,
  createShipment,
  deleteCategory,
  deleteProduct,
  getDashboardSummary,
  getOrderDetail,
  getReturnDetail,
  getSalesReportDetail,
  getShipment,
  getShipmentTracking,
  getUser,
  listCategories,
  listOrders,
  listProducts,
  listReturns,
  listSalesReport,
  listSellers,
  listShipments,
  listUsers,
  rejectReturn,
  updateCategory,
  updateProduct,
  updateSeller,
  verifyOrder,
} from "@/server/admin-store";

type RouteContext = { params: Promise<{ path: string[] }> };

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function noContent() {
  return new Response(null, { status: 204 });
}

async function body(request: NextRequest): Promise<Record<string, unknown>> {
  const payload = await request.json().catch(() => ({}));
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : {};
}

function handleError(error: unknown) {
  if (error instanceof AdminHttpError) {
    return json({ message: error.message }, error.status);
  }
  console.error("[api/admin]", error);
  return json({ message: "Terjadi kesalahan pada server." }, 500);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  try {
    if (path[0] === "dashboard" && path[1] === "summary") {
      return json(getDashboardSummary());
    }

    if (path[0] === "orders" && path[1]) {
      return json(getOrderDetail(path[1]));
    }

    if (path[0] === "orders") {
      return json(listOrders(request.nextUrl.searchParams));
    }

    if (path[0] === "shipments" && path[1] && path[2] === "tracking") {
      return json(getShipmentTracking(path[1]));
    }

    if (path[0] === "shipments" && path[1]) {
      return json(getShipment(path[1]));
    }

    if (path[0] === "shipments") {
      return json(listShipments());
    }

    if (path[0] === "returns" && path[1]) {
      return json(getReturnDetail(path[1]));
    }

    if (path[0] === "returns") {
      return json(listReturns());
    }

    if (path[0] === "products") {
      return json(listProducts());
    }

    if (path[0] === "categories") {
      return json(listCategories());
    }

    if (path[0] === "sellers") {
      return json(listSellers());
    }

    if (path[0] === "users" && path[1]) {
      return json(getUser(path[1]));
    }

    if (path[0] === "users") {
      return json(listUsers());
    }

    if (path[0] === "reports" && path[1] === "sales" && path[2]) {
      return json(getSalesReportDetail(path[2]));
    }

    if (path[0] === "reports" && path[1] === "sales") {
      return json(listSalesReport());
    }

    return json({ message: "Endpoint admin tidak ditemukan." }, 404);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  try {
    if (path[0] === "orders" && path[1] && path[2] === "verify") {
      return json(verifyOrder(path[1]));
    }

    if (path[0] === "shipments") {
      const payload = await body(request);
      const orderId = String(payload.orderId ?? "");
      const courier = String(payload.courier ?? "J&T Express");
      if (!orderId) throw new AdminHttpError(422, "orderId wajib diisi.");
      return json(createShipment(orderId, courier), 201);
    }

    if (path[0] === "returns" && path[1] && path[2] === "approve") {
      return json(approveReturn(path[1]));
    }

    if (path[0] === "returns" && path[1] && path[2] === "reject") {
      const payload = await body(request);
      return json(rejectReturn(path[1], String(payload.reason ?? "")));
    }

    if (path[0] === "products") {
      return json(createProduct((await body(request)) as AdminProductInput), 201);
    }

    if (path[0] === "categories") {
      return json(createCategory((await body(request)) as AdminCategoryInput), 201);
    }

    if (path[0] === "sellers") {
      return json(createSeller((await body(request)) as SellerInput), 201);
    }

    return json({ message: "Endpoint admin tidak ditemukan." }, 404);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  try {
    const id = Number(path[1]);
    if (!Number.isFinite(id)) {
      throw new AdminHttpError(422, "ID tidak valid.");
    }

    if (path[0] === "products" && path[1]) {
      return json(
        updateProduct(id, (await body(request)) as Partial<AdminProductInput>),
      );
    }

    if (path[0] === "categories" && path[1]) {
      return json(
        updateCategory(id, (await body(request)) as Partial<AdminCategoryInput>),
      );
    }

    if (path[0] === "sellers" && path[1]) {
      return json(updateSeller(id, (await body(request)) as Partial<SellerInput>));
    }

    return json({ message: "Endpoint admin tidak ditemukan." }, 404);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  try {
    const id = Number(path[1]);
    if (!Number.isFinite(id)) {
      throw new AdminHttpError(422, "ID tidak valid.");
    }

    if (path[0] === "products" && path[1]) {
      deleteProduct(id);
      return noContent();
    }

    if (path[0] === "categories" && path[1]) {
      deleteCategory(id);
      return noContent();
    }

    return json({ message: "Endpoint admin tidak ditemukan." }, 404);
  } catch (error) {
    return handleError(error);
  }
}
