import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import deviceRoutes from './routes/device_route';   
import energyCostRoutes from './routes/energyCost.routes';
import healthRoutes from './routes/energyCost.routes';


const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', deviceRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/costs', energyCostRoutes);


export default app;
