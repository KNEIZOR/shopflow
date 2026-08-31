import { Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { CreateOrderInput } from '../order.types';

const orderItemSelect = {
    id: true,
    quantity: true,
    price: true,
    productId: true,
    variantId: true,
} as const;

export const createOrder = async (userId: string, input: CreateOrderInput) => {
    return prisma.$transaction(
        async (tx) => {
            /*
             * The address must belong to the authenticated user.
             * A user must never be able to create an order
             * using somebody else's address.
             */
            const address = await tx.address.findFirst({
                where: {
                    id: input.addressId,
                    userId,
                },
                select: {
                    id: true,
                },
            });

            if (!address) {
                throw new AppError(
                    404,
                    'ADDRESS_NOT_FOUND',
                    'Address not found',
                );
            }

            /*
             * Prevent duplicate variants in a single order.
             *
             * Example:
             *
             * [
             *   { variantId: "abc", quantity: 1 },
             *   { variantId: "abc", quantity: 2 }
             * ]
             *
             * becomes invalid instead of creating ambiguous order data.
             */
            const variantIds = input.items.map((item) => item.variantId);

            if (new Set(variantIds).size !== variantIds.length) {
                throw new AppError(
                    400,
                    'DUPLICATE_ORDER_ITEMS',
                    'Duplicate product variants are not allowed',
                );
            }

            /*
             * Load all variants in one query.
             *
             * Prices come exclusively from the database.
             * Client-provided prices are completely ignored.
             */
            const variants = await tx.productVariant.findMany({
                where: {
                    id: {
                        in: variantIds,
                    },
                    product: {
                        status: 'ACTIVE',
                    },
                },
                select: {
                    id: true,
                    productId: true,
                    name: true,
                    price: true,
                    stock: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                },
            });

            if (variants.length !== input.items.length) {
                throw new AppError(
                    400,
                    'INVALID_ORDER_ITEMS',
                    'One or more product variants are unavailable',
                );
            }

            const variantsById = new Map(
                variants.map((variant) => [variant.id, variant]),
            );

            let total = new Prisma.Decimal(0);

            const orderItemsData: Array<{
                productId: string;
                variantId: string;
                quantity: number;
                price: Prisma.Decimal;
            }> = [];

            for (const inputItem of input.items) {
                const variant = variantsById.get(inputItem.variantId);

                if (!variant) {
                    throw new AppError(
                        400,
                        'VARIANT_NOT_FOUND',
                        'Product variant not found',
                    );
                }

                if (inputItem.quantity > variant.stock) {
                    throw new AppError(
                        400,
                        'INSUFFICIENT_STOCK',
                        `Insufficient stock for variant ${variant.id}`,
                    );
                }

                const price = variant.price ?? variant.product.price;

                const itemTotal = price.mul(inputItem.quantity);

                total = total.add(itemTotal);

                orderItemsData.push({
                    productId: variant.productId,
                    variantId: variant.id,
                    quantity: inputItem.quantity,
                    price,
                });
            }

            /*
             * Create the order and all order items in the same
             * database transaction.
             *
             * If any operation fails, PostgreSQL rolls everything back.
             */
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: address.id,
                    total,

                    status: 'PENDING',
                    paymentStatus: 'PENDING',

                    items: {
                        create: orderItemsData,
                    },
                },
                select: {
                    id: true,
                    total: true,
                    status: true,
                    paymentStatus: true,
                    createdAt: true,

                    items: {
                        select: orderItemSelect,
                    },
                },
            });

            /*
             * Decrease stock only after the order has been created.
             *
             * updateMany with a stock condition protects against
             * overselling when multiple requests arrive concurrently.
             */
            for (const inputItem of input.items) {
                const variant = variantsById.get(inputItem.variantId);

                if (!variant) {
                    throw new AppError(
                        400,
                        'VARIANT_NOT_FOUND',
                        'Product variant not found',
                    );
                }

                const updated = await tx.productVariant.updateMany({
                    where: {
                        id: variant.id,
                        stock: {
                            gte: inputItem.quantity,
                        },
                    },
                    data: {
                        stock: {
                            decrement: inputItem.quantity,
                        },
                    },
                });

                if (updated.count !== 1) {
                    throw new AppError(
                        409,
                        'STOCK_CHANGED',
                        'Product stock changed. Please try again',
                    );
                }
            }

            return {
                id: order.id,
                total: order.total.toFixed(2),
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                items: order.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price.toFixed(2),
                })),
            };
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
};
