import { create } from 'zustand';
import { getApi, postApi, putApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export type ChatProfileGender = 'male' | 'female' | 'unknown';

export interface ChatProfileBornPlace {
  city: string;
  latitude?: number;
  longitude?: number;
}

export interface ChatProfile {
  _id: string;
  name: string;
  gender: ChatProfileGender;
  bornDate: string;
  bornTime: string;
  bornPlace: ChatProfileBornPlace;
  isDefault: boolean;
  createdAt: string;
}

export interface ChatProfileInput {
  name: string;
  gender: ChatProfileGender;
  bornDate: string;
  bornTime: string;
  bornPlace: ChatProfileBornPlace;
  isDefault?: boolean;
}

interface ActionResult {
  success: boolean;
  message?: string;
}

interface ChatProfileStore {
  profiles: ChatProfile[];
  isLoading: boolean;
  fetchProfiles: () => Promise<void>;
  createProfile: (input: ChatProfileInput) => Promise<ActionResult>;
  updateProfile: (id: string, input: Partial<ChatProfileInput>) => Promise<ActionResult>;
}

export const useChatProfileStore = create<ChatProfileStore>((set, get) => ({
  profiles: [],
  isLoading: false,

  fetchProfiles: async () => {
    set({ isLoading: true });
    const res = await getApi<ChatProfile[]>(urlApi.chatProfile.list);
    set({ profiles: res.status === 'success' && res.data ? res.data : [], isLoading: false });
  },

  // Create/update responses carry no profile object (just a message), so
  // there's nothing to optimistically merge — refetch the list instead.
  createProfile: async (input) => {
    const res = await postApi(urlApi.chatProfile.create, { ...input });
    if (res.status !== 'success') {
      return { success: false, message: res.message };
    }
    await get().fetchProfiles();
    return { success: true, message: res.message };
  },

  updateProfile: async (id, input) => {
    const res = await putApi(urlApi.chatProfile.detail(id), { ...input });
    if (res.status !== 'success') {
      return { success: false, message: res.message };
    }
    await get().fetchProfiles();
    return { success: true, message: res.message };
  },
}));
