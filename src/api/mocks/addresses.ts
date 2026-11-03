import type { Address } from "../addresses";

/**
 * Alamat demo yang dipakai saat pengguna belum punya alamat tersimpan.
 *
 * TODO(backend): hapus seed demo setelah alamat berasal dari API.
 */
export const DEMO_ADDRESS: Address = {
  id: "address-demo",
  name: "Demo Alamat",
  phone: "+62 812-0000-0000",
  address: "Jalan Demo No.1, Kecamatan Demo, Kota Demo",
  postalCode: "12345",
  note: "Demo address for checkout",
  badges: ["Rumah"],
  isPrimary: true,
};

export function createDemoAddress(id = DEMO_ADDRESS.id): Address {
  return { ...DEMO_ADDRESS, id };
}
