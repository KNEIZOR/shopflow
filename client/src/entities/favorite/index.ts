export { addFavorite, getFavorites, removeFavorite } from './api/favorites-api';

export type { GetFavoritesParams } from './api/favorites-api';

export { favoriteQueryKeys } from './model/query-keys';

export type { FavoriteItem, FavoritesResponse } from './model/types';

export { useFavorites } from './model/useFavorites';

export {
    useAddFavorite,
    useRemoveFavorite,
} from './model/useFavoriteMutations';
