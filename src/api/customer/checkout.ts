import { request } from "../client";
import {
  shippingRateListSchema,
  type CustomerShippingRate,
} from "./schemas";

/** GET /shipping/rates */
export async function listCustomerShippingRates(input: {
  destinationAreaId?: string;
  weight?: number;
}): Promise<CustomerShippingRate[]> {
  const query = new URLSearchParams();
  if (input.destinationAreaId) {
    query.set("destinationAreaId", input.destinationAreaId);
  }
  if (input.weight !== undefined) {
    query.set("weight", String(input.weight));
  }

  const suffix = query.toString();
  const payload = await request(
    `/shipping/rates${suffix ? `?${suffix}` : ""}`,
    { responseSchema: shippingRateListSchema },
  );

  return payload.data;
}

export type CreateCheckoutInput = {
  addressId: number;
  shippingRateId: number | string;
  paymentMethod?: string;
};

/** POST /checkouts */
export async function createCustomerCheckout(
  input: CreateCheckoutInput,
): Promise<{ orderId: number }> {
  return request("/checkouts", {
    method: "POST",
    body: input,
  });
}
