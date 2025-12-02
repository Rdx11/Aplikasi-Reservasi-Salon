import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Button, ConfirmModal } from '@/Components/UI';
import { useState } from 'react';

export default function CustomerBookingShow({ booking }) {
    const [showCancel, setShowCancel] = useState(false);

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const formatDateTime = (date) => new Date(date).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle, label: 'Menunggu Konfirmasi' },
        confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle, label: 'Dikonfirmasi' },
        completed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Selesai' },
        cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Dibatalkan' },
    };

    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;

    const confirmCancel = () => {
        router.post(`/customer/bookings/${booking.id}/cancel`, {}, {
            onSuccess: () => setShowCancel(false),
        });
    };

    return (
        <CustomerLayout>
            <Head title={`Booking ${booking.booking_code}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Back Button */}
                <Link
                    href="/customer/bookings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali ke Daftar Booking
                </Link>

                {/* Booking Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Kode Booking</p>
                                <h1 className="text-2xl font-bold">{booking.booking_code}</h1>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${status.color}`}>
                                <StatusIcon className="w-5 h-5" />
                                <span className="font-medium">{status.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Service Info */}
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-8 h-8 text-primary-600" />
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-primary-600 font-medium">{booking.service?.category?.name}</span>
                                <h3 className="text-lg font-semibold text-gray-900">{booking.service?.name}</h3>
                                <p className="text-sm text-gray-500">{booking.service?.duration} menit</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Tanggal</p>
                                    <p className="font-medium text-gray-900">{formatDate(booking.booking_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Jam</p>
                                    <p className="font-medium text-gray-900">{booking.booking_time}</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Catatan</p>
                                <p className="text-gray-900">{booking.notes}</p>
                            </div>
                        )}

                        {/* Confirmation Info */}
                        {booking.confirmation && (
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 text-green-700 mb-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Booking Dikonfirmasi</span>
                                </div>
                                <p className="text-sm text-green-600">
                                    Dikonfirmasi pada {formatDateTime(booking.confirmation.confirmation_date)}
                                </p>
                            </div>
                        )}

                        {/* Cancellation Info */}
                        {booking.cancellation && (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-center gap-2 text-red-700 mb-2">
                                    <XCircle className="w-5 h-5" />
                                    <span className="font-medium">Booking Dibatalkan</span>
                                </div>
                                <p className="text-sm text-red-600">
                                    {booking.cancellation.reason}
                                </p>
                                <p className="text-sm text-red-500 mt-1">
                                    Dibatalkan pada {formatDateTime(booking.cancellation.cancelled_at)}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        {booking.status === 'pending' && (
                            <div className="flex gap-3 pt-4 border-t">
                                <Button variant="danger" onClick={() => setShowCancel(true)} className="flex-1">
                                    Batalkan Booking
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Salon Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Informasi Salon</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span>Jl. Kecantikan No. 123, Jakarta</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>+62 812 3456 7890</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>info@rastasalon.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showCancel}
                onClose={() => setShowCancel(false)}
                onConfirm={confirmCancel}
                title="Batalkan Booking"
                message={`Apakah Anda yakin ingin membatalkan booking ${booking.booking_code}?`}
                confirmText="Ya, Batalkan"
            />
        </CustomerLayout>
    );
}
