/* =========================================================
   DB BEASISWA — Template layout
   Menyisipkan topbar, header/navbar, dan footer ke setiap halaman.

   Pemakaian di halaman:
     <body data-page="beranda">
       <div id="site-header"></div>
       ...
       <div id="site-footer"></div>
       <script src="asset/js/layout.js"></script>

   data-page: beranda | tentang | pengumuman | bantuan | peta | data
   ========================================================= */
(function () {
  var SITE = {
    name: 'DB BEASISWA',
    sub: 'Dinas Pendidikan Provinsi',
    fullOrg: 'Dinas Pendidikan Provinsi Papua Pegunungan',
    logo: 'asset/img/logo-dinas.svg',
    year: 2026
  };

  var NAV = [
    { id: 'beranda',    label: 'Beranda',            href: 'index.html',         icon: 'fa-house' },
    { id: 'tentang',    label: 'Tentang',            href: 'index.html#tentang', icon: 'fa-circle-info' },
    { id: 'pengumuman', label: 'Berita/Pengumuman',  href: 'pengumuman.html',    icon: 'fa-bullhorn' },
    { id: 'bantuan',    label: 'Pusat Bantuan',      href: 'bantuan.html',       icon: 'fa-life-ring' }
  ];

  var SERVICES = [
    { label: 'Peta Sebaran GIS',  href: 'peta-gis.html',     icon: 'fa-map-location-dot' },
    { label: 'Pustaka Data',      href: 'pustaka-data.html', icon: 'fa-database' },
    { label: 'Masuk Portal',      href: 'login.html',        icon: 'fa-right-to-bracket' }
  ];

  var page = document.body.getAttribute('data-page') || '';

  function brand() {
    return (
      '<a href="index.html" class="brand" aria-label="' + SITE.name + ' — Beranda">' +
        '<img src="' + SITE.logo + '" alt="Logo ' + SITE.fullOrg + '" width="44" height="44">' +
        '<div>' +
          '<div class="brand-name"><span>DB</span> BEASISWA</div>' +
          '<div class="brand-sub">' + SITE.sub + '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function navLinks(cls) {
    return NAV.map(function (item) {
      var active = item.id === page ? ' is-active' : '';
      var current = item.id === page ? ' aria-current="page"' : '';
      return '<a href="' + item.href + '" class="' + cls + active + '"' + current + ' data-nav="' + item.id + '">' +
               '<i class="fa-solid ' + item.icon + '" aria-hidden="true"></i>' +
               '<span>' + item.label + '</span>' +
             '</a>';
    }).join('');
  }

  function headerHTML() {
    return (
      '<div class="topbar">' +
        '<div class="container">' +
          '<span>Portal Resmi ' + SITE.fullOrg + '</span>' +
          '<div class="topbar-links">' +
            '<a href="peta-gis.html"' + (page === 'peta' ? ' class="is-active" aria-current="page"' : '') + '><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>Peta GIS</a>' +
            '<a href="pustaka-data.html"' + (page === 'data' ? ' class="is-active" aria-current="page"' : '') + '><i class="fa-solid fa-database" aria-hidden="true"></i>Pustaka Data</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<header class="site-header">' +
        '<div class="container">' +
          brand() +
          '<nav class="main-nav" aria-label="Navigasi utama">' + navLinks('') + '</nav>' +
          '<div class="header-actions">' +
            '<a href="login.html" class="btn btn-primary btn-sm header-login">' +
              '<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span>Masuk</span>' +
            '</a>' +
            '<button type="button" class="nav-toggle" aria-label="Buka menu" aria-expanded="false" aria-controls="mobile-nav">' +
              '<i class="fa-solid fa-bars" aria-hidden="true"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<nav id="mobile-nav" class="mobile-nav" aria-label="Navigasi seluler">' +
          navLinks('') +
          '<a href="login.html" class="mobile-login"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span>Masuk Portal</span></a>' +
        '</nav>' +
      '</header>'
    );
  }

  function footerHTML() {
    var navList = NAV.map(function (i) {
      return '<li><a href="' + i.href + '"><i class="fa-solid ' + i.icon + '" aria-hidden="true"></i>' + i.label + '</a></li>';
    }).join('');
    var svcList = SERVICES.map(function (i) {
      return '<li><a href="' + i.href + '"><i class="fa-solid ' + i.icon + '" aria-hidden="true"></i>' + i.label + '</a></li>';
    }).join('');

    return (
      '<footer class="site-footer">' +
        '<div class="noken-strip" aria-hidden="true"></div>' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div>' +
              brand() +
              '<p class="footer-desc">Sistem informasi dan basis data penerima beasiswa Provinsi Papua Pegunungan — terpusat, terbuka, dan dapat dipertanggungjawabkan.</p>' +
            '</div>' +
            '<div><div class="footer-title">Navigasi</div><ul class="footer-list">' + navList + '</ul></div>' +
            '<div><div class="footer-title">Layanan Data</div><ul class="footer-list">' + svcList + '</ul></div>' +
            '<div><div class="footer-title">Kontak</div><ul class="footer-list">' +
              '<li><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>' + SITE.fullOrg + ', Wamena, Jayawijaya</span></li>' +
              '<li><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>helpdesk@disdik-prov.go.id</span></li>' +
              '<li><i class="fa-solid fa-clock" aria-hidden="true"></i><span>Senin – Jumat, 08.00 – 15.00 WIT</span></li>' +
            '</ul></div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div class="container">' +
            '<nav aria-label="Tautan footer">' +
              '<a href="index.html#tentang">Tentang</a><span>|</span>' +
              '<a href="pengumuman.html">Berita &amp; Pengumuman</a><span>|</span>' +
              '<a href="bantuan.html">Pusat Bantuan</a>' +
            '</nav>' +
            '<p>' + SITE.year + ' &copy; ' + SITE.fullOrg + '</p>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function mount(id, html) {
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  mount('site-header', headerHTML());
  mount('site-footer', footerHTML());

  // Menu seluler
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.getElementById('mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    mobile.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobile.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Di beranda: tandai "Tentang" aktif saat bagian #tentang terlihat
  var about = document.getElementById('tentang');
  if (page === 'beranda' && about && 'IntersectionObserver' in window) {
    var links = document.querySelectorAll('[data-nav]');
    new IntersectionObserver(function (entries) {
      var inAbout = entries[0].isIntersecting;
      links.forEach(function (a) {
        var id = a.getAttribute('data-nav');
        var on = inAbout ? id === 'tentang' : id === 'beranda';
        a.classList.toggle('is-active', on);
      });
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(about);
  }
})();
