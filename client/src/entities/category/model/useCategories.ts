import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api/category-api';

export const categoryQueryKeys = {
    all: ['categories'] as const,

    list: (language: string) =>
        [...categoryQueryKeys.all, 'list', language] as const,
};

export const useCategories = (language: string) => {
    return useQuery({
        queryKey: categoryQueryKeys.list(language),

        queryFn: () =>
            getCategories({
                language,
            }),

        enabled: Boolean(language),
    });
};
