import { IconLoader2, IconWallet } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../Components/Common/Modal';
import { useWalletStore } from '../../../store/useWalletStore';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose }) => {
  const addMoney = useWalletStore((state) => state.addMoney);

  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAmount('');
    setIsProcessing(false);
  }, [isOpen]);

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/[^0-9]/g, ''));
  };

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    const res = await addMoney(numericAmount);

    if (res.success && res.redirectUrl) {
      // Full-page redirect: payment completes on the gateway's own page,
      // outside the SPA, and the wallet is credited async via webhook/cron.
      window.location.href = res.redirectUrl;
      return;
    }

    setIsProcessing(false);
    toast.error(res.message || 'Failed to create payment order');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Money">
      <form onSubmit={handleProceed} className="p-6 space-y-6">
        <div className="bg-primary text-white rounded-2xl p-5">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mb-3">
            <IconWallet size={22} />
          </div>
          <p className="font-bold">Add Money to Wallet</p>
          <p className="text-sm text-white/70 mt-1">Add money to your wallet to use for chats, calls, and others.</p>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-text-main mb-2">
            Enter Amount
          </label>
          <input
            id="amount"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Amount"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(String(quickAmount))}
              className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                amount === String(quickAmount)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-bg border-border text-text-main hover:border-primary/40'
              }`}
            >
              ₹{quickAmount.toLocaleString('en-IN')}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {isProcessing && <IconLoader2 size={18} className="animate-spin" />}
          {isProcessing ? 'Redirecting...' : 'Proceed'}
        </button>
      </form>
    </Modal>
  );
};

export default AddMoneyModal;
