import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { setDemoMode, DEMO_USER, DEMO_TOKEN } from '../api/demo';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: async (user, accessToken, refreshToken) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  demoLogin: async () => {
    setDemoMode(true);
    await AsyncStorage.setItem('accessToken', DEMO_TOKEN);
    await AsyncStorage.setItem('refreshToken', DEMO_TOKEN);
    await AsyncStorage.setItem('user', JSON.stringify(DEMO_USER));
    set({ user: DEMO_USER, isAuthenticated: true });
  },

  logout: async () => {
    setDemoMode(false);
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({ user: null, isAuthenticated: false });
  },

  loadStoredAuth: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');
      if (userJson && token) {
        if (token === DEMO_TOKEN) setDemoMode(true);
        set({ user: JSON.parse(userJson), isAuthenticated: true });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
