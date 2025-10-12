// routes/consumption.routes.js
import express from 'express';
import * as consumptionController from '../controllers/consumption.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Create consumption
router.post('/', auth, consumptionController.addConsumptionController);

// Get user consumptions
router.get('/', auth, consumptionController.getAllConsumptionsController);

// Get single consumption
router.get('/:id', auth, consumptionController.getConsumptionByIdController);

// Update consumption
router.put('/:id', auth, consumptionController.editConsumptionController);

// Delete consumption
router.delete('/:id', auth, consumptionController.deleteConsumptionController);

export default router;
