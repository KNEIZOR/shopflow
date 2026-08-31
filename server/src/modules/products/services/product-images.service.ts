import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export type CreateProductImageInput = {
    url: string;
    alt?: string;
    position?: number;
};

export type UpdateProductImageInput = {
    url?: string;
    alt?: string | null;
    position?: number;
};

const MAX_IMAGES_PER_PRODUCT = 20;

const getProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    return product;
};

export const getProductImages = async (productId: string) => {
    await getProduct(productId);

    return prisma.productImage.findMany({
        where: {
            productId,
        },
        orderBy: {
            position: 'asc',
        },
    });
};

export const addProductImage = async (
    productId: string,
    input: CreateProductImageInput,
) => {
    await getProduct(productId);

    const imageCount = await prisma.productImage.count({
        where: {
            productId,
        },
    });

    if (imageCount >= MAX_IMAGES_PER_PRODUCT) {
        throw new AppError(
            400,
            'IMAGE_LIMIT_REACHED',
            `A product can have a maximum of ${MAX_IMAGES_PER_PRODUCT} images`,
        );
    }

    const image = await prisma.productImage.create({
        data: {
            productId,
            url: input.url,
            alt: input.alt,
            position: input.position ?? imageCount,
        },
    });

    return image;
};

export const updateProductImage = async (
    productId: string,
    imageId: string,
    input: UpdateProductImageInput,
) => {
    await getProduct(productId);

    const image = await prisma.productImage.findFirst({
        where: {
            id: imageId,
            productId,
        },
    });

    if (!image) {
        throw new AppError(
            404,
            'PRODUCT_IMAGE_NOT_FOUND',
            'Product image not found',
        );
    }

    return prisma.productImage.update({
        where: {
            id: imageId,
        },
        data: input,
    });
};

export const deleteProductImage = async (
    productId: string,
    imageId: string,
) => {
    await getProduct(productId);

    const image = await prisma.productImage.findFirst({
        where: {
            id: imageId,
            productId,
        },
    });

    if (!image) {
        throw new AppError(
            404,
            'PRODUCT_IMAGE_NOT_FOUND',
            'Product image not found',
        );
    }

    await prisma.productImage.delete({
        where: {
            id: imageId,
        },
    });
};
