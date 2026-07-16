import { IconArrowLeft, IconBrandFacebook, IconBrandInstagram, IconLoader2 } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Components/Logo';
import { useSettingsStore } from '../../store/useSettingsStore';

const About: React.FC = () => {
  const navigate = useNavigate();
  const config = useSettingsStore((state) => state.config);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const fetchConfig = useSettingsStore((state) => state.fetchConfig);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const legalLinks = config
    ? [
        { label: 'Terms of Service', url: config.termsOfServiceUrl },
        { label: 'Privacy Policy', url: config.privacyPolicyUrl },
        { label: 'Return & Refund Policy', url: config.refundPolicyUrl },
      ].filter((link) => link.url)
    : [];

  return (
    <div className="container-custom py-8 md:py-10 max-w-lg">
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">About</h1>

      {isLoading && !config ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-bg rounded-2xl border border-border p-6 space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <Logo size="sm" />
            <div>
              <p className="font-bold text-text-main">{config?.appName || 'EDWID ASTRO'}</p>
              <p className="text-sm text-text-muted mt-0.5">
                Version {config?.appVersion || import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </p>
            </div>
          </div>

          {legalLinks.length > 0 && (
            <div className="border-t border-border pt-5 space-y-3">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold text-accent-dark hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {config?.socialMediaLinks && (config.socialMediaLinks.facebook || config.socialMediaLinks.instagram) && (
            <div className="border-t border-border pt-5 flex items-center justify-center gap-4">
              {config.socialMediaLinks.facebook && (
                <a
                  href={config.socialMediaLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                >
                  <IconBrandFacebook size={20} />
                </a>
              )}
              {config.socialMediaLinks.instagram && (
                <a
                  href={config.socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                >
                  <IconBrandInstagram size={20} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default About;
