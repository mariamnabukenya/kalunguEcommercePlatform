import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '../../utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={cn('flex-1', className)}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;