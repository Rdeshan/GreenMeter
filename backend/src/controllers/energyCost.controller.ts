import { Request, Response } from 'express';
import * as energyCostService from '../services/energyCost.service';

export const addCost = async (req: Request, res: Response) => {
  try {
    const { deviceName, cost, date } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user._id;

    if (!deviceName || !cost || !date) {
      return res.status(400).json({ error: 'deviceName, cost and date are required' });
    }

    const record = await energyCostService.createCost({ userId, deviceName, cost, date });
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
    const { deviceName, from, to } = req.query;

    const records = await energyCostService.getCosts(userId, {
      deviceName: deviceName as string,
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
    const { groupBy = 'month', from, to } = req.query;

    const summary = await energyCostService.getCostSummary(
      userId,
      groupBy as 'day'|'week'|'month',
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined
    );
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
