import { motion } from 'framer-motion';

// Base Skeleton component with shimmer animation
export function Skeleton({ className = '', variant = 'rectangular', animation = 'pulse' }) {
    const baseClasses = 'bg-gray-200 overflow-hidden relative';
    
    const variantClasses = {
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded h-4',
        card: 'rounded-2xl',
    };

    const shimmerAnimation = animation === 'shimmer' ? (
        <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ translateX: ['−100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
    ) : null;

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${className} ${animation === 'pulse' ? 'animate-pulse' : ''}`}
        >
            {shimmerAnimation}
        </div>
    );
}

// Skeleton for stat cards
export function SkeletonStatCard() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Skeleton className="w-10 h-10 mb-3" variant="rectangular" />
            <Skeleton className="w-20 h-8 mb-2" />
            <Skeleton className="w-24 h-4" variant="text" />
        </div>
    );
}

// Skeleton for booking cards
export function SkeletonBookingCard() {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
            <Skeleton className="w-12 h-12 flex-shrink-0" variant="rectangular" />
            <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="w-3/4 h-5" variant="text" />
                <Skeleton className="w-1/2 h-4" variant="text" />
            </div>
            <Skeleton className="w-20 h-6" variant="rectangular" />
        </div>
    );
}

// Skeleton for table rows
export function SkeletonTableRow({ columns = 5 }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" variant="text" />
                </td>
            ))}
        </tr>
    );
}

// Skeleton for service cards
export function SkeletonServiceCard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <Skeleton className="w-full h-48" />
            <div className="p-5 space-y-3">
                <Skeleton className="w-3/4 h-6" variant="text" />
                <Skeleton className="w-full h-4" variant="text" />
                <Skeleton className="w-1/2 h-4" variant="text" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="w-24 h-6" variant="text" />
                    <Skeleton className="w-20 h-10" variant="rectangular" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for profile section
export function SkeletonProfile() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-20 h-20" variant="circular" />
                <div className="space-y-2">
                    <Skeleton className="w-32 h-6" variant="text" />
                    <Skeleton className="w-48 h-4" variant="text" />
                </div>
            </div>
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <Skeleton className="w-20 h-3 mb-2" variant="text" />
                        <Skeleton className="w-full h-10" variant="rectangular" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Skeleton for dashboard welcome section
export function SkeletonWelcome() {
    return (
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-8 animate-pulse">
            <Skeleton className="w-48 h-8 mb-2 bg-gray-300" />
            <Skeleton className="w-72 h-5 mb-6 bg-gray-300" />
            <Skeleton className="w-32 h-10 bg-gray-300" variant="rectangular" />
        </div>
    );
}

// Skeleton for list items
export function SkeletonListItem() {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-50 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="w-40 h-5" variant="text" />
                <Skeleton className="w-24 h-4" variant="text" />
            </div>
            <div className="text-right space-y-2">
                <Skeleton className="w-24 h-5" variant="text" />
                <Skeleton className="w-16 h-5" variant="rectangular" />
            </div>
        </div>
    );
}

// Full page skeleton loader
export function SkeletonPage() {
    return (
        <div className="space-y-8 animate-pulse">
            <SkeletonWelcome />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonStatCard key={i} />
                ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <Skeleton className="w-40 h-6 mb-6" variant="text" />
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonBookingCard key={i} />
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <Skeleton className="w-40 h-6 mb-6" variant="text" />
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonListItem key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export all
export default Skeleton;
