import { create } from 'zustand';

export interface ApiUser {
  name: string;
  email: string;
  password: string;     // hashed; present in response
  provider: string;
  _id: string;
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
  __v: number;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

interface AuthState {
  user: AuthResponse | null;
  setUser: (user: AuthResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
