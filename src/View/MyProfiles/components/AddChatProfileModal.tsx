import { IconArrowLeft, IconLoader2, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../Components/Common/Modal';
import { useChatProfileStore } from '../../../store/useChatProfileStore';
import type { ChatProfileBornPlace, ChatProfileGender } from '../../../store/useChatProfileStore';
import GenderToggle from './GenderToggle';
import PlaceAutocompleteField from './PlaceAutocompleteField';

interface AddChatProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 5;

const AddChatProfileModal: React.FC<AddChatProfileModalProps> = ({ isOpen, onClose }) => {
  const createProfile = useChatProfileStore((state) => state.createProfile);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<ChatProfileGender>('male');
  const [bornDate, setBornDate] = useState('');
  const [bornTime, setBornTime] = useState('');
  const [bornPlace, setBornPlace] = useState<ChatProfileBornPlace>({ city: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setName('');
    setGender('male');
    setBornDate('');
    setBornTime('');
    setBornPlace({ city: '' });
  }, [isOpen]);

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return !!gender;
      case 3:
        return !!bornDate;
      case 4:
        return !!bornTime;
      case 5:
        return bornPlace.city.trim().length > 0;
      default:
        return false;
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onClose();
      return;
    }
    setStep((s) => s - 1);
  };

  const handleNext = async () => {
    if (!isStepValid()) return;

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    setIsSaving(true);
    const res = await createProfile({ name: name.trim(), gender, bornDate, bornTime, bornPlace });
    setIsSaving(false);

    if (res.success) {
      toast.success(res.message || 'Profile created successfully');
      onClose();
    } else {
      toast.error(res.message || 'Failed to create profile');
    }
  };

  const progressPercent = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdropClick={false}>
      <div className="p-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-5"
        >
          {step === 1 ? <IconX size={18} /> : <IconArrowLeft size={18} />}
          {step === 1 ? 'Close' : 'Back'}
        </button>

        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-bg-soft rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {step === 1 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-main">What's your name?</h2>
            <p className="text-sm text-text-muted mt-1">This helps us personalize your experience</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              autoFocus
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all mt-4"
            />
          </div>
        )}

        {step === 2 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-main">Choose your gender</h2>
            <p className="text-sm text-text-muted mt-1">This helps us provide accurate readings</p>
            <div className="mt-4">
              <GenderToggle value={gender} onChange={setGender} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-main">When were you born?</h2>
            <p className="text-sm text-text-muted mt-1">Your date of birth for accurate predictions</p>
            <input
              type="date"
              value={bornDate}
              onChange={(e) => setBornDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all mt-4"
            />
          </div>
        )}

        {step === 4 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-main">What time were you born?</h2>
            <p className="text-sm text-text-muted mt-1">Your birth time for Kundli generation</p>
            <input
              type="time"
              value={bornTime}
              onChange={(e) => setBornTime(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all mt-4"
            />
          </div>
        )}

        {step === 5 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-main">Where were you born?</h2>
            <p className="text-sm text-text-muted mt-1">Your birth place for accurate astrological calculations</p>
            <div className="mt-4">
              <PlaceAutocompleteField value={bornPlace} onChange={setBornPlace} />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid() || isSaving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isSaving && <IconLoader2 size={18} className="animate-spin" />}
          {step < TOTAL_STEPS ? 'Next' : 'Create Profile'}
        </button>
      </div>
    </Modal>
  );
};

export default AddChatProfileModal;
