import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const perPageOptions = [10, 25, 50];
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(express.json());

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

const parsePage = (value: unknown) => {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
};

const parsePerPage = (value: unknown) => {
  const perPage = Number(value);
  if (Number.isFinite(perPage) && perPageOptions.includes(perPage)) {
    return perPage;
  }
  return perPageOptions[0];
};

const buildPaginatedResponse = <T>(
  items: T[],
  total: number,
  page: number,
  perPage: number
): PaginatedResponse<T> => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  return {
    data: items,
    meta: {
      total,
      page: safePage,
      perPage,
      totalPages
    }
  };
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zeus-backend' });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Zeus API (Express)',
    features: [
      'Postgres + Prisma with UUIDs',
      'Multi-tenant invoicing',
      'Role-based permissions'
    ]
  });
});

app.get('/api/products', async (req, res) => {
  const perPage = parsePerPage(req.query.perPage);
  const requestedPage = parsePage(req.query.page);
  const total = await prisma.product.count();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(requestedPage, totalPages);
  const data = await prisma.product.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    include: { taxRate: true }
  });
  res.json(buildPaginatedResponse(data, total, page, perPage));
});

app.get('/api/customers', async (req, res) => {
  const perPage = parsePerPage(req.query.perPage);
  const requestedPage = parsePage(req.query.page);
  const total = await prisma.customer.count();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(requestedPage, totalPages);
  const data = await prisma.customer.findMany({
    skip: (page - 1) * perPage,
    take: perPage
  });
  res.json(buildPaginatedResponse(data, total, page, perPage));
});

app.get('/api/customers/:id', async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: {
      invoices: { orderBy: { issuedAt: 'desc' } },
      notes: { orderBy: { createdAt: 'desc' }, include: { author: true } }
    }
  });

  if (!customer) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }

  res.json(customer);
});

app.get('/api/users', async (req, res) => {
  const perPage = parsePerPage(req.query.perPage);
  const requestedPage = parsePage(req.query.page);
  const total = await prisma.user.count();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(requestedPage, totalPages);
  const data = await prisma.user.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    include: { memberships: { include: { organization: true } } }
  });
  res.json(buildPaginatedResponse(data, total, page, perPage));
});

app.get('/api/invoices', async (req, res) => {
  const perPage = parsePerPage(req.query.perPage);
  const requestedPage = parsePage(req.query.page);
  const total = await prisma.invoice.count();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(requestedPage, totalPages);
  const data = await prisma.invoice.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    include: { customer: true, taxRate: true }
  });
  res.json(buildPaginatedResponse(data, total, page, perPage));
});

app.get('/api/admin/organizations', async (req, res) => {
  const perPage = parsePerPage(req.query.perPage);
  const requestedPage = parsePage(req.query.page);
  const total = await prisma.organization.count();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(requestedPage, totalPages);
  const data = await prisma.organization.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    include: { users: { include: { user: true } }, invoices: true }
  });
  res.json(buildPaginatedResponse(data, total, page, perPage));
});

app.listen(port, () => {
  console.log(`Zeus backend listening on ${port}`);
});
