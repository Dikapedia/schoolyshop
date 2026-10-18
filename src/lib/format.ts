export function formatRupiah(value: number): string {
  // Hasil: "Rp 120.000" (sesuai desain)
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}
