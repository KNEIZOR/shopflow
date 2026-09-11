import { useQuery } from '@tanstack/react-query';

import { getProductImages } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

export const productImagesQueryKeys = {
    all: (productId: string) =>
        [...adminProductQueryKeys.all, 'images', productId] as const,
};

export const useProductImages = (productId: string) => {
    return useQuery({
        queryKey: productImagesQueryKeys.all(productId),
        queryFn: () => getProductImages(productId),
        enabled: Boolean(productId),
    });
};
