import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Phone, MapPin, Clock, Instagram, Facebook, Mail, LayoutDashboard } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    
    // Determine dashboard URL based on user role
    const getDashboardUrl = () => {
        if (!user) return '/login';
        const roles = user.roles || [];
        if (roles.includes('Admin')) {
            return '/admin/dashboard';
        }
        return '/customer/dashboard';
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient">Rasta Salon</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="/services">Layanan</NavLink>
                        <NavLink href="/#promotions">Promo</NavLink>
                        <NavLink href="/#about">Tentang</NavLink>
                        <NavLink href="/#contact">Kontak</NavLink>
                    </div>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href={getDashboardUrl()}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition shadow-lg shadow-primary-500/25"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition shadow-lg shadow-primary-500/25"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({ href, children }) {
    return (
        <a href={href} className="text-gray-600 hover:text-primary-600 font-medium transition">
            {children}
        </a>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Rasta Salon</span>
                        </div>
                        <p className="text-gray-400">
                            Salon kecantikan terpercaya dengan layanan profesional untuk tampil lebih percaya diri.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Layanan</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Perawatan Rambut</a></li>
                            <li><a href="#" className="hover:text-white transition">Perawatan Wajah</a></li>
                            <li><a href="#" className="hover:text-white transition">Perawatan Tubuh</a></li>
                            <li><a href="#" className="hover:text-white transition">Nail Art</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-8 h-8" />
                                <span>Bugis, Kec. Sumbawa, Kabupaten Sumbawa, Nusa Tenggara Bar. 84313</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>+62 813 5342 2461</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>09:00 - 21:00 WIB</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Ikuti Kami</h4>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Rasta Salon. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
