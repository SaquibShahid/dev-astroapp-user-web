import { create } from 'zustand';
import { getApi, postApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export interface RemedyCategory {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  tag?: string;
  order: number;
}

export interface RemedyFaq {
  question: string;
  answer: string;
}

export interface Remedy {
  _id: string;
  title: string;
  tags: string[];
  description: string;
  images: string[];
  basePrice: number;
  discountPrice?: number;
  faq: RemedyFaq[];
  createdAt: string;
}

export interface RemedyBooking {
  _id: string;
  remedyId: {
    _id: string;
    title: string;
    description: string;
    basePrice: number;
    images: string[];
  };
  pricePaid: number;
  paymentId: string;
  status: string;
  bookedAt: string;
  rating?: number;
  review?: string;
}

interface BookRemedyData {
  bookingId: string;
  paymentId: string;
  paymentChannel: string;
  orderId?: string;
  redirectUrl?: string;
}

interface BookRemedyResult {
  success: boolean;
  message?: string;
  paymentChannel?: string;
  orderId?: string;
  redirectUrl?: string;
}

interface RemedyStore {
  categories: RemedyCategory[];
  isLoadingCategories: boolean;
  remediesByCategory: Record<string, Remedy[]>;
  isLoadingRemedies: boolean;
  bookings: RemedyBooking[];
  isLoadingBookings: boolean;
  fetchCategories: () => Promise<void>;
  fetchRemediesByCategory: (categoryId: string) => Promise<void>;
  bookRemedy: (remedyId: string) => Promise<BookRemedyResult>;
  fetchMyBookings: () => Promise<void>;
}

export const useRemedyStore = create<RemedyStore>((set, get) => ({
  categories: [],
  isLoadingCategories: false,
  remediesByCategory: {},
  isLoadingRemedies: false,
  bookings: [],
  isLoadingBookings: false,

  // Categories are effectively static — fetch once and cache.
  fetchCategories: async () => {
    if (get().categories.length > 0 || get().isLoadingCategories) return;
    set({ isLoadingCategories: true });
    const res = await getApi<RemedyCategory[]>(urlApi.remedies.categories);
    set({ categories: res.data || [], isLoadingCategories: false });
  },

  // Cached by categoryId so the detail page can look a remedy up locally
  // instead of needing a dedicated get-one-remedy endpoint (none exists).
  fetchRemediesByCategory: async (categoryId) => {
    set({ isLoadingRemedies: true });
    const res = await getApi<Remedy[]>(urlApi.remedies.listByCategory(categoryId), { page: 1, limit: 10 });
    set((state) => ({
      remediesByCategory: { ...state.remediesByCategory, [categoryId]: res.data || [] },
      isLoadingRemedies: false,
    }));
  },

  // Payment channel varies (PhonePe/Cashfree hand back a redirectUrl to
  // full-page-redirect to; Razorpay hands back an orderId for the Checkout
  // SDK instead) — the caller branches on `paymentChannel`.
  bookRemedy: async (remedyId) => {
    const res = await postApi<BookRemedyData>(urlApi.remedies.book, { remedyId });
    if (res.status !== 'success' || !res.data) {
      return { success: false, message: res.message };
    }
    return {
      success: true,
      paymentChannel: res.data.paymentChannel,
      orderId: res.data.orderId,
      redirectUrl: res.data.redirectUrl,
    };
  },

  fetchMyBookings: async () => {
    set({ isLoadingBookings: true });
    const res = await getApi<RemedyBooking[]>(urlApi.remedies.myBookings, { page: 1, limit: 10 });
    set({ bookings: res.data || [], isLoadingBookings: false });
  },
}));
