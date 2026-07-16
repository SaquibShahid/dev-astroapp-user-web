import { IconBuilding, IconHome, IconPencil, IconTrash } from '@tabler/icons-react';
import React from 'react';
import type { Address } from '../../../store/useAddressStore';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => {
  const Icon = address.addressCategory === 'work' ? IconBuilding : IconHome;

  return (
    <div className="bg-bg rounded-2xl border border-border p-5">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-text-main">{address.fullName}</p>
            {address.isDefault && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-1">{address.mobile}</p>
          <p className="text-sm text-text-light mt-1">
            {address.completeAddress}, {address.city}, {address.state} - {address.pinCode}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => onEdit(address)}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent-dark hover:text-accent transition-colors"
            >
              <IconPencil size={15} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(address)}
              className="flex items-center gap-1.5 text-sm font-semibold text-error hover:text-error/80 transition-colors"
            >
              <IconTrash size={15} />
              Delete
            </button>
            {!address.isDefault && (
              <button
                type="button"
                onClick={() => onSetDefault(address)}
                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Set as Default
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
