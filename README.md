# Mini Analytics Dashboard 📊

Proyek web dashboard analitik sederhana, modern, dan responsif yang dibangun menggunakan **HTML, CSS, dan JavaScript murni (Vanilla)** tanpa memerlukan instalasi dependensi (Node.js/npm).

---

## ✨ Fitur Utama

1. **Ringkasan KPI / Metrik Utama**:
   - Total Pendapatan (dihitung otomatis dari transaksi berhasil).
   - Total Pengunjung.
   - Total Pesanan Baru.
   - Tingkat Konversi.

2. **Grafik Interaktif (Chart.js)**:
   - Grafik Tren Pendapatan & Pengunjung (Dual Axis line chart) dengan filter rentang waktu: **7 Hari**, **1 Bulan**, dan **1 Tahun**.
   - Grafik Donat Proporsi Penjualan per Kategori produk (Elektronik, Fashion, Makanan, Kecantikan).

3. **Tabel Data Transaksi Interaktif**:
   - **Pencarian Real-time**: Mencari data berdasarkan nama pelanggan, ID, atau kategori dengan penanda highlight kuning otomatis.
   - **Filter Multi-kriteria**: Filter berdasarkan status (`Semua`, `Selesai`, `Pending`, `Dibatalkan`) dan kategori produk (`Elektronik`, `Fashion`, `Makanan`, `Kecantikan`).
   - **Pengurutan Kolom (Sort)**: Klik header kolom (ID, Pelanggan, Kategori, Tanggal, Nominal, Status) untuk mengurutkan data (A-Z / Z-A atau nominal naik / turun).
   - **Tombol Reset Filter**: Mengembalikan semua filter ke kondisi awal dengan 1 klik.
   - **Hapus Data & Ekspor CSV**: Tombol hapus baris transaksi dan ekspor tabel data ke format `.csv`.

4. **Tambah Transaksi (CRUD Ringan)**:
   - Modal popup formulir untuk menambah transaksi baru.
   - Data otomatis disimpan ke **LocalStorage** browser agar tidak hilang saat halaman di-refresh.
   - Grafik dan total pendapatan diperbarui secara otomatis.

5. **Mode Gelap / Terang (Dark / Light Theme)**:
   - Tombol switch tema di navbar pojok kanan atas.
   - Preferensi tema disimpan di LocalStorage.

6. **Desain Responsif**:
   - Sidebar navigasi yang dapat diciutkan (drawer) pada layar perangkat mobile / tablet.

---

## 📁 Struktur Direktori

```
simple-dashboard/
│
├── index.html       # Struktur utama HTML, navbar, sidebar, KPI, canvas chart, dan modal
├── style.css        # Desain visual, CSS Variables (Dark/Light mode), layout Grid & Flexbox
├── script.js        # Logika aplikasi, state LocalStorage, kalkulasi KPI, Chart.js, & event handler
└── README.md        # Panduan dokumentasi proyek
```

---

## 🚀 Cara Membuka Proyek

Proyek ini tidak memerlukan server lokal atau instalasi command line khusus.

1. Buka folder `simple-dashboard` di File Explorer.
2. Klik dua kali pada file **`index.html`** untuk langsung membukanya di browser favorit Anda (Google Chrome, Edge, Firefox, dll).
3. Atau jalankan via live-server/ekstensi VS Code jika tersedia.
