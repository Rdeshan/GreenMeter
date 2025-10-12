import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import deviceRoutes from './routes/device_route';   
import energyCostRoutes from './routes/energyCost.routes';
import consumptionRoutes from './routes/consumption.routes'
import goalRoutes from './routes/goal.routes'; 




const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/consumptions', consumptionRoutes)
app.use('/api', deviceRoutes);
app.use('/api/costs', energyCostRoutes);
app.use('/api/goals', goalRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Service is healthy ✅',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

export default app;
