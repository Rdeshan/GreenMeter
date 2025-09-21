import { Router } from 'express';
import {
  addCost,
  getCostRecords,
  updateCostRecord,
  deleteCostRecord,
  getSummary
} from '../controllers/energyCost.controller';

const router = Router();

router.post('/', addCost);
router.get('/', getCostRecords);
router.put('/:id', updateCostRecord);
router.delete('/:id', deleteCostRecord);
router.get('/insights/summary', getSummary);

export default router;