import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { registerRoutes } from './routes';
import { loadConfig } from './config/env';

const config = loadConfig();

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: config.corsOrigins,
    credentials: true
  });
  await app.register(helmet);
  await app.register(sensible);

  registerRoutes(app);

  return app;
}

async function start() {
  const server = await buildServer();
  try {
    await server.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { buildServer };
