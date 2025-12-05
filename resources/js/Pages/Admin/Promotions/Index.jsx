import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Tag } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/DataTable';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import PromotionForm from './Form';

export default function PromotionsIndex({ promotions = [], services = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);

    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const isPromoToday = (promoDate) => {
        if (!promoDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return promoDate === today;
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Judul' },
        {
            key: 'service',
            label: 'Layanan',
            render: (_, item) => item.service?.name || 'Semua Layanan',
        },
        {
            key: 'discount',
            label: 'Diskon',
            render: (_, item) => item.discount_percentage
                ? `${item.discount_percentage}%`
                : `Rp ${new Intl.NumberFormat('id-ID').format(item.discount_amount)}`,
        },
        {
            key: 'promo_date',
            label: 'Tanggal Promo',
            render: (val, item) => (
                <div className="flex items-center gap-2">
                    <span className={item.is_expired ? 'text-gray-400' : ''}>{formatDate(val)}</span>
                    {isPromoToday(item.promo_date) && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                            Hari Ini
                        </span>
                    )}
                    {item.is_expired && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Kadaluarsa
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (val, item) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.is_expired 
                        ? 'bg-red-100 text-red-700' 
                        : val 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                }`}>
                    {item.is_expired ? 'Kadaluarsa' : val ? 'Aktif' : 'Nonaktif'}
                </span>
            ),
        },
    ];

    const handleEdit = (item) => {
        setSelected(item);
        setShowForm(true);
    };

    const handleDelete = (item) => {
        setSelected(item);
        setShowDelete(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/promotions/${selected.id}`, {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <AdminLayout title="Promosi">
            <Head title="Promosi" />

            <div className="space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Tag className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Promosi</h2>
                            <p className="text-sm text-gray-500">{promotions.length} promosi</p>
                        </div>
                    </div>
                    <Button icon={Plus} onClick={() => { setSelected(null); setShowForm(true); }}>
                        Tambah Promosi
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={promotions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={selected ? 'Edit Promosi' : 'Tambah Promosi'}
                size="lg"
            >
                <PromotionForm
                    promotion={selected}
                    services={services}
                    onSuccess={() => setShowForm(false)}
                />
            </Modal>

            <ConfirmModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Hapus Promosi"
                message={`Apakah Anda yakin ingin menghapus promosi "${selected?.title}"?`}
                confirmText="Hapus"
            />
        </AdminLayout>
    );
}
