import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { setCache } from '../libs/cache';

const prisma = new PrismaClient();

const ALERT_EXPERETION_TIME_MINUTES = 5;

// get all alerts.
const getAllAlerts = async (req: Request, res: Response) => {
    const alerts = await prisma.alert.findMany({});

    res.json(alerts);
};

// get specific alert
const getAlertById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const alert = await prisma.alert.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            cities: true,
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

        const alertLocationsPromises = cities.map(async (cityId: number) => {
            const alertLocation = await prisma.alertLocations.create({
                data: {
                    alertId: alert.id,
                    cityId,
                },
                include: {
                    alert: false,
                    city: true,
                },
            });

            return alertLocation.city;
        });

        const alertCities = await Promise.all(alertLocationsPromises);

        setCache('liveAlerts', ALERT_EXPERETION_TIME_MINUTES * 60, {
            ...alert,
            cities: alertCities,
        });

        res.json(alert);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: 'failed to create alert' });
    }
};

// const addLocationToAlert = async (req: Request, res: Response) => {
//     const cities = req.body.cities;
// };

export default {
    getAllAlerts,
    getAlertById,
    getAlertByType,
    getAlertByTimezone,
    createAlert,
};
