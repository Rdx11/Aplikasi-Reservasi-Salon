import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
};

export function Alert({ type = 'info', title, message, onClose, className }) {
    const Icon = icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={clsx('flex gap-3 p-4 rounded-xl border', styles[type], className)}
        >
            <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
            <div className="flex-1">
                {title && <h4 className="font-semibold mb-1">{title}</h4>}
                <p className="text-sm">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition">
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
}
