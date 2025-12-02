import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Heart, Star, Clock, Shield, ArrowRight, Calendar } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/UI';

export default function Welcome({ categories = [], services = [], promotions = [] }) {
    const { auth } = usePage().props;
    
    return (
        <GuestLayout>
            <Head title="Selamat Datang" />
            <HeroSection auth={auth} />
            <ServicesSection categories={categories} services={services} />
            <PromotionsSection promotions={promotions} auth={auth} />
            <WhyUsSection />
            <CTASection auth={auth} />
        </GuestLayout>
    );
}

function HeroSection({ auth }) {
    const isAdmin = auth?.user?.roles?.includes('Admin');
    const bookingUrl = !auth?.user ? '/login' : (isAdmin ? '/admin/bookings' : '/customer/bookings');
    
    return (
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-gold-50" />
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-gold-200 rounded-full blur-3xl opacity-30" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Salon Kecantikan Terpercaya</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                            Tampil Cantik &<br />
                            <span className="text-gradient">Percaya Diri</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Nikmati pengalaman perawatan kecantikan terbaik dengan layanan profesional 
                            dan produk berkualitas di Rasta Salon.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" icon={Calendar} href={bookingUrl}>
                                Booking Sekarang
                            </Button>
                            <Button variant="outline" size="lg" href="#services">
                                Lihat Layanan
                            </Button>
                        </div>
                        <div className="flex items-center gap-8 pt-4">
                            <Stat value="5000+" label="Pelanggan Puas" />
                            <Stat value="50+" label="Layanan" />
                            <Stat value="4.9" label="Rating" icon={Star} />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 gradient-primary rounded-3xl rotate-6 opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop"
                                    alt="Rasta Salon"
                                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Scissors className="w-32 h-32 text-white/30" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function Stat({ value, label, icon: Icon }) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {Icon && <Icon className="w-5 h-5 text-gold-500 fill-gold-500" />}
            </div>
            <span className="text-sm text-gray-500">{label}</span>
        </div>
    );
}

function ServicesSection({ categories, services }) {
    return (
        <section id="services" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        Layanan <span className="text-gradient">Kami</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Berbagai pilihan layanan kecantikan profesional untuk memenuhi kebutuhan Anda
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8">
                    {(categories.length > 0 ? categories : defaultCategories).map((category, index) => (
                        <motion.div
                            key={category.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <category.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.name}</h3>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            <a href="#" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all">
                                Lihat Detail <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const defaultCategories = [
    { id: 1, name: 'Perawatan Rambut', description: 'Potong, styling, coloring, treatment rambut profesional', icon: Scissors },
    { id: 2, name: 'Perawatan Wajah', description: 'Facial, treatment kulit, dan perawatan wajah lainnya', icon: Sparkles },
    { id: 3, name: 'Perawatan Tubuh', description: 'Body spa, massage, dan perawatan tubuh lengkap', icon: Heart },
];

function PromotionsSection({ promotions, auth }) {
    const defaultPromos = [
        { id: 1, title: 'Diskon 30% Hair Treatment', description: 'Khusus member baru', discount_percentage: 30, image: null },
        { id: 2, title: 'Paket Facial + Massage', description: 'Hemat hingga 200rb', discount_amount: 200000, image: null },
    ];

    const promoList = promotions.length > 0 ? promotions : defaultPromos;

    return (
        <section id="promotions" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        Promo <span className="text-gradient">Spesial</span>
                    </h2>
                    <p className="text-xl text-gray-600">Jangan lewatkan penawaran menarik dari kami</p>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-8">
                    {promoList.map((promo, index) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-white"
                        >
                            {/* Background Image */}
                            {promo.image && (
                                <div className="absolute inset-0">
                                    <img 
                                        src={promo.image} 
                                        alt={promo.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/60 to-primary-800/60" />
                                </div>
                            )}
                            
                            {/* Decorative Circle */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            
                            {/* Content */}
                            <div className="relative p-8">
                                <span className="inline-block px-3 py-1 bg-gold-400 text-gray-900 rounded-full text-sm font-bold mb-4">
                                    {promo.discount_percentage ? `${promo.discount_percentage}% OFF` : `Hemat ${new Intl.NumberFormat('id-ID').format(promo.discount_amount)}`}
                                </span>
                                <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                                <p className="text-white/80 mb-6">{promo.description}</p>
                                <Button variant="gold" size="sm" href={!auth?.user ? '/login' : (auth?.user?.roles?.includes('Admin') ? '/admin/bookings' : '/customer/bookings')}>Klaim Sekarang</Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhyUsSection() {
    const features = [
        { icon: Star, title: 'Profesional', description: 'Tim stylist berpengalaman dan tersertifikasi' },
        { icon: Shield, title: 'Produk Berkualitas', description: 'Menggunakan produk premium dan aman' },
        { icon: Clock, title: 'Tepat Waktu', description: 'Layanan sesuai jadwal yang Anda pilih' },
        { icon: Heart, title: 'Kepuasan Pelanggan', description: 'Prioritas utama kami adalah kepuasan Anda' },
    ];

    return (
        <section id="about" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        Mengapa <span className="text-gradient">Rasta Salon?</span>
                    </h2>
                </motion.div>
                <div className="grid md:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                                <feature.icon className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection({ auth }) {
    const isAdmin = auth?.user?.roles?.includes('Admin');
    const bookingUrl = !auth?.user ? '/login' : (isAdmin ? '/admin/bookings' : '/customer/bookings');
    
    return (
        <section id="contact" className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center text-white"
                >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
                    <div className="relative">
                        <h2 className="text-4xl font-serif font-bold mb-4">Siap Tampil Lebih Cantik?</h2>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Booking sekarang dan dapatkan pengalaman perawatan kecantikan terbaik di Rasta Salon
                        </p>
                        <Button variant="gold" size="lg" icon={Calendar} href={bookingUrl}>
                            Booking Sekarang
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
