import { IconMoonStars } from '@tabler/icons-react';
import React from 'react';

interface LogoProps {
  size?: 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const boxSize = size === 'lg' ? 'w-28 h-28' : 'w-24 h-24';

  return (
    <div className={`${boxSize} rounded-2xl bg-primary-dark flex flex-col items-center justify-center gap-1 shadow-lg`}>
      <IconMoonStars size={28} className="text-accent" stroke={1.5} />
      <div className="text-center leading-none">
        <div className="text-white font-extrabold text-sm tracking-wide">EDWID</div>
        <div className="text-accent font-semibold text-[10px] tracking-[0.2em]">ASTRO</div>
      </div>
    </div>
  );
};

export default Logo;
