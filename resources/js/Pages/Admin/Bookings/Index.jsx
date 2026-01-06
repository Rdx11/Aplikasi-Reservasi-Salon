import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Eye, Check, X, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import BookingDetail from './Detail';

export default function BookingsIndex({ bookings = {}, filters = {} }) {
    const { flash, auth } = usePage().props;
    const [showDetail, setShowDetail] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [showPaymentProof, setShowPaymentProof] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const isOwner = auth?.user?.roles?.includes('Owner');
    const isAdmin = auth?.user?.roles?.includes('Admin');

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
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const columns = [
        { key: 'booking_code', label: 'Kode' },
        { key: 'user', label: 'Pelanggan', render: (_, item) => item.user?.name || '-' },
        { key: 'service', label: 'Layanan', render: (_, item) => item.service?.name || '-' },
        { key: 'booking_date', label: 'Tanggal', render: formatDate },
        { key: 'booking_time', label: 'Jam' },
        { key: 'total_price', label: 'Total', render: formatPrice },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[val]}`}>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                </span>
            ),
        },
    ];

    const handleView = (item) => {
        setSelected(item);
        setShowDetail(true);
    };

    const handleConfirm = (item) => {
        setSelected(item);
        setShowConfirm(true);
    };

    const handleCancel = (item) => {
        setSelected(item);
        setShowCancel(true);
    };

    const confirmBooking = () => {
        router.post(`/admin/bookings/${selected.id_booking}/confirm`, {}, {
            onSuccess: () => setShowConfirm(false),
        });
    };

    const cancelBooking = () => {
        router.post(`/admin/bookings/${selected.id_booking}/cancel`, {}, {
            onSuccess: () => setShowCancel(false),
        });
    };

    const handleComplete = (item) => {
        setSelected(item);
        setShowComplete(true);
    };

    const completeBooking = () => {
        router.post(`/admin/bookings/${selected.id_booking}/complete`, {}, {
            onSuccess: () => setShowComplete(false),
        });
    };

    const handleViewPaymentProof = (item) => {
        setSelected(item);
        setShowPaymentProof(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/bookings', { search, status }, { preserveState: true });
    };

    const handleStatusFilter = (newStatus) => {
        setStatus(newStatus);
        router.get('/admin/bookings', { search, status: newStatus }, { preserveState: true });
    };

    const goToPage = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    return (
        <AdminLayout title="Bookings">
            <Head title="Bookings" />

            <div className="space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Booking</h2>
                            <p className="text-sm text-gray-500">{pagination.total} booking</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kode booking, pelanggan, atau layanan..."
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
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Custom Booking Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kode</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pelanggan</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Layanan</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Jam</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pembayaran</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookingData.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    bookingData.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.booking_code}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.user?.name || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.service?.name || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatDate(item.booking_date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.booking_time}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(item.total_price)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.payment_proof ? (
                                                    <button
                                                        onClick={() => handleViewPaymentProof(item)}
                                                        className="flex items-center gap-1 text-green-600 hover:text-green-700"
                                                    >
                                                        <Image className="w-4 h-4" />
                                                        <span className="text-xs">Lihat</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Belum upload</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleView(item)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {isAdmin && item.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleConfirm(item)}
                                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                                title="Konfirmasi"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(item)}
                                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                title="Batalkan"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {isAdmin && item.status === 'confirmed' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleComplete(item)}
                                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                                title="Selesaikan"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(item)}
                                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                title="Batalkan"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
            </div>

            <Modal
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
                title="Detail Booking"
                size="lg"
            >
                <BookingDetail booking={selected} />
            </Modal>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmBooking}
                title="Konfirmasi Booking"
                message={`Konfirmasi booking ${selected?.booking_code}?`}
                confirmText="Konfirmasi"
                variant="primary"
            />

            <ConfirmModal
                isOpen={showCancel}
                onClose={() => setShowCancel(false)}
                onConfirm={cancelBooking}
                title="Batalkan Booking"
                message={`Batalkan booking ${selected?.booking_code}?`}
                confirmText="Batalkan"
                variant="danger"
            />

            <ConfirmModal
                isOpen={showComplete}
                onClose={() => setShowComplete(false)}
                onConfirm={completeBooking}
                title="Selesaikan Booking"
                message={`Selesaikan booking ${selected?.booking_code}? Pastikan layanan sudah selesai dan pembayaran sudah diterima.`}
                confirmText="Selesaikan"
                variant="primary"
            />

            {/* Payment Proof Modal */}
            <Modal
                isOpen={showPaymentProof}
                onClose={() => setShowPaymentProof(false)}
                title="Bukti Pembayaran"
            >
                {selected?.payment_proof && (
                    <div className="space-y-4">
                        <img
                            src={`/storage/${selected.payment_proof}`}
                            alt="Bukti Pembayaran"
                            className="w-full rounded-lg"
                        />
                        <div className="text-sm text-gray-500">
                            <p>Booking: {selected.booking_code}</p>
                            <p>Pelanggan: {selected.user?.name}</p>
                            <p>Total: {formatPrice(selected.total_price)}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
