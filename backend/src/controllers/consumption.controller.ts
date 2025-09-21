import { Request, Response } from 'express';
import Consumption from '../models/consumption.model.js';

// Create consumption record
export const addConsumptionController = async (req: Request, res: Response) => {
  try {
    const { deviceId, hours, minutes } = req.body;

    const consumption = new Consumption({
      device: deviceId,
      hours,
      minutes,
    });

    await consumption.save();

    res.status(201).json({ success: true, data: consumption });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all consumptions
export const getAllConsumptionsController = async (req: Request, res: Response) => {
  try {
    const consumptions = await Consumption.find()
      .populate("device") 
      .sort({ createdAt: -1 });

    res.json({ success: true, data: consumptions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single consumption by ID
export const getConsumptionByIdController = async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const consumption = await Consumption.findById(id).populate("device") ;

        if (!consumption) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.json({ success: true, data: consumption });
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update consumption
export const editConsumptionController = async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const consumption = await Consumption.findByIdAndUpdate(id, updateData, { new: true });

        if (!consumption) {
            return res.status(400).json({ success: false, message: 'Device update failed' });
        }

        res.json({ success: true, data: consumption });
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete consumption
export const deleteConsumptionController = async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const consumption = await Consumption.findByIdAndDelete(id);

        if (!consumption) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error : any) {
        res.status(500).json({ success: false, message: error.message });
    }
};