<?php

namespace App\Console\Commands;

use App\Models\Promotion;
use Illuminate\Console\Command;

class DeactivateExpiredPromotions extends Command
{
    protected $signature = 'promotions:deactivate-expired';
    protected $description = 'Deactivate promotions that have passed their promo date';

    public function handle()
    {
        $count = Promotion::where('is_active', true)
            ->whereDate('promo_date', '<', now()->toDateString())
            ->update(['is_active' => false]);

        $this->info("Deactivated {$count} expired promotions.");

        return Command::SUCCESS;
    }
}
