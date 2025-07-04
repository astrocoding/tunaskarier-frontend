# TunasKarier - Platform Magang SMK

TunasKarier adalah platform magang untuk siswa SMK di seluruh Indonesia yang menghubungkan siswa dengan perusahaan-perusahaan ternama.

## 🚀 Fitur Utama

- **Landing Page Responsif** - Tampilan yang menarik dan responsif untuk semua perangkat
- **Pencarian Lowongan** - Fitur pencarian berdasarkan posisi, lokasi, dan jurusan
- **Daftar Lowongan** - Menampilkan lowongan magang terbaru dari berbagai perusahaan
- **Statistik Platform** - Menampilkan jumlah peserta, perusahaan, dan kota yang terlibat
- **Keunggulan Platform** - Informasi tentang manfaat menggunakan TunasKarier
- **Testimoni** - Ulasan dari peserta magang sebelumnya
- **FAQ** - Pertanyaan yang sering ditanyakan
- **Partner Perusahaan** - Logo perusahaan mitra

## 🛠️ Teknologi yang Digunakan

- **React 19** - Library JavaScript untuk UI
- **Vite** - Build tool yang cepat
- **Bootstrap 5.3.2** - Framework CSS untuk styling
- **React Router** - Routing untuk aplikasi React
- **Bootstrap Icons** - Icon library

## 📁 Struktur Proyek

```
src/
├── components/          # Komponen yang dapat digunakan kembali
│   ├── Header.jsx      # Komponen header dengan navigasi
│   ├── HeroSection.jsx # Section hero dengan CTA
│   ├── SearchSection.jsx # Form pencarian lowongan
│   ├── JobCard.jsx     # Card untuk menampilkan lowongan
│   ├── JobListings.jsx # Daftar lowongan
│   ├── StatsSection.jsx # Statistik platform
│   ├── FeaturesSection.jsx # Keunggulan platform
│   ├── BannerSection.jsx # Banner informasi penting
│   ├── PartnersSection.jsx # Logo partner perusahaan
│   ├── TestimonialsSection.jsx # Testimoni pengguna
│   ├── FAQSection.jsx  # FAQ dengan accordion
│   └── Footer.jsx      # Footer dengan informasi kontak
├── pages/              # Halaman aplikasi
│   └── LandingPage.jsx # Halaman utama landing page
├── styles/             # File CSS
│   └── LandingPage.css # Styling untuk landing page
└── App.jsx             # Komponen utama aplikasi
```

## 🎨 Komponen yang Dibuat

### Komponen yang Dapat Digunakan Kembali:
1. **Header** - Navigasi responsif dengan mobile menu
2. **JobCard** - Card untuk menampilkan informasi lowongan
3. **Footer** - Footer dengan informasi kontak dan menu

### Section Komponen:
1. **HeroSection** - Section utama dengan gambar dan CTA
2. **SearchSection** - Form pencarian lowongan
3. **JobListings** - Daftar lowongan menggunakan JobCard
4. **StatsSection** - Statistik platform
5. **FeaturesSection** - Keunggulan platform
6. **BannerSection** - Banner informasi penting
7. **PartnersSection** - Logo partner perusahaan
8. **TestimonialsSection** - Testimoni pengguna
9. **FAQSection** - FAQ dengan accordion Bootstrap

## 🚀 Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```

3. **Build untuk production:**
   ```bash
   npm run build
   ```

## 📱 Responsivitas

Landing page ini sudah dioptimalkan untuk berbagai ukuran layar:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (< 768px)

## 🎯 Fitur Responsif

- **Mobile Navigation** - Offcanvas menu untuk mobile
- **Flexible Grid** - Bootstrap grid system yang responsif
- **Responsive Images** - Gambar yang menyesuaikan ukuran layar
- **Touch-friendly** - Tombol dan link yang mudah disentuh di mobile

## 🔧 Konfigurasi

### Menambahkan Lowongan Baru:
Edit file `src/components/JobListings.jsx` dan tambahkan objek lowongan baru ke array `jobs`.

### Mengubah Styling:
Edit file `src/styles/LandingPage.css` untuk mengubah tampilan.

### Menambahkan Halaman Baru:
1. Buat komponen baru di folder `src/pages/`
2. Tambahkan route baru di `src/App.jsx`

## 📄 Lisensi

© 2024 TunasKarier. All rights reserved.

## 📞 Kontak

- Email: info@tunaskarier.id
- Instagram: @tunaskarier.id
