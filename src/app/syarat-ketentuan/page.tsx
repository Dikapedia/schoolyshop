import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Schooly Shop",
  description: "Syarat dan ketentuan penggunaan Schooly Shop - platform jual beli online warga sekolah.",
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

export default function SyaratKetentuanPage() {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10">
          <header className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              SYARAT & KETENTUAN SCHOOLY SHOP
            </h1>
            <p className="mt-2 text-xs text-slate-500">Terakhir diperbarui: 14 Oktober 2026</p>
          </header>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
            <Paragraph>
              Selamat datang di Schooly Shop. Dengan mendaftar atau menggunakan layanan kami, Anda menyatakan telah
              membaca, memahami, dan menyetujui syarat dan ketentuan berikut. Bacalah dengan saksama sebelum berbelanja.
            </Paragraph>

            <Section title="Definisi">
              <BulletList>
                <Bullet>
                  <strong>Schooly Shop</strong> adalah platform jual beli online yang dikelola oleh unit Schooly Shop di{" "}
                  {site.school} untuk memasarkan produk siswa, guru, dan karyawan kepada masyarakat umum.
                </Bullet>
                <Bullet>
                  <strong>Admin</strong> adalah petugas unit Schooly Shop yang menyeleksi produk, mengelola katalog, memproses
                  pesanan dan pengiriman, serta melayani bantuan.
                </Bullet>
                <Bullet>
                  <strong>Pengguna atau Pembeli</strong> adalah orang yang mendaftar dan menggunakan akun untuk berbelanja di
                  Schooly Shop.
                </Bullet>
                <Bullet>
                  <strong>Penjual atau Supplier</strong> adalah siswa, guru, atau karyawan yang menitipkan produknya kepada
                  unit untuk dijual. Penjual tidak memiliki akun di sistem.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Pendaftaran dan Akun">
              <BulletList>
                <Bullet>
                  Pendaftaran terbuka untuk masyarakat umum. Anda wajib mengisi data yang benar, lengkap, dan terbaru, yaitu
                  nama, email, dan nomor telepon.
                </Bullet>
                <Bullet>
                  Anda berusia minimal 17 tahun, atau mendaftar dengan sepengetahuan dan izin orang tua atau wali.
                </Bullet>
                <Bullet>Satu email hanya dapat digunakan untuk satu akun. Email yang sudah terdaftar tidak dapat dipakai mendaftar kembali.</Bullet>
                <Bullet>
                  Anda bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas yang terjadi melalui akun Anda.
                  Segera hubungi Admin bila akun Anda dipakai tanpa izin.
                </Bullet>
                <Bullet>
                  Hanya pengguna yang sudah terdaftar dan masuk (login) yang dapat melakukan checkout dan pembayaran.
                </Bullet>
                <Bullet>Akun yang tidak aktif atau dinonaktifkan tidak dapat digunakan untuk masuk.</Bullet>
              </BulletList>
            </Section>

            <Section title="Produk dan Katalog">
              <BulletList>
                <Bullet>
                  Seluruh produk di katalog berasal dari pengajuan yang telah diperiksa dan disetujui Admin. Pengajuan produk
                  dilakukan secara langsung (offline) kepada Admin, bukan melalui akun pengguna.
                </Bullet>
                <Bullet>
                  Barang dari Penjual dititipkan kepada unit dan disimpan oleh Admin. Pengiriman dilakukan dari alamat sekolah.
                </Bullet>
                <Bullet>
                  Kami berupaya menampilkan foto, deskripsi, harga, dan stok seakurat mungkin. Warna atau tampilan produk dapat
                  sedikit berbeda dari aslinya karena pencahayaan dan layar perangkat.
                </Bullet>
                <Bullet>
                  Ketersediaan stok diperiksa saat checkout dan sebelum pesanan diproses. Admin berhak membatalkan atau
                  menyesuaikan pesanan bila stok ternyata tidak tersedia, dengan pengembalian dana penuh atas pesanan yang
                  sudah dibayar.
                </Bullet>
                <Bullet>
                  Harga ditetapkan oleh unit dan dapat berubah sewaktu-waktu tanpa pemberitahuan. Harga yang berlaku adalah
                  harga saat pesanan dibuat.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Pesanan dan Pembayaran">
              <BulletList>
                <Bullet>
                  Seluruh pembayaran dilakukan secara online melalui Midtrans. Kami tidak menerima pembayaran tunai.
                </Bullet>
                <Bullet>
                  Pesanan berstatus Menunggu Pembayaran setelah dibuat. Bila tidak dibayar dalam 60 menit, pesanan otomatis
                  berstatus Kedaluwarsa dan stok dikembalikan.
                </Bullet>
                <Bullet>
                  Pesanan baru diproses dan dikirim setelah status pembayaran Berhasil.
                </Bullet>
                <Bullet>
                  Data kartu atau rekening Anda diproses langsung oleh Midtrans dan tidak disimpan di sistem Schooly Shop.
                </Bullet>
                <Bullet>
                  Anda akan menerima pemberitahuan setiap kali status pembayaran atau pesanan berubah.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Pengiriman">
              <BulletList>
                <Bullet>
                  Pengiriman memakai jasa kurir atau ekspedisi melalui agregator Biteship. Ongkos kirim dan pilihan layanan
                  dihitung otomatis berdasarkan alamat, berat paket, dan layanan yang Anda pilih, serta ditampilkan sebelum
                  pembayaran. Ongkos kirim tidak dapat diubah oleh pengguna.
                </Bullet>
                <Bullet>
                  Pastikan alamat dan nomor telepon penerima benar. Kesalahan data pengiriman yang berasal dari pengguna
                  menjadi tanggung jawab pengguna.
                </Bullet>
                <Bullet>
                  Nomor resi dibuat otomatis saat Admin membuat pengiriman, dan status paket diperbarui otomatis. Estimasi
                  waktu tiba ditentukan kurir dan dapat berubah di luar kendali kami.
                </Bullet>
                <Bullet>
                  Pesanan dinyatakan Selesai setelah Anda mengonfirmasi penerimaan. Bila Anda belum mengonfirmasi, pesanan
                  otomatis terkonfirmasi dan berstatus Selesai dalam 2x24 jam sejak status terkirim.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Pengembalian Barang dan Dana">
              <BulletList>
                <Bullet>
                  Pengajuan pengembalian hanya dapat dilakukan untuk pesanan berstatus terkirim, paling lambat 2x24 jam sejak
                  waktu terkirim. Pengajuan di luar batas waktu tersebut ditolak.
                </Bullet>
                <Bullet>
                  Pengajuan dilakukan per item produk, disertai jumlah, alasan, dan minimal satu foto bukti. Jumlah yang
                  dikembalikan tidak boleh melebihi jumlah yang dibeli.
                </Bullet>
                <Bullet>
                  Alasan pengembalian dibagi dua. Pertama, <strong>kesalahan unit atau penjual</strong>, yaitu barang rusak
                  atau cacat, tidak sesuai pesanan, atau jumlah kurang. Kedua, <strong>alasan dari pembeli</strong>, yaitu
                  barang tidak sesuai harapan atau salah memilih produk. Alasan dari pembeli hanya berlaku untuk produk
                  selain makanan dan minuman, dan barang harus dalam kondisi belum dipakai.
                </Bullet>
                <Bullet>
                  Pengajuan disetujui atau ditolak oleh Admin. Bila disetujui, barang dikirim kembali dari alamat Anda ke
                  alamat sekolah melalui Biteship.
                </Bullet>
                <Bullet>
                  Dana dikembalikan setelah barang retur diterima Admin dan dinyatakan sesuai dengan klaim. Pengembalian
                  dilakukan melalui refund Midtrans ke metode pembayaran asal. Bila metode tersebut tidak mendukung refund
                  otomatis, Admin mentransfer dana ke rekening atau e-wallet yang Anda isi saat pengajuan.
                </Bullet>
                <Bullet>
                  Selama pengajuan belum diputuskan atau masih diproses, konfirmasi otomatis pesanan ditunda dan status
                  pesanan menjadi Dalam Pengembalian.
                </Bullet>
                <Bullet>
                  Barang retur yang layak jual dikembalikan ke stok. Barang yang rusak tidak dikembalikan ke stok.
                </Bullet>
                <Bullet>
                  <strong>Ketentuan biaya untuk pengembalian karena kesalahan unit atau penjual:</strong> biaya pengiriman retur
                  ditanggung unit Schooly Shop. Dana yang dikembalikan sebesar harga item dikali jumlah yang dikembalikan.
                  Ongkos kirim pesanan awal dikembalikan hanya jika seluruh item pesanan dikembalikan.
                </Bullet>
                <Bullet>
                  <strong>Ketentuan biaya untuk pengembalian karena alasan dari pembeli:</strong> biaya pengiriman retur
                  ditanggung pembeli dan dikurangkan dari dana yang dikembalikan. Dana yang dikembalikan sebesar harga item
                  dikali jumlah yang dikembalikan, dikurangi biaya pengiriman retur. Ongkos kirim pesanan awal tidak
                  dikembalikan.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Kewajiban dan Larangan Pengguna">
              <BulletList>
                <Bullet>
                  Dalam menggunakan Schooly Shop, Anda dilarang memberikan data palsu atau memakai identitas orang lain. Anda
                  juga dilarang mengajukan pengembalian dengan bukti yang tidak benar atau menyalahgunakan fitur pengembalian
                  dana.
                </Bullet>
                <Bullet>
                  Anda dilarang mencoba mengakses sistem tanpa izin, mengganggu layanan, atau memanipulasi harga, stok, dan
                  status pembayaran. Anda juga dilarang menggunakan layanan untuk tujuan yang melanggar hukum atau merugikan
                  pihak lain.
                </Bullet>
                <Bullet>
                  Pelanggaran dapat berakibat pembatalan pesanan, penonaktifan akun, dan bila perlu penyelesaian sesuai hukum
                  yang berlaku.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Batasan Tanggung Jawab">
              <BulletList>
                <Bullet>
                  Layanan disediakan sebagaimana adanya. Kami berupaya menjaga layanan tetap tersedia, tetapi tidak menjamin
                  bebas gangguan, misalnya karena pemeliharaan atau gangguan penyedia pihak ketiga seperti Midtrans, Biteship,
                  kurir, atau jaringan.
                </Bullet>
                <Bullet>
                  Keterlambatan atau kerusakan akibat pihak kurir diselesaikan dengan mengikuti ketentuan pengembalian di atas.
                </Bullet>
                <Bullet>
                  Tanggung jawab kami terbatas pada nilai pesanan yang bersangkutan, sejauh diizinkan oleh peraturan
                  perundang-undangan.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Hak Kekayaan Intelektual">
              <BulletList>
                <Bullet>
                  Nama, logo, tampilan, dan konten Schooly Shop dimiliki unit Schooly Shop {site.school}. Foto dan deskripsi
                  produk dimiliki masing-masing Penjual. Dilarang menyalin atau menggunakannya untuk kepentingan komersial
                  tanpa izin tertulis.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Perubahan Ketentuan">
              <BulletList>
                <Bullet>
                  Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Tanggal pembaruan tertera di bagian atas
                  halaman. Dengan terus menggunakan Schooly Shop setelah perubahan berlaku, Anda dianggap menyetujui versi
                  terbaru.
                </Bullet>
              </BulletList>
            </Section>

            <Section title="Hukum yang Berlaku dan Kontak">
              <BulletList>
                <Bullet>Ketentuan ini diatur berdasarkan hukum Republik Indonesia.</Bullet>
                <Bullet>Sengketa diupayakan diselesaikan secara musyawarah terlebih dahulu.</Bullet>
                <Bullet>
                  Pertanyaan atau kendala? Hubungi Admin melalui WhatsApp{" "}
                  <a href={whatsappLink("Halo Admin, saya butuh bantuan terkait syarat & ketentuan.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {site.whatsapp.display}
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