import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  provider: string;
  providerId: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
