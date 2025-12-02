import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button, Input } from '@/Components/UI';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex">
                {/* Left Side - Image */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <div className="absolute inset-0 gradient-primary" />
                    <img
                        src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=1200&fit=crop"
                        alt="Salon"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="text-center text-white">
                            <Scissors className="w-20 h-20 mx-auto mb-6 opacity-80" />
                            <h2 className="text-4xl font-serif font-bold mb-4">Bergabung Bersama Kami</h2>
                            <p className="text-xl text-white/80">Nikmati berbagai layanan kecantikan terbaik</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
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

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h1>
                        <p className="text-gray-600 mb-8">Daftar untuk menikmati layanan kami</p>

                        <form onSubmit={submit} className="space-y-5">
                            <Input
                                label="Nama Lengkap"
                                icon={User}
                                placeholder="Nama Anda"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                            />

                            <Input
                                label="Email"
                                type="email"
                                icon={Mail}
                                placeholder="email@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                            />

                            <Input
                                label="No. Telepon"
                                icon={Phone}
                                placeholder="08xxxxxxxxxx"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                error={errors.phone}
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
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
                                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <Input
                                label="Konfirmasi Password"
                                type="password"
                                icon={Lock}
                                placeholder="Ulangi password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={errors.password_confirmation}
                            />

                            <Button type="submit" loading={processing} className="w-full">
                                Daftar
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-gray-600">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-primary-600 font-medium hover:underline">
                                Masuk
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
