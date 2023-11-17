import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET TOKEN';

export async function authorization(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const jwtToken = req.headers['authorization']?.split(' ')[1];
    if (!jwtToken) {
        return res.sendStatus(401);
    }

    try {
        const payload = jwt.verify(jwtToken, JWT_SECRET) as {
            tokenId: number;
        };
        const dbToken = await prisma.authToken.findUnique({
            where: { id: payload.tokenId },
            include: { admin: true },
        });

        if (!dbToken || !dbToken.valid || dbToken.expiration >= new Date()) {
            return res.status(401).json({ error: 'invalid auth token' });
        }

        next();
    } catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }
}

export default authorization;
