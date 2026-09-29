/* Konfigurasi Tailwind CDN bersama — muat SETELAH https://cdn.tailwindcss.com
   Palet:
     navy   #123B5D  header, navbar, footer
     brand  #1769AA  tombol, link, icon (Government Blue)
     green  #2E7D5B  aksen, kategori pendidikan (Papua Green)
     gold   #D9A441  highlight, garis, badge
     paper  #F7F9FA  background utama
     muted  #475569  teks sekunder (Slate)
     ink    #172033  teks utama (Dark)
*/
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        ink: '#172033',
        muted: '#475569',
        paper: '#F7F9FA',
        line: '#E2E8F0',
        'line-strong': '#CBD5E1',
        navy: { DEFAULT: '#123B5D', dark: '#0C2940', line: '#24527A' },
        brand: { DEFAULT: '#1769AA', dark: '#115189', 100: '#D6E6F3', 50: '#EDF4FA' },
        green: { DEFAULT: '#2E7D5B', 100: '#DCEFE6' },
        gold:  { DEFAULT: '#D9A441', 100: '#F7EBD2', dark: '#9A6B14' },
        'on-navy': '#C9D8E6'
      }
    }
  }
};
