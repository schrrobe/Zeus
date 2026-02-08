import app from './app';
import logger from './utils/logger';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  logger.info(`Zeus backend listening on ${port}`);
});
