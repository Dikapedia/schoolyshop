import { adminRequest } from "./client";
import {
  adminAvatarClass,
  adminInitials,
  fetchAllAdminPages,
} from "./shared";

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
  role?: "Siswa" | "Guru" | "Karyawan";
  productCount?: number;
};

export type SellerInput = {
  name: string;
  business: string;
  type: string;
  kk: string;
  address: string;
  whatsapp?: string;
};

type SellerRole = "Siswa" | "Guru" | "Karyawan";

type AdminSellerRow = {
  id: number;
  name: string;
  role: SellerRole;
  business: string | null;
  type: string | null;
  kk: string | null;
  address: string | null;
  whatsapp: string | null;
  productCount?: number;
};

const ROLE_CLASS: Record<SellerRole, string> = {
  Siswa: "bg-emerald-50 text-emerald-700",
  Guru: "bg-amber-50 text-amber-700",
  Karyawan: "bg-blue-50 text-blue-700",
};

function normalizeRole(value: string | undefined): SellerRole {
  const normalized = (value ?? "").toLowerCase();

  if (normalized.includes("guru")) return "Guru";
  if (normalized.includes("karyawan")) return "Karyawan";
  return "Siswa";
}

function mapSeller(row: AdminSellerRow): Seller {
  const role = normalizeRole(row.role);
  const roleClass = ROLE_CLASS[role];

  return {
    id: row.id,
    initials: adminInitials(row.name),
    name: row.name,
    business: row.business || "-",
    type: role,
    typeClass: roleClass,
    kk: row.kk || "-",
    address: row.address || "-",
    whatsapp: row.whatsapp ?? "",
    avatarClass: roleClass || adminAvatarClass(row.id),
    role,
    productCount: row.productCount,
  };
}

function toBackendInput(input: SellerInput) {
  return {
    name: input.name.trim(),
    role: normalizeRole(input.type),
    business: input.business.trim() || undefined,
    type: input.type.trim() || undefined,
    kk: input.kk.trim() || undefined,
    address: input.address.trim() || undefined,
    whatsapp: input.whatsapp?.trim() || undefined,
  };
}

/** GET /admin/sellers */
export async function getAdminSellers(): Promise<Seller[]> {
  const rows = await fetchAllAdminPages<AdminSellerRow>("/admin/sellers");
  return rows.map(mapSeller);
}

/** POST /admin/sellers */
export async function createAdminSeller(
  input: SellerInput,
): Promise<Seller> {
  const row = await adminRequest<AdminSellerRow>("/admin/sellers", {
    method: "POST",
    body: toBackendInput(input),
  });

  return mapSeller(row);
}

/** PATCH /admin/sellers/:id */
export async function updateAdminSeller(
  id: number,
  input: Partial<SellerInput>,
): Promise<Seller> {
  const body: Record<string, unknown> = {};

  if (input.name !== undefined) body.name = input.name.trim();
  if (input.business !== undefined)
    body.business = input.business.trim() || undefined;
  if (input.type !== undefined) {
    body.role = normalizeRole(input.type);
    body.type = input.type.trim() || undefined;
  }
  if (input.kk !== undefined) body.kk = input.kk.trim() || undefined;
  if (input.address !== undefined)
    body.address = input.address.trim() || undefined;
  if (input.whatsapp !== undefined)
    body.whatsapp = input.whatsapp.trim() || undefined;

  const row = await adminRequest<AdminSellerRow>(`/admin/sellers/${id}`, {
    method: "PATCH",
    body,
  });

  return mapSeller(row);
}
