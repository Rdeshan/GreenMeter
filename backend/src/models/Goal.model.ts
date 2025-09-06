// src/models/Goal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;             // link to user
  title: string;
  notes?: string;
  date: Date;                 // target date
  timeFrequency: string;      // e.g., 'daily', 'weekly', 'monthly'
  priority: 'low' | 'medium' | 'high';
  devices: string[];          // array of device IDs (can use dummy data initially)
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true },
    notes: { type: String },
    date: { type: Date, required: true },
    timeFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
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
