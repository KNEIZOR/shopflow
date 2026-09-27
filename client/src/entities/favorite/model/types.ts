import type { Product } from '@/entities/product/model/types';

export type FavoriteItem = {
    id: string;
    createdAt: string;
    product: Product;
};

export type FavoritesResponse = FavoriteItem[];

export type {Product} from '@/entities/product/model/types';