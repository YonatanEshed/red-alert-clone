import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get all alerts.
const getAllAlerts = async (req: Request, res: Response) => {
    const alerts = await prisma.alert.findMany({});

    res.json(alerts);
};

// get specific alert
const getAlertById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const alert = prisma.alert.findUnique({
        where: {
            id: Number(id),
        },
    });

    res.json(alert);
};

// get all alerts in a time frame
// dateFormat: YYYY-MM-DDTHH:MM:SSZ
const getAlertByTimezone = async (req: Request, res: Response) => {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const alerts = await prisma.alert.findMany({
        where: {
            date: {
                lte: endDate,
                gt: startDate,
            },
        },
    });

    res.json(alerts);
};

// get all alerts by type
const getAlertByType = async (req: Request, res: Response) => {
    const { typeId } = req.params;

    const alerts = await prisma.alert.findMany({
        where: {
            typeId: Number(typeId),
        },
    });

    res.json(alerts);
};

// create new alert
const createAlert = async (req: Request, res: Response) => {
    const type = req.body.type;
    const cities = req.body.cities;

    try {
        const alert = await prisma.alert.create({
            data: {
                typeId: type,
            },
        });

        cities.forEach(async (cityId: number) => {
            const alertLocation = await prisma.alertLocations.create({
                data: {
                    alertId: alert.id,
                    cityId,
                },
            });
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'failed to create alert' });
    }

    // TODO create live alert servies
    res.json(alert);
};

export default {
    getAllAlerts,
    getAlertById,
    getAlertByType,
    getAlertByTimezone,
    createAlert,
};
