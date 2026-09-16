import { Prisma, ProductStatus } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import { ensureProductExists } from './product-validation.service';

export const deleteProduct = async (id: string): Promise<void> => {
    const product = await ensureProductExists(id);

    /**
     * ACTIVE products should not be physically
     * deleted from the catalog.
     *
     * They should first be moved to ARCHIVED.
     */
    if (product.status === ProductStatus.ACTIVE) {
        throw new AppError(
            409,
            'ACTIVE_PRODUCT_CANNOT_BE_DELETED',
            'Active product cannot be deleted. Archive the product first.',
        );
    }

    try {
        await prisma.product.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                throw new AppError(
                    409,
                    'PRODUCT_CANNOT_BE_DELETED',
                    'Product cannot be deleted because it is used by existing records',
                );
            }

            if (error.code === 'P2025') {
                throw new AppError(
                    404,
                    'PRODUCT_NOT_FOUND',
                    'Product not found',
                );
            }
        }

        throw error;
    }
};
