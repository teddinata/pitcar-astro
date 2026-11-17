import { WA_PUSAT } from './jaringan';

export type AreaId = 'mesin' | 'ac' | 'rem' | 'transmisi' | 'listrik' | 'bodi';

export interface Gejala {
  judul: string;
  /** Heading above `poin`: causes for mechanical faults, options for bodywork. */
  labelPoin: string;
  poin: string[];
  layanan: string[];
  /** The car should not be driven: the result leads with the 24-hour line. */
  darurat?: boolean;
}

export interface Area {
  id: AreaId;
  nama: string;
  /** One-word label for the marker floating on the car. */
  tag: string;
  ringkas: string;
  gejala: Gejala[];
}

const PENYEBAB = 'Kemungkinan penyebab';

export const AREA: Area[] = [
  {
    id: 'mesin',
    nama: 'Mesin',
    tag: 'Mesin',
    ringkas: 'Susah hidup, panas, boros, lampu indikator',
    gejala: [
      {
        judul: 'Mesin susah hidup atau mogok',
        labelPoin: PENYEBAB,
        poin: ['Aki lemah atau terminalnya kotor', 'Busi atau koil sudah aus', 'Pompa atau filter bensin tersumbat'],
        layanan: ['Service Mesin', 'Scanning & ECU'],
        darurat: true,
      },
      {
        judul: 'Lampu check engine menyala',
        labelPoin: PENYEBAB,
        poin: ['Sensor membaca nilai tidak normal', 'Pembakaran pincang di salah satu silinder', 'Tutup tangki bensin tidak rapat'],
        layanan: ['Scanning & ECU'],
      },
      {
        judul: 'Mesin cepat panas',
        labelPoin: PENYEBAB,
        poin: ['Air radiator kurang atau bocor', 'Kipas radiator tidak berputar', 'Termostat macet'],
        layanan: ['Service Mesin'],
        darurat: true,
      },
      {
        judul: 'Tarikan berat dan boros bensin',
        labelPoin: PENYEBAB,
        poin: ['Filter udara kotor', 'Busi dan injektor kotor', 'Oli mesin sudah lewat jadwal ganti'],
        layanan: ['Service Mesin', 'Ganti Oli'],
      },
    ],
  },
  {
    id: 'ac',
    nama: 'AC',
    tag: 'AC',
    ringkas: 'Tidak dingin, bau, berisik',
    gejala: [
      {
        judul: 'AC tidak dingin',
        labelPoin: PENYEBAB,
        poin: ['Freon berkurang karena ada kebocoran', 'Kompresor atau magnet kopling melemah', 'Kondensor kotor'],
        layanan: ['Service AC'],
      },
      {
        judul: 'AC bau atau anginnya kecil',
        labelPoin: PENYEBAB,
        poin: ['Filter kabin kotor', 'Evaporator berjamur', 'Motor blower melemah'],
        layanan: ['Service AC'],
      },
      {
        judul: 'AC berisik saat dinyalakan',
        labelPoin: PENYEBAB,
        poin: ['Bearing kompresor aus', 'Tali kipas kendur', 'Motor blower kemasukan kotoran'],
        layanan: ['Service AC'],
      },
    ],
  },
  {
    id: 'rem',
    nama: 'Rem dan Kaki-Kaki',
    tag: 'Rem',
    ringkas: 'Rem bunyi, setir getar, bunyi gluduk',
    gejala: [
      {
        judul: 'Rem bunyi atau kurang pakem',
        labelPoin: PENYEBAB,
        poin: ['Kampas rem sudah tipis', 'Piringan rem bergelombang', 'Minyak rem perlu dikuras'],
        layanan: ['Rem & Kaki-Kaki'],
        darurat: true,
      },
      {
        judul: 'Setir bergetar atau menarik ke satu sisi',
        labelPoin: PENYEBAB,
        poin: ['Roda perlu balancing atau spooring', 'Tie rod atau ball joint aus', 'Tekanan ban tidak sama'],
        layanan: ['Rem & Kaki-Kaki'],
      },
      {
        judul: 'Bunyi gluduk di jalan rusak',
        labelPoin: PENYEBAB,
        poin: ['Shockbreaker melemah', 'Karet stabilizer atau link aus', 'Bushing arm getas'],
        layanan: ['Rem & Kaki-Kaki'],
      },
    ],
  },
  {
    id: 'transmisi',
    nama: 'Transmisi',
    tag: 'Transmisi',
    ringkas: 'Menyentak, selip, rembes oli',
    gejala: [
      {
        judul: 'Perpindahan gigi matic menyentak',
        labelPoin: PENYEBAB,
        poin: ['Oli transmisi sudah lewat jadwal ganti', 'Solenoid atau valve body bermasalah', 'Komputer transmisi perlu dicek dengan scanner'],
        layanan: ['Transmisi', 'Scanning & ECU'],
      },
      {
        judul: 'Kopling selip atau susah masuk gigi',
        labelPoin: PENYEBAB,
        poin: ['Kampas kopling tipis', 'Master atau release kopling bocor', 'Oli transmisi manual perlu diganti'],
        layanan: ['Transmisi'],
      },
      {
        judul: 'Ada rembesan oli di bawah mobil',
        labelPoin: PENYEBAB,
        poin: ['Seal transmisi atau as roda getas', 'Paking bak oli rembes', 'Baut pembuangan kendur'],
        layanan: ['Transmisi', 'Service Mesin'],
      },
    ],
  },
  {
    id: 'listrik',
    nama: 'Kelistrikan',
    tag: 'Listrik',
    ringkas: 'Aki tekor, lampu mati, starter klik',
    gejala: [
      {
        judul: 'Aki sering tekor',
        labelPoin: PENYEBAB,
        poin: ['Aki sudah habis umur pakainya', 'Alternator tidak mengisi', 'Ada arus bocor saat mobil dimatikan'],
        layanan: ['Kelistrikan', 'Scanning & ECU'],
      },
      {
        judul: 'Starter hanya bunyi klik',
        labelPoin: PENYEBAB,
        poin: ['Aki lemah', 'Terminal aki longgar atau berkerak', 'Motor starter aus'],
        layanan: ['Kelistrikan'],
        darurat: true,
      },
      {
        judul: 'Lampu, power window, atau klakson mati',
        labelPoin: PENYEBAB,
        poin: ['Sekring putus', 'Saklar atau motornya rusak', 'Kabel atau soket longgar'],
        layanan: ['Kelistrikan'],
      },
    ],
  },
  {
    id: 'bodi',
    nama: 'Bodi dan Cat',
    tag: 'Bodi',
    ringkas: 'Penyok, baret, cat kusam, interior',
    gejala: [
      {
        judul: 'Penyok atau baret',
        labelPoin: 'Pilihan penanganan',
        poin: ['Perbaikan panel yang penyok', 'Cat ulang per panel', 'Cat full body'],
        layanan: ['Body Repair & Detailing'],
      },
      {
        judul: 'Cat kusam',
        labelPoin: 'Pilihan penanganan',
        poin: ['Poles bodi', 'Detailing eksterior'],
        layanan: ['Body Repair & Detailing'],
      },
      {
        judul: 'Interior atau ruang mesin kotor',
        labelPoin: 'Pilihan penanganan',
        poin: ['Detailing interior', 'Detailing ruang mesin'],
        layanan: ['Body Repair & Detailing'],
      },
    ],
  },
];

export const WA_NUMBER = WA_PUSAT;

export const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const WA_DARURAT = waLink('DARURAT. Halo Pitcar, mobil saya bermasalah di jalan dan butuh bantuan sekarang.\nLokasi:\nMobil:\n#darurat-web');

export const WA_UMUM = waLink('Halo Pitcar, saya mau konsultasi soal mobil saya.\nMobil & tahun:\nKilometer:\nKeluhan:\n#diagnosa-web');

export const WA_CABANG = waLink('Halo Pitcar, saya mau tanya alamat cabang terdekat.\nKota saya:\n#cabang-web');

export { CABANG, type Cabang } from './jaringan';

export const WA_GCU = waLink('Halo Admin, saya mau booking Free General Check Up.\nMobil & tahun:\nKilometer:\nCC:\nKendala:\n#gcu-web');

export interface ItemBerkala {
  nama: string;
  /** Kilometres between two services of this item. */
  tiap: number;
}

/** Common intervals, not a manufacturer schedule: the UI says so next to the list. */
export const BERKALA: ItemBerkala[] = [
  { nama: 'Oli mesin dan filter oli', tiap: 10000 },
  { nama: 'Cek rem, ban, dan kaki-kaki', tiap: 10000 },
  { nama: 'Filter udara dan filter AC', tiap: 20000 },
  { nama: 'Busi', tiap: 40000 },
  { nama: 'Minyak rem', tiap: 40000 },
  { nama: 'Oli transmisi', tiap: 40000 },
  { nama: 'Air radiator', tiap: 80000 },
  { nama: 'Timing belt, untuk mesin yang memakainya', tiap: 100000 },
];

export const km = (value: number) => value.toLocaleString('id-ID');

export const paketUntuk = (value: number) => (value % 40000 === 0 ? 'Paket Servis 40 Ribu KM' : 'Paket Servis 10 Ribu KM');

export function pesanGejala(area: string, judul: string, mobil = '', kilometer: number | null = null) {
  return [
    'Halo Pitcar, saya mau konsultasi.',
    `Keluhan: ${judul}`,
    `Bagian: ${area}`,
    `Mobil & tahun: ${mobil}`,
    `Kilometer: ${kilometer ? `${km(kilometer)} km` : ''}`,
    'Lokasi:',
    '#diagnosa-web',
  ].join('\n');
}

export function pesanServis(kilometer: number, mobil = '') {
  return [
    'Halo Pitcar, saya mau booking servis berkala.',
    `Kilometer: ${km(kilometer)} km`,
    `Mobil & tahun: ${mobil}`,
    '#servis-web',
  ].join('\n');
}

export const KM_MIN = 10000;
export const KM_MAX = 200000;
export const KM_STEP = 10000;
