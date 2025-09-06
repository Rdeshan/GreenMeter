// src/controllers/goal.controller.ts
import { Request, Response } from 'express';
import Goal, { IGoal } from '../models/Goal.model';

const DUMMY_USER_ID = '64f0a1b2c3d4e5f678901234'; // any valid ObjectId string

// Create a new goal
export const createGoal = async (req: Request, res: Response) => {
  try {
    const goalData = {
      ...req.body,
      userId: DUMMY_USER_ID,
      date: new Date(req.body.date),  // cast date string to Date
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
