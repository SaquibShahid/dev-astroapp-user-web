import { IconLoader2 } from '@tabler/icons-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../Components/Common/Modal';
import { useVastuStore } from '../../../store/useVastuStore';

interface VastuBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM = {
  name: '',
  mobileNumber: '',
  area: '',
  fullAddress: '',
  pinCode: '',
  city: '',
  state: '',
  landmark: '',
};

const VastuBookingModal: React.FC<VastuBookingModalProps> = ({ isOpen, onClose }) => {
  const bookVastu = useVastuStore((s) => s.bookVastu);
  const isBooking = useVastuStore((s) => s.isBooking);

  const [form, setForm] = useState(INITIAL_FORM);

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleChange =
    (field: keyof typeof INITIAL_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      mobileNumber: form.mobileNumber,
      fullAddress: form.fullAddress.trim(),
      area: form.area.trim(),
      pinCode: form.pinCode,
      city: form.city.trim(),
      state: form.state.trim(),
      landmark: form.landmark.trim(),
    };

    const res = await bookVastu(payload);
    if (res.success) {
      toast.success(res.message || 'Vastu booking submitted successfully');
      handleClose();
    } else {
      toast.error(res.message || 'Failed to submit vastu booking');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Vastu Booking">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label htmlFor="vastuName" className="block text-sm font-semibold text-text-main mb-2">
            Name
          </label>
          <input
            id="vastuName"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Enter your name"
            minLength={2}
            maxLength={100}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="vastuMobile" className="block text-sm font-semibold text-text-main mb-2">
            Mobile Number
          </label>
          <input
            id="vastuMobile"
            type="tel"
            value={form.mobileNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            placeholder="Enter your mobile number"
            pattern="^[6-9]\d{9}$"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="vastuArea" className="block text-sm font-semibold text-text-main mb-2">
            Area/BHK
          </label>
          <input
            id="vastuArea"
            type="text"
            value={form.area}
            onChange={handleChange('area')}
            placeholder="Enter area or BHK details"
            minLength={2}
            maxLength={200}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="vastuAddress" className="block text-sm font-semibold text-text-main mb-2">
            Complete Address
          </label>
          <textarea
            id="vastuAddress"
            value={form.fullAddress}
            onChange={handleChange('fullAddress')}
            placeholder="Enter full address"
            rows={3}
            minLength={5}
            maxLength={500}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vastuPinCode" className="block text-sm font-semibold text-text-main mb-2">
              Pincode
            </label>
            <input
              id="vastuPinCode"
              type="text"
              value={form.pinCode}
              onChange={(e) => setForm((prev) => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
              placeholder="Enter pin code"
              pattern="^\d{6}$"
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="vastuCity" className="block text-sm font-semibold text-text-main mb-2">
              City
            </label>
            <input
              id="vastuCity"
              type="text"
              value={form.city}
              onChange={handleChange('city')}
              placeholder="Enter city"
              minLength={2}
              maxLength={100}
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="vastuState" className="block text-sm font-semibold text-text-main mb-2">
            State
          </label>
          <input
            id="vastuState"
            type="text"
            value={form.state}
            onChange={handleChange('state')}
            placeholder="Enter state"
            minLength={2}
            maxLength={100}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="vastuLandmark" className="block text-sm font-semibold text-text-main mb-2">
            Landmark
          </label>
          <input
            id="vastuLandmark"
            type="text"
            value={form.landmark}
            onChange={handleChange('landmark')}
            placeholder="Enter landmark"
            maxLength={200}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isBooking}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {isBooking && <IconLoader2 size={18} className="animate-spin" />}
          Book Vaastu
        </button>
      </form>
    </Modal>
  );
};

export default VastuBookingModal;
