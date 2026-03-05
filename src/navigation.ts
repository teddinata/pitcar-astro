import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Layanan Kami',
      links: [
        {
          text: 'General Service',
          href: getPermalink('/layanan'),
        },
        {
          text: 'Inspeksi Mobil Bekas',
          href: getPermalink('/inspeksi-mobil-bekas'),
        },
      ],
    },
    {
      text: 'Tentang Kami',
      href: getPermalink('/tentang'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Hubungi Kami',
      href: getPermalink('/hubungi-kami'),
    },
    {
      text: 'Kemitraan',
      href: getPermalink('/kemitraan'),
    },
  ],
  actions: [{ text: 'WhatsApp Kami', href: 'https://wa.me/6281227636171', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Layanan',
      links: [
        { text: 'Service Mesin', href: getPermalink('/layanan') },
        { text: 'Ganti Oli', href: getPermalink('/layanan') },
        { text: 'Service AC', href: getPermalink('/layanan') },
        { text: 'Body Repair', href: getPermalink('/layanan') },
        { text: 'Emergency 24 Jam', href: getPermalink('/layanan') },
        { text: 'Inspeksi Mobil Bekas', href: getPermalink('/inspeksi-mobil-bekas') },
      ],
    },
    {
      title: 'Perusahaan',
      links: [
        { text: 'Tentang Kami', href: getPermalink('/tentang') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Hubungi Kami', href: getPermalink('/hubungi-kami') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Hubungi Kami', href: getPermalink('/hubungi-kami') },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/pitcar_id/' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © 2024 Pitcar Service · All rights reserved.
  `,
};
