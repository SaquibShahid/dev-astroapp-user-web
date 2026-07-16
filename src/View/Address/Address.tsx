import { IconArrowLeft, IconLoader2, IconMapPin } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmModal from '../../Components/Common/ConfirmModal';
import { useAddressStore } from '../../store/useAddressStore';
import type { Address as AddressData } from '../../store/useAddressStore';
import AddressCard from './components/AddressCard';
import AddressFormModal from './components/AddressFormModal';
import type { AddressFormState } from './components/AddressFormModal';

const Address: React.FC = () => {
  const navigate = useNavigate();
  const addresses = useAddressStore((state) => state.addresses);
  const isLoading = useAddressStore((state) => state.isLoading);
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
  const deleteAddress = useAddressStore((state) => state.deleteAddress);
  const setDefaultAddress = useAddressStore((state) => state.setDefaultAddress);

  const [formState, setFormState] = useState<AddressFormState | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<AddressData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;
    setIsDeleting(true);
    const res = await deleteAddress(deletingAddress._id);
    setIsDeleting(false);

    if (res.success) {
      toast.success(res.message || 'Address deleted successfully');
      setDeletingAddress(null);
    } else {
      toast.error(res.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (address: AddressData) => {
    const res = await setDefaultAddress(address._id);
    if (res.success) {
      toast.success(res.message || 'Default address set successfully');
    } else {
      toast.error(res.message || 'Failed to set default address');
    }
  };

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

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">My Addresses</h1>

      <button
        type="button"
        onClick={() => setFormState({ mode: 'add' })}
        className="w-full bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors mb-6"
      >
        Add New Address
      </button>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-bg rounded-2xl border border-border">
          <IconMapPin size={36} className="text-text-light mb-3" />
          <p className="font-semibold text-text-main">No addresses yet</p>
          <p className="text-sm text-text-muted mt-1">Add a delivery address to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={(a) => setFormState({ mode: 'edit', address: a })}
              onDelete={setDeletingAddress}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressFormModal formState={formState} onClose={() => setFormState(null)} />

      <ConfirmModal
        isOpen={!!deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        title="Are you sure you want to delete this address?"
        description={
          deletingAddress
            ? `${deletingAddress.fullName} — ${deletingAddress.completeAddress}, ${deletingAddress.city}, ${deletingAddress.state} - ${deletingAddress.pinCode}`
            : undefined
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default Address;
