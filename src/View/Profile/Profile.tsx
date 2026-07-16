import {
  IconHelpCircle,
  IconInfoCircle,
  IconLanguage,
  IconLogout,
  IconMapPin,
  IconMessage2,
  IconPencil,
  IconShoppingBag,
  IconSparkles,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './components/EditProfileModal';
import ProfileMenuSection from './components/ProfileMenuSection';
import type { ProfileMenuItem } from './components/ProfileMenuSection';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';

const ACCOUNT_ITEMS: ProfileMenuItem[] = [
  { icon: IconUser, label: 'My Profiles', to: '/profile/my-profiles' },
  { icon: IconMapPin, label: 'My Addresses', to: '/profile/addresses' },
  { icon: IconMessage2, label: 'My Communication', to: '/profile/communication' },
];

const ACTIVITY_ITEMS: ProfileMenuItem[] = [
  { icon: IconShoppingBag, label: 'My Orders', to: '/profile/orders' },
  { icon: IconSparkles, label: 'Remedies Bookings', to: '/profile/remedies-bookings' },
];

const PREFERENCE_ITEMS: ProfileMenuItem[] = [{ icon: IconLanguage, label: 'Change Language', to: '/profile/language' }];

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const config = useSettingsStore((state) => state.config);
  const fetchConfig = useSettingsStore((state) => state.fetchConfig);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Privacy/Return open the externally-hosted policy pages (from settings
  // config) directly — they're not rendered in-app, so skip them until the
  // config has loaded rather than linking to a dead URL.
  const supportItems: ProfileMenuItem[] = [
    { icon: IconHelpCircle, label: 'Help & Support', to: '/help' },
    { icon: IconInfoCircle, label: 'About', to: '/about' },
    ...(config?.privacyPolicyUrl
      ? [{ icon: IconInfoCircle, label: 'Privacy Policy', href: config.privacyPolicyUrl }]
      : []),
    ...(config?.refundPolicyUrl
      ? [{ icon: IconInfoCircle, label: 'Return Policy', href: config.refundPolicyUrl }]
      : []),
  ];

  const menuSections = [
    { title: 'Account', items: ACCOUNT_ITEMS },
    { title: 'Activity', items: ACTIVITY_ITEMS },
    { title: 'Support & Legal', items: supportItems },
    { title: 'Preferences', items: PREFERENCE_ITEMS },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container-custom py-8 md:py-10 space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-text-main">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <div className="bg-bg rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-bg-soft flex-shrink-0 flex items-center justify-center">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <IconUserCircle size={36} className="text-text-light" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-text-main truncate">{user?.username || 'You'}</p>
              <p className="text-sm text-text-muted">{user?.mobile}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="w-9 h-9 rounded-full bg-bg-soft flex items-center justify-center text-primary flex-shrink-0"
              aria-label="Edit profile"
            >
              <IconPencil size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-error/30 text-error font-semibold text-sm py-3 rounded-xl hover:bg-error/5 transition-colors"
          >
            <IconLogout size={18} />
            Logout
          </button>

          <p className="text-center text-xs text-text-light">
            App Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </p>
        </div>

        <div className="space-y-8">
          {menuSections.map((section) => (
            <ProfileMenuSection key={section.title} title={section.title} items={section.items} />
          ))}
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default Profile;
