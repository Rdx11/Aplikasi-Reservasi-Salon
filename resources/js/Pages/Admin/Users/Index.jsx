import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Users, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/DataTable';
import { Button, Modal, ConfirmModal, Alert } from '@/Components/UI';
import UserForm from './Form';

export default function UsersIndex({ users = [], roles = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
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

    const handleView = (item) => {
        setSelected(item);
        setShowDetail(true);
    };

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
                    onView={handleView}
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

            {/* User Detail Modal */}
            <Modal
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
                title="Detail User"
                size="lg"
            >
                {selected && <UserDetail user={selected} />}
            </Modal>
        </AdminLayout>
    );
}

function UserDetail({ user }) {
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {user.profile_photo_url ? (
                        <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-12 h-12 text-primary-400" />
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        {user.roles?.map((role) => (
                            <span
                                key={role.id}
                                className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                            >
                                {role.name}
                            </span>
                        ))}
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Telepon</p>
                        <p className="font-medium text-gray-900">{user.phone || '-'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Alamat</p>
                        <p className="font-medium text-gray-900">{user.address || '-'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Email Terverifikasi</p>
                        <p className="font-medium text-gray-900">
                            {user.email_verified_at ? formatDate(user.email_verified_at) : 'Belum terverifikasi'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Terdaftar Pada</p>
                        <p className="font-medium text-gray-900">{formatDate(user.created_at)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
