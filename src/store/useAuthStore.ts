import { create } from 'zustand';
import { getApi, postApi, putApi } from '../api/callApi';
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

interface UpdateProfileInput {
  name?: string;
  profilePicture?: string;
}

interface ActionResult {
  success: boolean;
  message?: string;
}

interface UploadProfilePictureResult extends ActionResult {
  url?: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  user: User | null;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  setInitialized: (val: boolean) => void;
  fetchWallet: () => Promise<void>;
  updateProfile: (updates: UpdateProfileInput) => Promise<ActionResult>;
  uploadProfilePicture: (file: File) => Promise<UploadProfilePictureResult>;
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

  updateProfile: async (updates) => {
    const previousUser = get().user;
    if (!previousUser) return { success: false, message: 'Not logged in' };

    const optimisticUser: User = {
      ...previousUser,
      ...(updates.name !== undefined && { username: updates.name }),
      ...(updates.profilePicture !== undefined && { profilePicture: updates.profilePicture }),
    };
    setUserData(optimisticUser);
    set({ user: optimisticUser });

    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.profilePicture !== undefined) payload.profilePicture = updates.profilePicture;

    const res = await putApi(urlApi.user.updateProfile, payload);
    if (res.status !== 'success') {
      setUserData(previousUser);
      set({ user: previousUser });
      return { success: false, message: res.message };
    }
    return { success: true };
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);

    const res = await postApi<{ url: string }>(urlApi.media.uploadProfilePic, formData);
    if (res.status === 'success' && res.data) {
      return { success: true, url: res.data.url };
    }
    return { success: false, message: res.message };
  },
}));
