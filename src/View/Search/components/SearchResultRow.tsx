import { IconStarFilled, IconUserCircle } from '@tabler/icons-react';
import React from 'react';
import type { Astrologer } from '../../Home/components/AstrologerCard';

interface SearchResultRowProps {
  astrologer: Astrologer;
}

const SearchResultRow: React.FC<SearchResultRowProps> = ({ astrologer }) => {
  const { name, avatarUrl, rating, skills, languages, isOnline, chatPricePerMinute } = astrologer;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-bg-soft flex-shrink-0 flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <IconUserCircle size={32} className="text-text-light" />
        )}
        {isOnline && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-bg" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bold text-text-main truncate">{name}</p>
        {skills && skills.length > 0 && <p className="text-sm text-text-muted truncate">{skills.join(', ')}</p>}
        {languages && languages.length > 0 && (
          <p className="text-sm text-text-light truncate">{languages.join(', ')}</p>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <span className="inline-flex items-center gap-1 text-accent-dark font-bold text-sm">
          <IconStarFilled size={14} />
          {rating.toFixed(1)}
        </span>
        <p className="text-sm text-text-muted mt-1">₹{chatPricePerMinute}/min</p>
      </div>
    </div>
  );
};

export default SearchResultRow;
