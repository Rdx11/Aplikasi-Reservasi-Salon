import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Fragment>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={clsx('w-full bg-white rounded-2xl shadow-2xl overflow-hidden', sizes[size])}
                        >
                            {title && (
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                    {showClose && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-gray-100 rounded-xl transition"
                                        >
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="p-6">{children}</div>
                        </motion.div>
                    </div>
                </Fragment>
            )}
        </AnimatePresence>
    );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
    const variants = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition font-medium">
                    {cancelText}
                </button>
                <button onClick={onConfirm} className={clsx('px-4 py-2 rounded-xl transition font-medium', variants[variant])}>
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
