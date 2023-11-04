import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllCities = async (req: Request, res: Response) => {
    const cities = await prisma.city.findMany({
        include: {
            area: {
                select: {
                    name: true,
                    nameEn: true,
                    nameAr: true,
                },
            },
        },
    });

    res.json(cities);
};

const getCitiesByArea = async (req: Request, res: Response) => {
    const { areaId } = req.params;
    const cities = await prisma.city.findMany({
        where: {
            areaId: Number(areaId),
        },
        include: {
            area: {
                select: {
                    name: true,
                    nameEn: true,
                    nameAr: true,
                },
            },
        },
    });

    res.json(cities);
};

const createCity = async (req: Request, res: Response) => {
    const { name, nameEn, nameAr, countdown, time, timeEn, timeAr, areaId } =
        req.body;

    try {
        console.log('hello');
        const city = await prisma.city.create({
            data: {
                name,
                nameEn,
                nameAr,
                countdown,
                time,
                timeEn,
                timeAr,
                areaId,
            },
        });
        res.json(city);
    } catch (e) {
        res.status(400).json({ error: 'failed to add new city' });
    }
};

const updateCity = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, nameEn, nameAr, countdown, time, timeEn, timeAr, areaId } =
        req.body;

    try {
        const city = await prisma.city.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                nameEn,
                nameAr,
                countdown,
                time,
                timeEn,
                timeAr,
                areaId,
            },
        });

        res.json(city);
    } catch (e) {
        res.status(400).json({ error: 'failed to update city' });
    }
};

const deleteCity = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.city.delete({
            where: {
                id: Number(id),
            },
        });

        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({ error: 'failed to delete city' });
    }
};

const getAllAreas = async (req: Request, res: Response) => {
    const areas = await prisma.area.findMany();

    res.json(areas);
};

const createArea = async (req: Request, res: Response) => {
    const { name, nameEn, nameAr } = req.body;

    try {
        console.log('hello');
        const area = await prisma.area.create({
            data: {
                name,
                nameEn,
                nameAr,
            },
        });
        res.json(area);
    } catch (e) {
        res.status(400).json({ error: 'failed to add new area' });
    }
};

const updateArea = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, nameEn, nameAr } = req.body;

    try {
        const area = await prisma.area.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                nameEn,
                nameAr,
            },
        });

        res.json(area);
    } catch (e) {
        res.status(400).json({ error: 'failed to update area' });
    }
};

const deleteArea = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.area.delete({
            where: {
                id: Number(id),
            },
        });

        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({ error: 'failed to delete area' });
    }
};

export default {
    getAllCities,
    getCitiesByArea,
    createCity,
    updateCity,
    deleteCity,
    getAllAreas,
    createArea,
    updateArea,
    deleteArea,
};
