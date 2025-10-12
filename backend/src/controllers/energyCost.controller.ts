import { Request, Response } from 'express';
import { EnergyCost } from '../models/energyCost.model';
import Device from '../models/Device';

const PRICING = {
    electricity: {
        domestic: [
            { limit: 30, rate: 7.85 },
            { limit: 60, rate: 10.00 },
            { limit: 90, rate: 27.75 },
            { limit: 120, rate: 32.00 },
            { limit: 180, rate: 45.00 },
            { limit: Infinity, rate: 50.00 }
        ],
        flat: 35.00
    },
    gas: {
        petrol: { petrol92: 299.00, petrol95: 356.00 },
        diesel: 320.00,
        kerosene: 180.00,
        lpg: { '12.5kg': 4850.00, '5kg': 1940.00, '2.5kg': 893.00 }
    },
    solar: {
        exportRate: 22.00,
        selfConsumptionSaving: 35.00
    }
};

class EnergyController {

    // ---------- Helper: Tiered Electricity Cost ----------
    private static calculateElectricityCost(kWh: number, useTiered = true): number {
        if (!useTiered) return kWh * PRICING.electricity.flat;

        let cost = 0, remainingUnits = kWh, previousLimit = 0;
        for (const tier of PRICING.electricity.domestic) {
            if (remainingUnits <= 0) break;
            const tierUnits = Math.min(remainingUnits, tier.limit - previousLimit);
            cost += tierUnits * tier.rate;
            remainingUnits -= tierUnits;
            previousLimit = tier.limit;
        }
        return cost;
    }

    // ---------- Helper: Universal Cost Calculator ----------
    private static calculateCost(data: any): number {
        switch (data.type) {
            case 'electricity':
                if (data.watts && data.hoursPerDay) {
                    const dailyKWh = (data.watts * data.hoursPerDay) / 1000;
                    const monthlyKWh = dailyKWh * 30;
                    return this.calculateElectricityCost(monthlyKWh);
                } else if (data.monthlyKWh) {
                    return this.calculateElectricityCost(data.monthlyKWh);
                }
                return 0;

            case 'gas':
                if (data.fuelType === 'lpg' && data.tankSize) {
                    const tankKey = data.tankSize as keyof typeof PRICING.gas.lpg;
                    const cylinderCost = PRICING.gas.lpg[tankKey] ?? 0;
                    const quantity = Number(data.quantity) || 1;
                    return cylinderCost * quantity;

                } else if (data.fuelType === 'petrol' && data.liters) {
                    const petrolKey = (data.petrolType || 'petrol92') as keyof typeof PRICING.gas.petrol;
                    const price = PRICING.gas.petrol[petrolKey];
                    return data.liters * price;

                } else if (data.liters && data.fuelType in PRICING.gas) {
                    const fuelKey = data.fuelType as keyof typeof PRICING.gas;
                    const price = PRICING.gas[fuelKey] as number;
                    return data.liters * price;
                }
                return 0;

            case 'solar':
                if (data.kWhGenerated) {
                    const selfConsumed = data.kWhSelfConsumed || data.kWhGenerated * 0.7;
                    const exported = data.kWhGenerated - selfConsumed;
                    const savings = (selfConsumed * PRICING.solar.selfConsumptionSaving) +
                                    (exported * PRICING.solar.exportRate);
                    return -savings;
                } else if (data.solarSavings) {
                    return -Number(data.solarSavings);
                }
                return 0;

            default:
                return 0;
        }
    }

    // ---------- Create ----------
    async create(req: Request, res: Response) {
        try {
            const { userId, type, deviceId, ...otherData } = req.body;

            let watts: number | undefined;
            if (deviceId) {
                const device = await Device.findById(deviceId);
                if (!device) {
                    return res.status(404).json({ success: false, message: 'Device not found' });
                }
                watts = device.consumption || 0; // Auto-get watts from Device model
            }

            const totalCost = EnergyController.calculateCost({ type, watts, ...otherData });
            if (isNaN(totalCost)) {
                return res.status(400).json({ success: false, message: 'Invalid cost calculation' });
            }

            let dailyKWh, monthlyKWh;
            if (type === 'electricity' && watts && otherData.hoursPerDay) {
                dailyKWh = (watts * otherData.hoursPerDay) / 1000;
                monthlyKWh = dailyKWh * 30;
            }

            const newEnergyCost = new EnergyCost({
                userId,
                type,
                deviceId,
                watts,
                totalCost: Math.round(totalCost * 100) / 100,
                dailyKWh,
                monthlyKWh,
                ...otherData
            });

            const saved = await newEnergyCost.save();
            res.status(201).json({
                success: true,
                message: 'Energy cost created successfully',
                data: saved
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ---------- Get All ----------
    async getAll(req: Request, res: Response) {
        try {
            const { userId } = req.query;
            const filter: any = {};
            if (userId) filter.userId = userId;

            const costs = await EnergyCost.find(filter)
                .populate('deviceId', 'device_name type location state watts')
                .sort({ date: -1 });

            const total = costs.reduce((sum, c) => sum + c.totalCost, 0);

            res.status(200).json({
                success: true,
                count: costs.length,
                totalCost: `LKR ${total.toFixed(2)}`,
                data: costs
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ---------- Get by ID ----------
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cost = await EnergyCost.findById(id)
                .populate('deviceId', 'device_name type location state watts');

            if (!cost) {
                return res.status(404).json({ success: false, message: 'Energy cost not found' });
            }

            res.status(200).json({ success: true, data: cost });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ---------- Update ----------
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            let watts: number | undefined;
            if (updateData.deviceId) {
                const device = await Device.findById(updateData.deviceId);
                if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
                watts = device.consumption;
                updateData.watts = watts;
            }

            const existing = await EnergyCost.findById(id);
            if (!existing) return res.status(404).json({ success: false, message: 'Energy cost not found' });

            const mergedData = { ...existing.toObject(), ...updateData };
            updateData.totalCost = EnergyController.calculateCost(mergedData);
            updateData.totalCost = Math.round(updateData.totalCost * 100) / 100;

            if (mergedData.type === 'electricity' && mergedData.watts && mergedData.hoursPerDay) {
                updateData.dailyKWh = (mergedData.watts * mergedData.hoursPerDay) / 1000;
                updateData.monthlyKWh = updateData.dailyKWh * 30;
            }

            const updated = await EnergyCost.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            }).populate('deviceId', 'device_name type location state watts');

            res.status(200).json({
                success: true,
                message: 'Energy cost updated successfully',
                data: updated
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ---------- Delete ----------
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await EnergyCost.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Energy cost not found' });
            }
            res.status(200).json({ success: true, message: 'Energy cost deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ---------- Pricing Info ----------
    async getPricingInfo(req: Request, res: Response) {
        try {
            res.status(200).json({
                success: true,
                data: PRICING,
                message: 'Current pricing information (LKR)'
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ---------- Reports ----------
    private getDateRange(period: "daily" | "weekly" | "monthly") {
        const now = new Date();
        let start: Date, end: Date;

        switch (period) {
            case "daily":
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                end = new Date(start);
                end.setDate(end.getDate() + 1);
                break;
            case "weekly":
                const first = now.getDate() - now.getDay();
                start = new Date(now.getFullYear(), now.getMonth(), first);
                end = new Date(start);
                end.setDate(end.getDate() + 7);
                break;
            case "monthly":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
        }
        return { start, end };
    }

    private async generateReport(req: Request, res: Response, period: "daily" | "weekly" | "monthly") {
        try {
            const { userId } = req.query;
            const { start, end } = this.getDateRange(period);

            const report = await EnergyCost.aggregate([
                { $match: { userId, date: { $gte: start, $lt: end } } },
                { $group: { _id: "$type", totalCost: { $sum: "$totalCost" } } },
            ]);

            res.status(200).json({
                success: true,
                period,
                dateRange: { start, end },
                report
            });
        } catch {
            res.status(500).json({ success: false, message: `Failed to generate ${period} report` });
        }
    }

    async getDailyReport(req: Request, res: Response) {
        await this.generateReport(req, res, 'daily');
    }
    async getWeeklyReport(req: Request, res: Response) {
        await this.generateReport(req, res, 'weekly');
    }
    async getMonthlyReport(req: Request, res: Response) {
        await this.generateReport(req, res, 'monthly');
    }
}

export const energyController = new EnergyController();