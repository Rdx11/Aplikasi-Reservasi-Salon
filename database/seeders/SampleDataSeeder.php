<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Category;
use App\Models\Promotion;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $categories = [
            ['name' => 'Perawatan Rambut', 'description' => 'Layanan potong, styling, coloring, dan treatment rambut', 'icon' => 'scissors'],
            ['name' => 'Perawatan Wajah', 'description' => 'Facial, treatment kulit, dan perawatan wajah lainnya', 'icon' => 'sparkles'],
            ['name' => 'Perawatan Tubuh', 'description' => 'Body spa, massage, dan perawatan tubuh lengkap', 'icon' => 'heart'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Services
        $services = [
            // Rambut
            ['category_id' => 1, 'name' => 'Potong Rambut Wanita', 'description' => 'Potong rambut dengan styling profesional', 'price' => 75000, 'duration' => 45],
            ['category_id' => 1, 'name' => 'Hair Coloring', 'description' => 'Pewarnaan rambut dengan produk premium', 'price' => 350000, 'duration' => 120],
            ['category_id' => 1, 'name' => 'Hair Treatment', 'description' => 'Perawatan rambut intensif untuk rambut sehat berkilau', 'price' => 200000, 'duration' => 60],
            ['category_id' => 1, 'name' => 'Smoothing', 'description' => 'Treatment smoothing untuk rambut lurus dan halus', 'price' => 500000, 'duration' => 180],
            ['category_id' => 1, 'name' => 'Blow Dry & Styling', 'description' => 'Blow dry dan styling untuk acara spesial', 'price' => 100000, 'duration' => 45],
            // Wajah
            ['category_id' => 2, 'name' => 'Facial Basic', 'description' => 'Facial dasar untuk kulit bersih dan segar', 'price' => 150000, 'duration' => 60],
            ['category_id' => 2, 'name' => 'Facial Premium', 'description' => 'Facial premium dengan produk high-end', 'price' => 300000, 'duration' => 90],
            ['category_id' => 2, 'name' => 'Acne Treatment', 'description' => 'Treatment khusus untuk kulit berjerawat', 'price' => 250000, 'duration' => 75],
            // Tubuh
            ['category_id' => 3, 'name' => 'Body Massage', 'description' => 'Pijat relaksasi seluruh tubuh', 'price' => 200000, 'duration' => 60],
            ['category_id' => 3, 'name' => 'Body Scrub', 'description' => 'Scrub tubuh untuk kulit halus dan cerah', 'price' => 175000, 'duration' => 45],
            ['category_id' => 3, 'name' => 'Manicure & Pedicure', 'description' => 'Perawatan kuku tangan dan kaki', 'price' => 150000, 'duration' => 60],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // Promotions
        Promotion::create([
            'title' => 'Diskon 30% Hair Treatment',
            'description' => 'Khusus member baru, dapatkan diskon 30% untuk semua layanan hair treatment',
            'discount_percentage' => 30,
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);

        Promotion::create([
            'title' => 'Paket Facial + Massage',
            'description' => 'Hemat hingga Rp 100.000 untuk paket facial dan body massage',
            'discount_amount' => 100000,
            'start_date' => now(),
            'end_date' => now()->addWeeks(2),
            'is_active' => true,
        ]);

        // Sample Customers
        $customers = [];
        $customerNames = [
            ['name' => 'Siti Rahayu', 'email' => 'siti.rahayu@example.com', 'phone' => '081234567001'],
            ['name' => 'Dewi Lestari', 'email' => 'dewi.lestari@example.com', 'phone' => '081234567002'],
            ['name' => 'Rina Wulandari', 'email' => 'rina.wulandari@example.com', 'phone' => '081234567003'],
            ['name' => 'Maya Sari', 'email' => 'maya.sari@example.com', 'phone' => '081234567004'],
            ['name' => 'Putri Handayani', 'email' => 'putri.handayani@example.com', 'phone' => '081234567005'],
            ['name' => 'Anisa Fitri', 'email' => 'anisa.fitri@example.com', 'phone' => '081234567006'],
            ['name' => 'Ratna Dewi', 'email' => 'ratna.dewi@example.com', 'phone' => '081234567007'],
            ['name' => 'Linda Permata', 'email' => 'linda.permata@example.com', 'phone' => '081234567008'],
        ];

        foreach ($customerNames as $cust) {
            $user = User::create([
                'name' => $cust['name'],
                'email' => $cust['email'],
                'phone' => $cust['phone'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
            $user->assignRole('Customer');
            $customers[] = $user;
        }

        // Sample Bookings (6 bulan terakhir)
        $services = Service::all();
        $statuses = ['completed', 'completed', 'completed', 'confirmed', 'pending', 'cancelled'];
        $times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

        // Generate bookings untuk 6 bulan terakhir
        for ($month = 5; $month >= 0; $month--) {
            $baseDate = Carbon::now()->subMonths($month);
            
            // Jumlah booking per bulan (meningkat setiap bulan untuk menunjukkan growth)
            $bookingsCount = rand(8, 12) + (5 - $month) * 2;
            
            for ($i = 0; $i < $bookingsCount; $i++) {
                $customer = $customers[array_rand($customers)];
                $service = $services->random();
                $bookingDate = $baseDate->copy()->day(rand(1, 28));
                
                // Untuk bulan lalu dan sebelumnya, lebih banyak completed
                if ($month > 0) {
                    $status = rand(1, 10) <= 8 ? 'completed' : 'cancelled';
                } else {
                    // Bulan ini, ada variasi status
                    $status = $statuses[array_rand($statuses)];
                }

                Booking::create([
                    'booking_code' => 'BK' . $bookingDate->format('Ymd') . strtoupper(substr(uniqid(), -4)),
                    'user_id' => $customer->id,
                    'service_id' => $service->id,
                    'booking_date' => $bookingDate,
                    'booking_time' => $times[array_rand($times)],
                    'status' => $status,
                    'total_price' => $service->price,
                    'notes' => null,
                    'created_at' => $bookingDate,
                    'updated_at' => $bookingDate,
                ]);
            }
        }
    }
}
