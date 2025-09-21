import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import consumptionRoutes from './routes/consumption.routes'
import deviceRoutes from './routes/device_route'

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())

// Routes
app.use('/api/consumptions', consumptionRoutes)
app.use('/api', deviceRoutes)

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Service is healthy ✅',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

export default app
