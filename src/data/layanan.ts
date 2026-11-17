/**
 * Service catalogue. Feeds /layanan (overview) and /layanan/<slug> (one page per
 * service). Copy restates what PRODUCT.md and the original service list say;
 * no prices, durations or warranties.
 */
export interface Layanan {
  slug: string;
  /** Short name in lists and breadcrumbs. */
  nama: string;
  /** Page H1, phrased the way people search. */
  judul: string;
  /** <title> and meta description. */
  seo: string;
  deskripsi: string;
  ringkas: string;
  rinci: string[];
  /** Matching `layanan` names in the symptom data (src/data/diagnosa.ts). */
  diagnosa: string[];
  /** Words that mark a related blog post (matched against its slug). */
  kunci: string[];
  /** First line of the prefilled WhatsApp message. */
  pesan: string;
  /** The emergency line leads instead of the general chat. */
  darurat?: boolean;
}

export const LAYANAN: Layanan[] = [
  {
    slug: 'service-mesin',
    nama: 'Mesin dan performa',
    judul: 'Service mesin mobil di Purwokerto',
    seo: 'Service Mesin & Tune Up Mobil Purwokerto',
    deskripsi:
      'Tune up, purging, turun mesin (overhaul), dan servis radiator untuk mobil bensin dan diesel di Pitcar Service Purwokerto. Home service, pick up, atau datang ke workshop.',
    ringkas: 'Perawatan dan perbaikan mesin bensin maupun diesel, dari tune up sampai turun mesin.',
    rinci: ['Tune up mobil bensin dan diesel', 'Purging dan carbon clean', 'Turun mesin (overhaul)', 'Servis radiator'],
    diagnosa: ['Service Mesin'],
    kunci: ['tune-up', 'turun-mesin', 'overhaul', 'radiator', 'mesin', 'diesel'],
    pesan: 'Halo Pitcar, saya mau konsultasi servis mesin.',
  },
  {
    slug: 'ganti-oli',
    nama: 'Pelumas dan cairan',
    judul: 'Ganti oli mobil di Purwokerto',
    seo: 'Ganti Oli Mobil Purwokerto',
    deskripsi:
      'Ganti oli mesin dan transmisi, kuras minyak rem, dan ganti air radiator dengan merek Shell, Mobil 1, Fastron, Castrol, TMO, Honda Genuine, dan lainnya di Pitcar Purwokerto.',
    ringkas: 'Penggantian oli dan cairan dengan merek yang sesuai untuk mobil Anda.',
    rinci: [
      'Ganti oli mesin dan transmisi',
      'Kuras minyak rem',
      'Ganti air radiator (coolant)',
      'Pilihan merek: Shell, Mobil 1, Fastron, Castrol, TMO, Honda Genuine, dan lainnya',
    ],
    diagnosa: ['Ganti Oli'],
    kunci: ['ganti-oli', 'oli-mobil', 'kuras-oli', 'oli-gardan', 'filter-oli'],
    pesan: 'Halo Pitcar, saya mau ganti oli.',
  },
  {
    slug: 'scanning-ecu',
    nama: 'Kelistrikan dan diagnostik',
    judul: 'Scanning, ECU, dan kelistrikan mobil di Purwokerto',
    seo: 'Scanner Mobil, ECU & Kelistrikan Purwokerto',
    deskripsi:
      'Pendeteksian masalah dengan scanner, perbaikan ECU, dinamo ampere, starter, aki, dan sensor elektrikal di Pitcar Service Purwokerto.',
    ringkas: 'Pemeriksaan kelistrikan dan elektronik mobil dengan scanner, lalu perbaikan sumber masalahnya.',
    rinci: ['Scanning dan ECU reset', 'Perbaikan dinamo ampere dan starter', 'Perbaikan dan penggantian aki', 'Servis sensor elektrikal'],
    diagnosa: ['Scanning & ECU', 'Kelistrikan'],
    kunci: ['scanner', 'scan', 'ecu', 'kelistrikan', 'aki', 'dinamo', 'check-engine'],
    pesan: 'Halo Pitcar, saya mau scanning atau cek kelistrikan mobil.',
  },
  {
    slug: 'rem-kaki-kaki',
    nama: 'Kaki-kaki dan pengereman',
    judul: 'Servis rem dan kaki-kaki mobil di Purwokerto',
    seo: 'Bengkel Kaki-Kaki & Rem Mobil Purwokerto',
    deskripsi:
      'Servis rem, bubut disc brake, ganti kampas rem, rekondisi shockbreaker, serta servis rack steer dan understeel di Pitcar Service Purwokerto.',
    ringkas: 'Rem, suspensi, dan kemudi: bagian yang menentukan mobil tetap aman dikendarai.',
    rinci: ['Servis rem dan bubut disc brake', 'Ganti kampas rem', 'Rekondisi shockbreaker', 'Servis rack steer dan understeel'],
    diagnosa: ['Rem & Kaki-Kaki'],
    kunci: ['kaki-kaki', 'kaki-mobil', 'rem', 'shock', 'spooring', 'balancing', 'rack-steer'],
    pesan: 'Halo Pitcar, saya mau servis rem atau kaki-kaki.',
  },
  {
    slug: 'service-ac',
    nama: 'AC',
    judul: 'Service AC mobil di Purwokerto',
    seo: 'Service AC Mobil Purwokerto',
    deskripsi:
      'Perawatan dan perbaikan AC mobil di Pitcar Purwokerto: flushing, isi freon dan oli kompresor, perbaikan evaporator dan kebocoran, sampai turun dashboard.',
    ringkas: 'Perawatan dan perbaikan AC kabin, dari isi freon sampai turun dashboard.',
    rinci: ['Flushing sistem AC', 'Isi freon dan oli kompresor', 'Perbaikan evaporator dan kebocoran', 'Turun dashboard'],
    diagnosa: ['Service AC'],
    kunci: ['ac-mobil', 'service-ac', 'servis-ac', 'kompresor', 'freon', 'bengkel-ac'],
    pesan: 'Halo Pitcar, saya mau servis AC mobil.',
  },
  {
    slug: 'transmisi-matic',
    nama: 'Transmisi manual dan matic',
    judul: 'Servis transmisi manual dan matic di Purwokerto',
    seo: 'Servis Transmisi Matic (AT, CVT, DCT, DSG) Purwokerto',
    deskripsi:
      'Perbaikan transmisi manual dan matic AT, CVT, DCT, dan DSG di Pitcar Service Purwokerto: overhaul, ganti kampas kopling, dan kuras oli transmisi.',
    ringkas: 'Perbaikan ringan sampai berat untuk transmisi manual dan matic: AT, CVT, DCT, DSG.',
    rinci: ['Servis transmisi manual', 'Overhaul matic (AT, CVT, DCT, DSG)', 'Ganti kampas kopling', 'Kuras oli transmisi (ATF, CVTF)'],
    diagnosa: ['Transmisi'],
    kunci: ['transmisi', 'matic', 'cvt', 'kopling', 'atf'],
    pesan: 'Halo Pitcar, saya mau konsultasi transmisi.',
  },
  {
    slug: 'body-repair-detailing',
    nama: 'Bodi, cat, dan detailing',
    judul: 'Body repair, cat, dan detailing mobil di Purwokerto',
    seo: 'Body Repair, Cat & Detailing Mobil Purwokerto',
    deskripsi:
      'Body repair untuk bodi penyok dan keropos, cat per panel atau full body, poles, serta detailing interior, eksterior, dan mesin di Pitcar Service Purwokerto.',
    ringkas: 'Perbaikan bodi dan perawatan tampilan mobil, per panel sampai full body.',
    rinci: ['Body repair (penyok dan keropos)', 'Cat full body atau per panel', 'Poles bodi', 'Detailing interior, eksterior, dan mesin'],
    diagnosa: ['Body Repair & Detailing'],
    kunci: ['body-repair', 'cat-mobil', 'bengkel-cat', 'cat-ulang', 'poles', 'detailing', 'ketok'],
    pesan: 'Halo Pitcar, saya mau konsultasi body repair atau cat.',
  },
  {
    slug: 'perawatan-berkala',
    nama: 'Perawatan berkala',
    judul: 'Servis berkala mobil di Purwokerto',
    seo: 'Servis Berkala Mobil 10 Ribu & 40 Ribu KM Purwokerto',
    deskripsi:
      'Paket Servis 10 Ribu KM dan 40 Ribu KM, ganti filter udara dan filter AC, serta check-up 32 titik kendaraan di Pitcar Service Purwokerto.',
    ringkas: 'Servis rutin sesuai kilometer mobil, dengan check-up 32 titik kendaraan.',
    rinci: ['Paket Servis 10 Ribu KM', 'Paket Servis 40 Ribu KM', 'Ganti filter udara dan filter AC', 'Check-up 32 titik kendaraan'],
    diagnosa: [],
    kunci: ['servis-berkala', 'service-berkala', 'berkala', 'check-up', 'general-check'],
    pesan: 'Halo Pitcar, saya mau booking servis berkala.',
  },
  {
    slug: 'mobil-eropa',
    nama: 'Mobil Eropa dan Amerika',
    judul: 'Bengkel mobil Eropa dan Amerika di Purwokerto',
    seo: 'Bengkel Mobil Eropa (BMW, Mercedes, VW) Purwokerto',
    deskripsi:
      'Servis dan perbaikan mobil Eropa dan Amerika di Pitcar Purwokerto: BMW, Mercedes-Benz, Volkswagen, Audi, MINI, Porsche, Renault, Peugeot, Ford, Chevrolet, Jeep.',
    ringkas: 'Perawatan dan perbaikan untuk merek Eropa dan Amerika.',
    rinci: [
      'BMW, Mercedes-Benz, Volkswagen, Audi',
      'MINI, Porsche, Renault, Peugeot',
      'Ford, Chevrolet, Jeep',
    ],
    diagnosa: [],
    kunci: ['bmw', 'mercedes', 'eropa', 'volkswagen', 'vw', 'audi', 'mini', 'ford', 'chevrolet', 'jeep', 'peugeot'],
    pesan: 'Halo Pitcar, saya mau konsultasi mobil Eropa/Amerika.',
  },
  {
    slug: 'darurat-24-jam',
    nama: 'Darurat dan home service',
    judul: 'Bengkel mobil 24 jam dan home service di Purwokerto',
    seo: 'Bengkel Mobil 24 Jam, Derek & Home Service Purwokerto',
    deskripsi:
      'Mobil mogok atau bermasalah di jalan? Pitcar Purwokerto melayani emergency call 24 jam, towing, home service (mekanik panggilan), dan inspeksi mobil bekas di lokasi.',
    ringkas: 'Penanganan di lokasi mobil Anda, termasuk saat mogok di jalan, jam berapa pun.',
    rinci: ['Emergency call 24 jam', 'Towing dan derek', 'Home service (mekanik panggilan)', 'Inspeksi mobil bekas di lokasi'],
    diagnosa: [],
    kunci: ['24-jam', 'derek', 'towing', 'panggilan', 'home-service', 'darurat', 'mogok'],
    pesan: 'Halo Pitcar, saya butuh mekanik datang ke lokasi.',
    darurat: true,
  },
];
