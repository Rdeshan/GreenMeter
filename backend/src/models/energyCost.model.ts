import { Schema, model, Document, Types } from 'mongoose';

export interface IEnergyCost extends Document {
    userId: Types.ObjectId;
    deviceName: string;
    cost: number;              
    date: Date;
}

const EnergyCostSchema = new Schema<IEnergyCost>({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  deviceName: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

export default model<IEnergyCost>('EnergyCost', EnergyCostSchema);