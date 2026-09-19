import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/entities/category';
import { useLocale } from '@/entities/locale';

import { adminCategoryQueryKeys } from './category-query-keys';

export const useAdminCategories = () => {
    const { language } = useLocale();

    return useQuery({
        queryKey: adminCategoryQueryKeys.list(language),

        queryFn: () =>
            getCategories({
                language,
            }),

        enabled: Boolean(language),
    });
};
