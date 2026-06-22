# Express Contacts API

Express Contacts API adalah RESTful API yang dikembangkan menggunakan Node.js, Express.js, dan Prisma ORM. Proyek ini bertujuan untuk mengelola data kontak dan alamat pengguna dengan sistem autentikasi.

## Fitur Utama
- **Manajemen Pengguna (User Management):** Registrasi, Login, Dapatkan Profil, Update Profil, dan Logout.
- **Manajemen Kontak (Contact Management):** Buat, Baca, Perbarui, Hapus, dan Cari Kontak.
- **Manajemen Alamat (Address Management):** Buat, Baca, Perbarui, Hapus, dan Daftar Alamat yang terhubung dengan spesifik kontak.
- **Autentikasi & Keamanan:** Middleware autentikasi menggunakan token, dan hashing password dengan bcrypt.
- **Validasi Data:** Validasi input request menggunakan Joi.
- **Pencatatan Log:** Sistem logging yang terintegrasi menggunakan Winston.
- **Pengujian (Testing):** Unit dan integration test menggunakan Jest dan Supertest.

## Teknologi yang Digunakan
- **Backend:** Node.js, Express.js (v5)
- **Database:** MySQL
- **ORM:** Prisma Client (v6)
- **Validation:** Joi
- **Logging:** Winston
- **Testing:** Jest, Supertest
- **Lainnya:** bcrypt, uuid, nodemon

## Struktur Direktori
```text
express-contacts-api/
├── prisma/                 # Konfigurasi Prisma dan Database Schema (schema.prisma)
├── src/                    # Source code utama aplikasi
│   ├── application/        # Konfigurasi Express (web.js), Database, dan Logging
│   ├── controller/         # Logika request dan response (Controllers)
│   ├── error/              # Custom error classes
│   ├── middleware/         # Express middlewares (Auth, Error Handling)
│   ├── route/              # Definisi endpoints API (Public & Private Routes)
│   ├── service/            # Logika bisnis utama (Services)
│   ├── validation/         # Skema validasi menggunakan Joi
│   └── main.js             # Entry point aplikasi
├── test/                   # Kode pengujian (Unit & Integration Tests)
├── package.json            # Daftar dependensi dan konfigurasi npm script
└── .env                    # Variabel environment
```

## Persyaratan Sistem
Pastikan Anda telah menginstal perangkat lunak berikut sebelum memulai:
- **Node.js** (versi 18 atau lebih baru direkomendasikan)
- **MySQL** Server

## Instalasi & Konfigurasi

1. **Clone repositori ini**.

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat atau modifikasi file `.env` di root direktori proyek, dan sesuaikan dengan konfigurasi database MySQL Anda:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/nama_database?schema=public"
   ```
   *Ganti `username`, `password`, dan `nama_database` sesuai dengan server MySQL lokal Anda.*

4. **Migrasi Database:**
   Jalankan perintah Prisma untuk melakukan sinkronisasi skema ke database Anda:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Atau gunakan `npx prisma migrate dev` jika Anda menggunakan sistem migrasi dari Prisma)*

## Menjalankan Aplikasi

Anda dapat menjalankan aplikasi menggunakan beberapa perintah yang telah disediakan di `package.json`:

- **Mode Development (dengan Nodemon):**
  ```bash
  npm run dev
  ```
- **Mode Production:**
  ```bash
  npm run prod
  ```
  Aplikasi akan berjalan secara default di `http://localhost:3000`.

## Pengujian (Testing)

Proyek ini dilengkapi dengan unit dan integration test menggunakan Jest dan dikonfigurasi untuk environment ECMAScript Modules (ESM). Untuk menjalankan semua pengujian:

```bash
npm test
```

## Dokumentasi API / Endpoints

Berikut adalah daftar endpoint API yang tersedia di aplikasi ini. Endpoint yang membutuhkan autentikasi mengharuskan pengiriman header token (seperti `Authorization` atau format yang ditentukan oleh middleware) dengan token yang valid.

### Public API (Tanpa Autentikasi)
| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/users` | Registrasi user baru |
| `POST` | `/api/users/login` | Login user untuk mendapatkan token |

### Protected API (Membutuhkan Autentikasi)

**User Management**
| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/users/current` | Dapatkan informasi profil user saat ini |
| `PATCH` | `/api/users/current` | Perbarui informasi profil user saat ini |
| `DELETE` | `/api/users/logout` | Logout (hapus token dari user) |

**Contact Management**
| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/contacts` | Tambah kontak baru |
| `GET` | `/api/contacts/:contactId` | Dapatkan detail satu kontak berdasarkan ID |
| `PUT` | `/api/contacts/:contactId` | Perbarui data kontak berdasarkan ID |
| `DELETE` | `/api/contacts/:contactId` | Hapus kontak berdasarkan ID |
| `GET` | `/api/contacts` | Cari dan tampilkan daftar kontak (dengan query pencarian & pagination) |

**Address Management**
| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/contacts/:contactId/addresses` | Tambah alamat untuk kontak tertentu |
| `GET` | `/api/contacts/:contactId/addresses/:addressId` | Dapatkan detail alamat |
| `PUT` | `/api/contacts/:contactId/addresses/:addressId` | Perbarui data alamat |
| `DELETE` | `/api/contacts/:contactId/addresses/:addressId` | Hapus data alamat |
| `GET` | `/api/contacts/:contactId/addresses` | Dapatkan seluruh alamat untuk kontak tertentu |