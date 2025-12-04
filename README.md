# Sistem Manajemen Restoran POS & QR Ordering

Sistem Manajemen Restoran modern yang dirancang untuk mempermudah operasional restoran, kafe, dan food court. Sistem ini mengintegrasikan POS, QR Ordering per sesi, Manajemen Meja, dan Kitchen Order Ticket dalam satu platform real-time.

---

## ⚙️ Kebutuhan Lingkungan & Tools

### System Requirements (Digunakan Di Project)

- **Node.js:**  
  Versi **≥ 20.x** _(direkomendasikan LTS, contoh stabil: 20.11.0 atau di atasnya, dan telah berhasil pada 20.14.x)_  
- **npm:**  
  Mengikuti Node.js (LTS).
- **MySQL/MariaDB:**  
  Direkomendasikan versi **MariaDB 10.4.32+** atau **MySQL 8.x**.  
  _(Project telah diuji berjalan lancar di MariaDB 10.4.32, namun kompatibilitas dengan MySQL 8 ke atas juga baik untuk fitur JSON & integritas data)_
- **OS:**  
  Teruji berjalan di **Windows 11** & **Ubuntu 24.04.3 LTS**.

### Tools Pengembangan Rekomendasi

- **Code Editor:**  
  [VSCode](https://code.visualstudio.com/)
- **Database Client GUI:**  
  [phpMyAdmin (XAMPP)](https://www.apachefriends.org/) atau [DBeaver](https://dbeaver.io/)
- **Package Manager:**  
  npm (default Node.js)
- **Git:**  
  [Git Bash](https://gitforwindows.org/) untuk cloning dll

#### Opsional untuk workflow development:
- **ngrok/localtunnel** _(testing dari HP di luar LAN)_
- **Docker Desktop** _(jika ingin isolasi MySQL/MariaDB/Node)_

---

## 🚦 Tahapan Instalasi & Setup

### 1. **Clone & Instalasi**
```bash
git clone https://github.com/Areandra/Sistem-Manjemen-Restorant-POS-QR-Ordering.git
cd Sistem-Manjemen-Restorant-POS-QR-Ordering
npm install
cp .env.example .env
```

### 2. **Generate Application Key**
```bash
node ace generate:key
```

### 3. **Konfigurasi .env**
Edit file `.env`:
```env
HOST=192.168.x.x
PORT=3333
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_db
DB_USER=root
DB_PASSWORD=isi_password_db_anda
SUPER_PASSWORD=isi_super_password_anda
```
> **WAJIB:** Gunakan IP LAN agar perangkat lain dapat akses aplikasi untuk testing QR Order.

---

### ⚠️ Disclaimer Sebelum Migrasi Database

- **MIGRASI bisa GAGAL** apabila _container database_, _versi DB_, atau _default config_ berbeda-beda _(contoh: kolom yang `notNullable` **tanpa default value** pada beberapa engine/database/container akan error) lakukan perbaikian manual pada migration_.
- Pastikan _user/permission/database_ sudah sesuai, dan __create database secara MANUAL__ jika migrasi error karena DB belum ada.
- Periksa kembali skema dan environment _jika deploy ke Docker dengan image database bukan MariaDB 10.4.x/mySQL 8.x_ (cek log error migrasi!).

---

### 4. **Migrasi Database**
```bash
node ace migration:run
```

### 5. **Build (Opsional untuk Produksi)**
```bash
npm run build
```

### 6. **Jalankan Developer**
```bash
npm run dev
```
Akses aplikasi di browser: `http://<HOST>:<PORT>`

---

## 🔑 **Pembuatan Admin & Admin Commands**

### Alur Pembuatan & Manajemen Admin

Setelah server berjalan & database siap, buat/atur admin dengan perintah CLI berikut:

```bash
node ace app:admin create
```
- Masukkan `SUPER_PASSWORD` sesuai yang di `.env` ketika diminta.
- Wajib mengisi **nama**, **email**, **password** admin.
- Hanya **SATU** admin aktif di sistem (_jika sudah ada, perintah tidak dapat dijalankan kecuali destroy/reset_).

#### Perintah Lain pada Admin Commands

- **Reset Password Admin**
  ```bash
  node ace app:admin password-reset <email_admin>
  ```
  > Akan meminta super password dan password baru.

- **Hapus Admin**
  ```bash
  node ace app:admin destroy <email_admin>
  ```
  > Hanya dapat dijalankan jika ingin membersihkan admin utama (super password diperlukan).

> Pastikan email admin sesuai dengan yang tercatat di database!

### 📋 Catatan:
- Semua aksi admin melalui CLI (bukan dari antarmuka web).
- SUPER_PASSWORD wajib diingat dan disimpan aman!
- Jika pembuatan admin atau migrasi error, cek log error pada terminal & pastikan database/config benar.

---

## 📱 Disclaimer QR Order

> **Fitur QR Order menggunakan QR unik tiap sesi/order (bukan statis per meja), sehingga tiap sesi memiliki URI khusus & histori sendiri. Untuk menguji QR, PASTIKAN aplikasi diakses via IP LAN (`HOST` di `.env`), perangkat lain dalam jaringan sama, BUKAN `localhost`/`127.0.0.1`.**

---

## 📝 Alur & Fitur Utama

### Role & Alur Inti

- **Admin:** Setup awal, manajemen user/meja/menu.
- **Kasir:** Proses openning session, daftar pesanan, pembayaran, closing session.
- **Pelanggan:** Scan QR (per sesi), buat pesanan, pantau status pesanan & bill langsung lewat perangkat sendiri.
- **Dapur:** Pantau pesanan masuk, update status produksi tiap pesanan/sesi.

### Alur Penggunaan
1. **Admin setup** data restoran: meja, kategori, menu, dan user lain.
2. **Pelanggan datang**, scan QR SESSION, akses menu, pesan secara mandiri.
3. **Order masuk** ke kasir & dapur secara realtime.
4. **Kasir** konfirmasi, proses pembayaran, close sesi_order.
5. **Kitchen** update status pesanan (masak-saji-selesai).

### Fitur Lengkap:
- CLI Admin: buat/reset password/destroy
- QR Session Ordering: QR unik tiap sesi/many_order (bukan one QR per table)
- CRUD Master: menu, meja, user role, laporan, histori order
- Transaksi: order, bayar, close sesi, billing digital
- Role & Otorisasi: SUPER_PASSWORD, role logic
- Realtime Notifikasi: React/Inertia SPA, refresh hanya terjadi jika pengolahan data di lakukan di perangkat lain
- Statistik: grafik penjualan, performa sesi/meja
- Modular Command: lint, build, serve, test, typecheck, dsb

---

## Kontribusi & Lisensi

Silakan fork/pull request/issue untuk kontribusi.  
Lisensi: [UNLICENSED] (cek file LICENSE).

---

## Kontak

- **Owner:** Areandra
- **Repo:** [https://github.com/Areandra/Sistem-Manjemen-Restorant-POS-QR-Ordering](https://github.com/Areandra/Sistem-Manjemen-Restorant-POS-QR-Ordering)
- **Linkedin** [https://www.linkedin.com/in/muhammad-ariel-4899312a0/](https://www.linkedin.com/in/muhammad-ariel-4899312a0/)
---
