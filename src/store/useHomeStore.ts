import { create } from 'zustand';
import { getApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';
import type { Astrologer } from '../View/Home/components/AstrologerCard';
import type { Banner } from '../View/Home/components/PromoBanner';

interface RawBanner {
  _id: string;
  imageUrl: string;
  redirect: string;
  redirectValue: string;
}

interface RawAstrologer {
  _id: string;
  username: string;
  profilePicture?: string;
  rating: number;
  skills?: string[];
  languages?: string[];
  currentStatus?: string;
  pricing: {
    chatPerMinute: number;
    voicePerMinute: number;
    videoPerMinute: number;
    isChatEnabled: boolean;
    isVoiceCallEnabled: boolean;
    isVideoCallEnabled: boolean;
  };
}

const mapBanner = (raw: RawBanner): Banner => ({
  id: raw._id,
  imageUrl: raw.imageUrl,
  redirect: raw.redirect,
  redirectValue: raw.redirectValue,
});

const mapAstrologer = (raw: RawAstrologer): Astrologer => ({
  id: raw._id,
  name: raw.username,
  avatarUrl: raw.profilePicture,
  rating: raw.rating,
  isChatEnabled: raw.pricing.isChatEnabled,
  isVoiceCallEnabled: raw.pricing.isVoiceCallEnabled,
  isVideoCallEnabled: raw.pricing.isVideoCallEnabled,
  chatPricePerMinute: raw.pricing.chatPerMinute,
  callPricePerMinute: raw.pricing.voicePerMinute,
  videoPricePerMinute: raw.pricing.videoPerMinute,
  skills: raw.skills,
  languages: raw.languages,
  isOnline: raw.currentStatus === 'ONLINE',
});

interface HomeStore {
  banners: Banner[];
  isLoadingBanners: boolean;
  astrologers: Astrologer[];
  isLoadingAstrologers: boolean;
  searchResults: Astrologer[];
  isLoadingSearchResults: boolean;
  fetchBanners: () => Promise<void>;
  fetchAstrologers: () => Promise<void>;
  searchAstrologers: (query: string) => Promise<void>;
  clearSearchResults: () => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  banners: [],
  isLoadingBanners: false,
  astrologers: [],
  isLoadingAstrologers: false,
  searchResults: [],
  isLoadingSearchResults: false,

  fetchBanners: async () => {
    set({ isLoadingBanners: true });
    const res = await getApi<RawBanner[]>(urlApi.dashboard.banners, { pageName: 'HOME' });
    set({
      banners: res.status === 'success' && res.data ? res.data.map(mapBanner) : [],
      isLoadingBanners: false,
    });
  },

  fetchAstrologers: async () => {
    set({ isLoadingAstrologers: true });
    const res = await getApi<RawAstrologer[]>(urlApi.astrologer.list, {
      isRecommended: true,
      sortBy: 'rating',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
    set({
      astrologers: res.status === 'success' && res.data ? res.data.map(mapAstrologer) : [],
      isLoadingAstrologers: false,
    });
  },

  searchAstrologers: async (query: string) => {
    if (query.trim().length < 3) {
      set({ searchResults: [] });
      return;
    }
    set({ isLoadingSearchResults: true });
    const res = await getApi<RawAstrologer[]>(urlApi.astrologer.list, { search: query, page: 1, limit: 20 });
    set({
      searchResults: res.status === 'success' && res.data ? res.data.map(mapAstrologer) : [],
      isLoadingSearchResults: false,
    });
  },

  clearSearchResults: () => set({ searchResults: [] }),
}));
