import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCategory } from '@/entities/category';

import { adminCategoryQueryKeys } from './category-query-keys';

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminCategoryQueryKeys.all,
            });
        },
    });
};
