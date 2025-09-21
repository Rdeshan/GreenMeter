export interface Device {
    id: number;
    name: string;
    description: string;
    location: string;
    powerUsage: number; // watts
}

export interface ConsumptionRecord {
    id: number;
    deviceId: number;
    deviceName: string;
    hours: number;
    minutes: number;
    energyConsumed: number; // kWh
    timestamp: Date;
}