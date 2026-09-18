export const productTypeQueryKeys = {
    all: ['product-types'] as const,

    lists: () => [...productTypeQueryKeys.all, 'list'] as const,

    list: () => [...productTypeQueryKeys.lists()] as const,

    details: () => [...productTypeQueryKeys.all, 'detail'] as const,

    detail: (productTypeId: string) =>
        [...productTypeQueryKeys.details(), productTypeId] as const,

    attributes: (productTypeId: string) =>
        [...productTypeQueryKeys.detail(productTypeId), 'attributes'] as const,

    attribute: (productTypeId: string, attributeId: string) =>
        [
            ...productTypeQueryKeys.attributes(productTypeId),
            attributeId,
        ] as const,

    options: (productTypeId: string, attributeId: string) =>
        [
            ...productTypeQueryKeys.attribute(productTypeId, attributeId),
            'options',
        ] as const,

    option: (productTypeId: string, attributeId: string, optionId: string) =>
        [
            ...productTypeQueryKeys.options(productTypeId, attributeId),
            optionId,
        ] as const,
};
