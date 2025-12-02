import { useForm } from '@inertiajs/react';
import { Button, Select, Textarea } from '@/Components/UI';

export default function BookingForm({ services = [], onSuccess }) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: '',
        booking_date: '',
        booking_time: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/customer/bookings', { onSuccess });
    };

    const serviceOptions = services.map((s) => ({
        value: s.id,
        label: `${s.name} - Rp ${new Intl.NumberFormat('id-ID').format(s.price)} (${s.duration} menit)`,
    }));

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00',
    ].map((t) => ({ value: t, label: t }));

    const selectedService = services.find((s) => s.id == data.service_id);

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
                <div className="p-4 bg-primary-50 rounded-xl">
                    <h4 className="font-medium text-primary-900 mb-2">{selectedService.name}</h4>
                    <p className="text-sm text-primary-700 mb-2">{selectedService.description}</p>
                    <div className="flex gap-4 text-sm">
                        <span className="text-primary-600">Durasi: {selectedService.duration} menit</span>
                        <span className="font-semibold text-primary-800">
                            Rp {new Intl.NumberFormat('id-ID').format(selectedService.price)}
                        </span>
                    </div>
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
