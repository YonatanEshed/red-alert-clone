import { Router } from 'express';

const router = Router();

// PUBLIC

// get all alerts.
router.get('/', (req, res) => {
    res.sendStatus(200);
});

// get all alerts in a time frame
router.get('/date', (req, res) => {
    const { startDate, endDate } = req.body;
    res.sendStatus(200);
});

// get specific alert
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.sendStatus(200);
});

// PRIVATE

// create new alert
router.post('/', (req, res) => {
    // TODO admins only
    // TODO activates webhook with axios.
    res.sendStatus(200);
});

export default router;
