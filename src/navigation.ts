import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Beranda',
      href: getPermalink('/'),
    },
    {
      text: 'Layanan Servis',
      links: [
        {
          text: 'Perawatan Berkala & Umum',
          href: getPermalink('/layanan'),
        },
        {
          text: 'Inspeksi & Diagnostik',
          href: getPermalink('/inspeksi-mobil-bekas'),
        },
      ],
    },
    {
      text: 'Profil Pitcar',
      href: getPermalink('/tentang'),
    },
    {
      text: 'Jurnal Otomotif',
      href: getBlogPermalink(),
    },
    {
      text: 'Pusat Bantuan',
      href: getPermalink('/hubungi-kami'),
    },
    {
      text: 'Kemitraan',
      href: getPermalink('/kemitraan'),
    },
  ],
  actions: [{ text: 'Booking Servis', href: 'https://wa.me/6285866224051?text=Halo%20Pitcar%2C%20saya%20ingin%20melakukan%20reservasi%2Fbooking%20untuk%20servis%20mobil%20saya.', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Layanan & Solusi Kendaraan',
      links: [
        { text: 'Engine Maintenance', href: getPermalink('/layanan') },
        { text: 'Penggantian Pelumas', href: getPermalink('/layanan') },
        { text: 'Sistem Pendingin AC', href: getPermalink('/layanan') },
        { text: 'Perbaikan Kaki-Kaki & Understeel', href: getPermalink('/layanan') },
        { text: 'Layanan Darurat (Home Service)', href: getPermalink('/layanan') },
        { text: 'Inspeksi & Diagnostik', href: getPermalink('/inspeksi-mobil-bekas') },
      ],
    },
    {
      title: 'Ekosistem Pitcar',
      links: [
        { text: 'Profil Perusahaan', href: getPermalink('/tentang') },
        { text: 'Jurnal Otomotif', href: getBlogPermalink() },
        { text: 'Kemitraan & Franchise', href: getPermalink('/kemitraan') },
        { text: 'Karir & Talenta', href: '#' },
        { text: 'Pusat Bantuan & Kontak', href: getPermalink('/hubungi-kami') },
      ],
    },
  ],
  secondaryLinks: [{ text: 'Hubungi Kami', href: getPermalink('/hubungi-kami') }],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/pitcar_id/' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © 2024 Pitcar Service · All rights reserved.
  `,
};
