// src/routes/goal.routes.ts
import { Router } from 'express';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  generateGoalHandler
} from '../controllers/goal.controller';

const router = Router();

router.post('/', createGoal);
router.get('/', getGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/generate-goal', generateGoalHandler);

export default router;