export const reviewQueryKeys = {
    all: ['reviews'] as const,

    product: (productId: string, page: number, limit: number) =>
        [...reviewQueryKeys.all, 'product', productId, page, limit] as const,

    mine: (productId: string) =>
        [...reviewQueryKeys.all, 'mine', productId] as const,
};
