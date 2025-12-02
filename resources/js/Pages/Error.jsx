import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/UI';

export default function Error({ status }) {
    const title = {
        503: 'Service Unavailable',
        500: 'Server Error',
        404: 'Page Not Found',
        403: 'Forbidden',
    }[status] || 'Error';

    const description = {
        503: 'Maaf, kami sedang melakukan maintenance. Silakan coba lagi nanti.',
        500: 'Whoops, terjadi kesalahan pada server kami.',
        404: 'Maaf, halaman yang Anda cari tidak ditemukan.',
        403: 'Maaf, Anda tidak memiliki akses ke halaman ini.',
    }[status] || 'Terjadi kesalahan.';

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">{status}</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
                    <p className="text-gray-500 mb-8 max-w-md">{description}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" icon={ArrowLeft} onClick={() => window.history.back()}>
                            Kembali
                        </Button>
                        <Button href="/" icon={Home}>
                            Ke Beranda
                        </Button>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
