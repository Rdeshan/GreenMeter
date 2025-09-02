import { Request, Response } from 'express';
import * as energyCostService from '../services/energyCost.service';
import { IEnergyCost } from '../models/energyCost.model';

const validateEnergyRecord = (data: Partial<IEnergyCost>): string | null => {
  if (!data.type || !['gas', 'electricity', 'solar'].includes(data.type)) {
    return 'Valid type (gas/electricity/solar) is required';
  }

  if (!data.date) {
    return 'Date is required';
  }

  if (data.type === 'gas') {
    if (!data.fuelType || !['petrol', 'diesel', 'lpg', 'kerosene'].includes(data.fuelType)) {
      return 'Valid fuel type (petrol/diesel/lpg/kerosene) is required for gas type';
    }
    if (data.fuelType === 'lpg') {
      if (!data.gasTankSize || ![5, 8, 12.5].includes(data.gasTankSize)) {
        return 'Valid gas tank size (5/8/12.5) is required for LPG';
      }
    } else {
      if (!data.liters || data.liters <= 0) {
        return 'Valid liters amount is required for petrol/diesel/kerosene';
      }
    }
  } else if (data.type === 'electricity') {
    if (!data.electricDeviceType) {
      return 'Electric device type is required';
    }
    if (!data.powerRatingWatts || data.powerRatingWatts <= 0) {
      return 'Valid power rating in watts is required';
    }
    if (!data.usageHoursPerDay || data.usageHoursPerDay <= 0) {
      return 'Valid usage hours per day is required';
    }
  } else if (data.type === 'solar') {
    if (data.costCalculationMethod !== 'manual') {
      return 'Solar type only supports manual cost calculation';
    }
    if (!data.cost || data.cost < 0) {
      return 'Valid cost is required for manual calculation';
    }
  }

  return null;
};

export const addCost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const costData = {
      ...req.body,
      userId: req.user._id,
      costCalculationMethod: req.body.type === 'solar' ? 'manual' : (req.body.costCalculationMethod || 'auto')
    };

    const validationError = validateEnergyRecord(costData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const record = await energyCostService.createCost(costData);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCostRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user._id.toString();
    const { type, fuelType, electricDeviceType, from, to } = req.query;

    const records = await energyCostService.getCosts(userId, {
      type: type as string,
      fuelType: fuelType as string,
      electricDeviceType: electricDeviceType as string,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCostRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user._id.toString();
    const { id } = req.params;

    const validationError = validateEnergyRecord({ ...req.body });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updated = await energyCostService.updateCost(userId, id, req.body);
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCostRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user._id.toString();
    const { id } = req.params;

    const deleted = await energyCostService.deleteCost(userId, id);
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user._id.toString();
    
    const summary = await energyCostService.getCostSummary(userId);
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
