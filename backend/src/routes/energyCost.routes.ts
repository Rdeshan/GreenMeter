import { Router } from 'express';
<<<<<<< Updated upstream
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  addCost,
  getCostRecords,
  updateCostRecord,
  deleteCostRecord,
  getSummary
} from '../controllers/energyCost.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', addCost);
router.get('/', getCostRecords);
router.put('/:id', updateCostRecord);
router.delete('/:id', deleteCostRecord);
router.get('/insights/summary', getSummary);
=======
import { energyController } from '../controllers/energyCost.controller';

const router = Router();

router.get('/energy-cost/summary/weekly', energyController.getWeeklySummary);
router.get('/energy-cost/summary/monthly', energyController.getMonthlySummary);
router.get('/energy-cost', energyController.getAll);
router.get('/energy-cost/:id', energyController.getById);
router.post('/energy-cost', energyController.create);
router.put('/energy-cost/:id', energyController.update);
router.delete('/energy-cost/:id', energyController.delete);

>>>>>>> Stashed changes

export default router;
