import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const ADMIN_TOKEN_EXPIRATION_HOURS = 2;

const prisma = new PrismaClient();

function generateToken() {
    return createHash('sha256')
        .update(Math.floor(1000000000 + Math.random() * 9000000000).toString())
        .digest('hex');
}

const generateAdminToken = async (req: Request, res: Response) => {
    const token = generateToken();

    const expiration = new Date(
        new Date().getTime() + ADMIN_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
    );
    try {
        const adminToken = await prisma.adminToken.create({
            data: {
                token: token,
                expiration,
            },
        });

        res.json({ token });
    } catch (e) {
        console.log(e);
        res.status(424).json({ error: 'failed to create adminToken' });
    }
};

const register = async (req: Request, res: Response) => {
    const { username, password, adminToken } = req.body;

    const dbAdminToken = await prisma.adminToken.findUnique({
        where: {
            token: adminToken,
        },
    });
    console.log(!dbAdminToken);
    console.log(!dbAdminToken);
    if (!dbAdminToken || !dbAdminToken.valid) {
        return res.sendStatus(401);
    }

    if (dbAdminToken.expiration < new Date()) {
        return res.sendStatus(498);
    }

    try {
        const hashedPassword = createHash('sha256')
            .update(password)
            .digest('hex');

        const newAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        //
        await prisma.adminToken.update({
            where: { token: adminToken },
            data: { valid: false },
        });

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(424).json({ error: 'failed to create new admin' });
    }
};

const activateAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    try {
        await prisma.admin.update({
            where: { id: Number(id) },
            data: { active: true },
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(424).json({ error: 'failed activating new admin' });
    }
};

export default {
    generateAdminToken,
    register,
    activateAdmin,
};
