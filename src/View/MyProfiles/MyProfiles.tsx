import { IconArrowLeft, IconLoader2, IconUsers } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatProfileStore } from '../../store/useChatProfileStore';
import type { ChatProfile } from '../../store/useChatProfileStore';
import AddChatProfileModal from './components/AddChatProfileModal';
import ChatProfileCard from './components/ChatProfileCard';
import EditChatProfileModal from './components/EditChatProfileModal';

const MyProfiles: React.FC = () => {
  const navigate = useNavigate();
  const profiles = useChatProfileStore((state) => state.profiles);
  const isLoading = useChatProfileStore((state) => state.isLoading);
  const fetchProfiles = useChatProfileStore((state) => state.fetchProfiles);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ChatProfile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <div className="container-custom py-8 md:py-10 max-w-2xl">
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">My Profiles</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-bg rounded-2xl border border-border">
          <IconUsers size={36} className="text-text-light mb-3" />
          <p className="font-semibold text-text-main">No profiles yet</p>
          <p className="text-sm text-text-muted mt-1">Create a profile to start chatting with astrologers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <ChatProfileCard key={profile._id} profile={profile} onEdit={setEditingProfile} />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="w-full bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors mt-8"
      >
        Create New Profile
      </button>

      <AddChatProfileModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditChatProfileModal profile={editingProfile} onClose={() => setEditingProfile(null)} />
    </div>
  );
};

export default MyProfiles;
