import type { ShippingOption } from "../checkout";

/**
 * Tarif kurir contoh.
 *
 * TODO(backend): ganti dengan response integrasi Biteship/rajaongkir;
 * tarif seharusnya dihitung dari alamat asal, tujuan, berat, dan kurir.
 */
export const SHIPPING_OPTION_MOCKS: ShippingOption[] = [
  {
    id: "jne",
    label: "JNE Express — Layanan Reguler",
    sub: "Estimasi tiba: Besok atau 1-2 Hari Kerja",
    fee: 15000,
    badge: "Termurah",
  },
  {
    id: "sicepat",
    label: "SiCepat — SIUNTUNG",
    sub: "Estimasi tiba: 1-2 Hari Kerja",
    fee: 16500,
  },
  {
    id: "jt",
    label: "J&T Express — EZ Reguler",
    sub: "Estimasi tiba: 2-3 Hari Kerja",
    fee: 18000,
  },
  {
    id: "anteraja",
    label: "AnterAja — Reguler Parcel",
    sub: "Estimasi tiba: 2-3 Hari Kerja",
    fee: 17000,
  },
];
