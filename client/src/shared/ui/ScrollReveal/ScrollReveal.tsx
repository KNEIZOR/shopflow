import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react';

import styles from './ScrollReveal.module.scss';

export type ScrollRevealAnimation =
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'scale';

export type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    animation?: ScrollRevealAnimation;
    delay?: number;
    duration?: number;
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    stagger?: boolean;
    staggerDelay?: number;
};

type ScrollRevealStyle = CSSProperties & {
    '--reveal-delay': string;
    '--reveal-duration': string;
    '--reveal-stagger': string;
};

const DEFAULT_THRESHOLD = 0.15;
const DEFAULT_ROOT_MARGIN = '0px 0px -60px';
const DEFAULT_DURATION = 700;
const DEFAULT_STAGGER_DELAY = 80;

export const ScrollReveal = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = DEFAULT_DURATION,
    threshold = DEFAULT_THRESHOLD,
    rootMargin = DEFAULT_ROOT_MARGIN,
    once = true,
    stagger = false,
    staggerDelay = DEFAULT_STAGGER_DELAY,
    className,
    style,
    ...rest
}: ScrollRevealProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isVisible, setIsVisible] = useState(
        () => typeof IntersectionObserver === 'undefined',
    );

    useEffect(() => {
        const element = containerRef.current;

        if (!element || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) {
                    return;
                }

                if (entry.isIntersecting) {
                    setIsVisible(true);

                    if (once) {
                        observer.disconnect();
                    }

                    return;
                }

                if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [once, rootMargin, threshold]);

    const revealStyle: ScrollRevealStyle = {
        ...style,
        '--reveal-delay': `${delay}ms`,
        '--reveal-duration': `${duration}ms`,
        '--reveal-stagger': `${staggerDelay}ms`,
    };

    const classNames = [
        styles.reveal,
        styles[animation],
        stagger ? styles.stagger : '',
        isVisible ? styles.isVisible : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={containerRef}
            className={classNames}
            style={revealStyle}
            {...rest}
        >
            {children}
        </div>
    );
};
