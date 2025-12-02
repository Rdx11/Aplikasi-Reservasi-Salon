import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Mail, ArrowLeft } from 'lucide-react';
import { Button, Input, Alert } from '@/Components/UI';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Lupa Password" />
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
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
                            <p className="text-gray-500">
                                Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                            </p>
                        </div>

                        {status && (
                            <Alert type="success" message={status} className="mb-6" />
                        )}

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

                            <Button type="submit" loading={processing} className="w-full">
                                Kirim Link Reset Password
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
