import { Request, Response } from 'express';
import {
  createInvoiceDraft,
  getInvoice,
  listInvoices,
  issueInvoice,
  recordPayment,
  deleteInvoice,
  createInvoiceFromQuote
} from '../services/invoiceService';
import { HttpError } from '../utils/httpError';
import { prisma } from '../lib/prisma';
import { generateInvoicePdf } from '../services/pdfService';
import { generateEInvoice } from '../services/eInvoiceService';
import { saveFileRecord } from '../services/fileService';
import { FileType } from '@prisma/client';

export const list = async (req: Request, res: Response) => {
  const invoices = await listInvoices(req.user!.orgId);
  res.json({ invoices });
};

export const detail = async (req: Request, res: Response) => {
  const invoice = await getInvoice(req.user!.orgId, req.params.id);
  if (!invoice) {
    throw new HttpError(404, 'Invoice not found');
  }
  res.json({ invoice });
};

export const create = async (req: Request, res: Response) => {
  const { dueAt, ...payload } = req.body;
  const invoice = await createInvoiceDraft({
    orgId: req.user!.orgId,
    ...payload,
    dueAt: dueAt ? new Date(dueAt) : undefined
  });
  res.status(201).json({ invoice });
};

export const createFromQuote = async (req: Request, res: Response) => {
  const invoice = await createInvoiceFromQuote({ orgId: req.user!.orgId, quoteId: req.params.quoteId });
  res.status(201).json({ invoice });
};

export const issue = async (req: Request, res: Response) => {
  const invoice = await issueInvoice(req.user!.orgId, req.params.id, req.user!.id);
  res.json({ invoice });
};

export const remove = async (req: Request, res: Response) => {
  const invoice = await getInvoice(req.user!.orgId, req.params.id);
  if (!invoice) {
    throw new HttpError(404, 'Invoice not found');
  }
  await deleteInvoice(req.user!.orgId, req.params.id);
  res.status(204).send();
};

export const payment = async (req: Request, res: Response) => {
  await recordPayment({
    orgId: req.user!.orgId,
    invoiceId: req.params.id,
    amountCents: req.body.amountCents,
    method: req.body.method,
    reference: req.body.reference,
    userId: req.user!.id
  });
  res.status(201).json({ status: 'recorded' });
};

export const sendInvoice = async (_req: Request, res: Response) => {
  res.status(202).json({ status: 'queued' });
};

export const pdf = async (req: Request, res: Response) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, organizationId: req.user!.orgId },
    include: { customer: true }
  });
  if (!invoice || !invoice.customer) {
    throw new HttpError(404, 'Invoice not found');
  }
  const buffer = await generateInvoicePdf(invoice, invoice.customer);
  await saveFileRecord({
    invoiceId: invoice.id,
    type: FileType.PDF,
    buffer,
    filename: `invoice-${invoice.id}.pdf`,
    mimeType: 'application/pdf'
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
  res.send(buffer);
};

export const eInvoice = async (req: Request, res: Response) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, organizationId: req.user!.orgId },
    include: { customer: true }
  });
  if (!invoice || !invoice.customer) {
    throw new HttpError(404, 'Invoice not found');
  }
  const buffer = generateEInvoice(invoice, invoice.customer);
  await saveFileRecord({
    invoiceId: invoice.id,
    type: FileType.E_INVOICE,
    buffer,
    filename: `invoice-${invoice.id}.xml`,
    mimeType: 'application/xml'
  });
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.xml`);
  res.send(buffer);
};
