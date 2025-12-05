import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, XCircle, AlertCircle, Sparkles, Upload, Image, CreditCard, Tag, X } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Button, ConfirmModal } from '@/Components/UI';
import { useState, useRef, useEffect } from 'react';

export default function CustomerBookingShow({ booking }) {
    const { flash } = usePage().props;
    const [showCancel, setShowCancel] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);
    
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null,
    });

    // Show toast when flash message exists
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
            setTimeout(() => setToast(null), 5000);
        }
        if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
            setTimeout(() => setToast(null), 5000);
        }
    }, [flash]);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('payment_proof', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadPayment = (e) => {
        e.preventDefault();
        post(`/customer/bookings/${booking.id}/upload-payment`, {
            forceFormData: true,
            onSuccess: () => {
                setPreviewImage(null);
                setData('payment_proof', null);
            },
        });
    };

    return (
        <CustomerLayout>
            <Head title={`Booking ${booking.booking_code}`} />

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className={`fixed top-4 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${
                            toast.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                {booking.original_price && booking.original_price > booking.total_price ? (
                                    <div>
                                        <p className="text-sm line-through text-gray-400">{formatPrice(booking.original_price)}</p>
                                        <p className="text-xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                                    </div>
                                ) : (
                                    <p className="text-xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                                )}
                            </div>
                        </div>

                        {/* Promo Info */}
                        {booking.promotion && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl border border-primary-200">
                                <Tag className="w-5 h-5 text-primary-600" />
                                <div>
                                    <p className="font-medium text-primary-900">🎉 {booking.promotion.title}</p>
                                    <p className="text-sm text-primary-600">
                                        Hemat {booking.promotion.discount_percentage 
                                            ? `${booking.promotion.discount_percentage}%` 
                                            : formatPrice(booking.promotion.discount_amount)}
                                    </p>
                                </div>
                            </div>
                        )}

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

                        {/* Payment Proof Section - Only show for confirmed bookings */}
                        {booking.status === 'confirmed' && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 text-blue-700 mb-4">
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-medium">Upload Bukti Pembayaran</span>
                                </div>
                                
                                {booking.payment_proof ? (
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <img
                                                src={`/storage/${booking.payment_proof}`}
                                                alt="Bukti Pembayaran"
                                                className="w-full max-w-md rounded-lg border border-blue-200"
                                            />
                                            <div className="mt-2 text-sm text-blue-600">
                                                Diupload pada {formatDateTime(booking.payment_uploaded_at)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-blue-600">
                                            Bukti pembayaran sudah diupload. Menunggu admin menyelesaikan booking.
                                        </p>
                                        
                                        {/* Option to re-upload */}
                                        <form onSubmit={handleUploadPayment} className="pt-3 border-t border-blue-200">
                                            <p className="text-sm text-blue-600 mb-2">Upload ulang bukti pembayaran:</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/jpeg,image/png,image/jpg"
                                                className="hidden"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    icon={Upload}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Pilih File
                                                </Button>
                                                {data.payment_proof && (
                                                    <Button type="submit" size="sm" disabled={processing}>
                                                        {processing ? 'Mengupload...' : 'Upload Ulang'}
                                                    </Button>
                                                )}
                                            </div>
                                            {previewImage && (
                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                                                    <img src={previewImage} alt="Preview" className="max-w-xs rounded-lg border" />
                                                </div>
                                            )}
                                            {errors.payment_proof && (
                                                <p className="text-sm text-red-500 mt-2">{errors.payment_proof}</p>
                                            )}
                                        </form>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUploadPayment}>
                                        <p className="text-sm text-blue-600 mb-3">
                                            Silakan upload bukti pembayaran untuk menyelesaikan booking Anda.
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/jpeg,image/png,image/jpg"
                                            className="hidden"
                                        />
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-100/50 transition"
                                        >
                                            {previewImage ? (
                                                <div>
                                                    <img src={previewImage} alt="Preview" className="max-w-xs mx-auto rounded-lg mb-3" />
                                                    <p className="text-sm text-blue-600">{data.payment_proof?.name}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Image className="w-12 h-12 mx-auto text-blue-400 mb-2" />
                                                    <p className="text-blue-600 font-medium">Klik untuk upload bukti pembayaran</p>
                                                    <p className="text-sm text-blue-500 mt-1">JPG, PNG (Max 2MB)</p>
                                                </>
                                            )}
                                        </div>
                                        {errors.payment_proof && (
                                            <p className="text-sm text-red-500 mt-2">{errors.payment_proof}</p>
                                        )}
                                        {data.payment_proof && (
                                            <Button type="submit" className="mt-4 w-full" disabled={processing}>
                                                {processing ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                                            </Button>
                                        )}
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Show payment proof for completed bookings */}
                        {booking.status === 'completed' && booking.payment_proof && (
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 text-green-700 mb-3">
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-medium">Bukti Pembayaran</span>
                                </div>
                                <img
                                    src={`/storage/${booking.payment_proof}`}
                                    alt="Bukti Pembayaran"
                                    className="w-full max-w-md rounded-lg border border-green-200"
                                />
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
