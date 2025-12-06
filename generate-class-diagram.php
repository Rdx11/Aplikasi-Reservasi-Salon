<?php

/**
 * Script untuk generate PlantUML Class Diagram dari Laravel Models
 * 
 * Cara pakai:
 * 1. Jalankan: php generate-class-diagram.php
 * 2. Copy output ke https://www.plantuml.com/plantuml/uml/ untuk visualisasi
 * 3. Atau gunakan extension PlantUML di VS Code
 */

$plantUML = <<<'PLANTUML'
@startuml Class Diagram - Booking System

skinparam classAttributeIconSize 0
skinparam class {
    BackgroundColor White
    BorderColor Black
    ArrowColor Black
}

' ==================== MODELS ====================

class User {
    +id: bigint
    +name: string
    +email: string
    +phone: string
    +address: text
    +password: string
    +profile_photo: string
    +last_login_at: datetime
    +is_active: boolean
    +email_verified_at: datetime
    +remember_token: string
    +created_at: timestamp
    +updated_at: timestamp
    --
    +getProfilePhotoUrlAttribute(): string
}

class Category {
    +id: bigint
    +name: string
    +description: text
    +icon: string
    +is_active: boolean
    +created_at: timestamp
    +updated_at: timestamp
    --
    +services(): HasMany
}

class Service {
    +id: bigint
    +category_id: bigint
    +name: string
    +description: text
    +price: decimal
    +duration: integer
    +image: string
    +is_active: boolean
    +created_at: timestamp
    +updated_at: timestamp
    --
    +category(): BelongsTo
    +bookings(): HasMany
    +promotions(): HasMany
}

class Promotion {
    +id: bigint
    +title: string
    +description: text
    +service_id: bigint
    +discount_percentage: decimal
    +discount_amount: decimal
    +image: string
    +promo_date: date
    +is_active: boolean
    +created_at: timestamp
    +updated_at: timestamp
    --
    +service(): BelongsTo
    +scopeActive(query)
    +scopeActiveOnDate(query, date)
    +scopeActiveToday(query)
    +getForService(serviceId, date): Promotion
    +calculateDiscountedPrice(price): decimal
}

class Booking {
    +id: bigint
    +booking_code: string
    +user_id: bigint
    +service_id: bigint
    +promotion_id: bigint
    +booking_date: date
    +booking_time: time
    +status: string
    +notes: text
    +total_price: decimal
    +original_price: decimal
    +payment_proof: string
    +payment_uploaded_at: datetime
    +created_at: timestamp
    +updated_at: timestamp
    --
    +user(): BelongsTo
    +service(): BelongsTo
    +promotion(): BelongsTo
    +confirmation(): HasOne
    +cancellation(): HasOne
    +hasPromo(): boolean
    +generateBookingCode(): string
}

class BookingConfirmation {
    +id: bigint
    +booking_id: bigint
    +confirmed_by: bigint
    +confirmation_date: datetime
    +payment_proof: string
    +bank_name: string
    +account_number: string
    +account_name: string
    +notes: text
    +created_at: timestamp
    +updated_at: timestamp
    --
    +booking(): BelongsTo
    +confirmedBy(): BelongsTo
}

class Cancellation {
    +id: bigint
    +booking_id: bigint
    +cancelled_by: bigint
    +reason: text
    +cancelled_at: datetime
    +created_at: timestamp
    +updated_at: timestamp
    --
    +booking(): BelongsTo
    +cancelledBy(): BelongsTo
}

' ==================== RELATIONSHIPS ====================

Category "1" --> "*" Service : has many
Service "1" --> "*" Booking : has many
Service "1" --> "*" Promotion : has many
User "1" --> "*" Booking : has many
Promotion "0..1" --> "*" Booking : applied to
Booking "1" --> "0..1" BookingConfirmation : has one
Booking "1" --> "0..1" Cancellation : has one
User "1" --> "*" BookingConfirmation : confirmed by
User "1" --> "*" Cancellation : cancelled by

@enduml
PLANTUML;

echo $plantUML;

// Simpan ke file
file_put_contents('class-diagram.puml', $plantUML);
echo "\n\n✅ Class diagram saved to: class-diagram.puml\n";
echo "📌 Buka file tersebut di https://www.plantuml.com/plantuml/uml/ untuk visualisasi\n";
echo "📌 Atau install extension PlantUML di VS Code\n";
