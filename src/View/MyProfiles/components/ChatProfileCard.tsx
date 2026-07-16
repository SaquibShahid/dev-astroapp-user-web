import { IconPencil } from '@tabler/icons-react';
import React from 'react';
import type { ChatProfile } from '../../../store/useChatProfileStore';

interface ChatProfileCardProps {
  profile: ChatProfile;
  onEdit: (profile: ChatProfile) => void;
}

const formatCreatedAt = (isoString: string): string => {
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString('en-GB');
  const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${datePart}, ${timePart}`;
};

const ChatProfileCard: React.FC<ChatProfileCardProps> = ({ profile, onEdit }) => {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
        {profile.name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bold text-text-main truncate">{profile.name}</p>
        <p className="text-sm text-text-muted mt-0.5">{formatCreatedAt(profile.createdAt)}</p>
        <p className="text-sm text-text-light mt-1">{profile.bornPlace.city}</p>
      </div>

      <button
        type="button"
        onClick={() => onEdit(profile)}
        aria-label={`Edit ${profile.name}`}
        className="w-9 h-9 rounded-full bg-accent/10 text-accent-dark flex items-center justify-center flex-shrink-0"
      >
        <IconPencil size={16} />
      </button>
    </div>
  );
};

export default ChatProfileCard;
