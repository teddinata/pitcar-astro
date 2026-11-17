/**
 * The Pitcar network: one record per branch or shop.
 *
 * `wa` is the branch's own admin number (from the Kirimdev accounts, confirmed
 * by the owner 2026-11-17). A branch without one falls back to WA_PUSAT with
 * the branch named in the message. WA_PUSAT stays the 24-hour emergency line.
 *
 * `maps` is the Google Maps search text for the business listing. `placeId`
 * (from Google) makes the review links exact and enables the "Tulis ulasan"
 * link; without it the links fall back to a Maps search.
 */

export const WA_PUSAT = '6285866224051';

export type Jenis = 'bengkel' | 'toko';

export interface Cabang {
  id: string;
  /** Short label used in the branch list and picker. */
  kota: string;
  /** Business name as listed on Google. */
  nama: string;
  jenis: Jenis;
  catatan?: string;
  baru?: boolean;
  wa?: string;
  maps?: string;
  /** Google Maps listing id (the `cid`), copied from each listing on 2026-11-17. */
  cid?: string;
  placeId?: string;
}

export const CABANG: Cabang[] = [
  {
    id: 'purwokerto',
    cid: '6077907684789831576',
    wa: '6285647679267',
    kota: 'Purwokerto',
    nama: 'Pitcar Service Purwokerto',
    jenis: 'bengkel',
    maps: 'Pitcar Service Purwokerto',
  },
  {
    id: 'cilacap',
    cid: '16994033649883454027',
    wa: '6282180888106',
    kota: 'Cilacap',
    nama: 'Otokits by Pitcar Cilacap',
    jenis: 'bengkel',
    catatan: 'Otokits',
    maps: 'Otokits by Pitcar Cilacap',
  },
  {
    id: 'purbalingga',
    cid: '5475464411957529969',
    wa: '6285859056857',
    kota: 'Purbalingga',
    nama: 'Pitcar Purbalingga',
    jenis: 'bengkel',
    baru: true,
    maps: 'Pitcar Purbalingga',
  },
  {
    id: 'tegal',
    cid: '11462803128633279898',
    wa: '6285738340334',
    kota: 'Tegal',
    nama: 'Pitcar Tegal',
    jenis: 'bengkel',
    baru: true,
    maps: 'Pitcar Tegal',
  },
  {
    id: 'batam',
    cid: '16569928097095192567',
    wa: '6282372437408',
    kota: 'Batam',
    nama: 'Pitcar Batam',
    jenis: 'bengkel',
    baru: true,
    maps: 'Pitcar Batam',
  },
  {
    id: 'accessories',
    cid: '11771307101146667804',
    wa: '6288971343478',
    kota: 'Auto Accessories',
    nama: 'Pitcar Auto Accessories',
    jenis: 'toko',
    maps: 'Pitcar Accessories',
  },
  { id: 'autopart', wa: '6285194354837', kota: 'Autopart', nama: 'Pitcar Autopart', jenis: 'toko' },
];

export const BENGKEL = CABANG.filter((c) => c.jenis === 'bengkel');

/** Listings that collect Google reviews. */
export const BERULASAN = CABANG.filter((c) => c.cid || c.maps || c.placeId);

const wa = (nomor: string, text: string) => `https://wa.me/${nomor}?text=${encodeURIComponent(text)}`;

export const waPusat = (text: string) => wa(WA_PUSAT, text);

/** Prefilled chat for one branch, routed to its own admin when it has one. */
export function waCabang(c: Cabang, tag = 'cabang-web') {
  const text =
    c.jenis === 'toko'
      ? [`Halo ${c.nama}, saya mau tanya produk.`, 'Mobil & tahun:', 'Yang dicari:', `#${tag}-${c.id}`].join('\n')
      : [
          `Halo Pitcar ${c.kota}, saya mau konsultasi soal mobil saya.`,
          `Cabang: ${c.nama}`,
          'Mobil & tahun:',
          'Kilometer:',
          'Keluhan:',
          `#${tag}-${c.id}`,
        ].join('\n');
  return wa(c.wa ?? WA_PUSAT, text);
}

export function mapsUrl(c: Cabang) {
  if (c.cid) return `https://maps.google.com/?cid=${c.cid}`;
  const q = encodeURIComponent(c.maps ?? c.nama);
  return c.placeId
    ? `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${c.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export const tulisUlasanUrl = (c: Cabang) =>
  c.placeId ? `https://search.google.com/local/writereview?placeid=${c.placeId}` : undefined;
