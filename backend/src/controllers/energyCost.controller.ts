import { Request, Response } from 'express';
import { EnergyCost } from '../models/energyCost.model';

// Real-world pricing data (Sri Lanka - LKR)
const PRICING = {
    electricity: {
        // Tiered pricing per kWh (CEB rates)
        domestic: [
            { limit: 30, rate: 7.85 },      // 0-30 units
            { limit: 60, rate: 10.00 },     // 31-60 units
            { limit: 90, rate: 27.75 },     // 61-90 units
            { limit: 120, rate: 32.00 },    // 91-120 units
            { limit: 180, rate: 45.00 },    // 121-180 units
            { limit: Infinity, rate: 50.00 } // 181+ units
        ],
        // Flat rate option (average)
        flat: 35.00
    },
    gas: {
        petrol: {
            petrol92: 395.00,    // per liter (Octane 92)
            petrol95: 485.00     // per liter (Octane 95)
        },
        diesel: 380.00,          // per liter
        kerosene: 190.00,        // per liter
        lpg: {
            '12.5kg': 4850.00,   // Litro Gas cylinder
            '5kg': 1940.00,      // Small cylinder
            '2.3kg': 893.00      // Portable cylinder
        }
    },
    solar: {
        // Solar savings calculation
        exportRate: 22.00,       // per kWh exported to grid
        selfConsumptionSaving: 35.00 // average saving per kWh self-consumed
    },
    water: {
        perCubicMeter: 45.00     // NWSDB average rate
    }
};

class EnergyController {
    
    // Calculate electricity cost based on tiered pricing
    private static calculateElectricityCost(kWh: number, useTiered: boolean = true): number {
        if (!useTiered) {
            return kWh * PRICING.electricity.flat;
        }

        let cost = 0;
        let remainingUnits = kWh;
        let previousLimit = 0;

        for (const tier of PRICING.electricity.domestic) {
            if (remainingUnits <= 0) break;

            const tierUnits = Math.min(
                remainingUnits,
                tier.limit - previousLimit
            );

            cost += tierUnits * tier.rate;
            remainingUnits -= tierUnits;
            previousLimit = tier.limit;
        }

        return cost;
    }

    // Main cost calculation method
    private static calculateCost(data: any): number {
        switch (data.type) {
            case 'electricity':
                if (data.watts && data.hoursPerDay) {
                    const watts = Number(data.watts);
                    const hours = Number(data.hoursPerDay);
                    
                    if (isNaN(watts) || isNaN(hours) || watts <= 0 || hours <= 0) {
                        return 0;
                    }
                    
                    const dailyKWh = (watts * hours) / 1000;
                    const monthlyKWh = dailyKWh * 30; // Monthly consumption
                    
                    // Use tiered pricing by default
                    return this.calculateElectricityCost(
                        monthlyKWh, 
                        data.useTieredPricing !== false
                    );
                } else if (data.monthlyKWh) {
                    const monthlyKWh = Number(data.monthlyKWh);
                    if (isNaN(monthlyKWh) || monthlyKWh <= 0) {
                        return 0;
                    }
                    // Direct monthly kWh input
                    return this.calculateElectricityCost(
                        monthlyKWh,
                        data.useTieredPricing !== false
                    );
                }
                return 0;

            case 'gas':
                if (data.fuelType === 'lpg' && data.tankSize) {
                    // LPG cylinder cost
                    const cylinderCost = PRICING.gas.lpg[data.tankSize as keyof typeof PRICING.gas.lpg] || 0;
                    const quantity = Number(data.quantity) || 1;
                    
                    if (isNaN(quantity) || quantity <= 0) {
                        return cylinderCost;
                    }
                    return cylinderCost * quantity;
                    
                } else if (data.fuelType === 'petrol' && data.liters) {
                    const liters = Number(data.liters);
                    if (isNaN(liters) || liters <= 0) {
                        return 0;
                    }
                    // Petrol cost (default to Octane 92)
                    const petrolType = data.petrolType || 'petrol92';
                    const pricePerLiter = PRICING.gas.petrol[petrolType as keyof typeof PRICING.gas.petrol];
                    return liters * pricePerLiter;
                    
                } else if (data.liters && data.fuelType !== 'lpg' && data.fuelType !== 'petrol') {
                    const liters = Number(data.liters);
                    if (isNaN(liters) || liters <= 0) {
                        return 0;
                    }
                    // Diesel or Kerosene
                    const pricePerLiter = PRICING.gas[data.fuelType as keyof typeof PRICING.gas] as number;
                    if (!pricePerLiter) {
                        return 0;
                    }
                    return liters * pricePerLiter;
                }
                return 0;

            case 'solar':
                // Solar can be savings (negative cost) or installation cost
                if (data.kWhGenerated) {
                    const kWhGenerated = Number(data.kWhGenerated);
                    if (isNaN(kWhGenerated) || kWhGenerated <= 0) {
                        return 0;
                    }
                    
                    const selfConsumed = data.kWhSelfConsumed 
                        ? Number(data.kWhSelfConsumed) 
                        : kWhGenerated * 0.7;
                    const exported = kWhGenerated - selfConsumed;
                    
                    const savings = (selfConsumed * PRICING.solar.selfConsumptionSaving) +
                                  (exported * PRICING.solar.exportRate);
                    
                    return -savings; // Negative because it's a saving
                } else if (data.solarSavings) {
                    const savings = Number(data.solarSavings);
                    if (isNaN(savings) || savings <= 0) {
                        return 0;
                    }
                    return -savings;
                }
                return 0;

            case 'water':
                if (data.cubicMeters) {
                    const cubicMeters = Number(data.cubicMeters);
                    if (isNaN(cubicMeters) || cubicMeters <= 0) {
                        return 0;
                    }
                    return cubicMeters * PRICING.water.perCubicMeter;
                }
                return 0;
                
            default:
                return 0;
        }
    }

    // Helper method to provide cost breakdown
    private static getCostBreakdown(type: string, data: any, totalCost: number) {
        const breakdown: any = {
            type,
            totalCost: `LKR ${totalCost.toFixed(2)}`
        };

        switch (type) {
            case 'electricity':
                if (data.watts && data.hoursPerDay) {
                    const dailyKWh = (data.watts * data.hoursPerDay) / 1000;
                    const monthlyKWh = dailyKWh * 30;
                    breakdown.dailyConsumption = `${dailyKWh.toFixed(2)} kWh`;
                    breakdown.monthlyConsumption = `${monthlyKWh.toFixed(2)} kWh`;
                    breakdown.estimatedMonthlyCost = `LKR ${totalCost.toFixed(2)}`;
                }
                break;
            case 'gas':
                if (data.fuelType === 'lpg') {
                    breakdown.item = `${data.tankSize} LPG Cylinder`;
                    breakdown.quantity = data.quantity || 1;
                    breakdown.unitPrice = `LKR ${(totalCost / (data.quantity || 1)).toFixed(2)}`;
                } else {
                    breakdown.fuelType = data.fuelType;
                    breakdown.liters = data.liters;
                    breakdown.pricePerLiter = `LKR ${(totalCost / data.liters).toFixed(2)}`;
                }
                break;
            case 'solar':
                breakdown.savings = `LKR ${Math.abs(totalCost).toFixed(2)}`;
                breakdown.kWhGenerated = data.kWhGenerated;
                break;
        }

        return breakdown;
    }

    // CREATE - Add new energy cost entry
    async create(req: Request, res: Response) {
        try {
            const { userId, type, ...otherData } = req.body;

            // Validate required fields based on type
            if (type === 'electricity') {
                if (!otherData.watts || !otherData.hoursPerDay) {
                    return res.status(400).json({
                        success: false,
                        message: 'Electricity requires watts and hoursPerDay fields'
                    });
                }
            } else if (type === 'gas') {
                if (otherData.fuelType === 'lpg' && !otherData.tankSize) {
                    return res.status(400).json({
                        success: false,
                        message: 'LPG requires tankSize field'
                    });
                }
                if (otherData.fuelType !== 'lpg' && !otherData.liters) {
                    return res.status(400).json({
                        success: false,
                        message: `${otherData.fuelType} requires liters field`
                    });
                }
            } else if (type === 'solar') {
                if (!otherData.solarSavings && !otherData.kWhGenerated) {
                    return res.status(400).json({
                        success: false,
                        message: 'Solar requires solarSavings or kWhGenerated field'
                    });
                }
            }

            // Calculate the total cost based on input
            const totalCost = EnergyController.calculateCost({ type, ...otherData });

            // Check if calculation resulted in NaN or invalid number
            if (isNaN(totalCost) || !isFinite(totalCost)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid calculation - please check your input values'
                });
            }

            // Calculate additional metrics
            let dailyKWh, monthlyKWh;
            if (type === 'electricity') {
                if (otherData.watts && otherData.hoursPerDay) {
                    dailyKWh = (otherData.watts * otherData.hoursPerDay) / 1000;
                    monthlyKWh = dailyKWh * 30;
                } else if (otherData.monthlyKWh) {
                    monthlyKWh = otherData.monthlyKWh;
                    dailyKWh = monthlyKWh / 30;
                }
            }

            const energyCost = new EnergyCost({
                userId,
                type,
                totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimals
                dailyKWh,
                monthlyKWh,
                ...otherData
            });

            const savedCost = await energyCost.save();
            
            res.status(201).json({
                success: true,
                data: savedCost,
                message: `Energy cost added successfully. Total: LKR ${totalCost.toFixed(2)}`,
                breakdown: EnergyController.getCostBreakdown(type, otherData, totalCost)
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

            // Calculate totals
            const totalCost = costs.reduce((sum, cost) => sum + cost.totalCost, 0);

            res.status(200).json({
                success: true,
                data: costs,
                count: costs.length,
                totalCost: `LKR ${totalCost.toFixed(2)}`
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
            const costFields = ['type', 'watts', 'hoursPerDay', 'monthlyKWh', 'liters', 
                              'tankSize', 'quantity', 'fuelType', 'petrolType', 
                              'solarSavings', 'kWhGenerated', 'cubicMeters'];
            
            const shouldRecalculate = costFields.some(field => field in updateData);

            if (shouldRecalculate) {
                const existingCost = await EnergyCost.findById(id);
                if (existingCost) {
                    const mergedData = { ...existingCost.toObject(), ...updateData };
                    updateData.totalCost = EnergyController.calculateCost(mergedData);
                    updateData.totalCost = Math.round(updateData.totalCost * 100) / 100;

                    // Recalculate kWh metrics if electricity
                    if (mergedData.type === 'electricity') {
                        if (mergedData.watts && mergedData.hoursPerDay) {
                            updateData.dailyKWh = (mergedData.watts * mergedData.hoursPerDay) / 1000;
                            updateData.monthlyKWh = updateData.dailyKWh * 30;
                        } else if (mergedData.monthlyKWh) {
                            updateData.monthlyKWh = mergedData.monthlyKWh;
                            updateData.dailyKWh = mergedData.monthlyKWh / 30;
                        }
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
                    totalCost: `LKR ${weeklyTotal.toFixed(2)}`
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
                    totalCost: `LKR ${monthlyTotal.toFixed(2)}`
                }
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET PRICING INFO - For reference
    async getPricingInfo(req: Request, res: Response) {
        try {
            res.status(200).json({
                success: true,
                data: PRICING,
                message: 'Current pricing information',
                note: 'Prices are in LKR and subject to change'
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