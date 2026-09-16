import type {
    ProductAttributeScope,
    ProductAttributeType,
} from '@prisma/client';

export type ProductVariantAttributeValueResponse = {
    id: string;
    variantId: string;
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

type ProductVariantAttributeValueWithRelations = {
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

    variantAttribute?: {
        id: string;
        isRequired: boolean;
        position: number;
    } | null;
};

export const mapProductVariantAttributeValue = (
    value: ProductVariantAttributeValueWithRelations,
): ProductVariantAttributeValueResponse => {
    return {
        id: value.id,

        variantId: value.variantId ?? '',

        attributeId: value.attributeId,

        attribute: {
            id: value.attribute.id,

            name: value.attribute.name,

            slug: value.attribute.slug,

            description: value.attribute.description,

            type: value.attribute.type,

            scope: value.attribute.scope,

            isRequired: value.variantAttribute?.isRequired ?? false,

            position: value.variantAttribute?.position ?? 0,
        },

        value: value.value,

        createdAt: value.createdAt,

        updatedAt: value.updatedAt,
    };
};
