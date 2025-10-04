import type { Request, Response } from 'express';
import { z } from 'zod';
import { integrationService } from '../services/integrationService';

const walletSchema = z.object({
  address: z.string().min(10),
  network: z.enum(['ethereum', 'solana', 'bitcoin'])
});

const exchangeSchema = z.object({
  exchange: z.enum(['bitvavo', 'coinbase', 'binance', 'bitpanda']),
  apiKey: z.string().min(5),
  apiSecret: z.string().min(10),
  passphrase: z.string().optional()
});

export class IntegrationController {
  async connectWallet(req: Request, res: Response) {
    const payload = walletSchema.parse(req.body);
    const connection = await integrationService.connectWallet(req.user!.id, payload);
    res.status(201).json(connection);
  }

  async connectExchange(req: Request, res: Response) {
    const payload = exchangeSchema.parse(req.body);
    const connection = await integrationService.connectExchange(req.user!.id, payload);
    res.status(201).json(connection);
  }
}
