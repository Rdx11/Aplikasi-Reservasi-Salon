import { forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef(({ label, error, helperText, className, icon: Icon, ...props }, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'placeholder:text-gray-400 transition-all duration-200',
                        Icon && 'pl-10',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
            </div>
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}
            <textarea
                ref={ref}
                className={clsx(
                    'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'placeholder:text-gray-400 transition-all duration-200 resize-none',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, options = [], placeholder, className, ...props }, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}
            <select
                ref={ref}
                className={clsx(
                    'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';
