import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import {
    login,
    logout,
    me,
    register,
    updatePassword,
    updateProfile,
} from './auth.controller';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', requireAuth, me);

router.patch('/profile', requireAuth, updateProfile);

router.patch('/password', requireAuth, updatePassword);

export default router;
