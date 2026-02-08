import { Request, Response } from 'express';
import { getInvoiceNumbering, updateInvoiceNumbering } from '../services/settingsService';

export const getInvoiceNumberingSetting = async (req: Request, res: Response) => {
  const setting = await getInvoiceNumbering(req.user!.orgId);
  res.json({ setting });
};

export const updateInvoiceNumberingSetting = async (req: Request, res: Response) => {
  const setting = await updateInvoiceNumbering(req.user!.orgId, req.body);
  res.json({ setting });
};
