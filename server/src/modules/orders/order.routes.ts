import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import { create, getAll, getById } from './order.controller';

const router = Router();

router.use(requireAuth);

router.post('/', create);

router.get('/', getAll);

router.get('/:orderId', getById);

export default router;
