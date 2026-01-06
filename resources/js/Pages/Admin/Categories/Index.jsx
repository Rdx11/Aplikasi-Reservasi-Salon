import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, FolderOpen } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/DataTable';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import CategoryForm from './Form';

export default function CategoriesIndex({ categories = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);

    const columns = [
        { key: 'id_category', label: 'ID' },
        { key: 'name', label: 'Nama' },
        { key: 'description', label: 'Deskripsi', render: (val) => val || '-' },
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
        router.delete(`/admin/categories/${selected.id_category}`, {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <AdminLayout title="Kategori">
            <Head title="Kategori" />

            <div className="space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <FolderOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Kategori</h2>
                            <p className="text-sm text-gray-500">{categories.length} kategori</p>
                        </div>
                    </div>
                    <Button icon={Plus} onClick={() => { setSelected(null); setShowForm(true); }}>
                        Tambah Kategori
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={selected ? 'Edit Kategori' : 'Tambah Kategori'}
            >
                <CategoryForm
                    category={selected}
                    onSuccess={() => setShowForm(false)}
                />
            </Modal>

            <ConfirmModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Hapus Kategori"
                message={`Apakah Anda yakin ingin menghapus kategori "${selected?.name}"?`}
                confirmText="Hapus"
            />
        </AdminLayout>
    );
}
