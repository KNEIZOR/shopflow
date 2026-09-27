import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useAuth } from '@/entities/auth';
import { useFavorites } from '@/entities/favorite';
import { useLocale } from '@/entities/locale';

import styles from './FavoriteHeaderLink.module.scss';

export const FavoriteHeaderLink = () => {
    const { t, i18n } = useTranslation();

    const { isAuthenticated } = useAuth();
    const { currency } = useLocale();

    const language = i18n.language === 'ru' ? 'ru' : 'en';

    const { data: favorites = [] } = useFavorites({
        language,
        currency,
    });

    const favoritesCount = isAuthenticated ? favorites.length : 0;

    return (
        <NavLink
            to="/account/favorites"
            className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
            }
            aria-label={t('favorites.account.title')}
            title={t('favorites.account.title')}
        >
            <Heart size={20} strokeWidth={1.8} />

            {favoritesCount > 0 && (
                <span className={styles.count} aria-hidden="true">
                    {favoritesCount}
                </span>
            )}
        </NavLink>
    );
};
