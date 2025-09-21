import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import deviceRoutes from './routes/device.routes';
import energyCostRoutes from './routes/energyCost.routes';
import healthRoutes from './routes/energyCost.routes';
import consumptionRoutes from './routes/consumption.routes'
import goalRoutes from './routes/goal.routes';



const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/', deviceRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/costs', energyCostRoutes);
app.use('/api/consumptions', consumptionRoutes);
app.use('/api/goals',goalRoutes );



export default app;
