import { Router } from 'express';
import authConteroller from '../controllers/authentication';

const router = Router();

router.post('/register', authConteroller.register);

// TODO add auth middleware
router.get('/adminToken', authConteroller.generateAdminToken);
router.put('/activateAdmin/:id', authConteroller.activateAdmin);

export default router;
