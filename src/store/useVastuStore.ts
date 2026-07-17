import { create } from 'zustand';
import { postApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export interface VastuBookingPayload {
  name: string;
  mobileNumber: string;
  fullAddress: string;
  area: string;
  pinCode: string;
  city: string;
  state: string;
  landmark: string;
}

interface BookVastuResult {
  success: boolean;
  message?: string;
}

interface VastuStore {
  isBooking: boolean;
  bookVastu: (payload: VastuBookingPayload) => Promise<BookVastuResult>;
}

export const useVastuStore = create<VastuStore>((set) => ({
  isBooking: false,

  bookVastu: async (payload) => {
    set({ isBooking: true });
    const res = await postApi<{ bookingId: string }>(urlApi.vastu.book, payload);
    set({ isBooking: false });

    if (res.status !== 'success') {
      return { success: false, message: res.message };
    }
    return { success: true, message: res.message };
  },
}));
