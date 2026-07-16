import { IconLoader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../Components/Common/Modal';
import { useChatProfileStore } from '../../../store/useChatProfileStore';
import type { ChatProfile, ChatProfileBornPlace, ChatProfileGender } from '../../../store/useChatProfileStore';
import GenderToggle from './GenderToggle';
import PlaceAutocompleteField from './PlaceAutocompleteField';

interface EditChatProfileModalProps {
  profile: ChatProfile | null;
  onClose: () => void;
}

const EditChatProfileModal: React.FC<EditChatProfileModalProps> = ({ profile, onClose }) => {
  const updateProfile = useChatProfileStore((state) => state.updateProfile);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<ChatProfileGender>('male');
  const [bornDate, setBornDate] = useState('');
  const [bornTime, setBornTime] = useState('');
  const [bornPlace, setBornPlace] = useState<ChatProfileBornPlace>({ city: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setGender(profile.gender === 'female' ? 'female' : 'male');
    setBornDate(profile.bornDate.slice(0, 10));
    setBornTime(profile.bornTime);
    setBornPlace(profile.bornPlace);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    const res = await updateProfile(profile._id, { name: name.trim(), gender, bornDate, bornTime, bornPlace });
    setIsSaving(false);

    if (res.success) {
      toast.success(res.message || 'Profile updated successfully');
      onClose();
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  return (
    <Modal isOpen={!!profile} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div>
          <label htmlFor="editName" className="block text-sm font-semibold text-text-main mb-2">
            Full Name
          </label>
          <input
            id="editName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-text-main mb-2">Gender</p>
          <GenderToggle value={gender} onChange={setGender} />
        </div>

        <div>
          <label htmlFor="editBornDate" className="block text-sm font-semibold text-text-main mb-2">
            Date of Birth
          </label>
          <input
            id="editBornDate"
            type="date"
            value={bornDate}
            onChange={(e) => setBornDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="editBornTime" className="block text-sm font-semibold text-text-main mb-2">
            Birth Time
          </label>
          <input
            id="editBornTime"
            type="time"
            value={bornTime}
            onChange={(e) => setBornTime(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <PlaceAutocompleteField value={bornPlace} onChange={setBornPlace} label="Birth Place" />

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {isSaving && <IconLoader2 size={18} className="animate-spin" />}
          Save
        </button>
      </form>
    </Modal>
  );
};

export default EditChatProfileModal;
