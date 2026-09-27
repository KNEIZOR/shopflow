import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/entities/auth';
import {
    useCreateReview,
    useDeleteReview,
    useMyProductReview,
    useProductReviews,
    useUpdateReview,
} from '@/entities/review';

import { ReviewStars } from './ReviewStars';

import styles from './ProductReviews.module.scss';

type ProductReviewsProps = {
    productId: string;
};

const REVIEWS_PER_PAGE = 5;

const getUserName = (
    firstName: string | null,
    lastName: string | null,
    fallback: string,
) => {
    const name = [firstName, lastName].filter(Boolean).join(' ').trim();

    return name || fallback;
};

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [page, setPage] = useState(1);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, isLoading, isError } = useProductReviews(
        productId,
        page,
        REVIEWS_PER_PAGE,
    );

    const { data: myReview, isLoading: isMyReviewLoading } = useMyProductReview(
        productId,
        isAuthenticated,
    );

    const createMutation = useCreateReview(productId);
    const updateMutation = useUpdateReview();
    const deleteMutation = useDeleteReview();

    const summary = data?.summary;
    const totalPages = data?.pagination.totalPages ?? 0;

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const canShowForm = isAuthenticated && !isAuthLoading && !isMyReviewLoading;

    const currentReview = myReview ?? null;

    useEffect(() => {
        if (!isDeleteModalOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !deleteMutation.isPending) {
                setIsDeleteModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDeleteModalOpen, deleteMutation.isPending]);

    useEffect(() => {
        if (!isDeleteModalOpen) {
            document.body.style.overflow = '';
            return;
        }

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isDeleteModalOpen]);

    const formatDate = (value: string) => {
        return new Intl.DateTimeFormat(i18n.language, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(value));
    };

    const resetForm = () => {
        setRating(5);
        setComment('');
        setIsEditing(false);
        setDeleteError(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedComment = comment.trim() || null;

        try {
            if (currentReview && isEditing) {
                await updateMutation.mutateAsync({
                    reviewId: currentReview.id,
                    input: {
                        rating,
                        comment: normalizedComment,
                    },
                });

                resetForm();

                return;
            }

            await createMutation.mutateAsync({
                rating,
                comment: normalizedComment,
            });

            resetForm();
        } catch {
            // Mutation state already exposes the error.
        }
    };

    const handleEdit = () => {
        if (!currentReview) {
            return;
        }

        setRating(currentReview.rating);
        setComment(currentReview.comment ?? '');
        setDeleteError(null);
        setIsEditing(true);
    };

    const openDeleteModal = () => {
        if (!currentReview || deleteMutation.isPending) {
            return;
        }

        setDeleteError(null);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (deleteMutation.isPending) {
            return;
        }

        setIsDeleteModalOpen(false);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        if (!currentReview || deleteMutation.isPending) {
            return;
        }

        setDeleteError(null);

        try {
            await deleteMutation.mutateAsync(currentReview.id);

            setIsDeleteModalOpen(false);
            resetForm();

            if (data?.items.length === 1 && page > 1) {
                setPage((currentPage) => Math.max(1, currentPage - 1));
            }
        } catch {
            setDeleteError(t('product.reviews.deleteError'));
        }
    };

    const getMutationError = () => {
        if (createMutation.error) {
            return createMutation.error.message;
        }

        if (updateMutation.error) {
            return updateMutation.error.message;
        }

        return null;
    };

    const mutationError = getMutationError();

    const currentReviewerName = currentReview
        ? getUserName(
              currentReview.user.firstName,
              currentReview.user.lastName,
              t('product.reviews.anonymous'),
          )
        : '';

    return (
        <>
            <section
                className={styles.section}
                aria-labelledby="product-reviews-title"
            >
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            {t('product.reviews.eyebrow')}
                        </span>

                        <h2 id="product-reviews-title" className={styles.title}>
                            {t('product.reviews.title')}
                        </h2>
                    </div>

                    {summary && summary.count > 0 && (
                        <div className={styles.summary}>
                            <div className={styles.average}>
                                {summary.averageRating.toFixed(1)}
                            </div>

                            <div className={styles.summaryDetails}>
                                <ReviewStars
                                    value={summary.averageRating}
                                    size="small"
                                    label={t('product.reviews.ratingLabel', {
                                        rating: summary.averageRating.toFixed(
                                            1,
                                        ),
                                    })}
                                />

                                <span className={styles.reviewCount}>
                                    {t('product.reviews.count', {
                                        count: summary.count,
                                    })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {isError && (
                    <div className={styles.state}>
                        <p>{t('product.reviews.loadError')}</p>
                    </div>
                )}

                {isLoading && (
                    <div className={styles.state}>
                        <span className={styles.loader} aria-hidden="true" />

                        <p>{t('product.reviews.loading')}</p>
                    </div>
                )}

                {!isLoading && !isError && (
                    <>
                        {data?.items.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyMark}>—</div>

                                <p className={styles.emptyTitle}>
                                    {t('product.reviews.emptyTitle')}
                                </p>

                                <p className={styles.emptyText}>
                                    {t('product.reviews.emptyText')}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.list}>
                                {data?.items.map((review) => {
                                    const isOwnReview =
                                        user?.id === review.user.id;

                                    const reviewerName = getUserName(
                                        review.user.firstName,
                                        review.user.lastName,
                                        t('product.reviews.anonymous'),
                                    );

                                    return (
                                        <article
                                            key={review.id}
                                            className={`${styles.review} ${
                                                isOwnReview
                                                    ? styles.reviewOwn
                                                    : ''
                                            }`}
                                        >
                                            <div
                                                className={styles.reviewHeader}
                                            >
                                                <div className={styles.author}>
                                                    <div
                                                        className={
                                                            styles.avatar
                                                        }
                                                        aria-hidden="true"
                                                    >
                                                        {reviewerName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p
                                                            className={
                                                                styles.authorName
                                                            }
                                                        >
                                                            {reviewerName}
                                                        </p>

                                                        <time
                                                            className={
                                                                styles.date
                                                            }
                                                            dateTime={
                                                                review.createdAt
                                                            }
                                                        >
                                                            {formatDate(
                                                                review.createdAt,
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>

                                                <ReviewStars
                                                    value={review.rating}
                                                    size="small"
                                                    label={t(
                                                        'product.reviews.ratingLabel',
                                                        {
                                                            rating: review.rating,
                                                        },
                                                    )}
                                                />
                                            </div>

                                            {review.comment && (
                                                <p className={styles.comment}>
                                                    {review.comment}
                                                </p>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <nav
                                className={styles.pagination}
                                aria-label={t(
                                    'product.reviews.paginationLabel',
                                )}
                            >
                                <button
                                    type="button"
                                    className={styles.paginationButton}
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((currentPage) =>
                                            Math.max(1, currentPage - 1),
                                        )
                                    }
                                >
                                    {t('product.reviews.previous')}
                                </button>

                                <div className={styles.pageNumbers}>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1,
                                    ).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            className={`${styles.pageButton} ${
                                                pageNumber === page
                                                    ? styles.pageButtonActive
                                                    : ''
                                            }`}
                                            aria-current={
                                                pageNumber === page
                                                    ? 'page'
                                                    : undefined
                                            }
                                            onClick={() => setPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className={styles.paginationButton}
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage((currentPage) =>
                                            Math.min(
                                                totalPages,
                                                currentPage + 1,
                                            ),
                                        )
                                    }
                                >
                                    {t('product.reviews.next')}
                                </button>
                            </nav>
                        )}
                    </>
                )}

                {canShowForm && (
                    <div className={styles.formSection}>
                        <div className={styles.formHeader}>
                            <div>
                                <span className={styles.formEyebrow}>
                                    {isEditing
                                        ? t('product.reviews.editEyebrow')
                                        : t('product.reviews.formEyebrow')}
                                </span>

                                <h3 className={styles.formTitle}>
                                    {isEditing
                                        ? t('product.reviews.editTitle')
                                        : t('product.reviews.formTitle')}
                                </h3>
                            </div>

                            {isEditing && (
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={resetForm}
                                >
                                    {t('product.reviews.cancel')}
                                </button>
                            )}
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <span className={styles.label}>
                                    {t('product.reviews.rating')}
                                </span>

                                <ReviewStars
                                    value={rating}
                                    interactive
                                    size="large"
                                    onChange={setRating}
                                    label={t(
                                        'product.reviews.ratingInputLabel',
                                    )}
                                />
                            </div>

                            <label
                                className={styles.field}
                                htmlFor="product-review-comment"
                            >
                                <span className={styles.label}>
                                    {t('product.reviews.comment')}
                                </span>

                                <textarea
                                    id="product-review-comment"
                                    className={styles.textarea}
                                    value={comment}
                                    maxLength={2000}
                                    rows={5}
                                    placeholder={t(
                                        'product.reviews.commentPlaceholder',
                                    )}
                                    onChange={(event) =>
                                        setComment(event.target.value)
                                    }
                                />

                                <span className={styles.characterCount}>
                                    {comment.length}/2000
                                </span>
                            </label>

                            {mutationError && (
                                <p className={styles.formError}>
                                    {mutationError}
                                </p>
                            )}

                            <div className={styles.formActions}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? t('product.reviews.submitting')
                                        : isEditing
                                          ? t('product.reviews.save')
                                          : t('product.reviews.submit')}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        disabled={deleteMutation.isPending}
                                        onClick={openDeleteModal}
                                    >
                                        {t('product.reviews.delete')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {!isAuthenticated && !isAuthLoading && (
                    <div className={styles.loginPrompt}>
                        <div>
                            <span className={styles.loginPromptEyebrow}>
                                {t('product.reviews.signInEyebrow')}
                            </span>

                            <p className={styles.loginPromptTitle}>
                                {t('product.reviews.signInTitle')}
                            </p>

                            <p className={styles.loginPromptText}>
                                {t('product.reviews.signInText')}
                            </p>
                        </div>

                        <a href="/login" className={styles.loginButton}>
                            {t('product.reviews.signIn')}
                        </a>
                    </div>
                )}

                {isAuthenticated &&
                    !isMyReviewLoading &&
                    currentReview &&
                    !isEditing && (
                        <div className={styles.ownReviewActions}>
                            <button
                                type="button"
                                className={styles.editButton}
                                onClick={handleEdit}
                            >
                                {t('product.reviews.edit')}
                            </button>

                            <button
                                type="button"
                                className={styles.deleteButton}
                                disabled={deleteMutation.isPending}
                                onClick={openDeleteModal}
                            >
                                {t('product.reviews.delete')}
                            </button>
                        </div>
                    )}
            </section>

            {isDeleteModalOpen && currentReview && (
                <div
                    className={styles.deleteModalOverlay}
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDeleteModal();
                        }
                    }}
                >
                    <div
                        className={styles.deleteModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-review-title"
                        aria-describedby="delete-review-description"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className={styles.deleteModalIcon}>
                            <span aria-hidden="true">!</span>
                        </div>

                        <div className={styles.deleteModalContent}>
                            <h3
                                id="delete-review-title"
                                className={styles.deleteModalTitle}
                            >
                                {t('product.reviews.deleteTitle')}
                            </h3>

                            <p
                                id="delete-review-description"
                                className={styles.deleteModalText}
                            >
                                {t('product.reviews.deleteDescription', {
                                    name: currentReviewerName,
                                })}
                            </p>
                        </div>

                        {deleteError && (
                            <p className={styles.deleteModalError}>
                                {deleteError}
                            </p>
                        )}

                        <div className={styles.deleteModalActions}>
                            <button
                                type="button"
                                className={styles.deleteModalCancel}
                                disabled={deleteMutation.isPending}
                                onClick={closeDeleteModal}
                            >
                                {t('product.reviews.cancel')}
                            </button>

                            <button
                                type="button"
                                className={styles.deleteModalConfirm}
                                disabled={deleteMutation.isPending}
                                onClick={handleDelete}
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <span
                                            className={
                                                styles.deleteModalSpinner
                                            }
                                            aria-hidden="true"
                                        />

                                        {t('product.reviews.deleting')}
                                    </>
                                ) : (
                                    t('product.reviews.confirmDelete')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
