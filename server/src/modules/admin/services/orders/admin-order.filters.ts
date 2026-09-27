import { Prisma } from '@prisma/client';

export const buildAdminOrderSearchFilter = (
    search: string,
): Prisma.OrderWhereInput => {
    const normalizedSearch = search.trim();

    if (!normalizedSearch) {
        return {};
    }

    return {
        OR: [
            {
                id: {
                    contains: normalizedSearch,
                    mode: 'insensitive',
                },
            },

            {
                user: {
                    email: {
                        contains: normalizedSearch,
                        mode: 'insensitive',
                    },
                },
            },

            {
                user: {
                    firstName: {
                        contains: normalizedSearch,
                        mode: 'insensitive',
                    },
                },
            },

            {
                user: {
                    lastName: {
                        contains: normalizedSearch,
                        mode: 'insensitive',
                    },
                },
            },
        ],
    };
};
