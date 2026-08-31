import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import { checkout } from './payments.controller';

const router = Router();

router.use(requireAuth);

router.post('/checkout', checkout);

export default router;
