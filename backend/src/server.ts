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

const parseYear = (value: unknown) => {
  const year = Number(value);
  return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : null;
};

const parseMonth = (value: unknown) => {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
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
  const year = parseYear(req.query.year);
  const month = parseMonth(req.query.month);
  const issuedAtFilter = (() => {
    if (!year) {
      return undefined;
    }
    if (month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      return { gte: start, lt: end };
    }
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    return { gte: start, lt: end };
  })();
  const whereClause = issuedAtFilter ? { issuedAt: issuedAtFilter } : undefined;
  const total = await prisma.invoice.count({ where: whereClause });
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(requestedPage, totalPages);
  const data = await prisma.invoice.findMany({
    where: whereClause,
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

app.get('/api/dashboard', async (_req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const totalOrganizations = await prisma.organization.count();
  const [openInvoices, revenueAggregate, paidOrganizations] = await Promise.all([
    prisma.invoice.count({ where: { status: 'OPEN' } }),
    prisma.invoice.aggregate({
      _sum: { totalCents: true },
      where: { status: 'PAID', issuedAt: { gte: startOfMonth } }
    }),
    prisma.invoice.findMany({
      where: { status: 'PAID' },
      distinct: ['organizationId'],
      select: { organizationId: true }
    })
  ]);

  const monthsBack = 5;
  const chartStart = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const invoicesForChart = await prisma.invoice.findMany({
    where: { status: 'PAID', issuedAt: { gte: chartStart } },
    select: { issuedAt: true, totalCents: true }
  });

  const formatter = new Intl.DateTimeFormat('de-DE', { month: 'short' });
  const labels: string[] = [];
  const values: number[] = [];

  for (let i = 0; i <= monthsBack; i += 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + i, 1);
    const label = formatter.format(monthDate);
    labels.push(label);
    values.push(0);
  }

  invoicesForChart.forEach((invoice) => {
    const index =
      (invoice.issuedAt.getFullYear() - chartStart.getFullYear()) * 12 +
      invoice.issuedAt.getMonth() -
      chartStart.getMonth();
    if (index >= 0 && index < values.length) {
      values[index] += invoice.totalCents;
    }
  });

  res.json({
    summary: {
      revenueMonthCents: revenueAggregate._sum.totalCents ?? 0,
      openInvoices,
      payingOrganizations: paidOrganizations.length,
      totalOrganizations
    },
    chart: {
      labels,
      values
    }
  });
});

app.post('/api/organizations/register', async (req, res) => {
  const organizationName = typeof req.body?.organizationName === 'string' ? req.body.organizationName.trim() : '';
  const leaderName = typeof req.body?.leaderName === 'string' ? req.body.leaderName.trim() : '';
  const leaderEmail = typeof req.body?.leaderEmail === 'string' ? req.body.leaderEmail.trim().toLowerCase() : '';

  if (!organizationName || !leaderName || !leaderEmail) {
    res.status(400).json({ message: 'Organization name, leader name, and leader email are required.' });
    return;
  }

  const existingUser = await prisma.user.findUnique({ where: { email: leaderEmail } });
  if (existingUser) {
    res.status(409).json({ message: 'A user with this email already exists.' });
    return;
  }

  const organization = await prisma.organization.create({
    data: {
      name: organizationName,
      users: {
        create: {
          role: 'ORG_LEADER',
          user: {
            create: {
              email: leaderEmail,
              displayName: leaderName
            }
          }
        }
      }
    },
    include: {
      users: { include: { user: true } }
    }
  });

  res.status(201).json({
    organization: {
      id: organization.id,
      name: organization.name,
      createdAt: organization.createdAt,
      plan: organization.plan
    },
    leader: organization.users[0]?.user
  });
});

app.listen(port, () => {
  console.log(`Zeus backend listening on ${port}`);
});
