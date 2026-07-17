import { create } from 'zustand';
import { postApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export interface BirthDetails {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  latitude: number;
  longitude: number;
  timezone: number;
  ayanamsha: number;
  sunrise: string;
  sunset: string;
}

// Field casing/spelling below (Varna, Naksahtra, ...) matches the astrology
// provider's response verbatim — do not "fix" the typos, they're the real keys.
export interface AstroDetails {
  ascendant: string;
  ascendant_lord: string;
  Varna: string;
  Vashya: string;
  Yoni: string;
  Gan: string;
  Nadi: string;
  sign: string;
  SignLord: string;
  Naksahtra: string;
  NaksahtraLord: string;
  Charan: number;
  Yog: string;
  Karan: string;
  Tithi: string;
  yunja: string;
  tatva: string;
  name_alphabet: string;
  paya: string;
}

export interface HoroChartHouse {
  sign: number;
  sign_name: string;
  planet: string[];
  planet_small: string[];
  planet_degree: number[];
}

export interface DashaLevel {
  planet: string;
  planet_id: number;
  start: string;
  end: string;
}

export interface CurrentVdasha {
  major: DashaLevel;
  minor: DashaLevel;
  sub_minor: DashaLevel;
  sub_sub_minor: DashaLevel;
  sub_sub_sub_minor: DashaLevel;
}

export interface AscendantReport {
  asc_report: {
    ascendant: string;
    report: string;
  };
}

const chartKey = (chatProfileId: string, chartId: string) => `${chatProfileId}:${chartId}`;

interface AstrologyStore {
  birthDetails: Record<string, BirthDetails>;
  astroDetails: Record<string, AstroDetails>;
  horoChartData: Record<string, HoroChartHouse[]>;
  horoChartSvg: Record<string, string>;
  currentVdasha: Record<string, CurrentVdasha>;
  ascendantReport: Record<string, AscendantReport>;

  isLoadingBirthDetails: boolean;
  isLoadingAstroDetails: boolean;
  isLoadingChart: boolean;
  isLoadingDasha: boolean;
  isLoadingReport: boolean;

  fetchBirthDetails: (chatProfileId: string) => Promise<void>;
  fetchAstroDetails: (chatProfileId: string) => Promise<void>;
  fetchHoroChart: (chatProfileId: string, chartId: string) => Promise<void>;
  fetchCurrentVdasha: (chatProfileId: string) => Promise<void>;
  fetchAscendantReport: (chatProfileId: string) => Promise<void>;
}

export const useAstrologyStore = create<AstrologyStore>((set, get) => ({
  birthDetails: {},
  astroDetails: {},
  horoChartData: {},
  horoChartSvg: {},
  currentVdasha: {},
  ascendantReport: {},

  isLoadingBirthDetails: false,
  isLoadingAstroDetails: false,
  isLoadingChart: false,
  isLoadingDasha: false,
  isLoadingReport: false,

  fetchBirthDetails: async (chatProfileId) => {
    if (get().birthDetails[chatProfileId]) return;
    set({ isLoadingBirthDetails: true });
    const res = await postApi<BirthDetails>(urlApi.astrology.getData, {
      apiType: 'BIRTH_DETAILS',
      chatProfileId,
      language: 'en',
    });
    set((state) => ({
      birthDetails: res.data ? { ...state.birthDetails, [chatProfileId]: res.data } : state.birthDetails,
      isLoadingBirthDetails: false,
    }));
  },

  fetchAstroDetails: async (chatProfileId) => {
    if (get().astroDetails[chatProfileId]) return;
    set({ isLoadingAstroDetails: true });
    const res = await postApi<AstroDetails>(urlApi.astrology.getData, {
      apiType: 'ASTRO_DETAILS',
      chatProfileId,
      language: 'en',
    });
    set((state) => ({
      astroDetails: res.data ? { ...state.astroDetails, [chatProfileId]: res.data } : state.astroDetails,
      isLoadingAstroDetails: false,
    }));
  },

  // HORO_CHART (per-house planet placement, for the "Chart Planets" list) and
  // HORO_CHART_IMAGE (a ready-made SVG of the north-Indian diamond chart) are
  // fetched together since the Charts tab always needs both for a given chartId.
  fetchHoroChart: async (chatProfileId, chartId) => {
    const key = chartKey(chatProfileId, chartId);
    if (get().horoChartData[key] && get().horoChartSvg[key]) return;
    set({ isLoadingChart: true });
    const [chartRes, imageRes] = await Promise.all([
      postApi<HoroChartHouse[]>(urlApi.astrology.getData, {
        apiType: 'HORO_CHART',
        chatProfileId,
        chartId,
        language: 'en',
      }),
      postApi<{ svg: string }>(urlApi.astrology.getData, {
        apiType: 'HORO_CHART_IMAGE',
        chatProfileId,
        chartId,
        language: 'en',
      }),
    ]);
    set((state) => ({
      horoChartData: chartRes.data ? { ...state.horoChartData, [key]: chartRes.data } : state.horoChartData,
      horoChartSvg: imageRes.data?.svg ? { ...state.horoChartSvg, [key]: imageRes.data.svg } : state.horoChartSvg,
      isLoadingChart: false,
    }));
  },

  fetchCurrentVdasha: async (chatProfileId) => {
    if (get().currentVdasha[chatProfileId]) return;
    set({ isLoadingDasha: true });
    const res = await postApi<CurrentVdasha>(urlApi.astrology.getData, {
      apiType: 'CURRENT_VDASHA',
      chatProfileId,
      language: 'en',
    });
    set((state) => ({
      currentVdasha: res.data ? { ...state.currentVdasha, [chatProfileId]: res.data } : state.currentVdasha,
      isLoadingDasha: false,
    }));
  },

  fetchAscendantReport: async (chatProfileId) => {
    if (get().ascendantReport[chatProfileId]) return;
    set({ isLoadingReport: true });
    const res = await postApi<AscendantReport>(urlApi.astrology.getData, {
      apiType: 'GENERAL_ASCENDANT_REPORT',
      chatProfileId,
      language: 'en',
    });
    set((state) => ({
      ascendantReport: res.data ? { ...state.ascendantReport, [chatProfileId]: res.data } : state.ascendantReport,
      isLoadingReport: false,
    }));
  },
}));
