import { Router } from 'express';

import authorization from '../middlewares/authentication';
import authConteroller from '../controllers/authentication';

const router = Router();

router.post('/register', authConteroller.register);
router.get('/login', authConteroller.login);

// Admin restricted
router.get('/adminToken', authorization, authConteroller.generateAdminToken);
router.put('/activateAdmin/:id', authorization, authConteroller.activateAdmin);

export default router;
