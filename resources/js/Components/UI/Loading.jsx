import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Spinner({ size = 'md', className }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    return (
        <svg className={clsx('animate-spin text-primary-600', sizes[size], className)} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

export function LoadingDots({ className }) {
    return (
        <div className={clsx('flex gap-1', className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary-600 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
            ))}
        </div>
    );
}

export function LoadingOverlay({ message = 'Loading...' }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <div className="flex flex-col items-center gap-4">
                <Spinner size="xl" />
                <p className="text-gray-600 font-medium">{message}</p>
            </div>
        </motion.div>
    );
}

export function PageLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-gray-500 font-medium">Memuat...</p>
            </div>
        </div>
    );
}

export function SkeletonBox({ className }) {
    return (
        <div className={clsx('animate-pulse bg-gray-200 rounded-lg', className)} />
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <SkeletonBox key={j} className="h-10 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}
