import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const perPageOptions = [10, 25, 50];

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

const paginate = <T>(items: T[], page: number, perPage: number): PaginatedResponse<T> => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: {
      total,
      page: safePage,
      perPage,
      totalPages
    }
  };
};

const products = [
  { id: 'prod-1', name: 'Beratung', price: '€ 180', unit: 'Stunde', taxRate: '19%' },
  { id: 'prod-2', name: 'Design-Paket', price: '€ 950', unit: 'Paket', taxRate: '7%' },
  { id: 'prod-3', name: 'Audit', price: '€ 1.200', unit: 'Paket', taxRate: '19%' },
  { id: 'prod-4', name: 'Support', price: '€ 95', unit: 'Stunde', taxRate: '19%' }
];

const customers = [
  { id: 'cust-1', name: 'Muster GmbH', city: 'Hamburg', status: 'Aktiv', revenue: '€ 12.500' },
  { id: 'cust-2', name: 'Nordwind AG', city: 'Berlin', status: 'Aktiv', revenue: '€ 48.300' },
  { id: 'cust-3', name: 'Komet KG', city: 'Leipzig', status: 'Pausiert', revenue: '€ 5.900' }
];

const users = [
  { id: 'user-1', name: 'Lisa Weber', role: 'ORG_LEADER', email: 'lisa@example.com' },
  { id: 'user-2', name: 'Sven Koch', role: 'MEMBER', email: 'sven@example.com' },
  { id: 'user-3', name: 'Nina Roth', role: 'ADMIN', email: 'nina@example.com' }
];

const invoices = [
  {
    id: 'inv-1',
    number: 'RE-2024-120',
    customer: 'Muster GmbH',
    date: '12.09.2024',
    status: 'Offen',
    amount: '€ 1.250'
  },
  {
    id: 'inv-2',
    number: 'GS-2024-013',
    customer: 'Nordwind AG',
    date: '01.09.2024',
    status: 'Bezahlt',
    amount: '-€ 250'
  }
];

const organizations = [
  { id: 'org-1', name: 'Muster GmbH', leader: 'Lisa Weber', plan: 'Free', invoices: 8 },
  { id: 'org-2', name: 'Nordwind AG', leader: 'Sven Koch', plan: 'Paid', invoices: 32 }
];

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

app.get('/api/products', (req, res) => {
  const page = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  res.json(paginate(products, page, perPage));
});

app.get('/api/customers', (req, res) => {
  const page = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  res.json(paginate(customers, page, perPage));
});

app.get('/api/users', (req, res) => {
  const page = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  res.json(paginate(users, page, perPage));
});

app.get('/api/invoices', (req, res) => {
  const page = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  res.json(paginate(invoices, page, perPage));
});

app.get('/api/admin/organizations', (req, res) => {
  const page = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  res.json(paginate(organizations, page, perPage));
});

app.listen(port, () => {
  console.log(`Zeus backend listening on ${port}`);
});
