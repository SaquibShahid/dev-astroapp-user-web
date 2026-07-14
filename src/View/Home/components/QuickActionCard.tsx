import React from 'react';
import type { Icon as TablerIcon } from '@tabler/icons-react';

interface QuickActionCardProps {
  icon: TablerIcon;
  label: string;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-bg rounded-2xl shadow-sm border border-border flex flex-col items-center justify-center gap-4 py-8 px-5 text-center transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <span className="w-16 h-16 rounded-full bg-bg-soft flex items-center justify-center text-primary">
        <Icon size={28} stroke={1.75} />
      </span>
      <span className="font-semibold text-sm sm:text-base text-text-main">{label}</span>
    </button>
  );
};

export default QuickActionCard;
