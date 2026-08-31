import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import { getAll, getById, create, update, remove } from './address.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);

router.post('/', create);

router.get('/:addressId', getById);

router.patch('/:addressId', update);

router.delete('/:addressId', remove);

export default router;
