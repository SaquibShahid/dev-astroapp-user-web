import { create } from 'zustand';
import { getApi, postApi } from '../api/callApi';
import { urlApi } from '../api/urlApi';

export type WalletTxType = 'CREDIT' | 'DEBIT';
export type WalletTxMode =
  | 'ORDER_PAYMENT'
  | 'REFUND'
  | 'WALLET_TOPUP'
  | 'CASHBACK'
  | 'JOINING_BONUS'
  | 'REMEDY_BOOKING'
  | 'PDF_DOWNLOAD';

export interface WalletTransaction {
  _id: string;
  amount: number;
  txType: WalletTxType;
  txMode: WalletTxMode;
  status: string;
  orderId?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionHistoryData {
  transactions: WalletTransaction[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

interface AddMoneyData {
  paymentId: string;
  paymentChannel: string;
  orderId?: string;
  redirectUrl?: string;
}

interface AddMoneyResult {
  success: boolean;
  message?: string;
  paymentChannel?: string;
  orderId?: string;
  redirectUrl?: string;
}

interface WalletStore {
  transactions: WalletTransaction[];
  isLoadingTransactions: boolean;
  fetchTransactions: () => Promise<void>;
  addMoney: (amount: number) => Promise<AddMoneyResult>;
}

export const useWalletStore = create<WalletStore>((set) => ({
  transactions: [],
  isLoadingTransactions: false,

  fetchTransactions: async () => {
    set({ isLoadingTransactions: true });
    const res = await getApi<TransactionHistoryData>(urlApi.wallet.history, { page: 1, limit: 10 });
    // A 404 "No transactions found" is a valid empty state, not an error to surface.
    set({ transactions: res.data?.transactions || [], isLoadingTransactions: false });
  },

  // Payment channel varies (PhonePe/Cashfree hand back a redirectUrl to
  // full-page-redirect to; Razorpay hands back an orderId for the Checkout
  // SDK instead) — the caller branches on `paymentChannel`.
  addMoney: async (amount) => {
    const res = await postApi<AddMoneyData>(urlApi.wallet.addMoney, { amount });
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
}));
