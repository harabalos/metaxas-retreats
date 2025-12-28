import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-ZDD9NS3KDN';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  const loadGoogleAnalytics = () => {
    if (window.gtag) return; 

    // 1. Create the script tag
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // 2. Initialize window.dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // 3. Define the gtag function carefully for TypeScript
    // We use (...args: any[]) so TS knows it accepts arguments
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    // Attach to window so it's global
    window.gtag = gtag;

    // 4. Configure
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    
    if (consent === 'true') {
      loadGoogleAnalytics();
    } else if (consent === 'false') {
      // Do nothing
    } else {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    loadGoogleAnalytics();
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-forest/20 shadow-lg z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-600">
          <p>
            We use cookies to enhance your browsing experience and analyze our traffic. 
            By clicking "Accept", you consent to our use of cookies. 
            See our <Link to="/privacy" className="text-forest hover:underline underline-offset-4">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={declineCookies}
            className="text-gray-500 border-gray-300 hover:bg-gray-100"
          >
            Decline
          </Button>
          <Button 
            onClick={acceptCookies}
            className="bg-forest hover:bg-forest-dark text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

// Global Type Definitions
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}