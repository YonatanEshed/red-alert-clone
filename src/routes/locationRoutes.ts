import { Router } from 'express';

import authorization from '../middlewares/authentication';
import locationController from '../controllers/locations';

const router = Router();

router.get('/city', locationController.getAllCities);
router.get('/city/:areaId', locationController.getCitiesByArea);
router.get('/area', locationController.getAllAreas);

// Admin restricted
router.post('/city', authorization, locationController.createCity);
router.put('/city/:id', authorization, locationController.updateCity);
router.delete('/city', authorization, locationController.deleteCity);

router.post('/area', authorization, locationController.createArea);
router.put('/area/:id', authorization, locationController.updateArea);
router.delete('/area', authorization, locationController.deleteArea);

export default router;
