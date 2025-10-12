// src/models/Goal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;             // link to user
  title: string;
  notes?: string;
  date: Date;                 
  time: string ,
  timeFrequency: string;      
  priority: 'Low' | 'Medium' | 'High';
  devices: string[];          
  status: 'Active' | 'Completed' | 'Archived';
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true },
    notes: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    timeFrequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: 'Daily' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
  },
  { timestamps: true }
);

GoalSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_: any, ret: any) => {
    ret.id = ret._id?.toString(); // safely convert to string
    delete ret._id;
  },
});

export default mongoose.model<IGoal>('Goal', GoalSchema);