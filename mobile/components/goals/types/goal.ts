export interface Goal {
  id?: string; // optional for new goals
  title: string;
  notes?: string;
  date: string;
  time?: string;
  timeFrequency?: 'Daily' | 'Weekly' | 'Monthly';
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Active' | 'Completed' | 'Archived';
  devices: string[];
}