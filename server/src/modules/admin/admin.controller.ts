import type { NextFunction, Request, Response } from 'express';

import { getAdminDashboard } from './services/admin-dashboard.service';

export const getDashboard = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const dashboard = await getAdminDashboard();

        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};
