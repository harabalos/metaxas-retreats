
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

// Pages whose first section is a full-screen hero — navbar floats transparently over them
const HERO_PAGES = ['/', '/explore'];

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const hasHero = HERO_PAGES.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Non-hero pages need a top offset equal to the fixed navbar height */}
      <main className={`flex-grow ${hasHero ? '' : 'pt-16 lg:pt-20'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
