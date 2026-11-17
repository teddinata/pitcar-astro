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
  actions: [{ variant: 'primary' as const, text: 'Booking Servis', href: 'https://wa.me/6285866224051?text=Halo%20Pitcar%2C%20saya%20ingin%20melakukan%20reservasi%2Fbooking%20untuk%20servis%20mobil%20saya.', target: '_blank', 'data-pilih-cabang': '' }],
};

export const footerData = {
  links: [
    {
      title: 'Layanan Servis',
      links: [
        { text: 'Semua layanan', href: getPermalink('/layanan') },
        { text: 'Service AC', href: getPermalink('/layanan/service-ac') },
        { text: 'Transmisi matic', href: getPermalink('/layanan/transmisi-matic') },
        { text: 'Rem dan kaki-kaki', href: getPermalink('/layanan/rem-kaki-kaki') },
        { text: 'Inspeksi mobil bekas', href: getPermalink('/inspeksi-mobil-bekas') },
        { text: 'Darurat 24 jam', href: getPermalink('/layanan/darurat-24-jam') },
      ],
    },
    {
      title: 'Keluarga Pitcar',
      links: [
        { text: 'Profil Perusahaan', href: getPermalink('/tentang') },
        { text: 'Peluang Kemitraan', href: getPermalink('/kemitraan') },
      ],
    },
    {
      title: 'Informasi',
      links: [
        { text: 'Jurnal Otomotif', href: getBlogPermalink() },
        { text: 'Pusat Bantuan', href: getPermalink('/hubungi-kami') },
      ],
    },
  ],
  secondaryLinks: [{ text: 'Hubungi Kami', href: getPermalink('/hubungi-kami') }],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/pitcar.service/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © 2026 Pitcar Service. Hak cipta dilindungi.
  `,
};
