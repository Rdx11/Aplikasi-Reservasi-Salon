import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Eye, Search, Filter, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import BookingForm from './Form';

export default function CustomerBookingsIndex({ bookings = {}, services = [], filters = {} }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const bookingData = bookings.data || [];
    const pagination = {
        currentPage: bookings.current_page || 1,
        lastPage: bookings.last_page || 1,
        total: bookings.total || 0,
        from: bookings.from || 0,
        to: bookings.to || 0,
        links: bookings.links || [],
    };

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
        completed: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    const statusLabels = {
        pending: 'Menunggu Konfirmasi',
        confirmed: 'Dikonfirmasi',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
    };

    const handleCancel = (booking) => {
        setSelected(booking);
        setShowCancel(true);
    };

    const confirmCancel = () => {
        router.post(`/customer/bookings/${selected.id}/cancel`, {}, {
            onSuccess: () => setShowCancel(false),
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/customer/bookings', { search, status }, { preserveState: true });
    };

    const handleStatusFilter = (newStatus) => {
        setStatus(newStatus);
        router.get('/customer/bookings', { search, status: newStatus }, { preserveState: true });
    };

    const goToPage = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    return (
        <CustomerLayout title="Booking Saya">
            <Head title="Booking Saya" />

            <div className="space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kode booking atau layanan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={status}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu Konfirmasi</option>
                                <option value="confirmed">Dikonfirmasi</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                        <Button icon={Plus} onClick={() => setShowForm(true)}>
                            Booking Baru
                        </Button>
                    </div>
                </div>

                {bookingData.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {search || status ? 'Tidak ada booking ditemukan' : 'Belum ada booking'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {search || status ? 'Coba ubah filter pencarian Anda' : 'Mulai booking layanan kecantikan favorit Anda'}
                        </p>
                        {!search && !status && (
                            <Button icon={Plus} onClick={() => setShowForm(true)}>
                                Booking Sekarang
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Booking List */}
                        <div className="grid gap-4">
                            {bookingData.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-500">{booking.booking_code}</span>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}>
                                                    {statusLabels[booking.status]}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">{booking.service?.name}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(booking.booking_date)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {booking.booking_time}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total</p>
                                                {booking.original_price && booking.original_price > booking.total_price ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm line-through text-gray-400">{formatPrice(booking.original_price)}</span>
                                                        <p className="text-xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                                                        <Tag className="w-4 h-4 text-primary-500" />
                                                    </div>
                                                ) : (
                                                    <p className="text-xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/customer/bookings/${booking.id}`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                {booking.status === 'pending' && (
                                                    <Button variant="danger" size="sm" onClick={() => handleCancel(booking)}>
                                                        Batalkan
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.lastPage > 1 && (
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-gray-500">
                                        Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} booking
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => goToPage(bookings.prev_page_url)}
                                            disabled={!bookings.prev_page_url}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        {pagination.links.slice(1, -1).map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                    link.active
                                                        ? 'bg-primary-500 text-white'
                                                        : 'border border-gray-200 hover:bg-gray-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                        
                                        <button
                                            onClick={() => goToPage(bookings.next_page_url)}
                                            disabled={!bookings.next_page_url}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title="Booking Baru"
                size="lg"
            >
                <BookingForm services={services} onSuccess={() => setShowForm(false)} />
            </Modal>

            <ConfirmModal
                isOpen={showCancel}
                onClose={() => setShowCancel(false)}
                onConfirm={confirmCancel}
                title="Batalkan Booking"
                message={`Apakah Anda yakin ingin membatalkan booking ${selected?.booking_code}?`}
                confirmText="Ya, Batalkan"
            />
        </CustomerLayout>
    );
}
