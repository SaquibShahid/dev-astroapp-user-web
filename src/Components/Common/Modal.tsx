import { IconX } from '@tabler/icons-react';
import React from 'react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
  closeOnBackdropClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClassName = 'max-w-lg',
  closeOnBackdropClick = true,
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        className={`w-full ${maxWidthClassName} bg-bg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-bold text-text-main">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-bg-soft flex items-center justify-center text-text-muted hover:text-text-main transition-colors"
            >
              <IconX size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
