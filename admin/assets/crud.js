/* =========================================================
   DB BEASISWA — Mesin CRUD panel admin
   Pemakaian di halaman:
     <div id="crud"></div>
     <script>AdminCrud.mount('#crud', { entity, singular, columns, fields, ... })</script>

   Opsi konfigurasi:
     entity     nama tabel di DB (store.js)
     singular   nama tunggal, mis. "Kampus"
     modul      nama modul untuk audit log (default: singular)
     labelKey   kolom untuk label baris (default: 'nama')
     columns    [{ key, label, render(row), class, thClass }]
     fields     [{ key, label, type, required, options, span, placeholder, hint, step }]
                type: text | email | number | date | password | select | textarea | map
                map : { type: 'map', lat: 'lat', lng: 'lng', label }
     searchKeys kolom yang dicari
     filters    [{ key, label, options }]
     readOnly   true = tanpa tambah/ubah/hapus
   ========================================================= */
(function () {
  function esc(v) {
    return String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var TONES = {
    green: ['Aktif', 'Terbit', 'Selesai', 'Lulus', 'Dibuka', 'Berjalan', 'Rendah'],
    gold:  ['Diproses', 'Cuti', 'Draf', 'Sedang', 'Menunggu Verifikasi', 'Ubah'],
    red:   ['Baru', 'Tinggi', 'Berhenti', 'Hapus', 'Penting'],
    gray:  ['Nonaktif', 'Ditutup', 'Logout']
  };

  var U = {
    esc: esc,
    rupiah: function (n) { return 'Rp ' + Number(n || 0).toLocaleString('id-ID'); },
    angka: function (n) { return Number(n || 0).toLocaleString('id-ID'); },
    tanggal: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      return isNaN(d) ? esc(iso) : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    waktu: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      return isNaN(d) ? esc(iso) : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    },
    badge: function (text, tone) {
      if (!text) return '';
      if (!tone) {
        tone = '';
        Object.keys(TONES).forEach(function (t) { if (TONES[t].indexOf(text) !== -1) tone = t; });
      }
      return '<span class="badge' + (tone ? ' badge-' + tone : '') + '">' + esc(text) + '</span>';
    },
    lookup: function (entity, id, key) {
      var row = window.DB.find(entity, id);
      return row ? esc(row[key || 'nama']) : '<span class="text-muted">—</span>';
    },
    coords: function (lat, lng) {
      if (lat === '' || lat === null || lat === undefined) return '<span class="text-muted">—</span>';
      return '<span class="tabular-nums text-sm">' + Number(lat).toFixed(4) + ', ' + Number(lng).toFixed(4) + '</span>';
    },
    /* Data penerima milik pengguna yang sedang masuk (portal penerima) */
    currentPenerima: function () {
      var user = window.DB.user('penerima');
      var all = window.DB.get('penerima');
      return all.filter(function (r) { return user.nik && r.nik === user.nik; })[0]
          || all.filter(function (r) { return r.nama === user.nama; })[0]
          || all[0];
    },
    toast: function (msg, tone) {
      var wrap = document.querySelector('.toast-wrap');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
      var el = document.createElement('div');
      el.className = 'toast' + (tone ? ' is-' + tone : '');
      el.setAttribute('role', 'status');
      el.textContent = msg;
      wrap.appendChild(el);
      setTimeout(function () { el.remove(); }, 3200);
    },
    download: function (filename, content, type) {
      var blob = new Blob([content], { type: type || 'text/plain' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    }
  };
  window.AdminUtil = U;

  /* ---------- Peta pemilih koordinat (di luar data reaktif Alpine) ---------- */
  var picker = { map: null, marker: null };

  function pickerUpdate(lat, lng, zoom) {
    if (!picker.map) return;
    var has = lat !== '' && lat !== null && lat !== undefined && !isNaN(Number(lat)) && lng !== '' && lng !== null && !isNaN(Number(lng));
    if (has) {
      var ll = [Number(lat), Number(lng)];
      if (picker.marker) picker.marker.setLatLng(ll);
      else picker.marker = L.marker(ll).addTo(picker.map);
      if (zoom) picker.map.setView(ll, zoom);
    } else {
      if (picker.marker) { picker.map.removeLayer(picker.marker); picker.marker = null; }
      if (zoom) picker.map.setView([-2.5, 125], 3);
    }
  }

  /* ---------- Komponen Alpine ---------- */
  window.crud = function (cfg) {
    return {
      cfg: cfg,
      rows: [],
      q: '',
      filters: {},
      page: 1,
      perPage: 10,
      modal: false,
      form: {},
      errors: {},
      editingId: null,
      confirmRow: null,

      init: function () {
        var self = this;
        this.rows = window.DB.get(cfg.entity);
        (cfg.filters || []).forEach(function (f) { self.filters[f.key] = ''; });
        this.$watch('q', function () { self.page = 1; });
        window.addEventListener('crud:reload', function () { self.rows = window.DB.get(cfg.entity); });
      },
      changed: function () {
        window.dispatchEvent(new CustomEvent('crud:changed', { detail: { entity: this.cfg.entity } }));
      },
      runAction: function (a, row) { a.run(row, this); },

      get mapField() {
        return (this.cfg.fields || []).filter(function (f) { return f.type === 'map'; })[0] || null;
      },

      get filtered() {
        var q = this.q.trim().toLowerCase();
        var keys = this.cfg.searchKeys || ['nama'];
        var filters = this.filters;
        return this.rows.filter(function (r) {
          for (var k in filters) {
            if (filters[k] !== '' && String(r[k]) !== String(filters[k])) return false;
          }
          if (!q) return true;
          return keys.some(function (k) { return String(r[k] === undefined ? '' : r[k]).toLowerCase().indexOf(q) !== -1; });
        });
      },
      get pages() { return Math.max(1, Math.ceil(this.filtered.length / this.perPage)); },
      get paged() {
        if (this.page > this.pages) this.page = this.pages;
        var start = (this.page - 1) * this.perPage;
        return this.filtered.slice(start, start + this.perPage);
      },
      get summary() {
        var n = this.filtered.length;
        if (!n) return '0 data';
        var start = (this.page - 1) * this.perPage + 1;
        return 'Menampilkan ' + start + '–' + Math.min(n, start + this.perPage - 1) + ' dari ' + n + ' data';
      },

      opts: function (f) {
        var o = typeof f.options === 'function' ? f.options(this.form) : (f.options || []);
        return o.map(function (x) { return typeof x === 'object' ? x : { value: x, label: x }; });
      },
      cell: function (row, c) { return c.render ? c.render(row) : esc(row[c.key]); },
      label: function (row) { return row ? row[this.cfg.labelKey || 'nama'] : ''; },
      fieldClass: function (f) {
        return (f.span === 2 || f.type === 'textarea' || f.type === 'map') ? 'sm:col-span-2' : '';
      },

      openCreate: function () {
        var form = {};
        (this.cfg.fields || []).forEach(function (f) {
          if (f.type === 'map') { form[f.lat] = ''; form[f.lng] = ''; }
          else form[f.key] = f.default !== undefined ? f.default : '';
        });
        this.form = form;
        this.editingId = null;
        this.errors = {};
        this.modal = true;
        this.afterOpen();
      },
      openEdit: function (row) {
        this.form = JSON.parse(JSON.stringify(row));
        (this.cfg.fields || []).forEach(function (f) { if (f.type === 'password') this.form[f.key] = ''; }, this);
        this.editingId = row.id;
        this.errors = {};
        this.modal = true;
        this.afterOpen();
      },
      afterOpen: function () {
        var self = this;
        this.$nextTick(function () {
          var first = self.$root.querySelector('.modal-body .input');
          if (first) first.focus();
          if (self.mapField) self.initPicker();
        });
      },

      initPicker: function () {
        var self = this;
        var f = this.mapField;
        var el = this.$root.querySelector('[data-map-picker]');
        if (!el || typeof L === 'undefined') return;
        if (!picker.map) {
          picker.map = L.map(el, { scrollWheelZoom: false }).setView([-2.5, 125], 3);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap', maxZoom: 19
          }).addTo(picker.map);
          picker.map.on('click', function (e) {
            self.form[f.lat] = Number(e.latlng.lat.toFixed(6));
            self.form[f.lng] = Number(e.latlng.lng.toFixed(6));
            pickerUpdate(self.form[f.lat], self.form[f.lng]);
          });
        }
        setTimeout(function () {
          picker.map.invalidateSize();
          pickerUpdate(self.form[f.lat], self.form[f.lng], self.form[f.lat] !== '' ? (f.zoom || 6) : 3);
        }, 50);
      },
      coordsChanged: function () {
        var f = this.mapField;
        if (f) pickerUpdate(this.form[f.lat], this.form[f.lng], f.zoom || 6);
      },

      validate: function () {
        var errors = {};
        var form = this.form;
        var editing = this.editingId !== null;
        (this.cfg.fields || []).forEach(function (f) {
          if (f.type === 'map') {
            ['lat', 'lng'].forEach(function (k) {
              var key = f[k], v = form[key];
              if (f.required && (v === '' || v === null || v === undefined)) errors[key] = 'Wajib diisi.';
              else if (v !== '' && v !== null && isNaN(Number(v))) errors[key] = 'Harus berupa angka.';
              else if (k === 'lat' && v !== '' && Math.abs(Number(v)) > 90) errors[key] = 'Lintang antara -90 dan 90.';
              else if (k === 'lng' && v !== '' && Math.abs(Number(v)) > 180) errors[key] = 'Bujur antara -180 dan 180.';
            });
            return;
          }
          var v = form[f.key];
          var empty = v === '' || v === null || v === undefined;
          if (f.required && empty && !(f.type === 'password' && editing)) errors[f.key] = 'Wajib diisi.';
          else if (f.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[f.key] = 'Format email tidak valid.';
          else if (f.type === 'number' && !empty && isNaN(Number(v))) errors[f.key] = 'Harus berupa angka.';
          else if (f.unique && !empty) {
            var dup = this.rows.some(function (r) { return String(r[f.key]).toLowerCase() === String(v).toLowerCase() && r.id !== this.editingId; }, this);
            if (dup) errors[f.key] = f.label + ' sudah digunakan.';
          }
        }, this);
        this.errors = errors;
        return Object.keys(errors).length === 0;
      },

      save: function () {
        if (!this.validate()) { U.toast('Periksa kembali isian formulir.', 'danger'); return; }
        var form = JSON.parse(JSON.stringify(this.form));
        (this.cfg.fields || []).forEach(function (f) {
          if (f.type === 'password') { delete form[f.key]; return; } // demo: kata sandi tidak disimpan
          if (f.type === 'map') {
            [f.lat, f.lng].forEach(function (k) { form[k] = form[k] === '' ? '' : Number(form[k]); });
            return;
          }
          if ((f.type === 'number' || f.numeric) && form[f.key] !== '') form[f.key] = Number(form[f.key]);
        });
        var modul = this.cfg.modul || this.cfg.singular;
        if (this.editingId !== null) {
          var idx = this.rows.findIndex(function (r) { return r.id === this.editingId; }, this);
          if (idx !== -1) this.rows.splice(idx, 1, Object.assign({}, this.rows[idx], form));
          window.DB.set(this.cfg.entity, this.rows);
          window.DB.log('Ubah', modul, 'Memperbarui ' + this.cfg.singular.toLowerCase() + ' "' + this.label(form) + '"');
          U.toast(this.cfg.singular + ' berhasil diperbarui.', 'success');
          this.changed();
        } else {
          form.id = window.DB.nextId(this.rows);
          form.dibuat = new Date().toISOString();
          if (this.cfg.beforeCreate) this.cfg.beforeCreate(form, this.rows);
          this.rows.unshift(form);
          window.DB.set(this.cfg.entity, this.rows);
          window.DB.log('Tambah', modul, 'Menambahkan ' + this.cfg.singular.toLowerCase() + ' "' + this.label(form) + '"');
          U.toast(this.cfg.singular + ' berhasil ditambahkan.', 'success');
          this.page = 1;
          this.changed();
        }
        this.modal = false;
      },

      askDelete: function (row) { this.confirmRow = row; },
      doDelete: function () {
        var row = this.confirmRow;
        if (!row) return;
        this.rows = this.rows.filter(function (r) { return r.id !== row.id; });
        window.DB.set(this.cfg.entity, this.rows);
        window.DB.log('Hapus', this.cfg.modul || this.cfg.singular, 'Menghapus ' + this.cfg.singular.toLowerCase() + ' "' + this.label(row) + '"');
        U.toast(this.cfg.singular + ' dihapus.', 'danger');
        this.changed();
        this.confirmRow = null;
      },

      exportCsv: function () {
        var cols = this.cfg.columns;
        var strip = function (html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent.trim(); };
        var lines = [cols.map(function (c) { return '"' + c.label + '"'; }).join(',')];
        this.filtered.forEach(function (r) {
          lines.push(cols.map(function (c) {
            var v = c.csv ? c.csv(r) : strip(c.render ? c.render(r) : esc(r[c.key]));
            return '"' + String(v).replace(/"/g, '""') + '"';
          }).join(','));
        });
        U.download(this.cfg.entity + '-' + new Date().toISOString().slice(0, 10) + '.csv', '﻿' + lines.join('\n'), 'text/csv;charset=utf-8');
        window.DB.log('Ekspor', this.cfg.modul || this.cfg.singular, 'Mengekspor ' + this.filtered.length + ' baris ke CSV');
      }
    };
  };

  /* ---------- Markup ---------- */
  var TEMPLATE = '' +
  '<div x-data="crud(window.__crud)">' +
    '<div class="card">' +
      '<div class="flex flex-col xl:flex-row gap-3 xl:items-center justify-between p-4 border-b border-line">' +
        '<div class="flex flex-col sm:flex-row gap-3 flex-1 flex-wrap">' +
          '<div class="input-icon w-full sm:max-w-xs">' +
            '<i class="fa-solid fa-magnifying-glass icon-left" aria-hidden="true"></i>' +
            '<input class="input" type="search" x-model="q" :placeholder="\'Cari \' + cfg.singular.toLowerCase() + \'…\'" aria-label="Cari">' +
          '</div>' +
          '<template x-for="f in (cfg.filters || [])" :key="f.key">' +
            '<select class="input sm:w-52" x-model="filters[f.key]" @change="page = 1" :aria-label="f.label">' +
              '<option value="" x-text="\'Semua \' + f.label.toLowerCase()"></option>' +
              '<template x-for="o in opts(f)" :key="o.value"><option :value="o.value" x-text="o.label"></option></template>' +
            '</select>' +
          '</template>' +
        '</div>' +
        '<div class="flex gap-2 shrink-0">' +
          '<button type="button" class="btn btn-outline btn-sm" @click="exportCsv()"><i class="fa-solid fa-file-csv" aria-hidden="true"></i> Ekspor CSV</button>' +
          '<button type="button" x-show="!cfg.readOnly" class="btn btn-primary btn-sm" @click="openCreate()"><i class="fa-solid fa-plus" aria-hidden="true"></i> <span x-text="\'Tambah \' + cfg.singular"></span></button>' +
        '</div>' +
      '</div>' +

      '<div class="overflow-x-auto">' +
        '<table class="table">' +
          '<thead><tr>' +
            '<th class="w-14">No</th>' +
            '<template x-for="c in cfg.columns" :key="c.label"><th :class="c.thClass || \'\'" x-text="c.label"></th></template>' +
            '<th x-show="!cfg.readOnly" class="!text-right w-32">Aksi</th>' +
          '</tr></thead>' +
          '<tbody>' +
            '<template x-for="(row, i) in paged" :key="row.id">' +
              '<tr>' +
                '<td class="text-muted tabular-nums" x-text="(page - 1) * perPage + i + 1"></td>' +
                '<template x-for="c in cfg.columns" :key="c.label"><td :class="c.class || \'\'" x-html="cell(row, c)"></td></template>' +
                '<td x-show="!cfg.readOnly" class="text-right whitespace-nowrap">' +
                  '<template x-for="a in (cfg.rowActions || [])" :key="a.label">' +
                    '<button type="button" class="icon-btn" @click="runAction(a, row)" :title="a.label" :aria-label="a.label"><span x-html="a.icon"></span></button>' +
                  '</template>' +
                  '<button type="button" class="icon-btn" @click="openEdit(row)" title="Ubah" aria-label="Ubah"><i class="fa-solid fa-pen" aria-hidden="true"></i></button>' +
                  '<button type="button" class="icon-btn is-danger" @click="askDelete(row)" title="Hapus" aria-label="Hapus"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>' +
                '</td>' +
              '</tr>' +
            '</template>' +
            '<tr x-show="filtered.length === 0"><td :colspan="cfg.columns.length + 2" class="text-center py-12 text-muted">Tidak ada data yang cocok.</td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +

      '<div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-line text-sm text-muted">' +
        '<span x-text="summary"></span>' +
        '<div class="flex items-center gap-1">' +
          '<button type="button" class="icon-btn is-bordered" :disabled="page === 1" @click="page--" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>' +
          '<span class="px-3 tabular-nums" x-text="page + \' / \' + pages"></span>' +
          '<button type="button" class="icon-btn is-bordered" :disabled="page === pages" @click="page++" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* Modal formulir */
    '<div class="modal" x-show="modal" x-cloak @keydown.escape.window="modal = false">' +
      '<div class="modal-backdrop" @click="modal = false"></div>' +
      '<form class="modal-card" :class="mapField ? \'is-lg\' : \'\'" @submit.prevent="save()" novalidate>' +
        '<div class="modal-head">' +
          '<h2 x-text="(editingId !== null ? \'Ubah \' : \'Tambah \') + cfg.singular"></h2>' +
          '<button type="button" class="icon-btn" @click="modal = false" aria-label="Tutup"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
        '</div>' +
        '<div class="modal-body grid sm:grid-cols-2 gap-5">' +
          '<template x-for="f in cfg.fields" :key="f.key || f.lat">' +
            '<div :class="fieldClass(f)">' +

              '<template x-if="f.type === \'map\'">' +
                '<div>' +
                  '<span class="label" x-text="f.label || \'Lokasi koordinat\'"></span>' +
                  '<div class="grid grid-cols-2 gap-3">' +
                    '<div><input class="input" type="number" step="any" :class="errors[f.lat] && \'is-invalid\'" x-model="form[f.lat]" @change="coordsChanged()" placeholder="Lintang (lat)" aria-label="Lintang">' +
                      '<p class="mt-1.5 text-sm text-red-700" x-show="errors[f.lat]" x-text="errors[f.lat]"></p></div>' +
                    '<div><input class="input" type="number" step="any" :class="errors[f.lng] && \'is-invalid\'" x-model="form[f.lng]" @change="coordsChanged()" placeholder="Bujur (lng)" aria-label="Bujur">' +
                      '<p class="mt-1.5 text-sm text-red-700" x-show="errors[f.lng]" x-text="errors[f.lng]"></p></div>' +
                  '</div>' +
                  '<div data-map-picker class="mt-3 h-72 rounded-lg border border-line z-0 isolate"></div>' +
                  '<p class="mt-2 text-sm text-muted"><i class="fa-solid fa-hand-pointer text-brand" aria-hidden="true"></i> Klik pada peta untuk menentukan titik lokasi, atau ketik koordinat secara manual.</p>' +
                '</div>' +
              '</template>' +

              '<template x-if="f.type !== \'map\'">' +
                '<div>' +
                  '<label class="label" :for="\'f_\' + f.key"><span x-text="f.label"></span><span x-show="f.required && !(f.type === \'password\' && editingId !== null)" class="text-red-700"> *</span></label>' +
                  '<template x-if="f.type === \'select\'">' +
                    '<select class="input" :id="\'f_\' + f.key" :class="errors[f.key] && \'is-invalid\'" x-model="form[f.key]">' +
                      '<option value="">— Pilih —</option>' +
                      '<template x-for="o in opts(f)" :key="o.value"><option :value="o.value" x-text="o.label" :selected="String(o.value) === String(form[f.key])"></option></template>' +
                    '</select>' +
                  '</template>' +
                  '<template x-if="f.type === \'textarea\'">' +
                    '<textarea class="input" rows="5" :id="\'f_\' + f.key" :class="errors[f.key] && \'is-invalid\'" x-model="form[f.key]" :placeholder="f.placeholder || \'\'"></textarea>' +
                  '</template>' +
                  '<template x-if="f.type !== \'select\' && f.type !== \'textarea\'">' +
                    '<input class="input" :type="f.type || \'text\'" :id="\'f_\' + f.key" :class="errors[f.key] && \'is-invalid\'" x-model="form[f.key]" :placeholder="f.placeholder || \'\'" :step="f.step || null" autocomplete="off">' +
                  '</template>' +
                  '<p class="mt-1.5 text-sm text-red-700" x-show="errors[f.key]" x-text="errors[f.key]"></p>' +
                  '<p class="mt-1.5 text-sm text-muted" x-show="f.hint && !errors[f.key]" x-text="f.hint"></p>' +
                '</div>' +
              '</template>' +

            '</div>' +
          '</template>' +
        '</div>' +
        '<div class="modal-foot">' +
          '<button type="button" class="btn btn-outline" @click="modal = false">Batal</button>' +
          '<button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan</button>' +
        '</div>' +
      '</form>' +
    '</div>' +

    /* Konfirmasi hapus */
    '<div class="modal" x-show="confirmRow" x-cloak @keydown.escape.window="confirmRow = null">' +
      '<div class="modal-backdrop" @click="confirmRow = null"></div>' +
      '<div class="modal-card is-sm" role="alertdialog" aria-modal="true">' +
        '<div class="modal-body text-center">' +
          '<span class="icon-box mx-auto" style="background: var(--red-100); color: var(--red)"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>' +
          '<h2 class="mt-4 text-lg font-bold" x-text="\'Hapus \' + cfg.singular.toLowerCase() + \'?\'"></h2>' +
          '<p class="mt-2 text-[15px] text-muted"><strong class="text-ink" x-text="label(confirmRow)"></strong> akan dihapus permanen dan tidak dapat dikembalikan.</p>' +
        '</div>' +
        '<div class="modal-foot">' +
          '<button type="button" class="btn btn-outline" @click="confirmRow = null">Batal</button>' +
          '<button type="button" class="btn btn-danger" @click="doDelete()"><i class="fa-solid fa-trash" aria-hidden="true"></i> Hapus</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  window.AdminCrud = {
    mount: function (selector, cfg) {
      window.__crud = cfg;
      var el = document.querySelector(selector);
      if (el) el.innerHTML = TEMPLATE;
    }
  };
})();
