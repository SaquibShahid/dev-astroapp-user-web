import React from 'react';
import Logo from '../Components/Logo';

interface SplashScreenProps {
  fadingOut?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ fadingOut }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-primary transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <Logo size="lg" />
      <p className="text-white/80 font-medium">Connect with Expert Astrologers</p>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-b-accent"></div>
    </div>
  );
};

export default SplashScreen;
