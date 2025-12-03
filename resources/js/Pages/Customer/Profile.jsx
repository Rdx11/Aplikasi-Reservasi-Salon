import { Head, useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Camera, Shield, Calendar, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Button, Alert, Modal, Toast } from '@/Components/UI';

export default function CustomerProfile() {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const fileInputRef = useRef(null);
    const [showDeletePhoto, setShowDeletePhoto] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const { data, setData, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        put('/customer/profile');
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put('/customer/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                addToast('Ukuran foto tidak boleh lebih dari 2MB', 'error');
                e.target.value = ''; // Reset input
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                addToast('Format foto harus JPG, JPEG, atau PNG', 'error');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => setPreviewPhoto(reader.result);
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('photo', file);

            router.post('/customer/profile/photo', formData, {
                forceFormData: true,
                onSuccess: () => {
                    setPreviewPhoto(null);
                },
                onError: (errors) => {
                    setPreviewPhoto(null);
                    if (errors.photo) {
                        addToast(errors.photo, 'error');
                    } else {
                        addToast('Gagal mengupload foto', 'error');
                    }
                },
            });
        }
    };

    const deletePhoto = () => {
        router.delete('/customer/profile/photo', {
            onSuccess: () => setShowDeletePhoto(false),
        });
    };

    const displayPhoto = previewPhoto || user?.profile_photo;

    return (
        <CustomerLayout>
            <Head title="Profile Saya" />

            <div className="max-w-4xl mx-auto space-y-6">
                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-28 h-28 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white/30 cursor-pointer"
                            >
                                {displayPhoto ? (
                                    <img src={displayPhoto} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
                                )}
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {user?.profile_photo && (
                                <button
                                    onClick={() => setShowDeletePhoto(true)}
                                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition"
                                >
                                    <Trash2 className="w-4 h-4 text-white" />
                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>

                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <p className="text-white/80">{user?.email}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-white/60 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Member sejak {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <p className="text-white/60 text-sm mt-2">Klik foto untuk mengubah</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Profile Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Informasi Profile</h2>
                                    <p className="text-sm text-gray-500">Update data diri Anda</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={updateProfile} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="Nama lengkap Anda"
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                                        placeholder="Alamat lengkap Anda"
                                    />
                                </div>
                                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                            </div>

                            <Button type="submit" loading={processing} className="w-full">
                                Simpan Perubahan
                            </Button>
                        </form>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Keamanan Akun</h2>
                                    <p className="text-sm text-gray-500">Ubah password Anda</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={updatePassword} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Password Saat Ini</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {passwordForm.errors.current_password && (
                                    <p className="text-sm text-red-500">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="Minimal 8 karakter"
                                    />
                                </div>
                                {passwordForm.errors.password && (
                                    <p className="text-sm text-red-500">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                                {passwordForm.errors.password_confirmation && (
                                    <p className="text-sm text-red-500">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>

                            <Button type="submit" variant="danger" loading={passwordForm.processing} className="w-full">
                                Ubah Password
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Delete Photo Modal */}
            <Modal isOpen={showDeletePhoto} onClose={() => setShowDeletePhoto(false)} title="Hapus Foto Profile" size="sm">
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus foto profile?</p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowDeletePhoto(false)} className="flex-1">
                        Batal
                    </Button>
                    <Button variant="danger" onClick={deletePhoto} className="flex-1">
                        Hapus
                    </Button>
                </div>
            </Modal>

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </CustomerLayout>
    );
}
