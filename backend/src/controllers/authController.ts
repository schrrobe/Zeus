import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { userService } from '../services/userService';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(3)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export class AuthController {
  async register(req: Request, res: Response) {
    const payload = registerSchema.parse(req.body);
    const existing = await userService.findByEmail(payload.email);
    if (existing) {
      return res.status(409).json({ message: 'E-Mail bereits registriert.' });
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await userService.create({ ...payload, password: hashedPassword });
    const token = this.generateToken(user.id);
    res.status(201).json({ token, user });
  }

  async login(req: Request, res: Response) {
    const payload = loginSchema.parse(req.body);
    const user = await userService.findByEmail(payload.email);
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten.' });
    }
    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten.' });
    }
    const token = this.generateToken(user.id);
    res.json({ token, user: userService.sanitize(user) });
  }

  async me(req: Request, res: Response) {
    const userId = req.user!.id;
    const user = await userService.findById(userId);
    res.json(userService.sanitize(user));
  }

  private generateToken(userId: string) {
    const secret = process.env.JWT_SECRET ?? 'super-secret-zeus';
    return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
  }
}
