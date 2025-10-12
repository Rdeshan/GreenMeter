import { Router } from 'express';
import { energyController } from '../controllers/energyCost.controller';

const router = Router();

// ---------- Report Endpoints ----------
router.get('/energy-cost/reports/daily/:userId', energyController.getDailyReport);
router.get('/energy-cost/reports/weekly/:userId', energyController.getWeeklyReport);
router.get('/energy-cost/reports/monthly/:userId', energyController.getMonthlyReport);

// ---------- Main CRUD Endpoints ----------
router.get('/energy-cost', energyController.getAll);
router.get('/energy-cost/:id', energyController.getById);
router.post('/energy-cost', energyController.create);
router.put('/energy-cost/:id', energyController.update);
router.delete('/energy-cost/:id', energyController.delete);

// ---------- Pricing Info ----------
router.get('/energy-cost/pricing/info', energyController.getPricingInfo);

export default router;