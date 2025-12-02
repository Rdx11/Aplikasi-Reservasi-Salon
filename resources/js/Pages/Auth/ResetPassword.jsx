import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button, Input } from '@/Components/UI';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <>
            <Head title="Reset Password" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gold-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <Scissors className="w-6 h-6 text-white" />
                            </div>
                        </Link>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                            <p className="text-gray-500">
                                Masukkan password baru untuk akun Anda.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <Input
                                label="Email"
                                type="email"
                                icon={Mail}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                disabled
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Ulangi password baru"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                            </div>

                            <Button type="submit" loading={processing} className="w-full">
                                Reset Password
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-sm text-gray-600 hover:text-primary-600 transition"
                            >
                                Kembali ke Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
