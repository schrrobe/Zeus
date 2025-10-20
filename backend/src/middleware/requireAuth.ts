import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Nicht autorisiert' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const secret = process.env.JWT_SECRET ?? 'super-secret-zeus';
    const decoded = jwt.verify(token, secret) as { sub: string };
    const user = await userService.findById(decoded.sub);
    req.user = { id: user.id, role: user.role, tier: user.tier };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ungültiger Token' });
  }
}
