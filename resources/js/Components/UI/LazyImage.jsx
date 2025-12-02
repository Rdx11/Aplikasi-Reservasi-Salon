import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * LazyImage component with blur-up effect and intersection observer
 */
export function LazyImage({ 
    src, 
    alt = '', 
    className = '', 
    placeholder = null,
    fallback = '/images/placeholder.jpg',
    aspectRatio = null,
    objectFit = 'cover',
    onLoad = () => {},
    onError = () => {},
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px', threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad();
    };

    const handleError = () => {
        setHasError(true);
        onError();
    };

    const aspectRatioStyles = aspectRatio ? {
        aspectRatio: aspectRatio,
    } : {};

    return (
        <div 
            ref={imgRef}
            className={`relative overflow-hidden bg-gray-100 ${className}`}
            style={aspectRatioStyles}
        >
            {/* Placeholder/Skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse">
                    {placeholder || (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg 
                                className="w-10 h-10 text-gray-300" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>
            )}

            {/* Actual Image */}
            {isInView && (
                <motion.img
                    src={hasError ? fallback : src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : ''}`}
                    loading="lazy"
                />
            )}
        </div>
    );
}

/**
 * Avatar with lazy loading
 */
export function LazyAvatar({ 
    src, 
    alt = '', 
    size = 'md',
    fallbackInitials = '',
    className = '' 
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl',
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (hasError || !src) {
        return (
            <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold ${className}`}>
                {getInitials(fallbackInitials || alt)}
            </div>
        );
    }

    return (
        <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 ${className}`}>
            {!isLoaded && (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
            <motion.img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>
    );
}

/**
 * Background image with lazy loading
 */
export function LazyBackground({ 
    src, 
    children, 
    className = '',
    overlay = false,
    overlayColor = 'rgba(0,0,0,0.5)'
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isInView && src) {
            const img = new Image();
            img.src = src;
            img.onload = () => setIsLoaded(true);
        }
    }, [isInView, src]);

    return (
        <div 
            ref={containerRef}
            className={`relative ${className}`}
            style={{
                backgroundImage: isLoaded ? `url(${src})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Loading placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            {/* Overlay */}
            {overlay && isLoaded && (
                <div 
                    className="absolute inset-0" 
                    style={{ backgroundColor: overlayColor }}
                />
            )}
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export default LazyImage;
