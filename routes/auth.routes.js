import { Router } from 'express';

const router = Router();

import { signup, login } from '../controllers/user.controller.js';

router.post('/signup', signup);
router.post('/login', login);

export default router;