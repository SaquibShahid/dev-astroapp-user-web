import { create } from 'zustand';
import { deleteApi, getApi, postApi, putApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export type AddressType = 'home' | 'work';

// Response payloads use `addressCategory`; request bodies use `addressType`
// for the same field — this asymmetry comes straight from the API spec.
export interface Address {
  _id: string;
  addressCategory: AddressType;
  fullName: string;
  mobile: string;
  completeAddress: string;
  city: string;
  state: string;
  pinCode: string;
  isDeleted: boolean;
  isDefault: boolean;
}

export interface AddressInput {
  addressType: AddressType;
  fullName: string;
  mobile: string;
  completeAddress: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

interface ActionResult {
  success: boolean;
  message?: string;
}

interface AddressStore {
  addresses: Address[];
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (input: AddressInput) => Promise<ActionResult>;
  updateAddress: (id: string, input: Partial<AddressInput>) => Promise<ActionResult>;
  deleteAddress: (id: string) => Promise<ActionResult>;
  setDefaultAddress: (id: string) => Promise<ActionResult>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    set({ isLoading: true });
    const res = await getApi<{ addresses: Address[] }>(urlApi.address.list, { page: 1, limit: 10 });
    set({ addresses: res.data?.addresses || [], isLoading: false });
  },

  // Add/update responses carry no address object back, so refetch rather
  // than guess at an optimistic merge.
  addAddress: async (input) => {
    const res = await postApi(urlApi.address.create, { ...input });
    if (res.status !== 'success') return { success: false, message: res.message };
    await get().fetchAddresses();
    return { success: true, message: res.message };
  },

  updateAddress: async (id, input) => {
    const res = await putApi(urlApi.address.detail(id), { ...input });
    if (res.status !== 'success') return { success: false, message: res.message };
    await get().fetchAddresses();
    return { success: true, message: res.message };
  },

  // Delete/set-default already hold the full list locally, so these two can
  // optimistically update and roll back on failure.
  deleteAddress: async (id) => {
    const previous = get().addresses;
    set({ addresses: previous.filter((a) => a._id !== id) });

    const res = await deleteApi(urlApi.address.detail(id));
    if (res.status !== 'success') {
      set({ addresses: previous });
      return { success: false, message: res.message };
    }
    return { success: true, message: res.message };
  },

  setDefaultAddress: async (id) => {
    const previous = get().addresses;
    set({ addresses: previous.map((a) => ({ ...a, isDefault: a._id === id })) });

    const res = await putApi(urlApi.address.setDefault(id), {});
    if (res.status !== 'success') {
      set({ addresses: previous });
      return { success: false, message: res.message };
    }
    return { success: true, message: res.message };
  },
}));
