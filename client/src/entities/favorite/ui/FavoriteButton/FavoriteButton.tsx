import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/entities/auth';

import {
    useAddFavorite,
    useRemoveFavorite,
} from '../../model/useFavoriteMutations';
import { useFavorites } from '../../model/useFavorites';

import type { CurrencyCode } from '@/shared/config/currencies';

import styles from './FavoriteButton.module.scss';

type FavoriteButtonProps = {
    productId: string;
    currency?: CurrencyCode;
};

export const FavoriteButton = ({
    productId,
    currency = 'RUB',
}: FavoriteButtonProps) => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated } = useAuth();

    const [optimisticFavorite, setOptimisticFavorite] = useState<
        boolean | null
    >(null);

    const language = i18n.language === 'ru' ? 'ru' : 'en';

    const { data: favorites = [], isLoading: isFavoritesLoading } =
        useFavorites({
            language,
            currency,
        });

    const addFavoriteMutation = useAddFavorite();
    const removeFavoriteMutation = useRemoveFavorite();

    const favoriteFromServer = favorites.some(
        (favorite) => favorite.product.id === productId,
    );

    const isFavorite =
        optimisticFavorite === null ? favoriteFromServer : optimisticFavorite;

    const isPending =
        addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

    const handleClick = async (): Promise<void> => {
        if (!isAuthenticated) {
            navigate('/account/login', {
                state: {
                    from: location,
                },
            });

            return;
        }

        if (isPending) {
            return;
        }

        const nextFavoriteState = !isFavorite;

        setOptimisticFavorite(nextFavoriteState);

        try {
            if (isFavorite) {
                await removeFavoriteMutation.mutateAsync(productId);
            } else {
                await addFavoriteMutation.mutateAsync(productId);
            }

            setOptimisticFavorite(null);
        } catch {
            setOptimisticFavorite(isFavorite);
        }
    };

    return (
        <button
            type="button"
            className={`${styles.button} ${isFavorite ? styles.active : ''}`}
            onClick={() => void handleClick()}
            disabled={isPending || (isAuthenticated && isFavoritesLoading)}
            aria-label={
                isFavorite
                    ? t('favorites.button.remove')
                    : t('favorites.button.add')
            }
            aria-pressed={isFavorite}
        >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
        </button>
    );
};
