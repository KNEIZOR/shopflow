import { Prisma, type CurrencyCode } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { CreateOrderInput } from '../order.types';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

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
             * The address must belong to the
             * authenticated user.
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
             * Load the user's cart together
             * with all required product data.
             *
             * The cart is the single source of
             * truth for which products are ordered.
             */
            const cart = await tx.cart.findUnique({
                where: {
                    userId,
                },

                select: {
                    id: true,

                    items: {
                        orderBy: {
                            createdAt: 'asc',
                        },

                        select: {
                            id: true,
                            quantity: true,
                            productId: true,
                            variantId: true,

                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    status: true,
                                },
                            },

                            variant: {
                                select: {
                                    id: true,
                                    productId: true,
                                    name: true,
                                    price: true,
                                    stock: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!cart) {
                throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
            }

            if (cart.items.length === 0) {
                throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
            }

            /*
             * Keep a defensive limit on the number
             * of different cart items that can be
             * converted into one order.
             */
            if (cart.items.length > 50) {
                throw new AppError(
                    400,
                    'TOO_MANY_ORDER_ITEMS',
                    'Order contains too many items',
                );
            }

            let total = new Prisma.Decimal(0);

            const orderItemsData: Array<{
                productId: string;
                variantId: string;
                quantity: number;
                price: Prisma.Decimal;
            }> = [];

            /*
             * Validate every cart item and calculate
             * the order total exclusively from
             * database values.
             */
            for (const cartItem of cart.items) {
                if (cartItem.product.id !== cartItem.productId) {
                    throw new AppError(
                        400,
                        'INVALID_CART_ITEM',
                        'Cart contains an invalid product reference',
                    );
                }

                if (cartItem.variant.id !== cartItem.variantId) {
                    throw new AppError(
                        400,
                        'INVALID_CART_ITEM',
                        'Cart contains an invalid variant reference',
                    );
                }

                if (cartItem.variant.productId !== cartItem.productId) {
                    throw new AppError(
                        400,
                        'VARIANT_PRODUCT_MISMATCH',
                        'Product variant does not belong to the cart product',
                    );
                }

                if (cartItem.quantity < 1 || cartItem.quantity > 100) {
                    throw new AppError(
                        400,
                        'INVALID_CART_QUANTITY',
                        'Cart contains an invalid quantity',
                    );
                }

                if (cartItem.product.status !== 'ACTIVE') {
                    throw new AppError(
                        400,
                        'PRODUCT_NOT_AVAILABLE',
                        `Product "${cartItem.product.name}" is no longer available`,
                    );
                }

                if (cartItem.variant.stock < cartItem.quantity) {
                    throw new AppError(
                        409,
                        'INSUFFICIENT_STOCK',
                        `Insufficient stock for variant "${cartItem.variant.name}"`,
                    );
                }

                /*
                 * Variant price has priority.
                 * Product price is the fallback.
                 *
                 * Neither value comes from the client.
                 */
                const price = cartItem.variant.price ?? cartItem.product.price;

                if (price.lessThan(0)) {
                    throw new AppError(
                        500,
                        'INVALID_PRODUCT_PRICE',
                        'Product contains an invalid price',
                    );
                }

                const itemTotal = price.mul(cartItem.quantity);

                total = total.add(itemTotal);

                orderItemsData.push({
                    productId: cartItem.productId,

                    variantId: cartItem.variantId,

                    quantity: cartItem.quantity,

                    price,
                });
            }

            /*
             * Create the order and all order items
             * inside the same transaction.
             */
            const order = await tx.order.create({
                data: {
                    userId,

                    addressId: address.id,

                    total,

                    currency: DEFAULT_CURRENCY,

                    status: 'PENDING',

                    paymentStatus: 'PENDING',

                    items: {
                        create: orderItemsData,
                    },
                },

                select: {
                    id: true,
                    total: true,
                    currency: true,
                    status: true,
                    paymentStatus: true,
                    createdAt: true,

                    items: {
                        select: orderItemSelect,
                    },
                },
            });

            /*
             * Atomically reserve the stock.
             *
             * The stock condition is intentionally
             * repeated here even though stock was
             * checked above.
             *
             * This protects against stock changing
             * between the initial read and this update.
             */
            for (const cartItem of cart.items) {
                const updated = await tx.productVariant.updateMany({
                    where: {
                        id: cartItem.variantId,

                        stock: {
                            gte: cartItem.quantity,
                        },
                    },

                    data: {
                        stock: {
                            decrement: cartItem.quantity,
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

            /*
             * The order was successfully created
             * and stock was successfully reserved.
             *
             * Clear the cart inside the same
             * transaction so the user cannot
             * accidentally order the same cart
             * twice.
             */
            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });

            return {
                id: order.id,

                total: order.total.toFixed(2),

                currency: order.currency,

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
