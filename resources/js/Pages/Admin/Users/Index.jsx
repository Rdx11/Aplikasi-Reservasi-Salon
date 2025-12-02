import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/DataTable';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import UserForm from './Form';

export default function UsersIndex({ users = [], roles = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Telepon', render: (val) => val || '-' },
        {
            key: 'roles',
            label: 'Role',
            render: (roles) => roles?.map((r) => (
                <span key={r.id} className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium mr-1">
                    {r.name}
                </span>
            )),
        },
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
        router.delete(`/admin/users/${selected.id}`, {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <div className="space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Users</h2>
                            <p className="text-sm text-gray-500">{users.length} users</p>
                        </div>
                    </div>
                    <Button icon={Plus} onClick={() => { setSelected(null); setShowForm(true); }}>
                        Tambah User
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={selected ? 'Edit User' : 'Tambah User'}
                size="lg"
            >
                <UserForm
                    user={selected}
                    roles={roles}
                    onSuccess={() => setShowForm(false)}
                />
            </Modal>

            <ConfirmModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Hapus User"
                message={`Apakah Anda yakin ingin menghapus user "${selected?.name}"?`}
                confirmText="Hapus"
            />
        </AdminLayout>
    );
}
