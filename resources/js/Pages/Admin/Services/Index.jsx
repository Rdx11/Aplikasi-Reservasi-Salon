import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Sparkles } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/DataTable';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import ServiceForm from './Form';

export default function ServicesIndex({ services = [], categories = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    const columns = [
        { key: 'id_service', label: 'ID' },
        { key: 'name', label: 'Nama Layanan' },
        { key: 'category', label: 'Kategori', render: (_, item) => item.category?.name || '-' },
        { key: 'price', label: 'Harga', render: formatPrice },
        { key: 'duration', label: 'Durasi', render: (val) => `${val} menit` },
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
        router.delete(`/admin/services/${selected.id_service}`, {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <AdminLayout title="Layanan">
            <Head title="Layanan" />

            <div className="space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Layanan</h2>
                            <p className="text-sm text-gray-500">{services.length} layanan</p>
                        </div>
                    </div>
                    <Button icon={Plus} onClick={() => { setSelected(null); setShowForm(true); }}>
                        Tambah Layanan
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={services}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={selected ? 'Edit Layanan' : 'Tambah Layanan'}
                size="lg"
            >
                <ServiceForm
                    service={selected}
                    categories={categories}
                    onSuccess={() => setShowForm(false)}
                />
            </Modal>

            <ConfirmModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Hapus Layanan"
                message={`Apakah Anda yakin ingin menghapus layanan "${selected?.name}"?`}
                confirmText="Hapus"
            />
        </AdminLayout>
    );
}
