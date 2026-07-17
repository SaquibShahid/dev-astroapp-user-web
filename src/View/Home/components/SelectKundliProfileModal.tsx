import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../Components/Common/Modal';
import AddChatProfileModal from '../../MyProfiles/components/AddChatProfileModal';
import { useChatProfileStore } from '../../../store/useChatProfileStore';

interface SelectKundliProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectKundliProfileModal: React.FC<SelectKundliProfileModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const profiles = useChatProfileStore((s) => s.profiles);
  const isLoading = useChatProfileStore((s) => s.isLoading);
  const fetchProfiles = useChatProfileStore((s) => s.fetchProfiles);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) fetchProfiles();
  }, [isOpen, fetchProfiles]);

  const handleSelect = (chatProfileId: string) => {
    onClose();
    navigate(`/kundli/${chatProfileId}`);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnBackdropClick={false}>
        <div className="p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-5"
          >
            <IconArrowLeft size={18} />
            Back
          </button>

          <h2 className="text-xl font-bold text-text-main mb-6">Select Profile</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <IconLoader2 size={28} className="animate-spin text-primary" />
            </div>
          ) : profiles.length === 0 ? (
            <p className="text-center text-sm text-text-muted py-10">No profiles available.</p>
          ) : (
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
              {profiles.map((profile) => (
                <button
                  key={profile._id}
                  type="button"
                  onClick={() => handleSelect(profile._id)}
                  className="w-full flex items-center gap-4 bg-bg border border-border rounded-2xl p-4 text-left hover:border-primary/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-main truncate">{profile.name}</p>
                    <p className="text-sm text-text-muted truncate">{profile.bornPlace.city}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Create New Profile
          </button>
        </div>
      </Modal>

      <AddChatProfileModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
};

export default SelectKundliProfileModal;
