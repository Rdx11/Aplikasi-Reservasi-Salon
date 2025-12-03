import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Clock, XCircle, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Button, Skeleton, SkeletonStatCard, SkeletonBookingCard, SkeletonListItem, SkeletonWelcome } from '@/Components/UI';
import { useLoadingState, useLazyLoad } from '@/Hooks/useLazyLoad';

export default function CustomerDashboard({ stats = {}, recentBookings = [], upcomingBookings = [] }) {
    const [isLoading] = useLoadingState(true, 800);
    
    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        in_progress: 'bg-indigo-100 text-indigo-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        in_progress: 'Diproses',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
    };

    // Skeleton Loading State
    if (isLoading) {
        return (
            <CustomerLayout>
                <Head title="Dashboard" />
                <div className="space-y-8">
                    <SkeletonWelcome />
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonStatCard key={i} />
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <Skeleton className="w-40 h-6" />
                            </div>
                            <div className="p-6 space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <SkeletonBookingCard key={i} />
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <Skeleton className="w-40 h-6" />
                            </div>
                            <div className="p-6 space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <SkeletonListItem key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white"
                >
                    <h1 className="text-2xl font-bold mb-2">Selamat Datang! 👋</h1>
                    <p className="text-white/80 mb-6">Kelola booking dan nikmati layanan kecantikan terbaik di Rasta Salon</p>
                    <Button variant="gold" href="/customer/services" icon={Sparkles}>
                        Lihat Layanan
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Booking"
                        value={stats.totalBookings || 0}
                        icon={Calendar}
                        color="primary"
                        delay={0}
                    />
                    <StatCard
                        title="Selesai"
                        value={stats.completedBookings || 0}
                        icon={CheckCircle}
                        color="green"
                        delay={0.1}
                    />
                    <StatCard
                        title="Menunggu"
                        value={stats.pendingBookings || 0}
                        icon={Clock}
                        color="yellow"
                        delay={0.2}
                    />
                    <StatCard
                        title="Dibatalkan"
                        value={stats.cancelledBookings || 0}
                        icon={XCircle}
                        color="red"
                        delay={0.3}
                    />
                    <StatCard
                        title="Total Pengeluaran"
                        value={formatPrice(stats.totalSpent || 0)}
                        icon={Wallet}
                        color="blue"
                        className="col-span-2 lg:col-span-1"
                        delay={0.4}
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Upcoming Bookings */}
                    <LazySection delay={0.2}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Booking Mendatang</h2>
                                <Link href="/customer/bookings" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                                    Lihat Semua <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="p-6">
                                {upcomingBookings.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">Tidak ada booking mendatang</p>
                                        <Button href="/customer/bookings" variant="outline" size="sm" className="mt-4">
                                            Buat Booking
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {upcomingBookings.map((booking, index) => (
                                                <motion.div
                                                    key={booking.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <Sparkles className="w-6 h-6 text-primary-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">{booking.service?.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(booking.booking_date)} • {booking.booking_time}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                                                        {statusLabels[booking.status]}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </LazySection>

                    {/* Recent Bookings */}
                    <LazySection delay={0.3}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Riwayat Booking</h2>
                                <Link href="/customer/bookings" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                                    Lihat Semua <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="p-6">
                                {recentBookings.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">Belum ada riwayat booking</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {recentBookings.map((booking, index) => (
                                                <motion.div
                                                    key={booking.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">{booking.service?.name}</p>
                                                        <p className="text-sm text-gray-500">{formatDate(booking.booking_date)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">{formatPrice(booking.total_price)}</p>
                                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                                                            {statusLabels[booking.status]}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </LazySection>
                </div>
            </div>
        </CustomerLayout>
    );
}

// Stat Card Component with animation
function StatCard({ title, value, icon: Icon, color, className = '', delay = 0 }) {
    const colors = {
        primary: 'bg-primary-50 text-primary-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
        >
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </motion.div>
    );
}

// Lazy Section Component with intersection observer
function LazySection({ children, delay = 0 }) {
    const { ref, isVisible, hasLoaded } = useLazyLoad({ threshold: 0.1, triggerOnce: true });

    return (
        <div ref={ref}>
            {hasLoaded ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, duration: 0.5 }}
                >
                    {children}
                </motion.div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                    <Skeleton className="w-40 h-6 mb-6" />
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonBookingCard key={i} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
