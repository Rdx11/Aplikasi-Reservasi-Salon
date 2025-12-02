import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Alert } from '@/Components/UI';

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex">
                {/* Left Side - Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">Rasta Salon</span>
                        </Link>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h1>
                        <p className="text-gray-600 mb-8">Masuk ke akun Anda untuk melanjutkan</p>

                        {status && <Alert type="success" message={status} className="mb-6" />}

                        <form onSubmit={submit} className="space-y-5">
                            <Input
                                label="Email"
                                type="email"
                                icon={Mail}
                                placeholder="email@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
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

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-600">Ingat saya</span>
                                </label>
                                <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                                    Lupa password?
                                </Link>
                            </div>

                            <Button type="submit" loading={processing} className="w-full">
                                Masuk
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-gray-600">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-primary-600 font-medium hover:underline">
                                Daftar sekarang
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <div className="absolute inset-0 gradient-primary" />
                    <img
                        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=1200&fit=crop"
                        alt="Salon"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="text-center text-white">
                            <Scissors className="w-20 h-20 mx-auto mb-6 opacity-80" />
                            <h2 className="text-4xl font-serif font-bold mb-4">Rasta Salon</h2>
                            <p className="text-xl text-white/80">Tampil Cantik & Percaya Diri</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
