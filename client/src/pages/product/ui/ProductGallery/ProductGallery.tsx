import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductImage } from '@/entities/product';

import styles from './ProductGallery.module.scss';

type ProductGalleryProps = {
    productName: string;
    images: ProductImage[];
    activeImageIndex: number;
    onImageChange: (index: number) => void;
};

export const ProductGallery = ({
    productName,
    images,
    activeImageIndex,
    onImageChange,
}: ProductGalleryProps) => {
    const { t } = useTranslation();

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    const activeImage = images[activeImageIndex];

    const hasMultipleImages = images.length > 1;

    const getNextIndex = () => {
        if (!hasMultipleImages) {
            return activeImageIndex;
        }

        return (activeImageIndex + 1) % images.length;
    };

    const getPreviousIndex = () => {
        if (!hasMultipleImages) {
            return activeImageIndex;
        }

        return (activeImageIndex - 1 + images.length) % images.length;
    };

    const handlePrevious = () => {
        if (!hasMultipleImages) {
            return;
        }

        onImageChange(getPreviousIndex());
    };

    const handleNext = () => {
        if (!hasMultipleImages) {
            return;
        }

        onImageChange(getNextIndex());
    };

    const handleOpenLightbox = () => {
        if (!activeImage) {
            return;
        }

        setIsLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setIsLightboxOpen(false);
    };

    const handleLightboxPrevious = () => {
        handlePrevious();
    };

    const handleLightboxNext = () => {
        handleNext();
    };

    useEffect(() => {
        if (!isLightboxOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();

                handleCloseLightbox();

                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();

                handleLightboxPrevious();

                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();

                handleLightboxNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        closeButtonRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            document.body.style.overflow = previousOverflow;
        };
    }, [isLightboxOpen, activeImageIndex, images.length]);

    if (!images.length) {
        return (
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <div className={styles.placeholder}>
                        {t('product.noImage')}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.gallery}>
                <div
                    className={`${styles.mainImage} ${
                        activeImage ? styles.mainImageInteractive : ''
                    }`}
                >
                    {activeImage && (
                        <>
                            <button
                                type="button"
                                className={styles.imageButton}
                                onClick={handleOpenLightbox}
                                aria-label={t('product.openImage')}
                            >
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.alt ?? productName}
                                    className={styles.image}
                                />
                            </button>

                            {hasMultipleImages && (
                                <>
                                    <button
                                        type="button"
                                        className={`${styles.navigationButton} ${styles.navigationButtonPrevious}`}
                                        onClick={handlePrevious}
                                        aria-label={t('product.previousImage')}
                                    >
                                        <span aria-hidden="true">←</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`${styles.navigationButton} ${styles.navigationButtonNext}`}
                                        onClick={handleNext}
                                        aria-label={t('product.nextImage')}
                                    >
                                        <span aria-hidden="true">→</span>
                                    </button>

                                    <div
                                        className={styles.imageCounter}
                                        aria-hidden="true"
                                    >
                                        <span>{activeImageIndex + 1}</span>

                                        <span
                                            className={
                                                styles.imageCounterDivider
                                            }
                                        >
                                            /
                                        </span>

                                        <span>{images.length}</span>
                                    </div>
                                </>
                            )}

                            <div className={styles.zoomHint}>
                                <span aria-hidden="true">⌕</span>

                                <span>{t('product.zoomImage')}</span>
                            </div>
                        </>
                    )}
                </div>

                {hasMultipleImages && (
                    <div
                        className={styles.thumbnails}
                        aria-label={t('product.gallery')}
                    >
                        {images.map((image, index) => {
                            const isActive = index === activeImageIndex;

                            return (
                                <button
                                    key={image.id}
                                    type="button"
                                    className={`${styles.thumbnail} ${
                                        isActive ? styles.thumbnailActive : ''
                                    }`}
                                    onClick={() => onImageChange(index)}
                                    aria-label={t('product.imageNumber', {
                                        number: index + 1,
                                    })}
                                    aria-pressed={isActive}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.alt ?? productName}
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {isLightboxOpen && activeImage && (
                <div
                    className={styles.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('product.gallery')}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            handleCloseLightbox();
                        }
                    }}
                >
                    <div className={styles.lightboxContent}>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            className={styles.lightboxClose}
                            onClick={handleCloseLightbox}
                            aria-label={t('product.closeImage')}
                        >
                            <span aria-hidden="true">×</span>
                        </button>

                        {hasMultipleImages && (
                            <button
                                type="button"
                                className={`${styles.lightboxNavigation} ${styles.lightboxNavigationPrevious}`}
                                onClick={handleLightboxPrevious}
                                aria-label={t('product.previousImage')}
                            >
                                <span aria-hidden="true">←</span>
                            </button>
                        )}

                        <div className={styles.lightboxImageWrapper}>
                            <img
                                src={activeImage.url}
                                alt={activeImage.alt ?? productName}
                                className={styles.lightboxImage}
                            />

                            {hasMultipleImages && (
                                <div className={styles.lightboxCounter}>
                                    <span>{activeImageIndex + 1}</span>

                                    <span
                                        className={styles.imageCounterDivider}
                                    >
                                        /
                                    </span>

                                    <span>{images.length}</span>
                                </div>
                            )}
                        </div>

                        {hasMultipleImages && (
                            <button
                                type="button"
                                className={`${styles.lightboxNavigation} ${styles.lightboxNavigationNext}`}
                                onClick={handleLightboxNext}
                                aria-label={t('product.nextImage')}
                            >
                                <span aria-hidden="true">→</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
