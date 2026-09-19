import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCategory, type CreateCategoryInput } from '@/entities/category';

import { adminCategoryQueryKeys } from './category-query-keys';

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateCategoryInput) => createCategory(input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminCategoryQueryKeys.lists(),
            });
        },
    });
};
