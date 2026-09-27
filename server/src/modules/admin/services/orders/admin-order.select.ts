export const adminOrderListUserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
} as const;

export const adminOrderListSelect = {
    id: true,
    total: true,
    currency: true,
    status: true,
    paymentStatus: true,
    paymentProvider: true,
    createdAt: true,
    updatedAt: true,

    user: {
        select: adminOrderListUserSelect,
    },

    _count: {
        select: {
            items: true,
        },
    },
} as const;

export const adminOrderDetailsSelect = {
    id: true,
    total: true,
    currency: true,
    status: true,
    paymentStatus: true,
    paymentProvider: true,
    paymentSessionId: true,
    paymentIntentId: true,
    createdAt: true,
    updatedAt: true,

    user: {
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        },
    },

    address: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            city: true,
            postalCode: true,
            street: true,
            apartment: true,
        },
    },

    items: {
        orderBy: {
            createdAt: 'asc' as const,
        },

        select: {
            id: true,
            quantity: true,
            price: true,

            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,

                    images: {
                        orderBy: {
                            position: 'asc' as const,
                        },

                        take: 1,

                        select: {
                            url: true,
                            alt: true,
                        },
                    },
                },
            },

            variant: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                },
            },
        },
    },
} as const;
