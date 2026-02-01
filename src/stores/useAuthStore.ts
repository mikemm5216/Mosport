import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types';

interface User {
  id?: string;
  email?: string; // Add email for admin checking
  role: string; // 'fan' | 'venue' | 'staff' | 'guest'
  isAuthenticated: boolean;
  isGuest: boolean;
  provider?: string | null;
  profile?: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setGuest: (role: UserRole) => void;
  setRole: (role: UserRole) => void; // Add role switching
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isLoading: false, error: null }),

      setGuest: (role) => set({
        user: {
          role,
          isAuthenticated: false,
          isGuest: true
        },
        isLoading: false,
        error: null
      }),

      setRole: (role) => set((state) => ({
        user: state.user ? { ...state.user, role } : null
      })),

      logout: () => set({ user: null, error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'mosport-auth',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
