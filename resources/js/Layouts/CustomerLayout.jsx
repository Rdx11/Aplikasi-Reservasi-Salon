import { Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Calendar, User, LogOut, Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function CustomerLayout({ children, title }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/customer/dashboard" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">Rasta Salon</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-4">
                            <NavLink href="/customer/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                            <NavLink href="/customer/services" icon={Sparkles}>Layanan</NavLink>
                            <NavLink href="/customer/bookings" icon={Calendar}>Booking</NavLink>
                            <Link
                                href="/customer/profile"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                                    {auth?.user?.profile_photo ? (
                                        <img src={auth.user.profile_photo} alt={auth.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-semibold text-primary-600">{auth?.user?.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <span className="font-medium text-gray-700">{auth?.user?.name?.split(' ')[0]}</span>
                            </Link>
                            <button
                                onClick={() => router.post('/logout')}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white"
                    >
                        <div className="px-4 py-4 space-y-2">
                            <MobileNavLink href="/customer/dashboard" icon={LayoutDashboard}>Dashboard</MobileNavLink>
                            <MobileNavLink href="/customer/services" icon={Sparkles}>Layanan</MobileNavLink>
                            <MobileNavLink href="/customer/bookings" icon={Calendar}>Booking</MobileNavLink>
                            <MobileNavLink href="/customer/profile" icon={User}>Profile</MobileNavLink>
                            <button
                                onClick={() => router.post('/logout')}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {title && (
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
                )}
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon: Icon, children }) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            href={href}
            className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition',
                isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{children}</span>
        </Link>
    );
}

function MobileNavLink({ href, icon: Icon, children }) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            href={href}
            className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition',
                isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{children}</span>
        </Link>
    );
}
