import { Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import { ensureProductExists } from './product-validation.service';

export const deleteProduct = async (id: string): Promise<void> => {
    await ensureProductExists(id);

    try {
        await prisma.product.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003'
        ) {
            throw new AppError(
                409,
                'PRODUCT_CANNOT_BE_DELETED',
                'Product cannot be deleted because it is used by existing records',
            );
        }

        throw error;
    }
};
