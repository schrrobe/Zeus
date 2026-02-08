import { Request, Response } from 'express';
import { listItems, getItem, createItem, updateItem, deleteItem } from '../services/itemService';
import { HttpError } from '../utils/httpError';

export const list = async (req: Request, res: Response) => {
  const items = await listItems(req.user!.orgId);
  res.json({ items });
};

export const detail = async (req: Request, res: Response) => {
  const item = await getItem(req.user!.orgId, req.params.id);
  if (!item) {
    throw new HttpError(404, 'Item not found');
  }
  res.json({ item });
};

export const create = async (req: Request, res: Response) => {
  const item = await createItem(req.user!.orgId, req.body);
  res.status(201).json({ item });
};

export const update = async (req: Request, res: Response) => {
  const existing = await getItem(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Item not found');
  }
  const item = await updateItem(req.user!.orgId, req.params.id, req.body);
  res.json({ item });
};

export const remove = async (req: Request, res: Response) => {
  const existing = await getItem(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Item not found');
  }
  await deleteItem(req.user!.orgId, req.params.id);
  res.status(204).send();
};
