<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all permissions
        $permissions = [
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Category Management
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            // Service Management
            'view services',
            'create services',
            'edit services',
            'delete services',

            // Booking Management
            'view all bookings',
            'view own bookings',
            'create bookings',
            'confirm bookings',
            'cancel bookings',
            'delete bookings',

            // Promotion Management
            'view promotions',
            'create promotions',
            'edit promotions',
            'delete promotions',

            // Report Access
            'view reports',
            'export reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Admin role with all permissions
        $adminRole = Role::create(['name' => 'Admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Create Customer role with limited permissions
        $customerRole = Role::create(['name' => 'Customer']);
        $customerRole->givePermissionTo([
            'view services',
            'view categories',
            'view promotions',
            'view own bookings',
            'create bookings',
            'cancel bookings',
        ]);

        // Create default Admin user
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@rastasalon.com',
            'password' => Hash::make('password'),
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Admin');
    }
}
