import {ConsumptionRecord} from "@/types/types";

export const calculateTotalConsumption = (records: ConsumptionRecord[]): string => {
    const total = records.reduce((sum, record) => sum + record.energyConsumed, 0);
    return total.toFixed(3);
};

export const calculateCost = (records: ConsumptionRecord[], ratePerKwh: number = 30): string => {
    const totalKwh = parseFloat(calculateTotalConsumption(records));
    return (totalKwh * ratePerKwh).toFixed(2);
};

export const getDeviceIcon = (deviceName: string): string => {
    const name = deviceName.toLowerCase();
    if (name.includes('bulb') || name.includes('light')) return '💡';
    if (name.includes('tv') || name.includes('television')) return '📺';
    if (name.includes('air') || name.includes('ac')) return '❄️';
    if (name.includes('fridge') || name.includes('refrigerator')) return '🧊';
    if (name.includes('wash')) return '👕';
    if (name.includes('microwave')) return '🔥';
    return '⚡';
};

export const calculateEnergyConsumption = (powerUsage: number, hours: number, minutes: number): number => {
    const totalHours = hours + minutes / 60;
    return (powerUsage * totalHours) / 1000; // Convert to kWh
};