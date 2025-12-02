import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Eye, Check, X } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/DataTable';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import BookingDetail from './Detail';

export default function BookingsIndex({ bookings = [] }) {
    const { flash } = usePage().props;
    const [showDetail, setShowDetail] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [selected, setSelected] = useState(null);

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
        router.post(`/admin/bookings/${selected.id}/confirm`, {}, {
            onSuccess: () => setShowConfirm(false),
        });
    };

    const cancelBooking = () => {
        router.post(`/admin/bookings/${selected.id}/cancel`, {}, {
            onSuccess: () => setShowCancel(false),
        });
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
                            <p className="text-sm text-gray-500">{bookings.length} booking</p>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={bookings}
                    onView={handleView}
                    onEdit={(item) => item.status === 'pending' && handleConfirm(item)}
                    onDelete={(item) => item.status === 'pending' && handleCancel(item)}
                />
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
        </AdminLayout>
    );
}
