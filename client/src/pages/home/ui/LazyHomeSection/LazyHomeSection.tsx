import type { ComponentType, ReactNode } from 'react';
import { Suspense, useEffect, useRef, useState } from 'react';
type LazyHomeSectionProps = {
    loader: () => Promise<{ default: ComponentType }>;
    rootMargin?: string;
    fallback?: ReactNode;
};
const canUseIntersectionObserver = typeof IntersectionObserver !== 'undefined';
export const LazyHomeSection = ({
    loader,
    rootMargin = '800px 0px',
    fallback = null,
}: LazyHomeSectionProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(
        () => !canUseIntersectionObserver,
    );
    const [Component, setComponent] = useState<ComponentType | null>(null);
    useEffect(() => {
        if (shouldLoad) {
            return;
        }
        const element = containerRef.current;
        if (!element) {
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }
                setShouldLoad(true);
                observer.disconnect();
            },
            { rootMargin, threshold: 0 },
        );
        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [rootMargin, shouldLoad]);
    useEffect(() => {
        if (!shouldLoad || Component) {
            return;
        }
        let cancelled = false;
        void loader().then(({ default: LoadedComponent }) => {
            if (cancelled) {
                return;
            }
            setComponent(() => LoadedComponent);
        });
        return () => {
            cancelled = true;
        };
    }, [Component, loader, shouldLoad]);
    return (
        <div ref={containerRef}>
            {' '}
            {Component ? (
                <Suspense fallback={fallback}>
                    {' '}
                    <Component />{' '}
                </Suspense>
            ) : (
                fallback
            )}{' '}
        </div>
    );
};
