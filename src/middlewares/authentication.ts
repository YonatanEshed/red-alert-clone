import { Request, Response, NextFunction } from 'express';

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    next();
}
