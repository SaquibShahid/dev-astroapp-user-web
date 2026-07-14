import { IconMoonStars } from '@tabler/icons-react';
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { box: 'w-12 h-12', icon: 18, title: 'text-[9px]', subtitle: 'text-[6px]' },
  md: { box: 'w-24 h-24', icon: 28, title: 'text-sm', subtitle: 'text-[10px]' },
  lg: { box: 'w-28 h-28', icon: 28, title: 'text-sm', subtitle: 'text-[10px]' },
};

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const { box, icon, title, subtitle } = SIZES[size];

  return (
    <div className={`${box} rounded-2xl bg-primary-dark flex flex-col items-center justify-center gap-1 shadow-lg flex-shrink-0`}>
      <IconMoonStars size={icon} className="text-accent" stroke={1.5} />
      <div className="text-center leading-none">
        <div className={`text-white font-extrabold tracking-wide ${title}`}>EDWID</div>
        <div className={`text-accent font-semibold tracking-[0.2em] ${subtitle}`}>ASTRO</div>
      </div>
    </div>
  );
};

export default Logo;
