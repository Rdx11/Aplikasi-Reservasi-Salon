import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for lazy loading content when it enters viewport
 */
export function useLazyLoad(options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const elementRef = useRef(null);

    const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setHasLoaded(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return { ref: elementRef, isVisible, hasLoaded };
}

/**
 * Hook for simulating loading state (useful for skeleton display)
 */
export function useLoadingState(initialLoading = true, delay = 500) {
    const [isLoading, setIsLoading] = useState(initialLoading);

    useEffect(() => {
        if (initialLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [initialLoading, delay]);

    return [isLoading, setIsLoading];
}

/**
 * Hook for infinite scroll / load more functionality
 */
export function useInfiniteScroll(callback, options = {}) {
    const [isFetching, setIsFetching] = useState(false);
    const observerRef = useRef(null);

    const { threshold = 0.5, rootMargin = '100px' } = options;

    const lastElementRef = useCallback(
        (node) => {
            if (isFetching) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setIsFetching(true);
                        callback().finally(() => setIsFetching(false));
                    }
                },
                { threshold, rootMargin }
            );

            if (node) observerRef.current.observe(node);
        },
        [isFetching, callback, threshold, rootMargin]
    );

    return { lastElementRef, isFetching };
}

/**
 * Hook for lazy loading images
 */
export function useLazyImage(src, placeholder = '') {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
        };

        img.onerror = () => {
            setError(true);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return { imageSrc, isLoaded, error, imageRef };
}

export default useLazyLoad;
