/* =========================================================
   DB BEASISWA — Penyimpanan data (demo)
   Dipakai bersama oleh panel admin (admin/) dan halaman publik.

   Data disimpan di localStorage browser dengan awalan "dbb_".
   Saat belum ada, data diisi dari SEED di bawah. Ganti modul ini
   dengan pemanggilan API ketika backend sudah tersedia.
   ========================================================= */
(function () {
  var PREFIX = 'dbb_';

  var KABUPATEN = ['Jayawijaya', 'Yahukimo', 'Pegunungan Bintang', 'Tolikara', 'Lanny Jaya', 'Nduga', 'Yalimo', 'Mamberamo Tengah'];
  var JENJANG = ['D3', 'D4', 'S1', 'S2', 'S3'];

  var SEED = {
    admin: [
      { id: 1, nama: 'Administrator Utama', username: 'admin', email: 'admin@disdik-prov.go.id', peran: 'Super Admin', status: 'Aktif' },
      { id: 2, nama: 'Admin Data Beasiswa', username: 'admin.data', email: 'data@disdik-prov.go.id', peran: 'Admin', status: 'Aktif' }
    ],

    operator: [
      { id: 1, nama: 'Operator Jayawijaya', username: 'op.jayawijaya', email: 'op.jayawijaya@disdik-prov.go.id', kabupaten: 'Jayawijaya', hp: '0812-0000-0001', status: 'Aktif' },
      { id: 2, nama: 'Operator Yahukimo', username: 'op.yahukimo', email: 'op.yahukimo@disdik-prov.go.id', kabupaten: 'Yahukimo', hp: '0812-0000-0002', status: 'Aktif' },
      { id: 3, nama: 'Operator Tolikara', username: 'op.tolikara', email: 'op.tolikara@disdik-prov.go.id', kabupaten: 'Tolikara', hp: '0812-0000-0003', status: 'Nonaktif' }
    ],

    akun_penerima: [
      { id: 1, nik: '9501010101000001', nama: 'Yance Wenda', username: 'yance.wenda', email: 'yance.w@mail.com', status: 'Aktif' },
      { id: 2, nik: '9501010101000002', nama: 'Maria Kogoya', username: 'maria.kogoya', email: 'maria.k@mail.com', status: 'Aktif' },
      { id: 3, nik: '9501010101000003', nama: 'Otniel Tabuni', username: 'otniel.tabuni', email: 'otniel.t@mail.com', status: 'Menunggu Verifikasi' }
    ],

    negara: [
      { id: 1, kode: 'ID', nama: 'Indonesia',       benua: 'Asia',    lat: -2.5489, lng: 118.0149 },
      { id: 2, kode: 'AU', nama: 'Australia',       benua: 'Oseania', lat: -25.2744, lng: 133.7751 },
      { id: 3, kode: 'JP', nama: 'Jepang',          benua: 'Asia',    lat: 36.2048, lng: 138.2529 },
      { id: 4, kode: 'GB', nama: 'Inggris',         benua: 'Eropa',   lat: 54.0000, lng: -2.0000 },
      { id: 5, kode: 'NL', nama: 'Belanda',         benua: 'Eropa',   lat: 52.1326, lng: 5.2913 },
      { id: 6, kode: 'US', nama: 'Amerika Serikat', benua: 'Amerika', lat: 39.8283, lng: -98.5795 }
    ],

    kampus: [
      { id: 1,  nama: 'Universitas Cenderawasih',  singkatan: 'UNCEN',   negara_id: 1, kota: 'Jayapura',   jenis: 'PTN',          jumlah_penerima: 340, lat: -2.5912, lng: 140.6690, website: 'https://uncen.ac.id' },
      { id: 2,  nama: 'Universitas Gadjah Mada',   singkatan: 'UGM',     negara_id: 1, kota: 'Yogyakarta', jenis: 'PTN',          jumlah_penerima: 210, lat: -7.7713, lng: 110.3775, website: 'https://ugm.ac.id' },
      { id: 3,  nama: 'Universitas Indonesia',     singkatan: 'UI',      negara_id: 1, kota: 'Depok',      jenis: 'PTN',          jumlah_penerima: 185, lat: -6.3652, lng: 106.8310, website: 'https://ui.ac.id' },
      { id: 4,  nama: 'Institut Teknologi Bandung', singkatan: 'ITB',    negara_id: 1, kota: 'Bandung',    jenis: 'PTN',          jumlah_penerima: 142, lat: -6.8915, lng: 107.6107, website: 'https://itb.ac.id' },
      { id: 5,  nama: 'University of Melbourne',   singkatan: 'UniMelb', negara_id: 2, kota: 'Melbourne',  jenis: 'Luar Negeri',  jumlah_penerima: 65,  lat: -37.7963, lng: 144.9614, website: 'https://unimelb.edu.au' },
      { id: 6,  nama: 'Monash University',         singkatan: 'Monash',  negara_id: 2, kota: 'Melbourne',  jenis: 'Luar Negeri',  jumlah_penerima: 52,  lat: -37.9105, lng: 145.1362, website: 'https://monash.edu' },
      { id: 7,  nama: 'Kyoto University',          singkatan: 'KyotoU',  negara_id: 3, kota: 'Kyoto',      jenis: 'Luar Negeri',  jumlah_penerima: 31,  lat: 35.0262, lng: 135.7808, website: 'https://kyoto-u.ac.jp' },
      { id: 8,  nama: 'University of Oxford',      singkatan: 'Oxford',  negara_id: 4, kota: 'Oxford',     jenis: 'Luar Negeri',  jumlah_penerima: 24,  lat: 51.7548, lng: -1.2544, website: 'https://ox.ac.uk' },
      { id: 9,  nama: 'Leiden University',         singkatan: 'Leiden',  negara_id: 5, kota: 'Leiden',     jenis: 'Luar Negeri',  jumlah_penerima: 22,  lat: 52.1561, lng: 4.4857, website: 'https://universiteitleiden.nl' },
      { id: 10, nama: 'Harvard University',        singkatan: 'Harvard', negara_id: 6, kota: 'Cambridge',  jenis: 'Luar Negeri',  jumlah_penerima: 18,  lat: 42.3770, lng: -71.1167, website: 'https://harvard.edu' }
    ],

    fakultas: [
      { id: 1,  kampus_id: 1,  nama: 'Fakultas Kedokteran' },
      { id: 2,  kampus_id: 1,  nama: 'Fakultas Keguruan dan Ilmu Pendidikan' },
      { id: 3,  kampus_id: 2,  nama: 'Fakultas Teknik' },
      { id: 4,  kampus_id: 2,  nama: 'Fakultas Pertanian' },
      { id: 5,  kampus_id: 3,  nama: 'Fakultas Ilmu Komputer' },
      { id: 6,  kampus_id: 3,  nama: 'Fakultas Kesehatan Masyarakat' },
      { id: 7,  kampus_id: 4,  nama: 'Sekolah Teknik Elektro dan Informatika' },
      { id: 8,  kampus_id: 5,  nama: 'Melbourne Graduate School of Education' },
      { id: 9,  kampus_id: 6,  nama: 'Faculty of Information Technology' },
      { id: 10, kampus_id: 7,  nama: 'Graduate School of Agriculture' },
      { id: 11, kampus_id: 8,  nama: 'Blavatnik School of Government' },
      { id: 12, kampus_id: 9,  nama: 'Faculty of Law' },
      { id: 13, kampus_id: 10, nama: 'Harvard Kennedy School' }
    ],

    prodi: [
      { id: 1,  fakultas_id: 1,  nama: 'Pendidikan Dokter',              jenjang: 'S1', akreditasi: 'Baik Sekali' },
      { id: 2,  fakultas_id: 2,  nama: 'Pendidikan Guru Sekolah Dasar',  jenjang: 'S1', akreditasi: 'Baik Sekali' },
      { id: 3,  fakultas_id: 3,  nama: 'Teknik Sipil',                   jenjang: 'S1', akreditasi: 'Unggul' },
      { id: 4,  fakultas_id: 4,  nama: 'Agronomi',                       jenjang: 'S1', akreditasi: 'Unggul' },
      { id: 5,  fakultas_id: 5,  nama: 'Ilmu Komputer',                  jenjang: 'S1', akreditasi: 'Unggul' },
      { id: 6,  fakultas_id: 6,  nama: 'Kesehatan Masyarakat',           jenjang: 'S2', akreditasi: 'Unggul' },
      { id: 7,  fakultas_id: 7,  nama: 'Teknik Elektro',                 jenjang: 'S1', akreditasi: 'Unggul' },
      { id: 8,  fakultas_id: 8,  nama: 'Master of Education',            jenjang: 'S2', akreditasi: 'Internasional' },
      { id: 9,  fakultas_id: 9,  nama: 'Master of Data Science',         jenjang: 'S2', akreditasi: 'Internasional' },
      { id: 10, fakultas_id: 10, nama: 'Agricultural and Food Sciences', jenjang: 'S3', akreditasi: 'Internasional' },
      { id: 11, fakultas_id: 11, nama: 'Master of Public Policy',        jenjang: 'S2', akreditasi: 'Internasional' },
      { id: 12, fakultas_id: 12, nama: 'Advanced LL.M. Public International Law', jenjang: 'S2', akreditasi: 'Internasional' },
      { id: 13, fakultas_id: 13, nama: 'Master in Public Administration', jenjang: 'S2', akreditasi: 'Internasional' }
    ],

    beasiswa: [
      { id: 1, nama: 'Beasiswa Afirmasi Pendidikan Tinggi', jenis: 'Afirmasi', jenjang: 'S1', lokasi: 'Dalam Negeri', sumber_dana: 'APBD Provinsi', kuota: 600, nilai: 30000000, periode: '2026', status: 'Berjalan' },
      { id: 2, nama: 'Beasiswa Kedokteran & Kesehatan',     jenis: 'Ikatan Dinas', jenjang: 'S1', lokasi: 'Dalam Negeri', sumber_dana: 'APBD Provinsi', kuota: 120, nilai: 45000000, periode: '2026', status: 'Berjalan' },
      { id: 3, nama: 'Beasiswa Pascasarjana Luar Negeri',   jenis: 'Prestasi', jenjang: 'S2', lokasi: 'Luar Negeri', sumber_dana: 'APBD Provinsi', kuota: 80,  nilai: 250000000, periode: '2026', status: 'Berjalan' },
      { id: 4, nama: 'Beasiswa Doktoral',                   jenis: 'Prestasi', jenjang: 'S3', lokasi: 'Luar Negeri', sumber_dana: 'APBD Provinsi', kuota: 20,  nilai: 300000000, periode: '2027', status: 'Dibuka' }
    ],

    penerima: [
      { id: 1,  nik: '9501010101000001', nama: 'Yance Wenda',      jk: 'Laki-laki', kabupaten: 'Jayawijaya',         beasiswa_id: 1, kampus_id: 1,  prodi_id: 1,  jenjang: 'S1', angkatan: '2023', status: 'Aktif', ipk: 3.42 },
      { id: 2,  nik: '9501010101000002', nama: 'Maria Kogoya',     jk: 'Perempuan', kabupaten: 'Lanny Jaya',         beasiswa_id: 1, kampus_id: 2,  prodi_id: 3,  jenjang: 'S1', angkatan: '2022', status: 'Aktif', ipk: 3.61 },
      { id: 3,  nik: '9501010101000003', nama: 'Otniel Tabuni',    jk: 'Laki-laki', kabupaten: 'Tolikara',           beasiswa_id: 1, kampus_id: 3,  prodi_id: 5,  jenjang: 'S1', angkatan: '2024', status: 'Aktif', ipk: 3.28 },
      { id: 4,  nik: '9501010101000004', nama: 'Ester Wandikbo',   jk: 'Perempuan', kabupaten: 'Tolikara',           beasiswa_id: 2, kampus_id: 1,  prodi_id: 1,  jenjang: 'S1', angkatan: '2021', status: 'Aktif', ipk: 3.55 },
      { id: 5,  nik: '9501010101000005', nama: 'Nius Asso',        jk: 'Laki-laki', kabupaten: 'Yahukimo',           beasiswa_id: 1, kampus_id: 4,  prodi_id: 7,  jenjang: 'S1', angkatan: '2022', status: 'Cuti',  ipk: 3.02 },
      { id: 6,  nik: '9501010101000006', nama: 'Debora Uropmabin', jk: 'Perempuan', kabupaten: 'Pegunungan Bintang', beasiswa_id: 3, kampus_id: 5,  prodi_id: 8,  jenjang: 'S2', angkatan: '2025', status: 'Aktif', ipk: 3.70 },
      { id: 7,  nik: '9501010101000007', nama: 'Yulius Gwijangge', jk: 'Laki-laki', kabupaten: 'Nduga',              beasiswa_id: 3, kampus_id: 6,  prodi_id: 9,  jenjang: 'S2', angkatan: '2024', status: 'Aktif', ipk: 3.66 },
      { id: 8,  nik: '9501010101000008', nama: 'Selvina Walilo',   jk: 'Perempuan', kabupaten: 'Yalimo',             beasiswa_id: 1, kampus_id: 2,  prodi_id: 4,  jenjang: 'S1', angkatan: '2020', status: 'Lulus', ipk: 3.48 },
      { id: 9,  nik: '9501010101000009', nama: 'Hendrik Yikwa',    jk: 'Laki-laki', kabupaten: 'Mamberamo Tengah',   beasiswa_id: 1, kampus_id: 1,  prodi_id: 2,  jenjang: 'S1', angkatan: '2023', status: 'Aktif', ipk: 3.15 },
      { id: 10, nik: '9501010101000010', nama: 'Agustina Itlay',   jk: 'Perempuan', kabupaten: 'Jayawijaya',         beasiswa_id: 4, kampus_id: 7,  prodi_id: 10, jenjang: 'S3', angkatan: '2025', status: 'Aktif', ipk: 3.81 },
      { id: 11, nik: '9501010101000011', nama: 'Benny Hisage',     jk: 'Laki-laki', kabupaten: 'Jayawijaya',         beasiswa_id: 3, kampus_id: 8,  prodi_id: 11, jenjang: 'S2', angkatan: '2025', status: 'Aktif', ipk: 3.74 },
      { id: 12, nik: '9501010101000012', nama: 'Ribka Heselo',     jk: 'Perempuan', kabupaten: 'Yahukimo',           beasiswa_id: 2, kampus_id: 3,  prodi_id: 6,  jenjang: 'S2', angkatan: '2024', status: 'Aktif', ipk: 3.59 },
      { id: 13, nik: '9501010101000013', nama: 'Markus Kalolik',   jk: 'Laki-laki', kabupaten: 'Lanny Jaya',         beasiswa_id: 3, kampus_id: 9,  prodi_id: 12, jenjang: 'S2', angkatan: '2023', status: 'Berhenti', ipk: 2.71 },
      { id: 14, nik: '9501010101000014', nama: 'Lince Murib',      jk: 'Perempuan', kabupaten: 'Nduga',              beasiswa_id: 3, kampus_id: 10, prodi_id: 13, jenjang: 'S2', angkatan: '2025', status: 'Aktif', ipk: 3.77 }
    ],

    tiket: [
      { id: 1, kode: 'TK-2026-0012', pelapor: 'Yance Wenda',    email: 'yance.w@mail.com',  kategori: 'Pencairan Dana', prioritas: 'Tinggi', status: 'Baru',     subjek: 'Dana semester genap belum masuk', pesan: 'Selamat siang, dana beasiswa semester genap belum masuk ke rekening saya. Mohon dicek.', tanggal: '2026-09-27T09:12:00', balasan: [] },
      { id: 2, kode: 'TK-2026-0011', pelapor: 'Maria Kogoya',   email: 'maria.k@mail.com',  kategori: 'Akun & Login',   prioritas: 'Sedang', status: 'Diproses', subjek: 'Tidak bisa masuk portal', pesan: 'Saya lupa kata sandi dan email pemulihan tidak masuk.', tanggal: '2026-09-25T14:40:00', balasan: [
        { dari: 'Admin Data Beasiswa', peran: 'admin', waktu: '2026-09-26T08:05:00', isi: 'Terima kasih, akun sedang kami periksa. Mohon kirimkan foto KTP untuk verifikasi.' }
      ] },
      { id: 3, kode: 'TK-2026-0010', pelapor: 'Otniel Tabuni',  email: 'otniel.t@mail.com', kategori: 'Data Akademik',  prioritas: 'Rendah', status: 'Selesai',  subjek: 'Salah input program studi', pesan: 'Program studi saya tertulis Teknik Sipil, seharusnya Ilmu Komputer.', tanggal: '2026-09-20T10:00:00', balasan: [
        { dari: 'Administrator Utama', peran: 'admin', waktu: '2026-09-21T09:30:00', isi: 'Data program studi sudah kami perbaiki. Silakan cek kembali di portal.' }
      ] },
      { id: 4, kode: 'TK-2026-0009', pelapor: 'Ribka Heselo',   email: 'ribka.h@mail.com',  kategori: 'Verifikasi Berkas', prioritas: 'Sedang', status: 'Baru', subjek: 'Unggah KHS gagal', pesan: 'Saat mengunggah KHS muncul pesan galat ukuran file.', tanggal: '2026-09-28T16:22:00', balasan: [] }
    ],

    pengumuman: [
      { id: 1, judul: 'Jadwal Verifikasi Berkas Pencairan Semester Genap 2026', kategori: 'Penting',    target: 'Penerima', tanggal: '2026-09-24', status: 'Terbit', isi: 'Bagi seluruh penerima beasiswa aktif diharapkan mengunggah KHS semester lalu sebelum 30 Oktober 2026.' },
      { id: 2, judul: 'Pembaruan Data Mandiri Melalui Portal Mahasiswa',       kategori: 'Pengumuman', target: 'Penerima', tanggal: '2026-09-15', status: 'Terbit', isi: 'Periksa kembali alamat, nomor rekening, dan status studi pada akun masing-masing.' },
      { id: 3, judul: 'Sosialisasi Beasiswa Afirmasi di Delapan Kabupaten',    kategori: 'Berita',     target: 'Publik',   tanggal: '2026-09-02', status: 'Terbit', isi: 'Tim Dinas Pendidikan berkeliling ke SMA/SMK untuk memperkenalkan program beasiswa 2027.' },
      { id: 4, judul: 'Pemeliharaan Sistem Terjadwal',                         kategori: 'Sistem',     target: 'Operator', tanggal: '2026-10-05', status: 'Draf',   isi: 'Portal tidak dapat diakses pada 5 Oktober 2026 pukul 22.00–24.00 WIT untuk pemeliharaan server.' }
    ],

    audit: [
      { id: 1, waktu: '2026-09-28T16:25:00', user: 'admin', aksi: 'Login',  modul: 'Autentikasi', keterangan: 'Masuk ke panel admin' },
      { id: 2, waktu: '2026-09-26T08:05:00', user: 'admin.data', aksi: 'Balas', modul: 'Tiket', keterangan: 'Membalas tiket TK-2026-0011' },
      { id: 3, waktu: '2026-09-21T09:30:00', user: 'admin', aksi: 'Ubah',  modul: 'Penerima Beasiswa', keterangan: 'Memperbarui program studi Otniel Tabuni' }
    ]
  };

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function read(name) {
    try {
      var raw = localStorage.getItem(PREFIX + name);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* abaikan: localStorage tidak tersedia */ }
    return null;
  }

  function write(name, value) {
    try { localStorage.setItem(PREFIX + name, JSON.stringify(value)); } catch (e) { /* abaikan */ }
  }

  var DB = {
    KABUPATEN: KABUPATEN,
    JENJANG: JENJANG,
    ENTITIES: Object.keys(SEED),

    get: function (name) {
      var data = read(name);
      if (data === null) {
        data = clone(SEED[name] || []);
        write(name, data);
      }
      return data;
    },

    set: function (name, rows) { write(name, rows); },

    find: function (name, id) {
      if (id === '' || id === null || id === undefined) return null;
      var rows = DB.get(name);
      for (var i = 0; i < rows.length; i++) if (String(rows[i].id) === String(id)) return rows[i];
      return null;
    },

    nextId: function (rows) {
      return rows.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0) + 1;
    },

    /* Sesi demo. role: admin | operator | penerima */
    ROLES: {
      admin:    { label: 'Admin',             panel: 'admin/',    table: 'admin',         fallback: 'admin' },
      operator: { label: 'Operator',          panel: 'operator/', table: 'operator',      fallback: 'op.jayawijaya' },
      penerima: { label: 'Penerima Beasiswa', panel: 'penerima/', table: 'akun_penerima', fallback: 'yance.wenda' }
    },

    user: function (role) {
      var u = read('session');
      if (u && u.username && (!role || u.role === role)) return u;
      return DB.makeUser(role || 'admin');
    },

    makeUser: function (role, username) {
      var cfg = DB.ROLES[role] || DB.ROLES.admin;
      var name = (username || '').trim() || cfg.fallback;
      var match = DB.get(cfg.table).filter(function (a) { return a.username === name; })[0];
      if (!match && !username) match = DB.get(cfg.table)[0];
      var peran = role === 'admin' ? (match && match.peran) || 'Admin'
                : role === 'operator' ? 'Operator Kabupaten'
                : 'Penerima Beasiswa';
      return {
        role: role,
        username: match ? match.username : name,
        nama: match ? match.nama : name,
        peran: peran.trim(),
        kabupaten: match && match.kabupaten,
        nik: match && match.nik
      };
    },

    login: function (username, role) {
      role = DB.ROLES[role] ? role : 'admin';
      write('session', DB.makeUser(role, username));
      DB.log('Login', 'Autentikasi', 'Masuk sebagai ' + DB.ROLES[role].label);
    },

    logout: function () {
      var u = DB.user();
      DB.log('Logout', 'Autentikasi', 'Keluar dari panel ' + ((DB.ROLES[u.role] || DB.ROLES.admin).label));
      try { localStorage.removeItem(PREFIX + 'session'); } catch (e) { /* abaikan */ }
    },

    log: function (aksi, modul, keterangan) {
      var rows = DB.get('audit');
      rows.unshift({ id: DB.nextId(rows), waktu: new Date().toISOString(), user: DB.user().username, aksi: aksi, modul: modul, keterangan: keterangan || '' });
      DB.set('audit', rows.slice(0, 1000));
    },

    exportAll: function () {
      var out = { aplikasi: 'DB BEASISWA', versi: 1, dibuat: new Date().toISOString(), data: {} };
      DB.ENTITIES.forEach(function (n) { out.data[n] = DB.get(n); });
      return out;
    },

    importAll: function (obj) {
      if (!obj || typeof obj.data !== 'object') throw new Error('Format berkas tidak dikenali.');
      DB.ENTITIES.forEach(function (n) { if (Array.isArray(obj.data[n])) write(n, obj.data[n]); });
    },

    resetAll: function () {
      DB.ENTITIES.forEach(function (n) { write(n, clone(SEED[n])); });
    },

    meta: function (key, value) {
      var m = read('meta') || {};
      if (value === undefined) return m[key];
      m[key] = value; write('meta', m);
    }
  };

  window.DB = DB;
})();
