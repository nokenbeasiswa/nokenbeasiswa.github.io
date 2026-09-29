/* =========================================================
   DB BEASISWA — Template layout panel (Admin, Operator, Penerima)
   Pemakaian di halaman:
     <body class="admin" data-role="admin" data-page="kampus" data-title="Data Kampus" data-group="Master Data">
       <div id="admin-sidebar"></div>
       <div class="admin-body">
         <div id="admin-topbar"></div>
         <main class="admin-content">…</main>
         <div id="admin-footer"></div>
       </div>
       <script src="…/admin/assets/layout.js"></script>

   data-role: admin (default) | operator | penerima
   Item menu tanpa href akan menampilkan pesan "sedang disiapkan".
   ========================================================= */
(function () {
  var MENUS = {
    admin: [
      { items: [
        { id: 'dashboard', label: 'Dashboard', href: 'index.html', icon: 'fa-gauge-high' }
      ] },
      { title: 'Manajemen Pengguna', items: [
        { id: 'admin',         label: 'Admin',             href: 'pengguna-admin.html',    icon: 'fa-user-shield' },
        { id: 'operator',      label: 'Operator',          href: 'pengguna-operator.html', icon: 'fa-user-gear' },
        { id: 'akun-penerima', label: 'Penerima Beasiswa', href: 'pengguna-penerima.html', icon: 'fa-user-graduate' }
      ] },
      { title: 'Master Data', items: [
        { id: 'negara',   label: 'Data Negara',        href: 'master-negara.html',   icon: 'fa-earth-asia' },
        { id: 'kampus',   label: 'Data Kampus',        href: 'master-kampus.html',   icon: 'fa-building-columns' },
        { id: 'fakultas', label: 'Data Fakultas',      href: 'master-fakultas.html', icon: 'fa-sitemap' },
        { id: 'prodi',    label: 'Data Program Studi', href: 'master-prodi.html',    icon: 'fa-book-open' },
        { id: 'beasiswa', label: 'Data Beasiswa',      href: 'master-beasiswa.html', icon: 'fa-award' }
      ] },
      { title: 'Layanan', items: [
        { id: 'penerima',   label: 'Penerima Beasiswa',       href: 'penerima.html',   icon: 'fa-users' },
        { id: 'tiket',      label: 'Pengaduan Tiket',         href: 'tiket.html',      icon: 'fa-ticket', count: 'tiket' },
        { id: 'pengumuman', label: 'Monitoring & Pengumuman', href: 'pengumuman.html', icon: 'fa-bullhorn' }
      ] },
      { title: 'Pengaturan Sistem', items: [
        { id: 'backup', label: 'Backup & Restore', href: 'backup.html',    icon: 'fa-database' },
        { id: 'audit',  label: 'Audit Log',        href: 'audit-log.html', icon: 'fa-clock-rotate-left' }
      ] }
    ],

    operator: [
      { items: [
        { id: 'dashboard', label: 'Ringkasan Statistik', href: 'index.html', icon: 'fa-gauge-high' }
      ] },
      { title: 'Master Data', items: [
        { id: 'kampus',   label: 'Data Kampus',   href: 'kampus.html',   icon: 'fa-building-columns' },
        { id: 'fakultas', label: 'Data Fakultas', href: 'fakultas.html', icon: 'fa-sitemap' },
        { id: 'negara',   label: 'Negara Studi',  href: 'negara.html',   icon: 'fa-earth-asia' }
      ] },
      { title: 'Kelola Beasiswa', items: [
        { id: 'program',     label: 'Program Beasiswa',     href: 'program.html',     icon: 'fa-award' },
        { id: 'pendaftaran', label: 'Verifikasi Pendaftar', href: 'pendaftaran.html', icon: 'fa-user-check', count: 'verifikasi' }
      ] },
      { title: 'Data Penerima', items: [
        { id: 'verifikasi-dokumen', label: 'Verifikasi Dokumen', href: 'verifikasi-dokumen.html', icon: 'fa-file-circle-check' },
        { id: 'laporan-studi',      label: 'Laporan Studi',      href: 'laporan-studi.html',      icon: 'fa-chart-line' }
      ] },
      { title: 'Pengaduan', items: [
        { id: 'tiket', label: 'Balas Tiket', href: 'tiket.html', icon: 'fa-ticket', count: 'tiket' }
      ] },
      { title: 'Laporan & Analitik', items: [
        { id: 'rekap', label: 'Rekap Penerima', href: 'rekap.html', icon: 'fa-table-list' },
        { id: 'peta',  label: 'Peta GIS',       href: 'peta.html',  icon: 'fa-map-location-dot' }
      ] },
      { title: 'Akun', items: [
        { id: 'akun', label: 'Pengaturan Akun', href: 'akun.html', icon: 'fa-user-gear' }
      ] }
    ],

    penerima: [
      { items: [
        { id: 'dashboard', label: 'Dashboard', href: 'index.html', icon: 'fa-gauge-high' }
      ] },
      { title: 'Profil & Biodata', items: [
        { id: 'data-diri',  label: 'Data Diri & Kontak',  href: 'data-diri.html',  icon: 'fa-id-card' },
        { id: 'pendidikan', label: 'Data Pendidikan',     href: 'pendidikan.html', icon: 'fa-building-columns' }
      ] },
      { title: 'Dokumen Saya', items: [
        { id: 'dokumen', label: 'Dokumen Persyaratan', href: 'dokumen.html', icon: 'fa-file-arrow-up' }
      ] },
      { title: 'Laporan Studi', items: [
        { id: 'transkrip',    label: 'Transkrip Nilai',      href: 'transkrip.html',    icon: 'fa-file-lines' },
        { id: 'perkembangan', label: 'Perkembangan Studi',   href: 'perkembangan.html', icon: 'fa-chart-line' }
      ] },
      { title: 'Pengaduan Tiket', items: [
        { id: 'tiket-baru',   label: 'Buat Tiket',   href: 'tiket-baru.html',   icon: 'fa-pen-to-square' },
        { id: 'tiket-status', label: 'Status Tiket', href: 'tiket-status.html', icon: 'fa-ticket', count: 'tiket-saya' }
      ] },
      { title: 'Informasi', items: [
        { id: 'pengumuman', label: 'Pusat Pengumuman', href: 'pengumuman.html', icon: 'fa-bullhorn' }
      ] }
    ]
  };

  var PANEL_NAME = { admin: 'Panel Administrasi', operator: 'Panel Operator', penerima: 'Portal Penerima' };

  var body = document.body;
  var role = MENUS[body.getAttribute('data-role')] ? body.getAttribute('data-role') : 'admin';
  var page = body.getAttribute('data-page') || '';
  var title = body.getAttribute('data-title') || 'Dashboard';
  var group = body.getAttribute('data-group') || PANEL_NAME[role];
  var user = window.DB ? window.DB.user(role) : { username: role, nama: role, peran: role };
  var esc = window.AdminUtil ? window.AdminUtil.esc : function (s) { return s; };

  function counts() {
    if (!window.DB) return {};
    var tiket = window.DB.get('tiket');
    return {
      tiket: tiket.filter(function (t) { return t.status === 'Baru'; }).length,
      verifikasi: window.DB.get('akun_penerima').filter(function (a) { return a.status === 'Menunggu Verifikasi'; }).length,
      'tiket-saya': tiket.filter(function (t) { return t.pelapor === user.nama && t.status !== 'Selesai'; }).length
    };
  }
  var COUNT = counts();

  function initials(name) {
    return String(name || 'A').split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }

  function sidebar() {
    var groups = MENUS[role].map(function (g) {
      var links = g.items.map(function (it) {
        var active = it.id === page;
        var n = it.count ? COUNT[it.count] : 0;
        var count = n ? '<span class="count" aria-label="' + n + ' baru">' + n + '</span>' : '';
        var attrs = it.href ? 'href="' + it.href + '"' : 'href="#" data-soon="' + esc(it.label) + '"';
        return '<a ' + attrs + ' class="side-link' + (active ? ' is-active' : '') + '"' + (active ? ' aria-current="page"' : '') + '>' +
                 '<i class="fa-solid ' + it.icon + '" aria-hidden="true"></i><span>' + it.label + '</span>' + count +
               '</a>';
      }).join('');
      return '<div class="side-group">' + (g.title ? '<div class="side-group-title">' + g.title + '</div>' : '') + links + '</div>';
    }).join('');

    return (
      '<aside class="admin-sidebar" id="admin-sidebar-panel" aria-label="Menu ' + PANEL_NAME[role] + '">' +
        '<a href="index.html" class="sidebar-brand">' +
          '<img src="../asset/img/logo-dinas.svg" alt="" width="38" height="38">' +
          '<div><div class="brand-name"><span>DB</span> BEASISWA</div><div class="brand-sub">' + PANEL_NAME[role] + '</div></div>' +
        '</a>' +
        '<nav class="sidebar-nav">' + groups +
          '<div class="side-group">' +
            '<a href="../index.html" class="side-link" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i><span>Lihat Situs Publik</span></a>' +
            '<button type="button" class="side-link is-logout w-full" data-logout><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i><span>Keluar</span></button>' +
          '</div>' +
        '</nav>' +
        '<div class="sidebar-foot">Dinas Pendidikan Provinsi Papua Pegunungan</div>' +
      '</aside>'
    );
  }

  function topbar() {
    var bell = '';
    if (role !== 'penerima') {
      var n = COUNT.tiket || 0;
      var href = 'href="tiket.html"';
      bell = '<a ' + href + ' class="icon-btn is-bordered relative" aria-label="Tiket baru: ' + n + '" title="Tiket pengaduan baru">' +
          '<i class="fa-solid fa-bell" aria-hidden="true"></i>' +
          (n ? '<span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink text-[11px] font-bold flex items-center justify-center">' + n + '</span>' : '') +
        '</a>';
    }
    return (
      '<header class="admin-topbar">' +
        '<button type="button" class="icon-btn is-bordered lg:hidden" data-sidebar-toggle aria-controls="admin-sidebar-panel" aria-expanded="false" aria-label="Buka menu">' +
          '<i class="fa-solid fa-bars" aria-hidden="true"></i>' +
        '</button>' +
        '<div class="topbar-title flex-1">' +
          '<div class="crumb">' + esc(group) + '</div>' +
          '<h1>' + esc(title) + '</h1>' +
        '</div>' +
        bell +
        '<div class="relative" data-user-menu>' +
          '<button type="button" class="user-chip" aria-haspopup="true" aria-expanded="false">' +
            '<span class="avatar">' + esc(initials(user.nama)) + '</span>' +
            '<span class="hidden sm:block text-left leading-tight">' +
              '<span class="block text-sm font-semibold">' + esc(user.nama) + '</span>' +
              '<span class="block text-xs text-muted">' + esc(user.peran) + '</span>' +
            '</span>' +
            '<i class="fa-solid fa-chevron-down text-xs text-muted" aria-hidden="true"></i>' +
          '</button>' +
          '<div class="dropdown" hidden>' +
            '<div class="px-2.5 py-2 text-xs text-muted border-b border-line mb-1">Masuk sebagai <strong class="text-ink">' + esc(user.username) + '</strong></div>' +
            '<a href="../index.html" target="_blank" rel="noopener"><i class="fa-solid fa-globe text-muted" aria-hidden="true"></i> Lihat situs publik</a>' +
            (role === 'admin' ? '<a href="audit-log.html"><i class="fa-solid fa-clock-rotate-left text-muted" aria-hidden="true"></i> Aktivitas saya</a>'
                              : '<a href="' + (role === 'operator' ? 'akun.html' : 'data-diri.html') + '"><i class="fa-solid fa-user-gear text-muted" aria-hidden="true"></i> Pengaturan akun</a>') +
            '<button type="button" class="is-danger" data-logout><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Keluar</button>' +
          '</div>' +
        '</div>' +
      '</header>'
    );
  }

  function footer() {
    return '<footer class="admin-footer">2026 &copy; Dinas Pendidikan Provinsi Papua Pegunungan · DB BEASISWA ' + PANEL_NAME[role] + '</footer>';
  }

  function mount(id, html) {
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  mount('admin-sidebar', sidebar());
  mount('admin-topbar', topbar());
  mount('admin-footer', footer());
  document.title = title + ' | ' + PANEL_NAME[role] + ' DB BEASISWA';

  // Sidebar seluler
  var panel = document.getElementById('admin-sidebar-panel');
  var toggle = document.querySelector('[data-sidebar-toggle]');
  function setSidebar(open) {
    panel.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle) toggle.addEventListener('click', function (e) { e.stopPropagation(); setSidebar(!panel.classList.contains('is-open')); });
  document.addEventListener('click', function (e) {
    if (panel.classList.contains('is-open') && !panel.contains(e.target)) setSidebar(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSidebar(false); });

  // Menu pengguna
  var menu = document.querySelector('[data-user-menu]');
  if (menu) {
    var btn = menu.querySelector('button');
    var dd = menu.querySelector('.dropdown');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.hasAttribute('hidden');
      if (open) dd.removeAttribute('hidden'); else dd.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () { dd.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); });
  }

  // Menu yang halamannya belum tersedia
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-soon]');
    if (!el) return;
    e.preventDefault();
    var msg = 'Halaman "' + el.getAttribute('data-soon') + '" sedang disiapkan.';
    if (window.AdminUtil) window.AdminUtil.toast(msg); else alert(msg);
  });

  // Keluar
  document.querySelectorAll('[data-logout]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (window.DB) window.DB.logout();
      window.location.href = '../login.html';
    });
  });
})();
