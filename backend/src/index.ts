import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleRoutes from './routes/vehicleRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', vehicleRoutes);
app.use('/api', authRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
