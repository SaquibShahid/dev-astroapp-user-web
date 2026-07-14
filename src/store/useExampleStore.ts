import { create } from 'zustand';
import { getApi, postApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

// Rename this file/store per domain, e.g. useCartStore.ts, useProfileStore.ts.
// One store per domain — do not merge unrelated concerns into one store.

interface ExampleItem {
  id: string;
  name: string;
}

interface ExampleStore {
  items: ExampleItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (name: string) => Promise<void>;
  reset: () => void;
}

export const useExampleStore = create<ExampleStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    const response = await getApi<ExampleItem[]>(urlApi.auth.login); // replace with real endpoint
    if (response.status === 'success') {
      set({ items: response.data || [], isLoading: false });
    } else {
      set({ error: response.message, isLoading: false });
    }
  },

  addItem: async (name: string) => {
    // optimistic update pattern: apply the change immediately, roll back on failure
    const previousItems = useExampleStore.getState().items;
    const optimisticItem: ExampleItem = { id: `temp-${Date.now()}`, name };
    set({ items: [...previousItems, optimisticItem] });

    const response = await postApi<ExampleItem>(urlApi.auth.login, { name }); // replace with real endpoint
    if (response.status !== 'success') {
      set({ items: previousItems, error: response.message });
    }
  },

  reset: () => set({ items: [], isLoading: false, error: null }),
}));
