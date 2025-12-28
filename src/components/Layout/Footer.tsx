import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Metaxas Retreats</h3>
            <p className="text-forest-light mb-4">{t('footer.about')}</p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-forest-light hover:text-wood transition-colors" onClick={scrollToTop}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/?scrollToAccommodations=true" className="text-forest-light hover:text-wood transition-colors">
                  {t('footer.ourAccommodations')}
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-forest-light hover:text-wood transition-colors" onClick={scrollToTop}>
                  {t('nav.explore')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-forest-light hover:text-wood transition-colors" onClick={scrollToTop}>
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span className="text-forest-light">Poros, Mikros Gialos, Lefkada, Greece</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} />
                <span className="text-forest-light">+30 6973219980 +30 6980429891</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} />
                <span className="text-forest-light">metaxasretreats@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-light mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-forest-light">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>&copy; {new Date().getFullYear()} Metaxas Retreats. All rights reserved.</p>
            
            {/* --- ADDED LEGAL LINKS HERE --- */}
            <div className="flex gap-4 text-sm">
              <Link to="/privacy" className="hover:text-wood underline transition-colors" onClick={scrollToTop}>
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-wood underline transition-colors" onClick={scrollToTop}>
                Terms of Service
              </Link>
            </div>
            {/* ------------------------------ */}
          </div>

          <p className="mt-4 md:mt-0">
            Powered by{" "}
            <a
              href="https://www.amox.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-wood underline"
            >
              Amox
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;