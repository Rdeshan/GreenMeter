// /types/DeviceItem.ts

export type DeviceItem = {
  _id: string;
  device_name: string;
  type?: string;
  location?: string;
  consumption?: number;
  state?: "ON" | "OFF";
};
