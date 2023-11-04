import { Router } from 'express';

import locationController from '../controllers/locations';

const router = Router();

router.get('/city', locationController.getAllCities);
router.get('/city/:areaId', locationController.getCitiesByArea);
router.get('/area', locationController.getAllAreas);

// TODO add auth middleware
router.post('/city', locationController.createCity);
router.put('/city/:id', locationController.updateCity);
router.delete('/city', locationController.deleteCity);

router.post('/area', locationController.createArea);
router.put('/area/:id', locationController.updateArea);
router.delete('/area', locationController.deleteArea);

export default router;
