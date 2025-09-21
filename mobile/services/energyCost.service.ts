import { Platform } from 'react-native';
import { getToken } from '../store/authStore';

const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api' 
  : 'http://10.0.2.2:5000/api';

export interface EnergyCostRecord {
  _id?: string;
  deviceName: string;
  cost: number;
  date: Date;
}

export const energyCostService = {
  async getCosts(deviceName?: string, from?: Date, to?: Date) {
    const token = await getToken();
    const params = new URLSearchParams();
    if (deviceName) params.append('deviceName', deviceName);
    if (from) params.append('from', from.toISOString());
    if (to) params.append('to', to.toISOString());

    const response = await fetch(`${BASE_URL}/costs?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch costs');
    return response.json();
  },

  async addCost(data: EnergyCostRecord) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/costs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add cost');
    return response.json();
  },

  async updateCost(id: string, data: Partial<EnergyCostRecord>) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/costs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update cost');
    return response.json();
  },

  async deleteCost(id: string) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/costs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete cost');
    return response.json();
  },

  async getSummary(groupBy: 'day' | 'week' | 'month' = 'month', from?: Date, to?: Date) {
    const token = await getToken();
    const params = new URLSearchParams({ groupBy });
    if (from) params.append('from', from.toISOString());
    if (to) params.append('to', to.toISOString());

    const response = await fetch(`${BASE_URL}/costs/insights/summary?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },
};
