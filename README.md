# 💇‍♀️ Rasta Salon - Sistem Reservasi Online

<p align="center">
  <strong>Aplikasi Reservasi Salon Modern dengan Laravel & React</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-1.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js">
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
</p>

---

## 📋 Deskripsi

**Rasta Salon** adalah aplikasi sistem reservasi salon kecantikan berbasis web yang dibangun menggunakan teknologi modern. Aplikasi ini memungkinkan pelanggan untuk melakukan booking layanan salon secara online, sementara admin dapat mengelola seluruh operasional salon dengan mudah.

## ✨ Fitur Utama

### 👤 Fitur Customer
- 🔐 Registrasi & Login dengan autentikasi aman
- 📅 Booking layanan salon online
- 🏷️ Otomatis mendapat diskon jika ada promo hari ini
- 📋 Melihat riwayat booking dengan filter & pencarian
- 💳 Upload bukti pembayaran
- 👤 Manajemen profil pengguna dengan foto
- 🔔 Notifikasi status booking

### 👨‍💼 Fitur Admin
- 📊 Dashboard dengan statistik & grafik interaktif
- 👥 Manajemen pengguna (CRUD)
- 📁 Manajemen kategori layanan
- 💅 Manajemen layanan salon dengan gambar
- 📆 Manajemen booking (konfirmasi, proses, selesai, batal)
- 🏷️ Manajemen promosi harian (diskon persentase)
- 💳 Verifikasi bukti pembayaran
- 📈 Laporan & export (PDF, Excel/CSV)
- 🔔 Notifikasi real-time booking baru dengan suara
- ⚙️ Pengaturan aplikasi

### 👑 Fitur Owner
- 📊 Akses dashboard dengan statistik lengkap
- 📆 Melihat semua booking
- 📈 Akses seluruh laporan (booking, revenue, customer)
- 📤 Export laporan (PDF, Excel/CSV)

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Backend** | Laravel 11.x, PHP 8.2+ |
| **Frontend** | React 18.x, Inertia.js |
| **Styling** | TailwindCSS 4.x, Framer Motion |
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

### Owner
```
Email: owner@rastasalon.com
Password: password
```

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
│   ├── Console/
│   │   └── Commands/           # Artisan commands (promo deactivation)
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
│   ├── web.php                 # Web routes
│   └── console.php             # Scheduled commands
├── public/                     # Public assets
│   └── sounds/                 # Notification sounds
├── storage/                    # Storage files
└── tests/                      # Test files
```

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit file `resources/css/app.css` untuk mengubah warna primary (bubble gum pink):

```css
@theme {
    --color-primary-50: #fef1f6;
    --color-primary-100: #fee5ef;
    --color-primary-200: #ffcce2;
    --color-primary-300: #ffa3ca;
    --color-primary-400: #ff6fa8;
    --color-primary-500: #ff4d94;
    --color-primary-600: #f72585;
    --color-primary-700: #e0106d;
    --color-primary-800: #ba1160;
    --color-primary-900: #9b1354;
}
```

### Mengubah Logo

Ganti file di:
- `public/favicon.ico` - Favicon
- `public/storage/banner/` - Banner images

## 📊 Database Schema

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna (owner, admin & customer) |
| `categories` | Kategori layanan |
| `services` | Layanan salon |
| `bookings` | Data booking dengan promo |
| `booking_confirmations` | Konfirmasi booking |
| `promotions` | Promosi harian |
| `cancellations` | Data pembatalan |
| `roles` | Role pengguna (Owner, Admin, Customer) |
| `permissions` | Permission sistem |

## 📐 Class Diagram

### Relasi Antar Model

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Category  │ 1───* │   Service   │ 1───* │   Booking   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ name        │       │ category_id │       │ booking_code│
│ description │       │ name        │       │ user_id     │
│ icon        │       │ description │       │ service_id  │
│ is_active   │       │ price       │       │ promotion_id│
└─────────────┘       │ duration    │       │ booking_date│
                      │ image       │       │ booking_time│
                      │ is_active   │       │ status      │
                      └─────────────┘       │ total_price │
                            │               │ notes       │
                            │ 1             │ payment_proof│
                            │               └──────┬──────┘
                            ▼                      │
                      ┌─────────────┐              │ 1
                      │  Promotion  │              │
                      ├─────────────┤              ├───────────────┐
                      │ title       │              │               │
                      │ service_id  │              ▼ 1             ▼ 1
                      │ discount_%  │    ┌─────────────────┐ ┌─────────────┐
                      │ discount_amt│    │BookingConfirm.  │ │ Cancellation│
                      │ promo_date  │    ├─────────────────┤ ├─────────────┤
                      │ is_active   │    │ booking_id      │ │ booking_id  │
                      └─────────────┘    │ confirmed_by    │ │ cancelled_by│
                                         │ payment_proof   │ │ reason      │
                      ┌─────────────┐    │ bank_name       │ │ cancelled_at│
                      │    User     │    │ account_number  │ └─────────────┘
                      ├─────────────┤    └─────────────────┘
                      │ name        │           ▲
                      │ email       │           │
                      │ phone       │ 1─────────┘
                      │ address     │
                      │ is_active   │ 1───* Booking
                      └─────────────┘
```

### Deskripsi Relasi

| Model | Relasi |
|-------|--------|
| **User** | Has many Booking, BookingConfirmation, Cancellation |
| **Category** | Has many Service |
| **Service** | Belongs to Category, Has many Booking & Promotion |
| **Promotion** | Belongs to Service, Has many Booking |
| **Booking** | Belongs to User, Service, Promotion. Has one Confirmation & Cancellation |
| **BookingConfirmation** | Belongs to Booking & User (confirmer) |
| **Cancellation** | Belongs to Booking & User (canceller) |

### Generate Class Diagram

Untuk generate class diagram dalam format PlantUML, jalankan:

```bash
php generate-class-diagram.php
```

File `class-diagram.puml` akan dibuat. Untuk visualisasi:
- **Online**: Buka https://www.plantuml.com/plantuml/uml/ dan paste isi file
- **VS Code**: Install extension "PlantUML" lalu tekan `Alt+D` untuk preview

Alternatif menggunakan package Laravel:
```bash
composer require beyondcode/laravel-er-diagram-generator --dev
php artisan generate:erd
```

## 🔧 Perintah Artisan Berguna

```bash
# Clear semua cache
php artisan optimize:clear

# Cache untuk production
php artisan optimize

# Melihat daftar route
php artisan route:list

# Menonaktifkan promo yang sudah kadaluarsa
php artisan promotions:deactivate-expired

# Fresh migration dengan seeder
php artisan migrate:fresh --seed
```

## ⏰ Scheduled Tasks

Aplikasi memiliki scheduled task untuk menonaktifkan promo yang sudah lewat tanggalnya:

```bash
# Jalankan scheduler (untuk production, tambahkan ke crontab)
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1

# Atau jalankan manual
php artisan promotions:deactivate-expired
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

### Admin & Owner Routes
| Method | Endpoint | Deskripsi | Access |
|--------|----------|-----------|--------|
| GET | `/admin/dashboard` | Dashboard | Admin, Owner |
| GET | `/admin/users` | List users | Admin |
| GET | `/admin/categories` | List categories | Admin |
| GET | `/admin/services` | List services | Admin |
| GET | `/admin/bookings` | List bookings | Admin, Owner |
| GET | `/admin/promotions` | List promotions | Admin |
| GET | `/admin/reports` | Reports page | Admin, Owner |
| GET | `/admin/reports/export` | Export reports | Admin, Owner |
| GET | `/admin/profile` | Profile page | Admin, Owner |
| GET | `/admin/settings` | Settings page | Admin |

### Customer Routes
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/customer/dashboard` | Dashboard customer |
| GET | `/customer/services` | List services dengan promo |
| GET | `/customer/services/{id}` | Detail service |
| GET | `/customer/bookings` | List bookings |
| POST | `/customer/bookings` | Create booking |
| GET | `/customer/bookings/{id}` | Detail booking |
| POST | `/customer/bookings/{id}/cancel` | Cancel booking |
| POST | `/customer/bookings/{id}/upload-payment` | Upload bukti bayar |
| GET | `/customer/profile` | Profile page |

## 🐛 Troubleshooting

### Error: "SQLSTATE[HY000] [2002] Connection refused"
- Pastikan MySQL/MariaDB sudah berjalan
- Periksa konfigurasi database di `.env`

### Error: "Vite manifest not found"
```bash
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

### Promo tidak muncul
- Pastikan tanggal promo sama dengan hari ini
- Pastikan promo dalam status aktif
- Jalankan `php artisan promotions:deactivate-expired` untuk membersihkan promo kadaluarsa

## 📄 License

Aplikasi ini dilisensikan di bawah [MIT License](LICENSE).

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk **Rasta Salon**

---

<p align="center">
  <strong>Rasta Salon</strong> - Sistem Reservasi Salon Modern
</p>
