/**
 * Google ratings and reviews for each Pitcar listing, fetched once per build
 * from the Places API (New). Set GOOGLE_PLACES_API_KEY in the build
 * environment (Cloudflare Pages: Settings → Environment variables) to enable
 * it. Without the key, or when a request fails, every listing still renders
 * with a link to its Google Maps page, and no rating is shown: the site never
 * prints a number that did not come from Google.
 */
import { BERULASAN, type Cabang } from './jaringan';
import { DIAMBIL, RATING, ULASAN_PILIHAN } from './ulasan-pilihan';

export interface Review {
  /** Absent for hand-picked reviews: the site credits the branch, not the person. */
  penulis?: string;
  bintang: number;
  teks: string;
  kapan: string;
  profil?: string;
  foto?: boolean;
}

export interface Listing {
  cabang: Cabang;
  rating?: number;
  jumlah?: number;
  url?: string;
  alamat?: string;
  placeId?: string;
  jam?: string[];
  ulasan: Review[];
  /** Date of the hand-picked snapshot; absent for live API data. */
  per?: string;
}

const FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'regularOpeningHours.weekdayDescriptions',
  'reviews',
];

interface PlaceResponse {
  id?: string;
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  reviews?: {
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    authorAttribution?: { displayName?: string; uri?: string };
  }[];
}

async function ambil(c: Cabang, key: string): Promise<PlaceResponse | undefined> {
  const headers = { 'X-Goog-Api-Key': key, 'Content-Type': 'application/json' };
  if (c.placeId) {
    const res = await fetch(`https://places.googleapis.com/v1/places/${c.placeId}?languageCode=id`, {
      headers: { ...headers, 'X-Goog-FieldMask': FIELDS.join(',') },
    });
    return res.ok ? ((await res.json()) as PlaceResponse) : undefined;
  }
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { ...headers, 'X-Goog-FieldMask': FIELDS.map((f) => `places.${f}`).join(',') },
    body: JSON.stringify({ textQuery: c.maps ?? c.nama, languageCode: 'id', regionCode: 'ID', pageSize: 1 }),
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { places?: PlaceResponse[] };
  return data.places?.[0];
}

function bentuk(c: Cabang, p?: PlaceResponse): Listing {
  if (!p) return dariPilihan(c);
  return {
    cabang: c,
    rating: p.rating,
    jumlah: p.userRatingCount,
    url: p.googleMapsUri,
    alamat: p.formattedAddress,
    placeId: p.id,
    jam: p.regularOpeningHours?.weekdayDescriptions,
    ulasan: (p.reviews ?? [])
      .map((r) => ({
        penulis: r.authorAttribution?.displayName ?? 'Pengguna Google',
        profil: r.authorAttribution?.uri,
        bintang: r.rating ?? 0,
        teks: (r.originalText?.text ?? r.text?.text ?? '').trim(),
        kapan: r.relativePublishTimeDescription ?? '',
      }))
      .filter((r) => r.teks),
  };
}

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const namaBulan = (ym: string) => `${BULAN[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;

/** Hand-picked snapshot (src/data/ulasan-pilihan.ts), used when no API key is set. */
function dariPilihan(c: Cabang): Listing {
  return {
    cabang: c,
    ...RATING[c.id],
    per: DIAMBIL,
    ulasan: ULASAN_PILIHAN.filter((u) => u.cabang === c.id).map((u) => ({
      bintang: u.bintang,
      teks: u.teks,
      kapan: namaBulan(u.bulan),
      foto: u.foto,
    })),
  };
}

let cache: Promise<Listing[]> | undefined;

export function getUlasan(): Promise<Listing[]> {
  cache ??= (async () => {
    const key = import.meta.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_PLACES_API_KEY;
    if (!key) return BERULASAN.map(dariPilihan);
    return Promise.all(
      BERULASAN.map(async (c) => {
        try {
          return bentuk(c, await ambil(c, key));
        } catch (err) {
          console.warn(`[ulasan] ${c.nama}: ${(err as Error).message}`);
          return dariPilihan(c);
        }
      })
    );
  })();
  return cache;
}
