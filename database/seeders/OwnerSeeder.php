<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        // Create Owner role if not exists
        if (!Role::where('name', 'Owner')->exists()) {
            $ownerRole = Role::create(['name' => 'Owner']);
            $ownerRole->givePermissionTo(['view all bookings', 'view reports']);
        }

        // Create Owner user if not exists
        if (!User::where('email', 'owner@rastasalon.com')->exists()) {
            $owner = User::create([
                'name' => 'Owner',
                'email' => 'owner@rastasalon.com',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
            $owner->assignRole('Owner');
        }
    }
}
