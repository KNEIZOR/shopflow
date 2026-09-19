import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCategory, type UpdateCategoryInput } from '@/entities/category';

import { adminCategoryQueryKeys } from './category-query-keys';

type UpdateCategoryVariables = {
    id: string;
    input: UpdateCategoryInput;
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: UpdateCategoryVariables) =>
            updateCategory(id, input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminCategoryQueryKeys.all,
            });
        },
    });
};
