import { IconCamera, IconLoader2, IconUserCircle } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../Components/Common/Modal';
import { useAuthStore } from '../../../store/useAuthStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const uploadProfilePicture = useAuthStore((state) => state.uploadProfilePicture);

  const [name, setName] = useState(user?.username || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePicture || null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Reset local form state to the current user each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setName(user?.username || '');
    setSelectedFile(null);
    setPreviewUrl(user?.profilePicture || null);
  }, [isOpen, user]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    e.target.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Please enter your name');
      return;
    }

    setIsSaving(true);

    let profilePictureUrl: string | undefined;
    if (selectedFile) {
      const uploadRes = await uploadProfilePicture(selectedFile);
      if (!uploadRes.success || !uploadRes.url) {
        toast.error(uploadRes.message || 'Failed to upload photo');
        setIsSaving(false);
        return;
      }
      profilePictureUrl = uploadRes.url;
    }

    const res = await updateProfile({
      name: trimmedName,
      ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
    });

    setIsSaving(false);

    if (res.success) {
      toast.success('Profile updated successfully');
      onClose();
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div>
          <p className="text-sm font-semibold text-text-main mb-3">Profile Photo</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-bg-soft flex-shrink-0 flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt={name || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                <IconUserCircle size={44} className="text-text-light" />
              )}
            </div>
            <button
              type="button"
              onClick={handlePhotoClick}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent-dark hover:text-accent transition-colors"
            >
              <IconCamera size={18} />
              Change Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-text-main mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {isSaving && <IconLoader2 size={18} className="animate-spin" />}
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
