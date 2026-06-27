import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './infra/routes/auth';
import clubRouter from './infra/routes/club';
import { errorHandlerMiddleware } from './infra/middlewares/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow React Vite frontend
  credentials: true,
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/clubs', clubRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware (MUST be the last one)
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`[API] Server is running on http://localhost:${PORT}`);
});
