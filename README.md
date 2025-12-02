# 💇‍♀️ Rasta Salon - Sistem Reservasi Online

<p align="center">
  <img src="public/favicon.ico" alt="Rasta Salon Logo" width="80">
</p>

<p align="center">
  <strong>Aplikasi Reservasi Salon Modern dengan Laravel & React</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-1.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
</p>

---

## 📋 Deskripsi

**Rasta Salon** adalah aplikasi sistem reservasi salon kecantikan berbasis web yang dibangun menggunakan teknologi modern. Aplikasi ini memungkinkan pelanggan untuk melakukan booking layanan salon secara online, sementara admin dapat mengelola seluruh operasional salon dengan mudah.

## ✨ Fitur Utama

### 👤 Fitur Customer
- 🔐 Registrasi & Login dengan autentikasi aman
- 📅 Booking layanan salon online
- 📋 Melihat riwayat booking
- 👤 Manajemen profil pengguna
- 🔔 Notifikasi status booking

### 👨‍💼 Fitur Admin
- 📊 Dashboard dengan statistik & grafik interaktif
- 👥 Manajemen pengguna (CRUD)
- 📁 Manajemen kategori layanan
- 💅 Manajemen layanan salon
- 📆 Manajemen booking (konfirmasi, proses, selesai, batal)
- 🏷️ Manajemen promosi & diskon
- 📈 Laporan & export (PDF, Excel/CSV)
- 🔔 Notifikasi real-time booking baru
- ⚙️ Pengaturan aplikasi

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Backend** | Laravel 11.x, PHP 8.2+ |
| **Frontend** | React 18.x, Inertia.js |
| **Styling** | TailwindCSS 3.x, Framer Motion |
| **Database** | MySQL 8.0+ / MariaDB 10.4+ |
| **Authentication** | Laravel Fortify |
| **Authorization** | Spatie Laravel Permission |
| **PDF Export** | DomPDF |
| **Build Tool** | Vite |
| **Icons** | Lucide React |
| **Charts** | Recharts |

## 📦 Requirements

### System Requirements
- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.x
- **NPM** >= 9.x atau **Yarn** >= 1.22
- **MySQL** >= 8.0 atau **MariaDB** >= 10.4

### PHP Extensions
```
- BCMath PHP Extension
- Ctype PHP Extension
- Fileinfo PHP Extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PDO PHP Extension
- PDO MySQL Extension
- Tokenizer PHP Extension
- XML PHP Extension
- GD PHP Extension (untuk image processing)
```

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/reservasi-salon-rasta.git
cd reservasi-salon-rasta
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Konfigurasi Database

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reservasi_salon_rasta
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Buat Database

```sql
CREATE DATABASE reservasi_salon_rasta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Jalankan Migration & Seeder

```bash
# Jalankan migration
php artisan migrate

# Jalankan seeder (data awal)
php artisan db:seed
```

### 7. Storage Link

```bash
php artisan storage:link
```

### 8. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 9. Jalankan Aplikasi

```bash
# Menggunakan PHP built-in server
php artisan serve

# Atau menggunakan Laragon/XAMPP/Valet
# Akses: http://localhost:8000 atau http://reservasi-salon-rasta.test
```

## 🔑 Default Login Credentials

Setelah menjalankan seeder, gunakan kredensial berikut untuk login:

### Admin
```
Email: admin@rastasalon.com
Password: password
```

### Customer (Sample)
```
Email: customer@example.com
Password: password
```

## 📁 Struktur Folder

```
reservasi-salon-rasta/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/          # Controller untuk admin
│   │   │   └── Customer/       # Controller untuk customer
│   │   └── Middleware/
│   ├── Models/                 # Eloquent Models
│   └── Actions/                # Action classes
├── database/
│   ├── migrations/             # Database migrations
│   ├── seeders/                # Database seeders
│   └── factories/              # Model factories
├── resources/
│   ├── js/
│   │   ├── Components/         # React components
│   │   │   └── UI/             # Reusable UI components
│   │   ├── Hooks/              # Custom React hooks
│   │   ├── Layouts/            # Layout components
│   │   └── Pages/              # Page components
│   │       ├── Admin/          # Admin pages
│   │       ├── Auth/           # Authentication pages
│   │       └── Customer/       # Customer pages
│   ├── css/                    # Stylesheets
│   └── views/                  # Blade templates
├── routes/
│   └── web.php                 # Web routes
├── public/                     # Public assets
├── storage/                    # Storage files
└── tests/                      # Test files
```

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit file `tailwind.config.js` untuk mengubah warna primary:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        // ... sesuaikan warna
        600: '#9333ea',
        700: '#7e22ce',
      }
    }
  }
}
```

### Mengubah Logo

Ganti file di:
- `public/favicon.ico` - Favicon
- `public/images/logo.png` - Logo aplikasi

## 📊 Database Schema

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna (admin & customer) |
| `categories` | Kategori layanan |
| `services` | Layanan salon |
| `bookings` | Data booking |
| `booking_confirmations` | Konfirmasi booking |
| `promotions` | Promosi & diskon |
| `cancellations` | Data pembatalan |
| `roles` | Role pengguna |
| `permissions` | Permission sistem |

## 🔧 Perintah Artisan Berguna

```bash
# Clear semua cache
php artisan optimize:clear

# Cache untuk production
php artisan optimize

# Melihat daftar route
php artisan route:list

# Membuat controller
php artisan make:controller NamaController

# Membuat model dengan migration
php artisan make:model NamaModel -m

# Fresh migration dengan seeder
php artisan migrate:fresh --seed
```

## 🧪 Testing

```bash
# Jalankan semua test
php artisan test

# Jalankan test dengan coverage
php artisan test --coverage
```

## 📱 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/login` | Login user |
| POST | `/register` | Register user baru |
| POST | `/logout` | Logout user |
| POST | `/forgot-password` | Request reset password |
| POST | `/reset-password` | Reset password |

### Admin Routes
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/admin/dashboard` | Dashboard admin |
| GET | `/admin/users` | List users |
| GET | `/admin/categories` | List categories |
| GET | `/admin/services` | List services |
| GET | `/admin/bookings` | List bookings |
| GET | `/admin/promotions` | List promotions |
| GET | `/admin/reports` | Reports page |
| GET | `/admin/reports/export` | Export reports |

### Customer Routes
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/customer/dashboard` | Dashboard customer |
| GET | `/customer/services` | List services |
| GET | `/customer/bookings` | List bookings |
| POST | `/customer/bookings` | Create booking |

## 🐛 Troubleshooting

### Error: "SQLSTATE[HY000] [2002] Connection refused"
- Pastikan MySQL/MariaDB sudah berjalan
- Periksa konfigurasi database di `.env`

### Error: "Vite manifest not found"
```bash
npm run build
```

### Error: "The Mix manifest does not exist"
```bash
npm run dev
# atau
npm run build
```

### Error: "Permission denied" pada storage
```bash
chmod -R 775 storage bootstrap/cache
# atau di Windows, pastikan folder writable
```

### Error: "Class not found"
```bash
composer dump-autoload
php artisan optimize:clear
```

## 📄 License

Aplikasi ini dilisensikan di bawah [MIT License](LICENSE).

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk **Rasta Salon**

---

<p align="center">
  <strong>Rasta Salon</strong> - Sistem Reservasi Salon Modern
</p>
