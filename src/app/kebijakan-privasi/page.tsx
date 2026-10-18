import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Schooly Shop",
  description: "Kebijakan privasi Schooly Shop - data pribadi Anda dan cara kami melindungi.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="space-y-2 text-slate-700">{children}</div>
    </section>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed">{children}</p>;
}

function BulletList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

export default function KebijakanPrivasiPage() {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10">
          <header className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              KEBIJAKAN PRIVASI SCHOOLY SHOP
            </h1>
            <p className="mt-2 text-xs text-slate-500">Terakhir diperbarui: 14 Oktober 2026</p>
          </header>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
            <Paragraph>
              Schooly Shop menghargai privasi Anda. Kebijakan ini menjelaskan data apa yang kami kumpulkan, untuk
              apa digunakan, dan bagaimana kami melindunginya.
            </Paragraph>

            <Section title="Data yang Kami Kumpulkan">
              <BulletList>
                <Bullet>
                  <strong>Data akun:</strong> nama lengkap, alamat email, nomor telepon, dan kata sandi. Kata sandi
                  disimpan dalam bentuk terenkripsi (hash), bukan teks asli.
                </Bullet>
                <Bullet>
                  <strong>Data pengiriman:</strong> alamat dan nomor telepon penerima yang Anda isi pada profil atau
                  saat checkout.
                </Bullet>
                <Bullet>
                  <strong>Data transaksi:</strong> isi keranjang, riwayat pesanan, status pembayaran, status pengiriman, dan
                  nomor resi.
                </Bullet>
                <Bullet>
                  <strong>Data pengembalian:</strong> item, alasan, foto bukti, serta rekening atau e-wallet tujuan bila
                  dana harus dikembalikan secara manual.
                </Bullet>
                <Bullet>
                  <strong>Data teknis dasar:</strong> informasi sesi masuk dan log aktivitas penting sistem untuk keamanan.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Cara Kami Menggunakan Data">
              <BulletList>
                <Bullet>
                  Data Anda kami gunakan untuk membuat dan mengelola akun serta memverifikasi login Anda.
                </Bullet>
                <Bullet>
                  Memproses pesanan, pembayaran, pengiriman, dan pengembalian.
                </Bullet>
                <Bullet>
                  Mengirim pemberitahuan perubahan status pembayaran dan pesanan.
                </Bullet>
                <Bullet>
                  Memberikan bantuan melalui WhatsApp Admin.
                </Bullet>
                <Bullet>
                  Membuat rekap penjualan internal tanpa membuka data pribadi pembeli kepada Penjual.
                </Bullet>
                <Bullet>
                  Mengingat keamanan sistem dan mencegah penyalahgunaan.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Berbagi Data dengan Pihak Lain">
              <Paragraph>
                <strong>Kami tidak menjual data pribadi Anda.</strong> Data dibagikan seperlunya kepada pihak berikut.
              </Paragraph>
              <BulletList>
                <Bullet>
                  <strong>Midtrans,</strong> untuk memproses pembayaran dan refund.
                </Bullet>
                <Bullet>
                  <strong>Biteship</strong> dan kurir atau ekspedisi, yang menerima nama, alamat, dan nomor telepon penerima
                  untuk menghitung ongkos kirim serta mengantar paket atau retur.
                </Bullet>
                <Bullet>
                  <strong>Layanan email,</strong> untuk mengirim pemberitahuan.
                </Bullet>
                <Bullet>
                  <strong>Pihak berwenang,</strong> bila diwajibkan oleh hukum.
                </Bullet>
              </BulletList>
              <Paragraph>
                <strong>Penjual atau Supplier</strong> tidak memiliki akses ke data akun atau alamat pembeli. Admin hanya
                dapat melihat data akun pengguna dan tidak dapat mengubah atau menghapusnya.
              </Paragraph>
            </Section>

            <Section title="Keamanan Data">
              <BulletList>
                <Bullet>
                  <strong>Seluruh komunikasi menggunakan HTTPS</strong> dan kata sandi disimpan dengan metode hashing.
                </Bullet>
                <Bullet>
                  <strong>Akses dibatasi berdasarkan peran</strong> (Admin dan Pengguna), dan kunci API layanan pihak
                  ketiga disimpan di sisi server.
                </Bullet>
                <Bullet>
                  <strong>Notifikasi pembayaran</strong> diverifikasi dengan signature key, dan aktivitas penting dicatat
                  dalam log.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Penyimpanan Data di Perangkat Anda">
              <Paragraph>
                <strong>Agar Anda tetap masuk dan keranjang tidak hilang,</strong> situs ini menyimpan informasi sesi
                (nama dan peran) serta isi keranjang pada penyimpanan browser Anda. Opsi <strong>&ldquo;Ingat saya&rdquo;</strong>
                menentukan apakah sesi disimpan permanen atau hanya selama browser terbuka. Anda dapat menghapusnya kapan
                saja dengan keluar (logout) atau membersihkan data situs di browser.
              </Paragraph>
            </Section>

            <Section title="Lama Penyimpanan">
              <BulletList>
                <Bullet>
                  <strong>Data akun</strong> disimpan selama akun aktif.
                </Bullet>
                <Bullet>
                  <strong>Data transaksi</strong> disimpan selama diperlukan untuk pencatatan, penyelesaian sengketa,
                  dan kewajiban hukum. Setelah tidak diperlukan, data dihapus atau dianonimkan.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Hak Anda">
              <BulletList>
                <Bullet>
                  <strong>Melihat dan memperbarui</strong> data profil serta alamat Anda.
                </Bullet>
                <Bullet>
                  <strong>Meminta salinan</strong> data pribadi yang kami simpan.
                </Bullet>
                <Bullet>
                  <strong>Meminta koreksi atau penghapusan</strong> data atau akun sepanjang tidak bertentangan dengan
                  kewajiban pencatatan transaksi.
                </Bullet>
                <Bullet>
                  <strong>Menarik persetujuan</strong> dengan berhenti menggunakan layanan.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Anak di Bawah Umur">
              <Paragraph>
                <strong>Layanan ditujukan bagi pengguna berusia 17 tahun ke atas</strong> atau dengan pendampingan orang tua
                atau wali. Bila kami mengetahui ada data anak yang terkumpul tanpa izin, data tersebut akan dihapus.
              </Paragraph>
            </Section>

            <Section title="Perubahan Kebijakan">
              <Paragraph>
                <strong>Kebijakan ini dapat diperbarui sewaktu-waktu.</strong> Tanggal pembaruan tertera di bagian atas
                halaman. Perubahan penting akan kami informasikan melalui situs.
              </Paragraph>
            </Section>

            <Section title="Kontak">
              <BulletList>
                <Bullet>
                  <strong>Untuk pertanyaan tentang privasi,</strong> hubungi Admin Schooly Shop melalui WhatsApp{" "}
                  <a href={whatsappLink("Halo Admin, saya butuh bantuan terkait privasi.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {site.whatsapp.display}
                  </a>
                  .
                </Bullet>
                <Bullet>
                  <strong>Datang ke</strong> SMK Suka Maju,{" "}
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {site.address}
                  </a>
                  .
                </Bullet>
              </BulletList>
            </Section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}