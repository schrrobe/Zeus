import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  JWT_SECRET: z.string().min(16).default('change-me-securely'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) => value.split(','))
});

export type AppConfig = ReturnType<typeof loadConfig>;

export function loadConfig() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  return {
    port: parsed.data.PORT,
    stripeSecretKey: parsed.data.STRIPE_SECRET_KEY,
    jwtSecret: parsed.data.JWT_SECRET,
    frontendUrl: parsed.data.FRONTEND_URL,
    corsOrigins: parsed.data.CORS_ORIGINS
  };
}
