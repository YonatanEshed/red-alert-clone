import { Request, Response } from 'express';

import { getCache } from '../libs/cache';

const getLiveAlert = (req: Request, res: Response) => {
    const alert = getCache('liveAlerts');

    if (alert) {
        return res.json(alert);
    }

    res.json({});
};

export default getLiveAlert;
