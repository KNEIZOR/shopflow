import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/entities/auth';
import {
    useAddFavorite,
    useFavorites,
    useRemoveFavorite,
} from '@/entities/favorite';

import type { CurrencyCode } from '@/shared/config/currencies';

import styles from './ProductFavoriteButton.module.scss';

type ProductFavoriteButtonProps = {
    productId: string;
    currency: CurrencyCode;
};

export const ProductFavoriteButton = ({
    productId,
    currency,
}: ProductFavoriteButtonProps) => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated } = useAuth();

    const [optimisticFavorite, setOptimisticFavorite] = useState<
        boolean | null
    >(null);

    const language = i18n.language === 'ru' ? 'ru' : 'en';

    const { data: favorites = [], isLoading } = useFavorites({
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

        const nextState = !isFavorite;

        setOptimisticFavorite(nextState);

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
            disabled={isPending || (isAuthenticated && isLoading)}
            aria-label={
                isFavorite
                    ? t('favorites.button.remove')
                    : t('favorites.button.add')
            }
            aria-pressed={isFavorite}
            title={
                isFavorite
                    ? t('favorites.button.remove')
                    : t('favorites.button.add')
            }
        >
            <Heart
                className={styles.icon}
                size={21}
                strokeWidth={1.8}
                fill={isFavorite ? 'currentColor' : 'none'}
            />
        </button>
    );
};
