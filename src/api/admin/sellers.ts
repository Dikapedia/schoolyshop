import { request } from "../client";

export type Seller = {
  id: number;
  initials: string;
  name: string;
  business: string;
  type: string;
  typeClass: string;
  kk: string;
  address: string;
  whatsapp?: string;
  avatarClass: string;
};

export type SellerInput = {
  name: string;
  business: string;
  type: string;
  kk: string;
  address: string;
  whatsapp?: string;
};

/** GET /admin/sellers */
export function getAdminSellers(): Promise<Seller[]> {
  return request<Seller[]>("/admin/sellers");
}

/** POST /admin/sellers */
export function createAdminSeller(input: SellerInput): Promise<Seller> {
  return request<Seller>("/admin/sellers", { method: "POST", body: input });
}

/** PATCH /admin/sellers/:id */
export function updateAdminSeller(
  id: number,
  input: Partial<SellerInput>,
): Promise<Seller> {
  return request<Seller>(`/admin/sellers/${id}`, {
    method: "PATCH",
    body: input,
  });
}
