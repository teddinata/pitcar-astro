# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pemilik mobil di Purwokerto, Cilacap, dan sekitarnya yang mobilnya sedang bermasalah atau sudah waktunya servis. Mayoritas membuka situs dari HP, sering dalam keadaan terdesak (mogok, AC mati, bunyi aneh), dan belum tahu nama kerusakannya. Tugas mereka: memastikan Pitcar bisa menangani masalahnya, lalu menghubungi admin.

Audiens kedua: calon mitra waralaba (halaman Kemitraan) dan pembaca artikel perawatan mobil dari pencarian Google.

## Product Purpose

Situs resmi Pitcar Service, bengkel mobil di Purwokerto. Situs ini mengubah pengunjung menjadi percakapan WhatsApp dengan admin (booking, konsultasi, panggilan darurat). Berhasil berarti admin menerima chat yang sudah berisi tipe mobil, tahun, kilometer, dan keluhan.

## Positioning

Satu nomor untuk semua urusan mobil: 9+ jenis layanan lewat tiga cara pengerjaan (Home Service, Pick Up Service, Workshop), termasuk darurat 24 jam. Pelanggan dijelaskan kerusakan dan estimasi biayanya secara terbuka sebelum pengerjaan.

## Operating Context

- Semua booking terjadi di WhatsApp admin, nomor 6285866224051. Tidak ada form booking, aplikasi, atau pembayaran online di situs.
- Alur: konsultasi dan booking, estimasi dari admin, datang atau home/pick up service, pekerjaan selesai, pembayaran tunai atau transfer.
- Promo tetap: Free General Check Up, 5 mobil per hari.
- Kota: Purwokerto dan Cilacap, ditambah cabang baru di Purbalingga, Tegal, dan Batam (dari pemilik, 14 November 2026). Alamat cabang belum tercatat.
- Bagian dari ekosistem Pitcar: Otokits (Cilacap), Pitcar Auto Accessories, Pitcar Autopart. Anak usaha pendidikan: Pitcar Academy (situs terpisah).

## Capabilities and Constraints

- Layanan: Emergency 24 Jam, Service Mesin, Ganti Oli, Scanning & ECU, Rem & Kaki-Kaki, Service AC, Transmisi (AT, CVT, DCT, DSG), Body Repair & Detailing, Mobil Eropa & Amerika, Perawatan Berkala (paket 10 ribu km dan 40 ribu km, check-up 32 titik), Kelistrikan, Towing, Inspeksi Mobil Bekas.
- Harga tidak ditampilkan di situs. Estimasi selalu dikonfirmasi admin (keputusan pemilik, 14 November 2026).
- Stack: Astro 5 (templat AstroWind), Tailwind 3, konten blog Markdown, deploy statis. Peringkat pencarian lokal ("bengkel mobil Purwokerto") harus dijaga: teks layanan tetap HTML.
- Tombol darurat dan WhatsApp tidak boleh bergantung pada JavaScript berat.

## Brand Commitments

- Nama: Pitcar, Pitcar Service. Logo di `src/assets/images/logo-pitcar.png`.
- Bahasa Indonesia, sapaan "Anda".
- Arahan visual dari pemilik (14 November 2026): tema cyberpunk, dengan mode gelap dan mode terang.
- Bagian mobil dan gejala disebut dengan namanya, tanpa kode angka (permintaan pemilik, 14 November 2026).

## Evidence on Hand

Dikonfirmasi asli oleh pemilik pada 14 November 2026:

- 18.953+ mobil ditangani, 450+ unit dilayani per bulan, 5+ cabang aktif, beroperasi sejak 2019.
- Testimoni Juliani Tri Astuti (Pengusaha Kuliner) dan Sugiarto (Kontraktor), teks di `src/pages/index.astro`.
- Foto workshop dan mekanik asli di `src/assets/images/uploads/` dan `src/assets/images/DIMAS MUALIM.png`.

Tidak ada dan tidak boleh dikarang: harga, garansi, rating ulasan, alamat cabang, jam buka.

## Product Principles

1. Setiap interaksi berakhir di chat WhatsApp yang sudah terisi.
2. Darurat lebih dulu: nomor yang bisa dihubungi terlihat sebelum apa pun selesai dimuat.
3. Jelaskan kerusakan dengan bahasa pemilik mobil, bukan bahasa mekanik.
4. Tidak ada angka atau klaim tanpa sumber.
