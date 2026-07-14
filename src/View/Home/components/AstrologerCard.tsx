import { IconMessage, IconPhone, IconStarFilled, IconUserCircle, IconVideo } from '@tabler/icons-react';
import React from 'react';

export interface Astrologer {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  isChatEnabled: boolean;
  isVoiceCallEnabled: boolean;
  isVideoCallEnabled: boolean;
  chatPricePerMinute: number;
  callPricePerMinute: number;
  videoPricePerMinute: number;
}

interface AstrologerCardProps {
  astrologer: Astrologer;
  onBook?: (astrologer: Astrologer) => void;
}

const formatPricePerMinute = (price: number) => `₹${price}/min`;

const AstrologerCard: React.FC<AstrologerCardProps> = ({ astrologer, onBook }) => {
  const {
    name,
    avatarUrl,
    rating,
    isChatEnabled,
    isVoiceCallEnabled,
    isVideoCallEnabled,
    chatPricePerMinute,
    callPricePerMinute,
    videoPricePerMinute,
  } = astrologer;

  const hasAnyChannel = isChatEnabled || isVoiceCallEnabled || isVideoCallEnabled;

  return (
    <div className="bg-bg rounded-2xl border border-border p-5 sm:p-6 flex flex-col transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-bg-soft flex-shrink-0 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <IconUserCircle size={32} className="text-text-light" />
          )}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-text-main truncate">{name}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 bg-accent/15 text-accent-dark text-xs font-bold px-2 py-0.5 rounded-full">
            <IconStarFilled size={12} />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {hasAnyChannel && (
        <div className="flex items-center gap-2 mt-5 flex-wrap">
          {isChatEnabled && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              <IconMessage size={14} />
              {formatPricePerMinute(chatPricePerMinute)}
            </span>
          )}
          {isVoiceCallEnabled && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              <IconPhone size={14} />
              {formatPricePerMinute(callPricePerMinute)}
            </span>
          )}
          {isVideoCallEnabled && (
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              <IconVideo size={14} />
              {formatPricePerMinute(videoPricePerMinute)}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onBook?.(astrologer)}
        className="mt-5 w-full bg-primary-dark text-white text-sm font-semibold py-3 rounded-xl"
      >
        Book Consultation
      </button>
    </div>
  );
};

export default AstrologerCard;
