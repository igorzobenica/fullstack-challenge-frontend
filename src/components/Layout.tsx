import React from 'react';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from './ui';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            {user && (
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user.displayName || 'User'}</span>
                <LogoutButton />
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
        <Toaster />
      </main>
      <footer className="bg-primary text-white py-4 text-center text-sm">
        © 2024 Fullstack Challenge. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
