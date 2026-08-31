import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import { validateProductVariant } from './cart-validation.service';

import type { AddCartItemInput, UpdateCartItemInput } from '../cart.types';

const getUserCart = async (userId: string) => {
    return prisma.cart.upsert({
        where: {
            userId,
        },
        create: {
            userId,
        },
        update: {},
        select: {
            id: true,
        },
    });
};

export const addCartItem = async (userId: string, input: AddCartItemInput) => {
    const cart = await getUserCart(userId);

    const variant = await validateProductVariant({
        productId: input.productId,
        variantId: input.variantId,
        quantity: input.quantity,
    });

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_variantId: {
                cartId: cart.id,
                variantId: input.variantId,
            },
        },
        select: {
            id: true,
            quantity: true,
        },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + input.quantity;

    if (newQuantity > variant.stock) {
        throw new AppError(
            400,
            'INSUFFICIENT_STOCK',
            'Requested quantity exceeds available stock',
        );
    }

    if (existingItem) {
        return prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: newQuantity,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                variant: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                        stock: true,
                    },
                },
            },
        });
    }

    return prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId: input.productId,
            variantId: input.variantId,
            quantity: input.quantity,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            variant: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stock: true,
                },
            },
        },
    });
};

export const updateCartItem = async (
    userId: string,
    itemId: string,
    input: UpdateCartItemInput,
) => {
    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cart: {
                userId,
            },
        },
        select: {
            id: true,
            productId: true,
            variantId: true,
        },
    });

    if (!item) {
        throw new AppError(404, 'CART_ITEM_NOT_FOUND', 'Cart item not found');
    }

    await validateProductVariant({
        productId: item.productId,
        variantId: item.variantId,
        quantity: input.quantity,
    });

    return prisma.cartItem.update({
        where: {
            id: item.id,
        },
        data: {
            quantity: input.quantity,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            variant: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stock: true,
                },
            },
        },
    });
};

export const removeCartItem = async (userId: string, itemId: string) => {
    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cart: {
                userId,
            },
        },
        select: {
            id: true,
        },
    });

    if (!item) {
        throw new AppError(404, 'CART_ITEM_NOT_FOUND', 'Cart item not found');
    }

    await prisma.cartItem.delete({
        where: {
            id: item.id,
        },
    });
};

export const clearCart = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return;
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });
};
