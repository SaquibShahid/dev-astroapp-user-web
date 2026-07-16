import { create } from 'zustand';
import { getApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SupportConfig {
  email: string;
  call: string;
  whatsapp: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
}

export interface AppConfig {
  appName: string;
  appVersion: string;
  privacyPolicyUrl: string;
  refundPolicyUrl: string;
  termsOfServiceUrl: string;
  support: SupportConfig;
  faq: FaqItem[];
  socialMediaLinks: SocialMediaLinks;
  razorpayKey: string;
}

interface SettingsStore {
  config: AppConfig | null;
  isLoading: boolean;
  fetchConfig: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  config: null,
  isLoading: false,

  // Config is effectively static per app build — fetch once and cache.
  // The backend's settings doc is only maintained per-platform for
  // android/ios, so this call always identifies as android regardless of
  // the app's real (web) platform, unlike every other request.
  fetchConfig: async () => {
    if (get().config || get().isLoading) return;
    set({ isLoading: true });
    const res = await getApi<{ config: AppConfig }>(urlApi.settings.get, undefined, { 'x-app-platform': 'android' });
    set({ config: res.data?.config || null, isLoading: false });
  },
}));
