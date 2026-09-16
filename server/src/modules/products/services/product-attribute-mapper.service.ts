import type {
    ProductAttributeScope,
    ProductAttributeType,
} from '@prisma/client';

export type ProductAttributeValueResponse = {
    id: string;
    productId: string;
    attributeId: string;

    attribute: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: ProductAttributeType;
        scope: ProductAttributeScope;
        isRequired: boolean;
        position: number;
    };

    value: string;

    createdAt: Date;
    updatedAt: Date;
};

type ProductAttributeValueWithRelations = {
    id: string;
    productId: string | null;
    variantId: string | null;
    attributeId: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;

    attribute: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: ProductAttributeType;
        scope: ProductAttributeScope;
    };

    productAttribute?: {
        id: string;
        isRequired: boolean;
        position: number;
    } | null;
};

export const mapProductAttributeValue = (
    value: ProductAttributeValueWithRelations,
): ProductAttributeValueResponse => {
    return {
        id: value.id,

        productId: value.productId ?? '',

        attributeId: value.attributeId,

        attribute: {
            id: value.attribute.id,

            name: value.attribute.name,

            slug: value.attribute.slug,

            description: value.attribute.description,

            type: value.attribute.type,

            scope: value.attribute.scope,

            isRequired: value.productAttribute?.isRequired ?? false,

            position: value.productAttribute?.position ?? 0,
        },

        value: value.value,

        createdAt: value.createdAt,

        updatedAt: value.updatedAt,
    };
};
