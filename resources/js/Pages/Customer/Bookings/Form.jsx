import { useForm } from '@inertiajs/react';
import { Button, Select, Textarea } from '@/Components/UI';
import { Tag } from 'lucide-react';

export default function BookingForm({ services = [], onSuccess }) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: '',
        booking_date: new Date().toISOString().split('T')[0], // Default hari ini
        booking_time: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/customer/bookings', { onSuccess });
    };

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    const serviceOptions = services.map((s) => {
        const hasPromo = s.active_promo && isPromoValidForDate(s.active_promo, data.booking_date);
        return {
            value: s.id,
            label: hasPromo
                ? `${s.name} - ${formatPrice(s.active_promo.discounted_price)} (PROMO!) - ${s.duration} menit`
                : `${s.name} - ${formatPrice(s.price)} - ${s.duration} menit`,
        };
    });

    // Check if promo is valid for selected date (promo only valid for today)
    function isPromoValidForDate(promo, selectedDate) {
        if (!promo) return false;
        const today = new Date().toISOString().split('T')[0];
        return selectedDate === today;
    }

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00',
    ].map((t) => ({ value: t, label: t }));

    const selectedService = services.find((s) => s.id == data.service_id);
    const hasActivePromo = selectedService?.active_promo && isPromoValidForDate(selectedService.active_promo, data.booking_date);

    return (
        <form onSubmit={submit} className="space-y-5">
            <Select
                label="Pilih Layanan"
                placeholder="Pilih layanan..."
                options={serviceOptions}
                value={data.service_id}
                onChange={(e) => setData('service_id', e.target.value)}
                error={errors.service_id}
            />

            {selectedService && (
                <div className={`p-4 rounded-xl ${hasActivePromo ? 'bg-gradient-to-r from-primary-50 to-gold-50 border border-primary-200' : 'bg-primary-50'}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-medium text-primary-900 mb-2">{selectedService.name}</h4>
                            <p className="text-sm text-primary-700 mb-2">{selectedService.description}</p>
                        </div>
                        {hasActivePromo && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-primary-500 text-white rounded-full text-xs font-medium">
                                <Tag className="w-3 h-3" />
                                PROMO
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-primary-600">Durasi: {selectedService.duration} menit</span>
                        {hasActivePromo ? (
                            <div className="flex items-center gap-2">
                                <span className="line-through text-gray-400">
                                    {formatPrice(selectedService.price)}
                                </span>
                                <span className="font-bold text-primary-600">
                                    {formatPrice(selectedService.active_promo.discounted_price)}
                                </span>
                                <span className="text-xs text-primary-500">
                                    (Hemat {selectedService.active_promo.discount_percentage 
                                        ? `${selectedService.active_promo.discount_percentage}%` 
                                        : formatPrice(selectedService.active_promo.discount_amount)})
                                </span>
                            </div>
                        ) : (
                            <span className="font-semibold text-primary-800">
                                {formatPrice(selectedService.price)}
                            </span>
                        )}
                    </div>
                    {hasActivePromo && (
                        <div className="mt-3 p-2 bg-white/50 rounded-lg">
                            <p className="text-xs text-primary-700">
                                <strong>🎉 {selectedService.active_promo.title}</strong> - Promo berlaku hanya hari ini!
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={data.booking_date}
                        onChange={(e) => setData('booking_date', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.booking_date && <p className="text-sm text-red-500">{errors.booking_date}</p>}
                    {data.booking_date === new Date().toISOString().split('T')[0] && selectedService?.active_promo && (
                        <p className="text-xs text-primary-600">✨ Promo tersedia untuk hari ini!</p>
                    )}
                </div>

                <Select
                    label="Jam"
                    placeholder="Pilih jam..."
                    options={timeSlots}
                    value={data.booking_time}
                    onChange={(e) => setData('booking_time', e.target.value)}
                    error={errors.booking_time}
                />
            </div>

            <Textarea
                label="Catatan (opsional)"
                placeholder="Catatan tambahan untuk booking Anda..."
                rows={3}
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                error={errors.notes}
            />

            <div className="flex gap-3 pt-4">
                <Button type="submit" loading={processing} className="flex-1">
                    Booking Sekarang
                </Button>
            </div>
        </form>
    );
}
