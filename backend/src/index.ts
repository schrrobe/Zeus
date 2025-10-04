import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'], credentials: true }));
app.use(express.json());

registerRoutes(app);
app.use(errorHandler);

const port = process.env.PORT ?? 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Zeus backend listening on port ${port}`);
  });
}

export default app;
