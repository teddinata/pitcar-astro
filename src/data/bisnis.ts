/**
 * schema.org description of Pitcar Service for search engines. Only facts the
 * owner confirmed (PRODUCT.md) go here. Opening hours, geo coordinates, price
 * range and ratings are left out until they come from the owner or Google.
 */
import { CABANG, WA_PUSAT } from './jaringan';

const SITE = 'https://pitcar.co.id';

export const ORG_ID = `${SITE}/#organization`;
export const BENGKEL_ID = `${SITE}/#bengkel-purwokerto`;

export const organisasi = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Pitcar Service',
  url: SITE,
  logo: `${SITE}/brand/logo-pitcar.png`,
  foundingDate: '2019',
  sameAs: ['https://www.instagram.com/pitcar.service/'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: `+${WA_PUSAT}`,
    contactType: 'customer service',
    availableLanguage: 'Indonesian',
  },
  department: CABANG.filter((c) => c.jenis === 'bengkel' && c.id !== 'purwokerto').map((c) => ({
    '@type': 'AutoRepair',
    name: c.nama,
    address: { '@type': 'PostalAddress', addressLocality: c.kota, addressCountry: 'ID' },
  })),
};

export const bengkelPurwokerto = {
  '@type': 'AutoRepair',
  '@id': BENGKEL_ID,
  name: 'Pitcar Service Purwokerto',
  url: SITE,
  image: `${SITE}/brand/workshop-purwokerto.jpg`,
  telephone: `+${WA_PUSAT}`,
  parentOrganization: { '@id': ORG_ID },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Pancurawis no. 14',
    addressLocality: 'Purwokerto Selatan',
    addressRegion: 'Jawa Tengah',
    postalCode: '53147',
    addressCountry: 'ID',
  },
  areaServed: [
    { '@type': 'City', name: 'Purwokerto' },
    { '@type': 'AdministrativeArea', name: 'Kabupaten Banyumas' },
  ],
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Pitcar+Service+Jl.+Pancurawis+no.+14+Purwokerto+Selatan',
  paymentAccepted: 'Cash, Bank transfer',
};

export function layananSchema(nama: string, deskripsi: string, url: string) {
  return {
    '@type': 'Service',
    name: nama,
    description: deskripsi,
    url,
    serviceType: nama,
    provider: { '@id': BENGKEL_ID },
    areaServed: { '@type': 'City', name: 'Purwokerto' },
  };
}
