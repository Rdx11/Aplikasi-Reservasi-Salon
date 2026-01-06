import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Calendar, Sparkles, CheckCircle, Tag } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Button, Modal, Select, Textarea, Alert } from '@/Components/UI';

export default function CustomerServiceShow({ service, relatedServices = [] }) {
    const [showBooking, setShowBooking] = useState(false);
    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    return (
        <CustomerLayout>
            <Head title={service.name} />

            <div className="space-y-8">
                {/* Back Button */}
                <Link
                    href="/customer/services"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali ke Layanan
                </Link>

                {/* Service Detail */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden"
                    >
                        {service.image_url ? (
                            <img
                                src={service.image_url}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Sparkles className="w-32 h-32 text-primary-300" />
                            </div>
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                                    {service.category?.name}
                                </span>
                                {service.active_promo && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-bold">
                                        <Tag className="w-3 h-3" />
                                        PROMO
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                            <div className="flex items-center gap-4 text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-5 h-5" />
                                    {service.duration} menit
                                </span>
                            </div>
                        </div>

                        {service.active_promo ? (
                            <div className="p-4 bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl border border-primary-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xl line-through text-gray-400">
                                        {formatPrice(service.price)}
                                    </span>
                                    <span className="text-3xl font-bold text-primary-600">
                                        {formatPrice(service.active_promo.discounted_price)}
                                    </span>
                                </div>
                                <p className="text-sm text-primary-700">
                                    🎉 <strong>{service.active_promo.title}</strong> - Hemat {service.active_promo.discount_percentage 
                                        ? `${service.active_promo.discount_percentage}%` 
                                        : formatPrice(service.active_promo.discount_amount)}! Promo berlaku hari ini saja.
                                </p>
                            </div>
                        ) : (
                            <div className="text-3xl font-bold text-primary-600">
                                {formatPrice(service.price)}
                            </div>
                        )}

                        <div className="prose prose-gray">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Termasuk:</h3>
                            <ul className="space-y-2">
                                {['Konsultasi gratis', 'Produk berkualitas premium', 'Stylist profesional', 'Garansi kepuasan'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button size="lg" icon={Calendar} onClick={() => setShowBooking(true)} className="w-full">
                            Booking Sekarang
                        </Button>
                    </motion.div>
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Layanan Serupa</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedServices.map((related) => (
                                <Link
                                    key={related.id_service}
                                    href={`/customer/services/${related.id_service}`}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition relative"
                                >
                                    {related.active_promo && (
                                        <span className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 bg-primary-500 text-white rounded-full text-xs font-bold">
                                            <Tag className="w-3 h-3" />
                                            PROMO
                                        </span>
                                    )}
                                    <h4 className="font-medium text-gray-900 mb-1">{related.name}</h4>
                                    <p className="text-sm text-gray-500 mb-2">{related.duration} menit</p>
                                    {related.active_promo ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm line-through text-gray-400">{formatPrice(related.price)}</span>
                                            <span className="font-semibold text-primary-600">{formatPrice(related.active_promo.discounted_price)}</span>
                                        </div>
                                    ) : (
                                        <p className="font-semibold text-primary-600">{formatPrice(related.price)}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBooking}
                onClose={() => setShowBooking(false)}
                service={service}
            />
        </CustomerLayout>
    );
}

function BookingModal({ isOpen, onClose, service }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_service: service.id_service,
        booking_date: new Date().toISOString().split('T')[0], // Default hari ini
        booking_time: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/customer/bookings', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00',
    ].map((t) => ({ value: t, label: t }));

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    const isPromoToday = data.booking_date === new Date().toISOString().split('T')[0] && service.active_promo;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Booking Layanan" size="md">
            <form onSubmit={submit} className="space-y-5">
                {/* Service Info */}
                <div className={`p-4 rounded-xl ${isPromoToday ? 'bg-gradient-to-r from-primary-50 to-gold-50 border border-primary-200' : 'bg-primary-50'}`}>
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary-900">{service.name}</h4>
                        {isPromoToday && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-500 text-white rounded-full text-xs font-bold">
                                <Tag className="w-3 h-3" />
                                PROMO
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-primary-700">{service.duration} menit</span>
                        {isPromoToday ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm line-through text-gray-400">{formatPrice(service.price)}</span>
                                <span className="font-bold text-primary-800">{formatPrice(service.active_promo.discounted_price)}</span>
                            </div>
                        ) : (
                            <span className="font-bold text-primary-800">{formatPrice(service.price)}</span>
                        )}
                    </div>
                    {isPromoToday && (
                        <p className="text-xs text-primary-600 mt-2">🎉 {service.active_promo.title} - Promo hari ini!</p>
                    )}
                </div>

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
                    placeholder="Catatan tambahan..."
                    rows={3}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    error={errors.notes}
                />

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button type="submit" loading={processing} className="flex-1">
                        Konfirmasi Booking
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
