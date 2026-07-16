import { IconArrowLeft, IconBrandWhatsapp, IconLoader2, IconMail, IconPhone } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqAccordionItem from '../../Components/Common/FaqAccordionItem';
import { useSettingsStore } from '../../store/useSettingsStore';

const Help: React.FC = () => {
  const navigate = useNavigate();
  const config = useSettingsStore((state) => state.config);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const fetchConfig = useSettingsStore((state) => state.fetchConfig);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const policies = config
    ? [
        { label: 'Return & Refund Policy', url: config.refundPolicyUrl },
        { label: 'Privacy Policy', url: config.privacyPolicyUrl },
        { label: 'Terms of Service', url: config.termsOfServiceUrl },
      ].filter((policy) => policy.url)
    : [];

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

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">Help and Support</h1>

      {isLoading && !config ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : !config ? (
        <div className="text-center py-16 bg-bg rounded-2xl border border-border">
          <p className="text-sm text-text-muted">Couldn't load help content. Please try again later.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {config.faq.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-text-main mb-4">FAQs</h2>
              <div className="space-y-3">
                {config.faq.map((faq) => (
                  <FaqAccordionItem key={faq.question} faq={faq} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-text-main mb-4">Contact Us</h2>
            <div className="space-y-3">
              {config.support.whatsapp && (
                <a
                  href={`https://wa.me/${config.support.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-green-700 transition-colors"
                >
                  <IconBrandWhatsapp size={18} />
                  WhatsApp Support
                </a>
              )}
              {config.support.call && (
                <a
                  href={`tel:${config.support.call}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors"
                >
                  <IconPhone size={18} />
                  Call Support
                </a>
              )}
              {config.support.email && (
                <a
                  href={`mailto:${config.support.email}`}
                  className="w-full flex items-center justify-center gap-2 border border-border text-text-main font-semibold text-sm py-3.5 rounded-xl hover:bg-bg-soft transition-colors"
                >
                  <IconMail size={18} />
                  Email Support
                </a>
              )}
            </div>
          </div>

          {policies.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-text-main mb-4">Policies</h2>
              <div className="space-y-2">
                {policies.map((policy) => (
                  <a
                    key={policy.label}
                    href={policy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-semibold text-accent-dark hover:text-accent transition-colors"
                  >
                    {policy.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Help;
