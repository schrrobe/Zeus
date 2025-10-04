import type { Request, Response } from 'express';
import { portfolioService } from '../services/portfolioService';

export class PortfolioController {
  async listSnapshots(req: Request, res: Response) {
    const snapshots = await portfolioService.list(req.user!.id);
    res.json(snapshots);
  }

  async refreshSnapshot(req: Request, res: Response) {
    const { id } = req.params;
    await portfolioService.refresh(req.user!.id, id);
    res.status(202).json({ message: 'Aktualisierung ausgelöst' });
  }
}
