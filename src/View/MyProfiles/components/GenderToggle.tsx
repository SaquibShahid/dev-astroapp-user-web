import React from 'react';
import type { ChatProfileGender } from '../../../store/useChatProfileStore';

interface GenderToggleProps {
  value: ChatProfileGender;
  onChange: (gender: ChatProfileGender) => void;
}

const GenderToggle: React.FC<GenderToggleProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['male', 'female'] as const).map((gender) => (
        <button
          key={gender}
          type="button"
          onClick={() => onChange(gender)}
          className={`py-3 rounded-xl text-sm font-semibold border transition-all capitalize ${
            value === gender
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-bg border-border text-text-muted hover:border-primary/40'
          }`}
        >
          {gender}
        </button>
      ))}
    </div>
  );
};

export default GenderToggle;
