import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "./globals.css";
import RootLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Schooly Shop | Produk Kreatif Warga Sekolah",
  description: "Belanja produk kreatif siswa, guru, dan karyawan sekolah. Semua produk terkurasi dan disetujui Admin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
