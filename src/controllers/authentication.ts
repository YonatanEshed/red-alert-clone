import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

const ADMIN_TOKEN_EXPIRATION_HOURS = 2;
const AUTH_TOKEN_EXPIRATION_HOURS = 24;
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET TOKEN';

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

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const hashedPassword = createHash('sha256').update(password).digest('hex');

    const dbAdmin = await prisma.admin.findUnique({ where: { username } });

    if (!dbAdmin || !dbAdmin.active || dbAdmin.password !== hashedPassword) {
        return res.status(401).json({ error: 'wrong username or password' });
    }

    try {
        const expiration = new Date(
            new Date().getTime() + AUTH_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
        );

        const authToken = await prisma.authToken.create({
            data: {
                expiration,
                admin: {
                    connect: { username },
                },
            },
        });

        let tokenId = authToken.id;
        const token = jwt.sign({ tokenId }, JWT_SECRET, {
            algorithm: 'HS256',
            noTimestamp: true,
        });

        res.json({ token });
    } catch (e) {
        console.log(e);
        res.status(424).json({ error: 'failed to login' });
    }
};

export default {
    generateAdminToken,
    register,
    login,
    activateAdmin,
};
