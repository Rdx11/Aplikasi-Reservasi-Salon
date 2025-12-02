import { forwardRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Spinner } from './Loading';
import clsx from 'clsx';

const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25',
    gold: 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white shadow-lg shadow-gold-500/25',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
};

export const Button = forwardRef(({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false, 
    href, 
    className, 
    icon: Icon,
    iconPosition = 'left',
    ...props 
}, ref) => {
    const classes = clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
    );

    const content = (
        <>
            {loading && <Spinner size="sm" className="text-current" />}
            {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
    );

    if (href) {
        return (
            <Link ref={ref} href={href} className={classes} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            disabled={disabled || loading}
            className={classes}
            {...props}
        >
            {content}
        </motion.button>
    );
});

Button.displayName = 'Button';
