import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scissors, LayoutDashboard, Users, FolderOpen, Sparkles, Calendar,
    Tag, FileText, Settings, LogOut, Menu, X, ChevronDown, Bell, Volume2, VolumeX
} from 'lucide-react';
import clsx from 'clsx';
import { useNotifications } from '@/Hooks/useNotifications';

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users, permission: 'view users' },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen, permission: 'view categories' },
    { name: 'Services', href: '/admin/services', icon: Sparkles, permission: 'view services' },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar, permission: 'view all bookings' },
    { name: 'Promotions', href: '/admin/promotions', icon: Tag, permission: 'view promotions' },
    { name: 'Reports', href: '/admin/reports', icon: FileText, permission: 'view reports' },
];

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={clsx(
                'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gradient">Rasta Salon</span>
                </div>
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <SidebarLink key={item.name} item={item} />
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <button
                        onClick={() => router.post('/logout')}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationDropdown />
                            <UserDropdown user={auth?.user} />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ item }) {
    const { url } = usePage();
    const isActive = url.startsWith(item.href);

    return (
        <Link
            href={item.href}
            className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition',
                isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
            )}
        >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
        </Link>
    );
}

function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const { notifications, unreadCount, soundEnabled, setSoundEnabled, testSound } = useNotifications(5000);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return date.toLocaleDateString('id-ID');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition"
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    <span className="font-semibold">Notifikasi Booking</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (soundEnabled) {
                                            testSound();
                                        }
                                        setSoundEnabled(!soundEnabled);
                                    }}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition"
                                    title={soundEnabled ? 'Klik untuk test & matikan suara' : 'Nyalakan suara'}
                                >
                                    {soundEnabled ? (
                                        <Volume2 className="w-4 h-4" />
                                    ) : (
                                        <VolumeX className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500">
                                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Belum ada booking baru</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notif) => (
                                            <Link
                                                key={notif.id}
                                                href="/admin/bookings"
                                                onClick={() => setOpen(false)}
                                                className="block px-4 py-3 hover:bg-gray-50 transition"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                                        <Calendar className="w-5 h-5 text-primary-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {notif.customer_name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {notif.service_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-primary-600 font-medium">
                                                                {notif.booking_code}
                                                            </span>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatPrice(notif.total_price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {formatTime(notif.created_at)}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                                    <Link
                                        href="/admin/bookings"
                                        onClick={() => setOpen(false)}
                                        className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                                    >
                                        Lihat Semua Booking
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function UserDropdown({ user }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                    {user?.profile_photo ? (
                        <img src={user.profile_photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-sm font-semibold text-primary-600">
                            {user?.name?.charAt(0) || 'A'}
                        </span>
                    )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name || 'Admin'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                        >
                            <Link href="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                                Profile
                            </Link>
                            <Link href="/admin/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                                Settings
                            </Link>
                            <hr className="my-2" />
                            <button
                                onClick={() => router.post('/logout')}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
