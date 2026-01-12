import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Sparkles, Tag } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import { LazyImage, Skeleton, SkeletonServiceCard } from '@/Components/UI';
import { useLoadingState, useLazyLoad } from '@/Hooks/useLazyLoad';

export default function PublicServicesIndex({ categories = [], services = [] }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showPromoOnly, setShowPromoOnly] = useState(false);
    const [isLoading] = useLoadingState(true, 500);

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    const promoCount = services.filter((s) => s.active_promo).length;

    const filteredServices = services.filter((service) => {
        const matchSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
            service.description?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === 'all' || service.id_category == selectedCategory;
        const matchPromo = !showPromoOnly || service.active_promo;
        return matchSearch && matchCategory && matchPromo;
    });

    if (isLoading) {
        return (
            <GuestLayout>
                <Head title="Layanan" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-64 mx-auto" />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="flex-1 h-12" />
                            <div className="flex gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="w-24 h-10" />
                                ))}
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonServiceCard key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Layanan" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        Layanan <span className="text-gradient">Kami</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Berbagai pilihan layanan kecantikan profesional untuk memenuhi kebutuhan Anda
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {/* Search & Filter */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari layanan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                                    selectedCategory === 'all'
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id_category}
                                    onClick={() => setSelectedCategory(cat.id_category)}
                                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                                        selectedCategory === cat.id_category
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {promoCount > 0 && (
                                <button
                                    onClick={() => setShowPromoOnly(!showPromoOnly)}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                                        showPromoOnly
                                            ? 'bg-gradient-to-r from-primary-500 to-gold-500 text-white shadow-lg'
                                            : 'bg-gradient-to-r from-primary-100 to-gold-100 text-primary-700 hover:from-primary-200 hover:to-gold-200'
                                    }`}
                                >
                                    <Tag className="w-4 h-4" />
                                    Promo ({promoCount})
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Services Grid */}
                    <AnimatePresence mode="wait">
                        {filteredServices.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-12 bg-white rounded-2xl"
                            >
                                <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Layanan tidak ditemukan</h3>
                                <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredServices.map((service, index) => (
                                    <ServiceCard 
                                        key={service.id_service} 
                                        service={service} 
                                        index={index}
                                        formatPrice={formatPrice}
                                        auth={auth}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </GuestLayout>
    );
}

function ServiceCard({ service, index, formatPrice, auth }) {
    const { ref, hasLoaded } = useLazyLoad({ threshold: 0.1, triggerOnce: true });

    // Determine link based on auth status
    const getServiceLink = () => {
        if (auth?.user) {
            if (auth.user.roles?.includes('Admin') || auth.user.roles?.includes('Owner')) {
                return `/admin/services`;
            }
            return `/customer/services/${service.id_service}`;
        }
        return `/services/${service.id_service}`;
    };

    return (
        <div ref={ref}>
            {hasLoaded ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                    <Link
                        href={getServiceLink()}
                        className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all group"
                    >
                        <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                            {service.image_url ? (
                                <LazyImage
                                    src={service.image_url}
                                    alt={service.name}
                                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-16 h-16 text-primary-300" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-600">
                                    {service.category?.name}
                                </span>
                            </div>
                            {service.active_promo && (
                                <div className="absolute top-3 right-3">
                                    <span className="flex items-center gap-1 px-2 py-1 bg-primary-500 text-white rounded-full text-xs font-bold shadow-lg">
                                        <Tag className="w-3 h-3" />
                                        {service.active_promo.discount_percentage 
                                            ? `${service.active_promo.discount_percentage}% OFF` 
                                            : `Hemat ${formatPrice(service.active_promo.discount_amount)}`}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                                {service.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                                {service.active_promo ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm line-through text-gray-400">
                                            {formatPrice(service.price)}
                                        </span>
                                        <span className="text-lg font-bold text-primary-600">
                                            {formatPrice(service.active_promo.discounted_price)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-lg font-bold text-primary-600">
                                        {formatPrice(service.price)}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    {service.duration} menit
                                </span>
                            </div>
                            {service.active_promo && (
                                <p className="text-xs text-primary-600 mt-2">
                                    🎉 {service.active_promo.title} - Hari ini saja!
                                </p>
                            )}
                        </div>
                    </Link>
                </motion.div>
            ) : (
                <SkeletonServiceCard />
            )}
        </div>
    );
}
