// routes/consumption.routes.js
import express from 'express';
import * as consumptionController from '../controllers/consumption.controller';
// import { auth } from '../middlewares/auth';

const router = express.Router();

// Create consumption
router.post('/', consumptionController.addConsumptionController);

// Get user consumptions
router.get('/', consumptionController.getAllConsumptionsController);

// Get single consumption
router.get('/:id', consumptionController.getConsumptionByIdController);

// Update consumption
router.put('/:id', consumptionController.editConsumptionController);

// Delete consumption
router.delete('/:id', consumptionController.deleteConsumptionController);

export default router;
