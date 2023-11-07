import { Router } from 'express';

import realTimeController from '../controllers/realTimeAlert';
import alertController from '../controllers/alerts';

const router = Router();

router.get('/liveAlert', realTimeController);

router.get('/', alertController.getAllAlerts);
router.get('/date', alertController.getAlertByTimezone);
router.get('/:id', alertController.getAlertById);
router.get('/:typeId', alertController.getAlertByType);

// TODO add auth middleware
router.post('/', alertController.createAlert);

export default router;
