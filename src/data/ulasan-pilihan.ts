/**
 * Google Maps reviews picked by hand on 17 November 2026, at the owner's
 * request: per listing, the latest 4- and 5-star reviews that have text,
 * reviews with photos first, five per listing. Text is copied as written
 * (only a leading star-emoji line and a trailing "…" display artifact were
 * removed). Reviewer names are left out on purpose: the site credits Google
 * and the branch instead of naming private people.
 *
 * Skipped while picking: one Batam review that promises a parts warranty
 * (PRODUCT.md: no warranty claims) and one-word reviews.
 *
 * `bulan` is the month Google showed as "x months ago" on the pick date.
 * Ratings are a snapshot of that date and are labeled as such on the page.
 * When GOOGLE_PLACES_API_KEY is set, live data from src/data/ulasan.ts
 * replaces this file.
 */

export const DIAMBIL = '2026-11-17';

export const RATING: Record<string, { rating: number; jumlah: number }> = {
  purwokerto: { rating: 4.7, jumlah: 750 },
  cilacap: { rating: 4.6, jumlah: 290 },
  purbalingga: { rating: 4.9, jumlah: 96 },
  tegal: { rating: 4.6, jumlah: 46 },
  batam: { rating: 4.7, jumlah: 41 },
  accessories: { rating: 4.7, jumlah: 136 },
};

export interface UlasanPilihan {
  cabang: string;
  bintang: number;
  bulan: string;
  foto: boolean;
  teks: string;
}

export const ULASAN_PILIHAN: UlasanPilihan[] = [
  // Pitcar Service Purwokerto
  {
    cabang: 'purwokerto',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'tempat nyaman, mekanik berpengalaman',
  },
  {
    cabang: 'purwokerto',
    bintang: 5,
    bulan: '2026-07',
    foto: true,
    teks: 'Pelayanan cepat mantap, mekanik juga ramah²',
  },
  {
    cabang: 'purwokerto',
    bintang: 5,
    bulan: '2026-07',
    foto: true,
    teks: 'Pelayanan cepat, ramah, ruang tunggu juga enak',
  },
  {
    cabang: 'purwokerto',
    bintang: 5,
    bulan: '2026-07',
    foto: true,
    teks: 'Pelayanan ramah, fast respon',
  },
  {
    cabang: 'purwokerto',
    bintang: 5,
    bulan: '2026-07',
    foto: true,
    teks: 'Pas kebetulan lagi didaerah purwokerto ada kendala dengan kendaraan saya,ketemu bengkel ini saya mampir dan cerita permasalahan nya,staf karyawan nya ramah ramah dan menjelaskan semua nya,dan akhir nya kendaraan saya langsung di tangani.Bagi yang sedang berada disekitaran purwokerto bila masalah pada kendaraan ada,bisa langsung aja mampir ke bengkel ini',
  },

  // Otokits by Pitcar Cilacap
  {
    cabang: 'cilacap',
    bintang: 5,
    bulan: '2026-11',
    foto: true,
    teks: 'Pelayanan ramah, ruang tunggu adem, penjelasan mekaniknya detail dan membuat  kita puas.\nTerima kasih',
  },
  {
    cabang: 'cilacap',
    bintang: 5,
    bulan: '2026-05',
    foto: true,
    teks: 'Service di Pitcar puas banget. Kemarin tune up, gurah mesin, sama ganti oli di sini. Pelayanannya cepat, mekaniknya juga komunikatif dan pengerjaannya rapi. Setelah diservice, tarikan mobil terasa lebih enak dan mesin lebih halus. Tempat tunggunya juga nyaman jadi nggak bikin bosan nunggu. Recommended buat yang cari bengkel dengan pelayanan bagus dan pengerjaan cepat 👍',
  },
  {
    cabang: 'cilacap',
    bintang: 5,
    bulan: '2026-05',
    foto: true,
    teks: 'Pelayanan baik dan cepat, karyawan dan mekanik ramah sekali. Harga murah rekomendasi',
  },
  {
    cabang: 'cilacap',
    bintang: 5,
    bulan: '2026-05',
    foto: true,
    teks: 'Pelayan bagus tempat yang nyaman',
  },
  {
    cabang: 'cilacap',
    bintang: 5,
    bulan: '2026-04',
    foto: true,
    teks: 'pertama kali service mobil disini, service nya oke sih. pegawainya baik bgtt.. maafin aku yang banyak tanya ini huhu',
  },

  // Pitcar Service Purbalingga
  {
    cabang: 'purbalingga',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'Pelayanan ramah, admin fast respon, pengerjaan cepat dan rapih, tempat bersih nyaman buat nunggu juga',
  },
  {
    cabang: 'purbalingga',
    bintang: 5,
    bulan: '2026-09',
    foto: true,
    teks: 'Pelayanan di Pitcar Purbalingga sangat memuaskan. Staff-nya ramah, responsif, dan menjelaskan kondisi kendaraan dengan cukup jelas. Proses servis juga cepat dan pengerjaannya rapi. Tempatnya nyaman, jadi nggak khawatir menunggu saat kendaraan diservis. Harganya juga menurut saya cukup sesuai dengan pelayanan yang diberikan.\n\nRecommended banget untuk yang cari tempat servis mobil yang terpercaya di Purbalingga! 👍',
  },
  {
    cabang: 'purbalingga',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'Sesuai ratingnya rata-rata 5. Pelayanan ramah tempat nyaman. Yang saya suka terdapat kejelasan harga dan biaya didepan sehingga apabila msh ada budget bisa nambah layanan lain lagi. Pertahankan layanannya pitcar. Tersedia camilan dan bisa bikin kopi teh.',
  },
  {
    cabang: 'purbalingga',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'Service.nya keren, tempatnya nyaman, terima kasih yaa 💐💐💐',
  },
  {
    cabang: 'purbalingga',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'Pelayanan baik, mantap',
  },

  // Pitcar Service Tegal
  {
    cabang: 'tegal',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'rekomen buat yang mau service pelayanan ramah, ruang tunggu nyaman, di jelasin dengan detail',
  },
  {
    cabang: 'tegal',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'Pelayanan ramah dan part oli terjamin ORI👍👍',
  },
  {
    cabang: 'tegal',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: '✅ Pelayanan cepat\n✅ Ruang tunggu nyama dapat fasilitas minum gratis juga\n✅ Disarankan untuk booking terlebih dahulu supaya cepat',
  },
  {
    cabang: 'tegal',
    bintang: 5,
    bulan: '2026-09',
    foto: true,
    teks: 'Ruang tunggu mantap ada cofee dan cemilan',
  },
  {
    cabang: 'tegal',
    bintang: 5,
    bulan: '2026-10',
    foto: false,
    teks: 'Tempat tunggu nyaman, harga selalu diinfoin di awal, pengerjaan step by step jg diinfokan,, keren 👍👍',
  },

  // Pitcar Service Batam
  {
    cabang: 'batam',
    bintang: 5,
    bulan: '2026-11',
    foto: true,
    teks: 'trusted and recommended',
  },
  {
    cabang: 'batam',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'Cukup puas dengan pelayanannya',
  },
  {
    cabang: 'batam',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'Pelayanan mantapp bakal balik lagi',
  },
  {
    cabang: 'batam',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'Tempatnya mantap, mobil saya bunyi2 dari 2 minggu lalu baru sempat bawa ke bengkel, rupanya cuman ad yg loss screw nya, jadi di ketatin, tempatnya jujur, pelayanannya mantap  dan fee nya dikasih gratis gk usah bayar😄😄, thanks yaa',
  },
  {
    cabang: 'batam',
    bintang: 5,
    bulan: '2026-10',
    foto: true,
    teks: 'Pengerjaan bagus dan ruang tunggu nyaman',
  },

  // Pitcar Auto Accessories (Husen Utama)
  {
    cabang: 'accessories',
    bintang: 5,
    bulan: '2026-11',
    foto: true,
    teks: 'Keren sih, pasang head unit double din plus kamera mundur, proses cepat, harga bersahabat',
  },
  {
    cabang: 'accessories',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'Pelayanan sangat memuaskan, cari aksesoris dan perlengkapan di Pitcar Auto Accessories sangat lengkap. Mantap 👍',
  },
  {
    cabang: 'accessories',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'mantap, pemasangan cepat & rapih, harga jg bersahabat 🙏🏻🙏🏻',
  },
  {
    cabang: 'accessories',
    bintang: 5,
    bulan: '2026-08',
    foto: true,
    teks: 'Mengatasi solusi khususnya untuk center lock dan juga kamera belakang',
  },
  {
    cabang: 'accessories',
    bintang: 5,
    bulan: '2026-01',
    foto: true,
    teks: 'Mantap beli di sini lengkap dan murah, next kalo butuh acc pasti ke sini lagi',
  },
];
