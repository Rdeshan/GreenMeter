import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import energyCostRoutes from './routes/energyCost.routes';
import aiModelRoute from './routes/aiModel.routes';
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api/costs', energyCostRoutes);
app.use('/api/ai', aiModelRoute);

// Routes
app.use('/auth', authRoutes);

export default app;
