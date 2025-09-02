import { Request, Response } from 'express';
import Device from '../models/Device';

export const saveDevice = async (req: Request, res: Response) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: 'Failed to save device' });
  }
};