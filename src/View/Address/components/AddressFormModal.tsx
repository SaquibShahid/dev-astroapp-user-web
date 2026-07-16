import { IconBuilding, IconHome, IconLoader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../Components/Common/Modal';
import { useAddressStore } from '../../../store/useAddressStore';
import type { Address, AddressType } from '../../../store/useAddressStore';

export type AddressFormState = { mode: 'add' } | { mode: 'edit'; address: Address };

interface AddressFormModalProps {
  formState: AddressFormState | null;
  onClose: () => void;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({ formState, onClose }) => {
  const addAddress = useAddressStore((s) => s.addAddress);
  const updateAddress = useAddressStore((s) => s.updateAddress);

  const [addressType, setAddressType] = useState<AddressType>('home');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = formState?.mode === 'edit';

  useEffect(() => {
    if (!formState) return;
    if (formState.mode === 'edit') {
      setAddressType(formState.address.addressCategory);
      setFullName(formState.address.fullName);
      setMobile(formState.address.mobile);
      setCompleteAddress(formState.address.completeAddress);
      setPinCode(formState.address.pinCode);
      setCity(formState.address.city);
      setState(formState.address.state);
      setIsDefault(formState.address.isDefault);
    } else {
      setAddressType('home');
      setFullName('');
      setMobile('');
      setCompleteAddress('');
      setPinCode('');
      setCity('');
      setState('');
      setIsDefault(false);
    }
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    setIsSaving(true);
    const payload = {
      addressType,
      fullName: fullName.trim(),
      mobile,
      completeAddress: completeAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pinCode,
      ...(formState.mode === 'add' && isDefault && { isDefault: true }),
    };

    const res =
      formState.mode === 'edit' ? await updateAddress(formState.address._id, payload) : await addAddress(payload);
    setIsSaving(false);

    if (res.success) {
      toast.success(res.message || (isEdit ? 'Address updated successfully' : 'Address added successfully'));
      onClose();
    } else {
      toast.error(res.message || 'Failed to save address');
    }
  };

  return (
    <Modal isOpen={!!formState} onClose={onClose} title={isEdit ? 'Edit Address' : 'Add New Address'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <p className="text-sm text-text-muted -mt-2">Enter your delivery address details</p>

        <div>
          <p className="text-sm font-semibold text-text-main mb-2">Address Type</p>
          <div className="grid grid-cols-2 gap-3">
            {(['home', 'work'] as const).map((type) => {
              const TypeIcon = type === 'work' ? IconBuilding : IconHome;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAddressType(type)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all capitalize ${
                    addressType === type
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-bg border-border text-text-muted hover:border-primary/40'
                  }`}
                >
                  <TypeIcon size={18} />
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-text-main mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-semibold text-text-main mb-2">
            Phone Number
          </label>
          <input
            id="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter phone number"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="completeAddress" className="block text-sm font-semibold text-text-main mb-2">
            Complete Address
          </label>
          <textarea
            id="completeAddress"
            value={completeAddress}
            onChange={(e) => setCompleteAddress(e.target.value)}
            placeholder="House no., Building name, Street, Area"
            rows={3}
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pinCode" className="block text-sm font-semibold text-text-main mb-2">
              Pincode
            </label>
            <input
              id="pinCode"
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 400001"
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-text-main mb-2">
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-text-main mb-2">
            State
          </label>
          <input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        {!isEdit && (
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm font-medium text-text-main">Set as default delivery address</span>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-border text-text-main font-semibold text-sm hover:bg-bg-soft transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
          >
            {isSaving && <IconLoader2 size={18} className="animate-spin" />}
            {isEdit ? 'Update Address' : 'Save Address'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressFormModal;
