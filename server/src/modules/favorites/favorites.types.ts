import type { ProductResponse } from '../products/products.types';

export type FavoriteItem = {
    id: string;
    createdAt: string;
    product: ProductResponse;
};
