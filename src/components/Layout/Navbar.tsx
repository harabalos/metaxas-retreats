import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const scrollToAccommodations = () => {
    if (isHome) {
      document.getElementById('accommodations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/?scrollToAccommodations=true');
    }
  };

  // On homepage: transparent when at top, solid when scrolled
  // On other pages: always solid
  const navBg = isHome
    ? scrolled
      ? 'bg-forest/95 backdrop-blur-md shadow-nav'
      : 'bg-transparent'
    : 'bg-forest shadow-nav';

  const textColor = (isHome && !scrolled) ? 'text-white/90' : 'text-sand-light';
  const hoverColor = 'hover:text-wood';
  const logoColor = (isHome && !scrolled) ? 'text-white' : 'text-sand-light';

  const navLinks = [
    { label: t('nav.accommodations'), onClick: scrollToAccommodations },
    { label: t('nav.explore'), to: '/explore' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className={`text-xl lg:text-2xl font-heading font-semibold tracking-wide transition-colors duration-300 ${logoColor}`}>
                Metaxas Retreats
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(({ label, onClick, to }) =>
                onClick ? (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`text-sm font-sans font-medium tracking-wide transition-colors duration-200 relative group ${textColor} ${hoverColor}`}
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-wood transition-all duration-300 group-hover:w-full" />
                  </button>
                ) : (
                  <Link
                    key={label}
                    to={to!}
                    className={`text-sm font-sans font-medium tracking-wide transition-colors duration-200 relative group ${textColor} ${hoverColor}`}
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-wood transition-all duration-300 group-hover:w-full" />
                  </Link>
                )
              )}

              {/* Book Now CTA */}
              <Link
                to="/contact"
                className="btn-shimmer ml-2 px-5 py-2 rounded-full bg-wood text-forest-dark text-sm font-sans font-semibold tracking-wide transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-95"
              >
                {t('nav.bookNow') || 'Book Now'}
              </Link>

              <LanguageSwitcher isLight={isHome && !scrolled} />
            </div>

            {/* Mobile: language + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher isLight={isHome && !scrolled} />
              <button
                type="button"
                aria-label="Toggle menu"
                className={`p-2 rounded-md transition-colors ${textColor} hover:bg-white/10`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileMenuOpen ? 'x' : 'menu'}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-40 bg-forest/97 backdrop-blur-md shadow-xl md:hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map(({ label, onClick, to }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.22 }}
                >
                  {onClick ? (
                    <button
                      onClick={() => { onClick(); setMobileMenuOpen(false); }}
                      className="w-full text-left py-3 px-2 text-base font-sans text-sand-light/90 hover:text-wood border-b border-white/8 transition-colors"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={to!}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-2 text-base font-sans text-sand-light/90 hover:text-wood border-b border-white/8 transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.22 }}
                className="pt-4"
              >
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-full bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide"
                >
                  {t('nav.bookNow') || 'Book Now'}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
