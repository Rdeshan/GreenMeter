/*import EnergyCost, { IEnergyCost } from '../models/energyCost.model';

// Price tables
const fuelPrices = {
  petrol: 299,
  diesel: 277,
  kerosene: 184
};

const lpgTankPrices = {
  5: 2550,
  8: 4400,
  12.5: 6500
};

const electricityPricePerKWh = 60;

// Calculate cost based on type and inputs
const calculateCost = (data: Partial<IEnergyCost>): number => {
  if (data.type === 'gas') {
    if (data.fuelType === 'lpg' && data.gasTankSize) {
      return lpgTankPrices[data.gasTankSize as 5 | 8 | 12.5] || 0;
    } else if (['petrol', 'diesel', 'kerosene'].includes(data.fuelType || '') && data.liters) {
      return data.liters * fuelPrices[data.fuelType as 'petrol' | 'diesel' | 'kerosene'];
    }
  } else if (data.type === 'electricity' && 
             data.powerRatingWatts && 
             data.usageHoursPerDay) {
    // Convert watts to kilowatts and calculate cost
    return (data.powerRatingWatts * data.usageHoursPerDay * electricityPricePerKWh) / 1000;
  }
  return 0;
};

export const createCost = async (data: Partial<IEnergyCost>) => {
  // Auto calculate cost if method is auto and not solar type
  if (data.costCalculationMethod === 'auto' && data.type !== 'solar') {
    data.cost = calculateCost(data);
  }
  const cost = await EnergyCost.create(data);
  return cost;
};

export const getCosts = async (filters: {
  type?: string;
  fuelType?: string;
  electricDeviceType?: string;
  from?: Date;
  to?: Date;
}) => {
  const query: any = {};

  if (filters.type) query.type = filters.type;
  if (filters.fuelType) query.fuelType = filters.fuelType;
  if (filters.electricDeviceType) query.electricDeviceType = filters.electricDeviceType;
  
  if (filters.from || filters.to) {
    query.date = {};
    if (filters.from) query.date.$gte = filters.from;
    if (filters.to) query.date.$lte = filters.to;
  }

  console.log('Getting costs with query:', JSON.stringify(query, null, 2));
  const costs = await EnergyCost.find(query).sort({ date: -1 });
  console.log(`Found ${costs.length} cost records`);
  return costs;
};

export const updateCost = async (id: string, data: Partial<IEnergyCost>) => {
  // Recalculate cost if method is auto and inputs changed
  if (data.costCalculationMethod === 'auto' && data.type !== 'solar') {
    // Get existing record to merge with updates
    const existing = await EnergyCost.findById(id);
    if (existing) {
      const mergedData = { ...existing.toObject(), ...data };
      data.cost = calculateCost(mergedData);
    }
  }
  
  return EnergyCost.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

export const deleteCost = async (id: string) => {
  return EnergyCost.findByIdAndDelete(id);
};

export const getCostSummary = async () => {
  return EnergyCost.aggregate([
    {
      $group: {
        _id: '$type',
        totalCost: { $sum: '$cost' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        type: '$_id',
        totalCost: 1,
        count: 1,
        _id: 0
      }
    },
    { $sort: { type: 1 } }
  ]);
};
*/