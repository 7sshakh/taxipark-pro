import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes';
import { initTelegramBot } from './bot';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (_req, res) => {
  res.send({ message: 'TaxiPark Pro backend is running' });
});

app.listen(port, () => {
  console.log(`TaxiPark backend listening on http://localhost:${port}`);
  initTelegramBot();
});
