```markdown
# 📚 GiveNTech - Sistem Manajemen Peminjaman Fasilitas & Barang Kampus

**GiveNTech** adalah platform manajemen peminjaman fasilitas dan barang modern yang dirancang untuk kampus, organisasi, maupun perusahaan. Sistem ini mengintegrasikan **Booking Online**, **Verifikasi QR Code**, **Tracking Lokasi**, **Approval Workflow**, dan **Notifikasi Real-time** dalam satu ekosistem yang *seamless*.

Dibangun dengan arsitektur **Monorepo Full-Stack** menggunakan **AdonisJS 6** (Backend) dan **React + Inertia.js** (Frontend), menjamin performa tinggi, keamanan tipe data (TypeScript), dan pengalaman pengguna setara Single Page Application (SPA).

---

## 🎯 Quick Info

| Aspek | Detail |
| :--- | :--- |
| **Framework** | AdonisJS 6 (Full-Stack TypeScript) |
| **Frontend** | React 19 + InertiaJS |
| **Backend** | Node.js 20+ |
| **Database** | MySQL / MariaDB |
| **Cache & OTP** | Redis 6+ |
| **API Interface** | REST & GraphQL |
| **Realtime** | Socket.IO |
| **Maps** | Leaflet |
| **Notifikasi** | WhatsApp Cloud API |

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![AdonisJS](https://img.shields.io/badge/AdonisJS-6-purple)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

---

## ⭐ Fitur Utama

### 1. 📅 Manajemen Peminjaman (Booking System)
- **Availability Check:** Sistem otomatis mengecek ketersediaan ruangan/barang agar tidak terjadi bentrokan jadwal.
- **Approval Workflow:** Peminjaman melalui tahap *Pending* -> *Confirmed* (oleh Admin) -> *Picked Up* -> *Returned*.
- **Form Interaktif:** Integrasi peta (Leaflet) untuk pemilihan lokasi fasilitas secara visual.

### 2. 🔐 Verifikasi & Keamanan
- **QR Code Unique:** Setiap booking menghasilkan QR Code unik dengan proteksi HMAC untuk mencegah pemalsuan.
- **Scan Verification:** Fitur scanner bawaan bagi Admin untuk memverifikasi proses pengambilan dan pengembalian.
- **OTP Registration:** Verifikasi akun baru menggunakan kode OTP yang dikirim ke email dan disimpan di **Redis** (TTL 5 menit).

### 3. 🔔 Notifikasi Cerdas
- **WhatsApp Cloud API:** Pengiriman notifikasi otomatis terkait status approval dan pengingat denda ke WhatsApp user.
- **Real-time Updates:** Sinkronisasi status antar perangkat secara instan menggunakan Socket.IO.

### 4. 🗺️ Lokasi & Fasilitas
- **Geo-tagging:** Penentuan titik koordinat (Latitude/Longitude) untuk setiap ruangan.
- **Fasilitas Management:** CRUD lengkap untuk Admin mengelola inventaris beserta kondisi barang (Baik/Rusak/Hilang).

---

## 💻 Prasyarat Sistem

Sebelum instalasi, pastikan environment Anda memiliki:
1. **Node.js**: Versi 20.x atau lebih baru.
2. **NPM**: Versi 10.x ke atas.
3. **Database**: MySQL atau MariaDB yang berjalan.
4. **Redis**: Server Redis yang berjalan (Wajib untuk fitur OTP).
5. **Git**: Untuk cloning repository.

---

## 🚀 Instalasi & Setup

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di local machine:

### 1. Clone Repository
```bash
git clone [https://github.com/Areandra/GiveNTech.git](https://github.com/Areandra/GiveNTech.git)
cd GiveNTech

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Setup Environment Variable

Copy file contoh konfigurasi dan generate key aplikasi:

```bash
cp .env.example .env
node ace generate:key

```

### 4. Setup Database

Buat database di MySQL, sesuaikan kredensial di `.env`, lalu jalankan migrasi:

```bash
node ace migration:run
# Opsional: Jalankan seeder untuk data awal
node ace db:seed

```

### 5. Jalankan Server

```bash
npm run dev

```

Akses di: **http://localhost:3333**

---

## 🔐 Konfigurasi Environment (.env)

Contoh konfigurasi utama yang harus diperhatikan:

```env
# --- DATABASE ---
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=giventech

# --- REDIS (Wajib untuk OTP) ---
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# --- WHATSAPP CLOUD API ---
PHONE_NUMBER_ID=your_id
WA_ACCESS_TOKEN=your_token

# --- SMTP EMAIL ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=email@gmail.com
SMTP_PASSWORD=app_specific_password

```

---

## 🔄 Alur Penggunaan (User Flow)

1. **Registrasi:** User mendaftar -> Verifikasi OTP email via Redis -> Akun Aktif.
2. **Booking:** Pilih fasilitas melalui List atau Map -> Isi form peminjaman -> Submit.
3. **Approval:** Admin meninjau permintaan di Dashboard Admin -> Setujui/Tolak.
4. **Pickup:** User menunjukkan QR Code -> Admin Scan -> Status: *Picked Up*.
5. **Return:** User mengembalikan barang -> Admin Scan -> Cek Kondisi -> Status: *Done*.

---

## 📂 Struktur Folder

```
GiveNTech/
├── app/
│   ├── Controllers/    # Logika Request (Auth, Booking, Facility)
│   ├── Models/         # Skema Database
│   ├── Services/       # Business Logic (WhatsApp, QR, Socket)
│   └── GraphQL/        # Schema & Resolvers
├── database/           # Migrasi & Seeder
├── inertia/            # FRONTEND (React & TypeScript)
│   ├── pages/          # Halaman UI
│   └── components/     # Komponen Reusable
├── start/              # Route & Kernel Konfigurasi
└── public/             # Aset Statis

```

---

## 🚨 Troubleshooting

| Masalah | Solusi |
| --- | --- |
| **Error: Redis Connection Refused** | Pastikan `redis-server` sudah berjalan. |
| **WhatsApp tidak terkirim** | Cek validitas `WA_ACCESS_TOKEN` di Meta Developers. |
| **Vite Manifest Not Found** | Jalankan `npm run dev` atau build frontend terlebih dahulu. |

---

## 🤝 Kontribusi & Lisensi

Dibuat dengan ❤️ oleh **Areandra**.
Project ini dilisensikan di bawah **MIT License**.

---

<div align="center">
<b>⭐ Berikan Star jika project ini membantu Anda! ⭐</b>
</div>

```

```
