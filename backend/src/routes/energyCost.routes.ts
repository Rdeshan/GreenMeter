import { Router } from 'express';
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

export default router;
