import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Sparkles } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { LazyImage, Skeleton, SkeletonServiceCard } from '@/Components/UI';
import { useLoadingState, useLazyLoad } from '@/Hooks/useLazyLoad';

export default function CustomerServicesIndex({ categories = [], services = [] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading] = useLoadingState(true, 500);

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    const filteredServices = services.filter((service) => {
        const matchSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
            service.description?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === 'all' || service.category_id == selectedCategory;
        return matchSearch && matchCategory;
    });

    // Skeleton Loading
    if (isLoading) {
        return (
            <CustomerLayout title="Layanan Kami">
                <Head title="Layanan" />
                <div className="space-y-6">
                    {/* Search Skeleton */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Skeleton className="flex-1 h-12" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="w-24 h-10" />
                            ))}
                        </div>
                    </div>
                    {/* Grid Skeleton */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonServiceCard key={i} />
                        ))}
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout title="Layanan Kami">
            <Head title="Layanan" />

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
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                                    selectedCategory === cat.id
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
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
                                    key={service.id} 
                                    service={service} 
                                    index={index}
                                    formatPrice={formatPrice}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </CustomerLayout>
    );
}

// Service Card with Lazy Loading
function ServiceCard({ service, index, formatPrice }) {
    const { ref, isVisible, hasLoaded } = useLazyLoad({ threshold: 0.1, triggerOnce: true });

    return (
        <div ref={ref}>
            {hasLoaded ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                    <Link
                        href={`/customer/services/${service.id}`}
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
                            <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-600">
                                    {service.category?.name}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                                {service.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary-600">
                                    {formatPrice(service.price)}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    {service.duration} menit
                                </span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ) : (
                <SkeletonServiceCard />
            )}
        </div>
    );
}
