import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Zeus backend listening on ${port}`);
});
