import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

import apiRoutes from './routes/api';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for development to prevent blocking dev tools
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Welcome to ProHero API', 
    docs: 'Visit /api for available endpoints' 
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Programming Hero Backend is running' });
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };
