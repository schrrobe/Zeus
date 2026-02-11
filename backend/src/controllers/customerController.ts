import { Request, Response } from 'express';
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerNote
} from '../services/customerService';
import { HttpError } from '../utils/httpError';

export const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(req.query.perPage) || 25));

  const { customers, total } = await listCustomers(req.user!.orgId, page, perPage);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  res.json({
    customers,
    meta: {
      total,
      page,
      perPage,
      totalPages
    }
  });
};

export const detail = async (req: Request, res: Response) => {
  const customer = await getCustomer(req.user!.orgId, req.params.id);
  if (!customer) {
    throw new HttpError(404, 'Customer not found');
  }
  res.json({ customer });
};

export const create = async (req: Request, res: Response) => {
  const customer = await createCustomer(req.user!.orgId, req.body);
  res.status(201).json({ customer });
};

export const update = async (req: Request, res: Response) => {
  const existing = await getCustomer(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Customer not found');
  }
  const customer = await updateCustomer(req.user!.orgId, req.params.id, req.body);
  res.json({ customer });
};

export const remove = async (req: Request, res: Response) => {
  const existing = await getCustomer(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Customer not found');
  }
  await deleteCustomer(req.user!.orgId, req.params.id);
  res.status(204).send();
};

export const addNote = async (req: Request, res: Response) => {
  const existing = await getCustomer(req.user!.orgId, req.params.id);
  if (!existing) {
    throw new HttpError(404, 'Customer not found');
  }
  const note = await addCustomerNote(req.user!.orgId, req.params.id, req.user!.id, req.body.content);
  res.status(201).json({ note });
};
