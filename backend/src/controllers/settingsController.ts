import { Request, Response } from 'express';
import { getInvoiceNumbering, getQuoteNumbering, updateInvoiceNumbering, updateQuoteNumbering } from '../services/settingsService';

export const getInvoiceNumberingSetting = async (req: Request, res: Response) => {
  const setting = await getInvoiceNumbering(req.user!.orgId);
  res.json({ setting });
};

export const getQuoteNumberingSetting = async (req: Request, res: Response) => {
  const setting = await getQuoteNumbering(req.user!.orgId);
  res.json({ setting });
};

export const updateInvoiceNumberingSetting = async (req: Request, res: Response) => {
  const setting = await updateInvoiceNumbering(req.user!.orgId, req.body);
  res.json({ setting });
};

export const updateQuoteNumberingSetting = async (req: Request, res: Response) => {
  const setting = await updateQuoteNumbering(req.user!.orgId, req.body);
  res.json({ setting });
};
