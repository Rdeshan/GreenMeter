import { Router } from 'express';
import { energyController } from '../controllers/energyCost.controller';

const router = Router();

router.get('/energy-cost/summary/weekly', energyController.getWeeklySummary);
router.get('/energy-cost/summary/monthly', energyController.getMonthlySummary);
router.get('/energy-cost', energyController.getAll);
router.get('/energy-cost/:id', energyController.getById);
router.post('/energy-cost', energyController.create);
router.put('/energy-cost/:id', energyController.update);
router.delete('/energy-cost/:id', energyController.delete);


export default router;
