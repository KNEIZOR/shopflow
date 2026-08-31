import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../../errors/app-error';

import {
    createAddressSchema,
    updateAddressSchema,
    addressIdParamsSchema,
} from './address.schema';

import {
    createAddress,
    updateAddress,
    deleteAddress,
} from './services/address.service';

import {
    getUserAddresses,
    getUserAddressById,
} from './services/address-query.service';

const getAuthenticatedUserId = (req: Request) => {
    if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    return req.userId;
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const addresses = await getUserAddresses(userId);

        res.status(200).json({
            success: true,
            data: addresses,
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { addressId } = addressIdParamsSchema.parse(req.params);

        const address = await getUserAddressById(userId, addressId);

        res.status(200).json({
            success: true,
            data: address,
        });
    } catch (error) {
        next(error);
    }
};

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const input = createAddressSchema.parse(req.body);

        const address = await createAddress(userId, input);

        res.status(201).json({
            success: true,
            data: address,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { addressId } = addressIdParamsSchema.parse(req.params);

        const input = updateAddressSchema.parse(req.body);

        const address = await updateAddress(userId, addressId, input);

        res.status(200).json({
            success: true,
            data: address,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { addressId } = addressIdParamsSchema.parse(req.params);

        await deleteAddress(userId, addressId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
