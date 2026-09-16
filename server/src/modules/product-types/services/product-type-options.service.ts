import { ProductAttributeType } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export type CreateProductTypeOptionInput = {
    value: string;
    label: string;
    position?: number;
};

export type UpdateProductTypeOptionInput = {
    value?: string;
    label?: string;
    position?: number;
};

const optionInclude = {
    productTypeAttribute: {
        include: {
            attribute: true,
        },
    },
};

const getProductTypeAttribute = async (
    productTypeId: string,
    productTypeAttributeId: string,
) => {
    const productTypeAttribute = await prisma.productTypeAttribute.findFirst({
        where: {
            id: productTypeAttributeId,
            productTypeId,
        },

        include: {
            attribute: true,
        },
    });

    if (!productTypeAttribute) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_ATTRIBUTE_NOT_FOUND',
            'Product type attribute not found',
        );
    }

    if (productTypeAttribute.attribute.type !== ProductAttributeType.SELECT) {
        throw new AppError(
            409,
            'PRODUCT_ATTRIBUTE_NOT_SELECT',
            'Options can only be created for SELECT attributes',
        );
    }

    return productTypeAttribute;
};

const ensureOptionValueAvailable = async (
    productTypeAttributeId: string,
    value: string,
    excludeOptionId?: string,
): Promise<void> => {
    const existingOption = await prisma.productAttributeOption.findFirst({
        where: {
            productTypeAttributeId,

            value,

            ...(excludeOptionId
                ? {
                      id: {
                          not: excludeOptionId,
                      },
                  }
                : {}),
        },

        select: {
            id: true,
        },
    });

    if (existingOption) {
        throw new AppError(
            409,
            'PRODUCT_ATTRIBUTE_OPTION_ALREADY_EXISTS',
            'An option with this value already exists',
        );
    }
};

export const getProductTypeOptions = async (
    productTypeId: string,
    productTypeAttributeId: string,
) => {
    await getProductTypeAttribute(productTypeId, productTypeAttributeId);

    return prisma.productAttributeOption.findMany({
        where: {
            productTypeAttributeId,
        },

        orderBy: [
            {
                position: 'asc',
            },
            {
                createdAt: 'asc',
            },
        ],
    });
};

export const getProductTypeOptionById = async (
    productTypeId: string,
    productTypeAttributeId: string,
    optionId: string,
) => {
    await getProductTypeAttribute(productTypeId, productTypeAttributeId);

    const option = await prisma.productAttributeOption.findFirst({
        where: {
            id: optionId,
            productTypeAttributeId,
        },

        include: optionInclude,
    });

    if (!option) {
        throw new AppError(
            404,
            'PRODUCT_ATTRIBUTE_OPTION_NOT_FOUND',
            'Product attribute option not found',
        );
    }

    return option;
};

export const createProductTypeOption = async (
    productTypeId: string,
    productTypeAttributeId: string,
    input: CreateProductTypeOptionInput,
) => {
    await getProductTypeAttribute(productTypeId, productTypeAttributeId);

    await ensureOptionValueAvailable(productTypeAttributeId, input.value);

    return prisma.productAttributeOption.create({
        data: {
            value: input.value,
            label: input.label,
            position: input.position ?? 0,
            productTypeAttributeId,
        },

        include: optionInclude,
    });
};

export const updateProductTypeOption = async (
    productTypeId: string,
    productTypeAttributeId: string,
    optionId: string,
    input: UpdateProductTypeOptionInput,
) => {
    await getProductTypeAttribute(productTypeId, productTypeAttributeId);

    const existingOption = await prisma.productAttributeOption.findFirst({
        where: {
            id: optionId,
            productTypeAttributeId,
        },

        select: {
            id: true,
        },
    });

    if (!existingOption) {
        throw new AppError(
            404,
            'PRODUCT_ATTRIBUTE_OPTION_NOT_FOUND',
            'Product attribute option not found',
        );
    }

    if (input.value !== undefined) {
        await ensureOptionValueAvailable(
            productTypeAttributeId,
            input.value,
            optionId,
        );
    }

    const data = {
        ...(input.value !== undefined
            ? {
                  value: input.value,
              }
            : {}),

        ...(input.label !== undefined
            ? {
                  label: input.label,
              }
            : {}),

        ...(input.position !== undefined
            ? {
                  position: input.position,
              }
            : {}),
    };

    if (Object.keys(data).length === 0) {
        return getProductTypeOptionById(
            productTypeId,
            productTypeAttributeId,
            optionId,
        );
    }

    await prisma.productAttributeOption.update({
        where: {
            id: optionId,
        },

        data,
    });

    return getProductTypeOptionById(
        productTypeId,
        productTypeAttributeId,
        optionId,
    );
};

export const deleteProductTypeOption = async (
    productTypeId: string,
    productTypeAttributeId: string,
    optionId: string,
): Promise<void> => {
    await getProductTypeAttribute(productTypeId, productTypeAttributeId);

    const option = await prisma.productAttributeOption.findFirst({
        where: {
            id: optionId,
            productTypeAttributeId,
        },

        select: {
            id: true,
        },
    });

    if (!option) {
        throw new AppError(
            404,
            'PRODUCT_ATTRIBUTE_OPTION_NOT_FOUND',
            'Product attribute option not found',
        );
    }

    /*
     * ProductAttributeOption is currently only a definition
     * for available SELECT values.
     *
     * Actual selected values are stored in
     * ProductAttributeValue.value, so deleting an option
     * does not currently delete product/variant values.
     *
     * The service deliberately does not cascade-delete
     * ProductAttributeValue records.
     */

    await prisma.productAttributeOption.delete({
        where: {
            id: optionId,
        },
    });
};
