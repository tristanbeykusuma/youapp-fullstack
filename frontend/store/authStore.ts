'use client';

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hydrated: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  hydrated: false,

  setAuth: (user, token) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set cookie for middleware
      document.cookie = `auth-storage=${encodeURIComponent(JSON.stringify({ user, token }))}; path=/; max-age=86400; SameSite=Lax`;
    }

    // Update state
    set({ user, token });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Remove cookie
      document.cookie = 'auth-storage=; path=/; max-age=0';
    }

    set({ user: null, token: null });
  },

  isAuthenticated: () => {
    const state = get();
    return !!(state.token && state.user);
  },
}));

// Hydrate from localStorage on client side
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      useAuthStore.setState({ user, token, hydrated: true });

      // Set cookie for middleware if not already set
      if (!document.cookie.includes('auth-storage=')) {
        document.cookie = `auth-storage=${encodeURIComponent(JSON.stringify({ user, token }))}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } else {
    useAuthStore.setState({ hydrated: true });
  }
}