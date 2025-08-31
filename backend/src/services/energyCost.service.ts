import EnergyCost, { IEnergyCost } from '../models/energyCost.model';

export const createCost = async (data: Partial<IEnergyCost>) => {
  const cost = await EnergyCost.create(data);
  return cost;
};

export const getCosts = async (userId: string, filters: { deviceName?: string; from?: Date; to?: Date }) => {
  const query: any = { userId };

  if (filters.deviceName) query.deviceName = filters.deviceName;
  if (filters.from || filters.to) query.date = {};
  if (filters.from) query.date.$gte = filters.from;
  if (filters.to) query.date.$lte = filters.to;

  return EnergyCost.find(query).sort({ date: -1 });
};

export const updateCost = async (userId: string, id: string, data: Partial<IEnergyCost>) => {
  return EnergyCost.findOneAndUpdate({ _id: id, userId }, data, { new: true });
};

export const deleteCost = async (userId: string, id: string) => {
  return EnergyCost.findOneAndDelete({ _id: id, userId });
};

// Optional: Summaries for weekly/monthly costs per device
export const getCostSummary = async (userId: string, groupBy: 'day'|'week'|'month', from?: Date, to?: Date) => {
  const match: any = { userId };
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = from;
    if (to) match.date.$lte = to;
  }

  let dateFormat = '%Y-%m-%d';
  if (groupBy === 'week') dateFormat = '%Y-%U'; 
  if (groupBy === 'month') dateFormat = '%Y-%m';

  return EnergyCost.aggregate([
    { $match: match },
    {
      $group: {
        _id: { deviceName: '$deviceName', period: { $dateToString: { format: dateFormat, date: '$date' } } },
        totalCost: { $sum: '$cost' }
      }
    },
    { $sort: { '_id.period': 1 } }
  ]);
};
