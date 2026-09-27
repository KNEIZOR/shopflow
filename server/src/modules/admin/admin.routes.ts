import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';

import { getDashboard } from './admin.controller';

import {
    getOrderById,
    getOrders,
    updateOrderStatus,
} from './admin-order.controller';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/dashboard', getDashboard);

router.get('/orders', getOrders);

router.get('/orders/:orderId', getOrderById);

router.patch('/orders/:orderId/status', updateOrderStatus);

export default router;
