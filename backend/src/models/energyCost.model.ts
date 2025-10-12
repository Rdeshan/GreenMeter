import { Schema, model, Document } from 'mongoose';

export interface IEnergyCost extends Document {
    userId: string;
    type: 'electricity' | 'gas' | 'solar';
    totalCost: number;
    date: Date;

    // Electricity fields
    deviceId?: Schema.Types.ObjectId;  // reference to Device
    consumption?: number;                  
    hoursPerDay?: number;
    dailyKWh?: number;                 // auto-generated
    monthlyKWh?: number;               // auto-generated

    // Gas fields
    fuelType?: 'petrol' | 'diesel' | 'kerosene' | 'lpg';
    liters?: number;
    tankSize?: '12.5kg' | '5kg' | '2.3kg'; 

    // Solar fields
    solarSavings?: number;
}

const EnergyCostSchema = new Schema<IEnergyCost>({
    userId: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['electricity', 'gas', 'solar'], 
        required: true 
    },
    totalCost: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },

    // Electricity
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device' },
    consumption: { type: Number, min: 0 },
    hoursPerDay: { type: Number, min: 0, max: 24 },
    dailyKWh: { type: Number, min: 0 },
    monthlyKWh: { type: Number, min: 0 },

    // Gas
    fuelType: { 
        type: String, 
        enum: ['petrol', 'diesel', 'kerosene', 'lpg'] 
    },
    liters: { type: Number, min: 0 },
    tankSize: { 
        type: String, 
        enum: ['12.5kg', '5kg', '2.3kg']
    },

    // Solar
    solarSavings: { type: Number, min: 0 }

}, { timestamps: true });

EnergyCostSchema.index({ userId: 1, date: -1 });

export const EnergyCost = model<IEnergyCost>('EnergyCost', EnergyCostSchema);