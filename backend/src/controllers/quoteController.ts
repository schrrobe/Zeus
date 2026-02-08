import { Request, Response } from 'express';
import { listQuotes, getQuote, createQuote, updateQuoteStatus, deleteQuote } from '../services/quoteService';
import { HttpError } from '../utils/httpError';

export const list = async (req: Request, res: Response) => {
  const quotes = await listQuotes(req.user!.orgId);
  res.json({ quotes });
};

export const detail = async (req: Request, res: Response) => {
  const quote = await getQuote(req.user!.orgId, req.params.id);
  if (!quote) {
    throw new HttpError(404, 'Quote not found');
  }
  res.json({ quote });
};

export const create = async (req: Request, res: Response) => {
  const { validUntil, ...payload } = req.body;
  const quote = await createQuote({
    orgId: req.user!.orgId,
    ...payload,
    validUntil: validUntil ? new Date(validUntil) : undefined
  });
  res.status(201).json({ quote });
};

export const updateStatus = async (req: Request, res: Response) => {
  const quote = await updateQuoteStatus(req.user!.orgId, req.params.id, req.body.status);
  res.json({ quote });
};

export const remove = async (req: Request, res: Response) => {
  await deleteQuote(req.user!.orgId, req.params.id);
  res.status(204).send();
};
