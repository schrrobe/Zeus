import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRateLimiter } from './middlewares/rateLimit';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgRoutes';
import inviteRoutes from './routes/inviteRoutes';
import customerRoutes from './routes/customerRoutes';
import itemRoutes from './routes/itemRoutes';
import taxRoutes from './routes/taxRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import quoteRoutes from './routes/quoteRoutes';
import billingRoutes from './routes/billingRoutes';
import settingsRoutes from './routes/settingsRoutes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(apiRateLimiter);
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.originalUrl === '/api/billing/webhook') {
    next();
    return;
  }
  express.json()(req, res, next);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zeus-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

export default app;
