import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { initDb } from './database';

export default async function bootstrap() {
  dotenv.config();

  await initDb();

  const app = express();

  // middlewares
  app.use(express.json());

  // routes
  app.use(routes);

  return app;
}
