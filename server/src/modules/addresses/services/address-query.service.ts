import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

const addressSelect = {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    country: true,
    city: true,
    postalCode: true,
    street: true,
    apartment: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const getUserAddresses = async (userId: string) => {
    return prisma.address.findMany({
        where: {
            userId,
        },

        select: addressSelect,

        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const getUserAddressById = async (userId: string, addressId: string) => {
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },

        select: addressSelect,
    });

    if (!address) {
        throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Address not found');
    }

    return address;
};
