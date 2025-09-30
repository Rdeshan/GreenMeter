import { Request, Response } from 'express';
<<<<<<< Updated upstream
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
=======
import { EnergyCost } from '../models/energyCost.model';

// Sample pricing data
const PRICING = {
    electricity: 0.25, // per kWh
    gas: {
        petrol: 1.50,    // per liter
        diesel: 1.40,    // per liter  
        kerosene: 1.30,  // per liter
        lpg: {
            '12.5kg': 35.00,
            '8kg': 22.00,
            '5kg': 14.00,
            '2.5kg': 7.50
        }
    }
};

class EnergyController {
    
    // Calculate cost based on type and user input
    private static calculateCost(data: any): number {
        switch (data.type) {
            case 'electricity':
                if (data.watts && data.hoursPerDay) {
                    const dailyKWh = (data.watts * data.hoursPerDay) / 1000;
                    return dailyKWh * PRICING.electricity;
                }
                return 0;

            case 'gas':
                if (data.fuelType === 'lpg' && data.tankSize) {
                    return PRICING.gas.lpg[data.tankSize as keyof typeof PRICING.gas.lpg] || 0;
                } else if (data.liters && data.fuelType !== 'lpg') {
                    const pricePerLiter = PRICING.gas[data.fuelType as keyof typeof PRICING.gas] as number;
                    return data.liters * pricePerLiter;
                }
                return 0;

            case 'solar':
                return -(data.solarSavings || 0); 
                
            default:
                return 0;
        }
    }

    // CREATE
    async create(req: Request, res: Response) {
        try {
            const { userId, type, ...otherData } = req.body;

            // Call static method
            const totalCost = EnergyController.calculateCost({ type, ...otherData });

            let dailyKWh;
            if (type === 'electricity' && otherData.watts && otherData.hoursPerDay) {
                dailyKWh = (otherData.watts * otherData.hoursPerDay) / 1000;
            }

            const energyCost = new EnergyCost({
                userId,
                type,
                totalCost,
                dailyKWh,
                ...otherData
            });

            const savedCost = await energyCost.save();
            
            res.status(201).json({
                success: true,
                data: savedCost,
                message: 'Energy cost added successfully'
            });

        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // VIEW ALL
    async getAll(req: Request, res: Response) {
    try {
        const { userId } = req.query;
        const filter: any = {};
        if (userId) {
            filter.userId = userId;
        }

        const costs = await EnergyCost.find(filter).sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: costs,
            count: costs.length
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


    // VIEW BY ID
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cost = await EnergyCost.findById(id);

            if (!cost) {
                return res.status(404).json({
                    success: false,
                    message: 'Energy cost not found'
                });
            }

            res.status(200).json({
                success: true,
                data: cost
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // UPDATE
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Recalculate cost if relevant fields are being updated
            if (updateData.type || updateData.watts || updateData.hoursPerDay || 
                updateData.liters || updateData.tankSize || updateData.solarSavings) {
                
                const existingCost = await EnergyCost.findById(id);
                if (existingCost) {
                    const mergedData = { ...existingCost.toObject(), ...updateData };
                    updateData.totalCost = EnergyController.calculateCost(mergedData);

                    // Recalculate dailyKWh if electricity
                    if (mergedData.type === 'electricity' && mergedData.watts && mergedData.hoursPerDay) {
                        updateData.dailyKWh = (mergedData.watts * mergedData.hoursPerDay) / 1000;
                    }
                }
            }

            const updatedCost = await EnergyCost.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            );

            if (!updatedCost) {
                return res.status(404).json({
                    success: false,
                    message: 'Energy cost not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedCost,
                message: 'Energy cost updated successfully'
            });

        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedCost = await EnergyCost.findByIdAndDelete(id);

            if (!deletedCost) {
                return res.status(404).json({
                    success: false,
                    message: 'Energy cost not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Energy cost deleted successfully'
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET WEEKLY SUMMARY
    async getWeeklySummary(req: Request, res: Response) {
        try {
            const { userId } = req.query;
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const weeklyCosts = await EnergyCost.aggregate([
                {
                    $match: {
                        userId,
                        date: { $gte: startOfWeek, $lte: endOfWeek }
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        totalCost: { $sum: '$totalCost' },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const weeklyTotal = weeklyCosts.reduce((sum, item) => sum + item.totalCost, 0);

            res.status(200).json({
                success: true,
                data: {
                    period: 'weekly',
                    startDate: startOfWeek,
                    endDate: endOfWeek,
                    breakdown: weeklyCosts,
                    totalCost: weeklyTotal
                }
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET MONTHLY SUMMARY
    async getMonthlySummary(req: Request, res: Response) {
        try {
            const { userId } = req.query;
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            endOfMonth.setDate(0);
            endOfMonth.setHours(23, 59, 59, 999);

            const monthlyCosts = await EnergyCost.aggregate([
                {
                    $match: {
                        userId,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        totalCost: { $sum: '$totalCost' },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const monthlyTotal = monthlyCosts.reduce((sum, item) => sum + item.totalCost, 0);

            res.status(200).json({
                success: true,
                data: {
                    period: 'monthly',
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                    breakdown: monthlyCosts,
                    totalCost: monthlyTotal
                }
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export const energyController = new EnergyController();
>>>>>>> Stashed changes
