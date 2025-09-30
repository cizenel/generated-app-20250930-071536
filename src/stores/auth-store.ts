import { create } from 'zustand';
import { User, UserRole } from '@shared/types';
import { api } from '@/lib/api-client';
interface AuthState {
  isAuthenticated: boolean;
  currentUser: Omit<User, 'password'> | null;
  login: (username: string, password: string) => Promise<Omit<User, 'password'>>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,
  login: async (username, password) => {
    try {
      const user = await api<Omit<User, 'password'>>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      set({ isAuthenticated: true, currentUser: user });
      return user;
    } catch (error) {
      set({ isAuthenticated: false, currentUser: null });
      // Re-throw the error to be caught by the UI component
      throw error;
    }
  },
  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
  },
  hasPermission: (requiredRoles) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    return requiredRoles.includes(currentUser.role);
  },
}));