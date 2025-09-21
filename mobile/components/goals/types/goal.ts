export interface Goal {
  id?: string; // optional for new goals
  title: string;
  notes?: string;
  date: string;
  timeFrequency?: 'daily' | 'weekly' | 'monthly';
  priority?: 'low' | 'medium' | 'high';
  devices: string[];
}
