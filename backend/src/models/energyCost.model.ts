import { Schema, model, Document, Types } from 'mongoose';

export interface IEnergyCost extends Document {
    type: 'gas' | 'electricity' | 'solar';

    // common fields
    cost: number;
    date: Date;

    // gas-specific fields
    fuelType?: 'petrol' | 'diesel' | 'lpg' | 'kerosene';
    liters?: number;            
    pricePerLiter?: number;
    gasTankSize?: number;      
    gasTankPrice?: number;

    // electricity-specific fields
    electricDeviceType?: string; 
    powerRatingWatts?: number;  
    usageHoursPerDay?: number;  
    costCalculationMethod?: 'manual' | 'auto';
}

const EnergyCostSchema = new Schema<IEnergyCost>({
    type: { type: String, enum: ['gas', 'electricity', 'solar'], required: true },
    cost: { type: Number, required: true },
    date: { type: Date, required: true },

    // gas-specific
    fuelType: { type: String, enum: ['petrol', 'diesel', 'lpg', 'kerosene'] },
    liters: { type: Number },
    pricePerLiter: { type: Number },
    gasTankSize: { type: Number },
    gasTankPrice: { type: Number },

    // electricity-specific
    electricDeviceType: { type: String },
    powerRatingWatts: { type: Number },
    usageHoursPerDay: { type: Number },

    costCalculationMethod: { type: String, enum: ['manual', 'auto'], default: 'auto' }
}, { timestamps: true });

export default model<IEnergyCost>('EnergyCost', EnergyCostSchema);