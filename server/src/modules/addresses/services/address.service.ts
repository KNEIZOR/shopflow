import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { CreateAddressInput, UpdateAddressInput } from '../address.types';

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

export const createAddress = async (
    userId: string,
    input: CreateAddressInput,
) => {
    return prisma.address.create({
        data: {
            ...input,
            userId,
        },

        select: addressSelect,
    });
};

export const updateAddress = async (
    userId: string,
    addressId: string,
    input: UpdateAddressInput,
) => {
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },

        select: {
            id: true,
        },
    });

    if (!address) {
        throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Address not found');
    }

    return prisma.address.update({
        where: {
            id: address.id,
        },

        data: input,

        select: addressSelect,
    });
};

export const deleteAddress = async (userId: string, addressId: string) => {
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },

        select: {
            id: true,
        },
    });

    if (!address) {
        throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Address not found');
    }

    const ordersCount = await prisma.order.count({
        where: {
            addressId: address.id,
        },
    });

    if (ordersCount > 0) {
        throw new AppError(
            409,
            'ADDRESS_USED_BY_ORDER',
            'Address cannot be deleted because it is used by an order',
        );
    }

    await prisma.address.delete({
        where: {
            id: address.id,
        },
    });
};
