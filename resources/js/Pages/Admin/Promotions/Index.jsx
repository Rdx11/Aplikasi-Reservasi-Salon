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

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Judul' },
        {
            key: 'discount',
            label: 'Diskon',
            render: (_, item) => item.discount_percentage
                ? `${item.discount_percentage}%`
                : `Rp ${new Intl.NumberFormat('id-ID').format(item.discount_amount)}`,
        },
        { key: 'start_date', label: 'Mulai', render: formatDate },
        { key: 'end_date', label: 'Berakhir', render: formatDate },
        {
            key: 'is_active',
            label: 'Status',
            render: (val) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {val ? 'Aktif' : 'Nonaktif'}
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
