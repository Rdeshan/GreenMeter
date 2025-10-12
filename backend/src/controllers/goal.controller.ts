// src/controllers/goal.controller.ts
import { Request, Response } from 'express';
import Goal, { IGoal } from '../models/Goal.model';
import { Types } from 'mongoose';
import Device, { IDevice } from '../models/Device';
import AiGenerate from '../config/geminiGoals.config';

const DUMMY_USER_ID = '64f0a1b2c3d4e5f678901234'; // any valid ObjectId string

// Create a new goal
export const createGoal = async (req: Request, res: Response) => {
  try {
    const goalData = {
      ...req.body,
      userId: DUMMY_USER_ID,
      date: new Date(req.body.date),  // cast date string to Date
      time: req.body.time,
    };
    const goal = await Goal.create(goalData);
    res.status(201).json(goal);
  } catch (err: any) {
    console.error('Create Goal Error:', err);
    if (err.name === 'ValidationError') {
      // Send validation error details to client for debugging
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Failed to create goal', error: err.message || err });
  }
};


// Get all goals for a user
export const getGoals = async (req: Request, res: Response) => {
  try {
    const goals = await Goal.find({ userId: DUMMY_USER_ID });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch goals', error: err });
  }
};

// Update a goal
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update goal', error: err });
  }
};

// Delete a goal
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete goal', error: err });
  }
};

export const generateGoalHandler = async (req: Request, res: Response) => {
  try {
    const { devices = [] } = req.body; // items can be ObjectId strings OR device_name strings

    // Normalize: check if items look like ObjectId hex strings (24 chars hex)
    const looksLikeObjectId = (s: any) =>
      typeof s === 'string' && /^[0-9a-fA-F]{24}$/.test(s);

    // If incoming devices are IDs, fetch device documents to get names.
    
    let deviceDocs: IDevice[] = [];
let deviceIds: Types.ObjectId[] = [];
let deviceNames: string[] = [];

if (devices.length > 0 && looksLikeObjectId(devices[0])) {
  // received IDs
  deviceDocs = await Device.find({ _id: { $in: devices } });
} else if (devices.length > 0) {
  // received names
  deviceDocs = await Device.find({ device_name: { $in: devices } });
}

deviceIds = deviceDocs
  .map(d => d._id)
  .filter((id): id is Types.ObjectId => !!id); // type guard ensures array of ObjectId

deviceNames = deviceDocs.map(d => d.device_name);

    // Call AI with device NAMES (friendly for prompts)
    const aiResult = await AiGenerate('goal_recommendation', { devices: deviceNames });

    // Build goal document using AI output, but ensure devices saved as ObjectIds
    const generatedGoal = {
      title: aiResult.title || 'AI Suggested Goal',
      notes: (aiResult.recommendations?.tips || []).join('\n') || aiResult.summary || '',
      priority: aiResult.priority || 'Medium',
      timeFrequency: aiResult.timeFrequency || 'Daily',
      time: aiResult.time || '21:00',
      devices: deviceIds, // ObjectIds
      userId: DUMMY_USER_ID,
      status: 'Active',
      date: new Date(), // you can change to aiResult.date if provided
    };

    const goal = await Goal.create(generatedGoal);
    // populate devices for client convenience
    const populated = await Goal.findById(goal._id).populate('devices');

    res.status(201).json({ goal: populated, ai: aiResult });
  } catch (err: any) {
    console.error('AI Generate Goal Error:', err);
    const message = err?.message || 'Failed to generate goal';
    // if Mongoose validation error include details
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message, error: err });
  }
};