<<<<<<< Updated upstream
import { Schema, model, Document, Types } from 'mongoose';

export interface IEnergyCost extends Document {
    userId: Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
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
=======
import { Schema, model, Document } from 'mongoose';

export interface IEnergyCost extends Document {
    userId: string;
    type: 'electricity' | 'gas' | 'solar';
    totalCost: number;
    date: Date;

    // Electricity fields
    deviceName?: string;
    watts?: number;
    hoursPerDay?: number;
    dailyKWh?: number;

    // Gas fields
    fuelType?: 'petrol' | 'diesel' | 'kerosene' | 'lpg';
    liters?: number;        
    tankSize?: string;          

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
    deviceName: { type: String },
    watts: { type: Number, min: 0 },
    hoursPerDay: { type: Number, min: 0, max: 24 },
    dailyKWh: { type: Number, min: 0 },

    // Gas
    fuelType: { 
        type: String, 
        enum: ['petrol', 'diesel', 'kerosene', 'lpg'] 
    },
    liters: { type: Number, min: 0 },
    tankSize: { 
        type: String, 
        enum: ['12.5kg', '8kg', '5kg', '2.5kg'] 
    },

    // Solar
    solarSavings: { type: Number, min: 0 }

}, { timestamps: true });

EnergyCostSchema.index({ userId: 1, date: -1 });

export const EnergyCost = model<IEnergyCost>('EnergyCost', EnergyCostSchema);
>>>>>>> Stashed changes
