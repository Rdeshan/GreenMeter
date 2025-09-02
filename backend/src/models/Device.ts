import { Schema, model, Document } from 'mongoose';

export interface IDevice extends Document {
  device_name: string;
  type?: string;
  location?: string;
  consumption?: number;
  createdAt: Date;
}

const DeviceSchema = new Schema<IDevice>({
  device_name: { type: String, required: true },
  type: { type: String },
  location: { type: String },
  consumption: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default model<IDevice>('Device', DeviceSchema);