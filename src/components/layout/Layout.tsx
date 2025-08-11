import React, { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6E6] via-white to-[#E6E6E6]">
      <Header />
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};