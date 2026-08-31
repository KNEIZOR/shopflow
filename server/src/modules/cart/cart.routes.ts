import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import {
    addItem,
    getCart,
    removeAllItems,
    removeItem,
    updateItem,
} from './cart.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getCart);

router.post('/items', addItem);

router.patch('/items/:itemId', updateItem);

router.delete('/items/:itemId', removeItem);

router.delete('/items', removeAllItems);

export default router;
