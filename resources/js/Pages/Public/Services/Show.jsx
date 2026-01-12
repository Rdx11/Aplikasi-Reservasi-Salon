import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Calendar, Sparkles, CheckCircle, Tag } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/UI';

export default function PublicServiceShow({ service, relatedServices = [] }) {
    const { auth } = usePage().props;
    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    // Determine booking URL based on auth status
    const getBookingUrl = () => {
        if (auth?.user) {
            if (auth.user.roles?.includes('Admin') || auth.user.roles?.includes('Owner')) {
                return '/admin/bookings';
            }
            return `/customer/services/${service.id_service}`;
        }
        return '/login';
    };

    return (
        <GuestLayout>
            <Head title={service.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="space-y-8">
                    {/* Back Button */}
                    <Link
                        href="/services"
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

                            <Button size="lg" icon={Calendar} href={getBookingUrl()} className="w-full">
                                {auth?.user ? 'Booking Sekarang' : 'Login untuk Booking'}
                            </Button>

                            {!auth?.user && (
                                <p className="text-center text-sm text-gray-500">
                                    Belum punya akun? <Link href="/register" className="text-primary-600 hover:underline">Daftar di sini</Link>
                                </p>
                            )}
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
                                        href={`/services/${related.id_service}`}
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
            </div>
        </GuestLayout>
    );
}
