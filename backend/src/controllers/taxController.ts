import { Request, Response } from 'express';
import { listTaxes, createTax, updateTax, deleteTax, getTax } from '../services/taxService';
import { HttpError } from '../utils/httpError';

export const list = async (req: Request, res: Response) => {
  const taxes = await listTaxes(req.user!.orgId);
  res.json({ taxes });
};

export const create = async (req: Request, res: Response) => {
  const tax = await createTax(req.user!.orgId, req.body);
  res.status(201).json({ tax });
};

export const update = async (req: Request, res: Response) => {
  const existing = await getTax(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Tax rate not found');
  }
  const tax = await updateTax(req.user!.orgId, req.params.id, req.body);
  res.json({ tax });
};

export const remove = async (req: Request, res: Response) => {
  const existing = await getTax(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Tax rate not found');
  }
  await deleteTax(req.user!.orgId, req.params.id);
  res.status(204).send();
};
