import { create } from 'zustand';
import { getUserData, setUserData, clearSecureStorage, TOKEN } from '../api/localStorageKeys';

export interface User {
  userId: string;
  username: string;
  loginType: string;
  wallet: number;
  gender: string;
  mobile: string;
  profilePicture: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  user: User | null;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  setInitialized: (val: boolean) => void;
}

// Initialize from localStorage for immediate availability on boot
const initialUser = getUserData<User>();

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!initialUser && !!TOKEN(),
  user: initialUser,
  isInitialized: false,

  login: (user) => {
    setUserData(user);
    set({ isLoggedIn: true, user });
  },

  logout: () => {
    clearSecureStorage();
    set({ isLoggedIn: false, user: null });
  },

  setInitialized: (val) => set({ isInitialized: val }),
}));
