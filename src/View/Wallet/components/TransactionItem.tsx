import { IconCurrencyRupee } from '@tabler/icons-react';
import React from 'react';
import type { WalletTransaction } from '../../../store/useWalletStore';

interface TransactionItemProps {
  transaction: WalletTransaction;
}

const formatTransactionDate = (isoString: string): string => {
  const date = new Date(isoString);
  const datePart = date
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-');
  const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${datePart} ${timePart}`;
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isCredit = transaction.txType === 'CREDIT';

  return (
    <div className="bg-bg rounded-2xl border border-border p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center text-primary flex-shrink-0">
        <IconCurrencyRupee size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-text-main truncate">{transaction.description}</p>
        <p className="text-sm text-text-muted mt-0.5">{formatTransactionDate(transaction.createdAt)}</p>
      </div>
      <p className={`font-bold flex-shrink-0 ${isCredit ? 'text-green-600' : 'text-error'}`}>
        {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
      </p>
    </div>
  );
};

export default TransactionItem;
