import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-soft">
      <Header />
      <main className="flex-1 w-full pb-10 md:pb-14">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
