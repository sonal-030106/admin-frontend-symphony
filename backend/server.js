import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import fineRoutes from './routes/fineRoutes.js';
import rtoRoutes from './routes/rtoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize database
const startServer = async () => {
  try {
    await connectDB();

    // Routes
    app.use('/api/vehicles', vehicleRoutes);
    app.use('/api/fines', fineRoutes);
    app.use('/api/rtos', rtoRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/auth', authRoutes);

    const PORT = process.env.PORT || 5005;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
