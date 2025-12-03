import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { ConfirmModal } from '@/Components/UI/Modal';
import { Alert } from '@/Components/UI/Alert';
import { Toast } from '@/Components/UI/Toast';
import { User, Mail, Phone, MapPin, Camera, Trash2, Lock, Save } from 'lucide-react';

export default function ProfileIndex({ user }) {
    const [photoPreview, setPhotoPreview] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toasts, setToasts] = useState([]);
    const photoInput = useRef(null);
    const { flash } = usePage().props;

    const addToast = (message, type = 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
    });

    const photoForm = useForm({
        photo: null,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/admin/profile');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                addToast('Ukuran foto tidak boleh lebih dari 2MB', 'error');
                e.target.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                addToast('Format foto harus JPG, JPEG, atau PNG', 'error');
                e.target.value = '';
                return;
            }

            photoForm.setData('photo', file);
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoSubmit = () => {
        if (photoForm.data.photo) {
            photoForm.post('/admin/profile/photo', {
                onSuccess: () => {
                    setPhotoPreview(null);
                    photoForm.reset();
                },
                onError: (errors) => {
                    if (errors.photo) {
                        addToast(errors.photo, 'error');
                    } else {
                        addToast('Gagal mengupload foto', 'error');
                    }
                },
            });
        }
    };

    const handleDeletePhoto = () => {
        photoForm.delete('/admin/profile/photo', {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/admin/profile/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AdminLayout title="Profil Saya">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Alert Notification */}
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                {/* Photo Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto Profil</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                                {photoPreview || user.profile_photo ? (
                                    <img
                                        src={photoPreview || user.profile_photo}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-primary-400" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => photoInput.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                ref={photoInput}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-3">
                                JPG, PNG maksimal 2MB
                            </p>
                            <div className="flex gap-2">
                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={handlePhotoSubmit}
                                        disabled={photoForm.processing}
                                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm"
                                    >
                                        Simpan Foto
                                    </button>
                                )}
                                {user.profile_photo && !photoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profil</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                {profileForm.errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{profileForm.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                {profileForm.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{profileForm.errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profileForm.data.address}
                                        onChange={(e) => profileForm.setData('address', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubah Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            {passwordForm.errors.current_password && (
                                <p className="text-red-500 text-sm mt-1">{passwordForm.errors.current_password}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                {passwordForm.errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Ubah Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Photo Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeletePhoto}
                title="Hapus Foto Profil"
                message="Apakah Anda yakin ingin menghapus foto profil? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                variant="danger"
            />

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
