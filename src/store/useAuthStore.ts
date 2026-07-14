import { create } from 'zustand';
import { getApi } from '../api/callApi';
import { getUserData, setUserData, clearSecureStorage, TOKEN } from '../api/localStorageKeys';
import { urlApi } from '../api/urlApi';

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
  fetchWallet: () => Promise<void>;
}

// Initialize from localStorage for immediate availability on boot
const initialUser = getUserData<User>();

export const useAuthStore = create<AuthStore>((set, get) => ({
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

  fetchWallet: async () => {
    const res = await getApi<string>(urlApi.wallet.getBalance);
    const currentUser = get().user;
    if (res.status === 'success' && res.data !== null && currentUser) {
      const wallet = Number(res.data);
      const updatedUser = { ...currentUser, wallet };
      setUserData(updatedUser);
      set({ user: updatedUser });
    }
  },
}));
