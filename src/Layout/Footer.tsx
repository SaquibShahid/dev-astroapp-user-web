import { IconBrandFacebook, IconBrandInstagram, IconMail, IconPhone } from '@tabler/icons-react';
import { useEffect } from 'react';
import Logo from '../Components/Logo';
import { useSettingsStore } from '../store/useSettingsStore';

const DEFAULT_SUPPORT_EMAIL = 'support@edwidastro.com';
const DEFAULT_SUPPORT_PHONE = '+911234567890';

const Footer = () => {
  const config = useSettingsStore((state) => state.config);
  const fetchConfig = useSettingsStore((state) => state.fetchConfig);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const socialLinks = [
    config?.socialMediaLinks.facebook && {
      icon: IconBrandFacebook,
      label: 'Facebook',
      url: config.socialMediaLinks.facebook,
    },
    config?.socialMediaLinks.instagram && {
      icon: IconBrandInstagram,
      label: 'Instagram',
      url: config.socialMediaLinks.instagram,
    },
  ].filter((link): link is { icon: typeof IconBrandFacebook; label: string; url: string } => !!link);

  const supportEmail = config?.support.email || DEFAULT_SUPPORT_EMAIL;
  const supportPhone = config?.support.call || DEFAULT_SUPPORT_PHONE;

  return (
    <footer className="relative bg-linear-to-b from-primary-dark to-[#241748] text-white/70 mt-auto pt-4 md:pt-6 pb-4 md:pb-6">
      <div className="container-custom pt-16 md:pt-20 pb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-white font-bold leading-tight text-lg">
            EDWID
            <br />
            ASTRO
          </span>
        </div>
        <p className="text-sm leading-relaxed max-w-sm sm:text-right">
          Connect with expert, verified astrologers for chat, call and video consultations — anytime, anywhere.
        </p>
      </div>

      <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <p>© {new Date().getFullYear()} EDWID ASTRO. All rights reserved.</p>
        <div className="flex flex-col items-center sm:items-end gap-3">
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          )}
          <div className="flex items-center gap-6">
            <a href={`mailto:${supportEmail}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <IconMail size={14} />
              {supportEmail}
            </a>
            <a href={`tel:${supportPhone}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <IconPhone size={14} />
              {supportPhone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
