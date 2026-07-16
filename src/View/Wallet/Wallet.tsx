import { IconArrowLeft, IconLoader2, IconWallet } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useWalletStore } from '../../store/useWalletStore';
import AddMoneyModal from './components/AddMoneyModal';
import TransactionItem from './components/TransactionItem';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const fetchWallet = useAuthStore((state) => state.fetchWallet);
  const transactions = useWalletStore((state) => state.transactions);
  const isLoadingTransactions = useWalletStore((state) => state.isLoadingTransactions);
  const fetchTransactions = useWalletStore((state) => state.fetchTransactions);

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet, fetchTransactions]);

  return (
    <div className="container-custom py-8 md:py-10 max-w-lg">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">Wallet</h1>

      <div className="bg-primary text-white rounded-2xl p-6 mb-6">
        <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mb-4">
          <IconWallet size={22} />
        </div>
        <p className="text-white/70 text-sm">Available Balance</p>
        <p className="text-3xl font-bold mt-1">₹{(user?.wallet ?? 0).toLocaleString('en-IN')}</p>
        <p className="text-white/70 text-sm mt-3">Use your wallet balance for chats, calls, and others.</p>
      </div>

      <button
        type="button"
        onClick={() => setIsAddMoneyOpen(true)}
        className="w-full bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors mb-8"
      >
        Add Money to Wallet
      </button>

      <h2 className="text-lg font-bold text-text-main mb-4">Recent Transactions</h2>

      {isLoadingTransactions ? (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-bg rounded-2xl border border-border">
          <p className="text-sm text-text-muted">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))}
        </div>
      )}

      <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} />
    </div>
  );
};

export default Wallet;
