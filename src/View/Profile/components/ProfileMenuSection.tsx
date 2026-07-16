import { IconChevronRight } from '@tabler/icons-react';
import React from 'react';
import { Link } from 'react-router-dom';
import type { Icon as TablerIcon } from '@tabler/icons-react';

export type ProfileMenuItem =
  | { icon: TablerIcon; label: string; to: string; href?: undefined }
  | { icon: TablerIcon; label: string; href: string; to?: undefined };

interface ProfileMenuSectionProps {
  title: string;
  items: ProfileMenuItem[];
}

const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({ title, items }) => {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-text-light mb-3">{title}</h3>
      <div className="bg-bg rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {items.map(({ icon: Icon, label, to, href }) => {
          const content = (
            <>
              <Icon size={20} className="text-primary flex-shrink-0" stroke={1.75} />
              <span className="flex-1 text-sm font-medium text-text-main">{label}</span>
              <IconChevronRight size={18} className="text-text-light flex-shrink-0" />
            </>
          );
          const className = 'flex items-center gap-3 px-5 py-4 hover:bg-bg-soft transition-colors';

          return href ? (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          ) : (
            <Link key={label} to={to as string} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMenuSection;
