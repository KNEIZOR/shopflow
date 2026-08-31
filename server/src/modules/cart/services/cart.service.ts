import { prisma } from '../../../lib/prisma';

const cartItemInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
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
} as const;

export const getUserCart = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            items: {
                include: cartItemInclude,
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!cart) {
        return {
            id: null,
            items: [],
            summary: {
                itemsCount: 0,
                subtotal: '0.00',
            },
        };
    }

    let itemsCount = 0;
    let subtotal = 0;

    const items = cart.items.map((item) => {
        const price = Number(item.variant.price ?? item.product.price);

        const itemSubtotal = price * item.quantity;

        itemsCount += item.quantity;
        subtotal += itemSubtotal;

        return {
            id: item.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
            },
            variant: {
                id: item.variant.id,
                name: item.variant.name,
                sku: item.variant.sku,
                price: item.variant.price?.toFixed(2) ?? null,
                stock: item.variant.stock,
            },
            subtotal: itemSubtotal.toFixed(2),
        };
    });

    return {
        id: cart.id,
        items,
        summary: {
            itemsCount,
            subtotal: subtotal.toFixed(2),
        },
    };
};
