import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconMail, IconPhone } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Logo from '../Components/Logo';

const LINK_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Refund Policy', to: '/refund-policy' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: IconBrandFacebook, label: 'Facebook' },
  { icon: IconBrandInstagram, label: 'Instagram' },
  { icon: IconBrandX, label: 'X (Twitter)' },
];

const Footer = () => {
  return (
    <footer className="relative bg-linear-to-b from-primary-dark to-[#241748] text-white/70 mt-auto">
      <div className="h-px w-full bg-linear-to-r from-transparent via-accent/60 to-transparent" />

      <div className="container-custom pt-16 md:pt-20 pb-12 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 md:gap-8">
        <div className="space-y-6 max-w-sm mt-2 md:mt-3">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-white font-bold leading-tight text-lg">
              EDWID
              <br />
              ASTRO
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Connect with expert, verified astrologers for chat, call and video consultations — anytime, anywhere.
          </p>
          <div className="flex items-center gap-3 mb-2">
            {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {LINK_COLUMNS.map((column) => (
          <div key={column.title} className="mt-2 md:mt-3">
            <h3 className="text-accent font-bold text-xs uppercase tracking-wider mb-5">{column.title}</h3>
            <ul className="space-y-3.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <p>© {new Date().getFullYear()} EDWID ASTRO. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="mailto:support@edwidastro.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <IconMail size={14} />
            support@edwidastro.com
          </a>
          <a href="tel:+911234567890" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <IconPhone size={14} />
            +91 12345 67890
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
