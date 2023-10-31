import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import locations from '../public/locations.json';
import areas from '../public/areas.json';

const router = Router();
const prisma = new PrismaClient();

// get all cities
router.get('/city', async (req, res) => {
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
});

router.get('/area', async (req, res) => {
    console.log(locations[299]);
    const areas = await prisma.area.findMany();

    res.json(areas);
});

// get all cities in an area
router.get('/city/:areaId', async (req, res) => {
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
});

export default router;
