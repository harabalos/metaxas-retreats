import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import LogoMark from './LogoMark';
import { splitLanguage } from '@/lib/i18nRoutes';
import { scrollBehavior } from '@/lib/motion';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, localize } = useLanguage();

  const isHome = splitLanguage(location.pathname).path === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  // While the phone menu is open the page behind it stays put, Escape closes
  // it, and so does the window growing past the phone layout.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const desktop = window.matchMedia('(min-width: 768px)');
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', close);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', close);
    };
  }, [mobileMenuOpen]);

  const scrollToAccommodations = () => {
    if (isHome) {
      document.getElementById('accommodations')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    } else {
      navigate(`${localize('/')}#accommodations`);
    }
  };

  // "Book Now" leads to availability: the date picker on an accommodation page,
  // otherwise the two accommodations on the home page to choose from.
  const onAccommodationPage = splitLanguage(location.pathname).path.startsWith('/accommodation/');
  const bookHref = onAccommodationPage ? '#book' : `${localize('/')}#accommodations`;
  const bookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onAccommodationPage) {
      document.getElementById('book')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    } else {
      scrollToAccommodations();
    }
  };

  // On homepage: transparent when at top, solid when scrolled
  // On other pages, and under the open phone menu: always solid
  const overHero = isHome && !scrolled && !mobileMenuOpen;
  const navBg = mobileMenuOpen
    ? 'bg-forest'
    : isHome
      ? scrolled
        ? 'bg-forest/95 backdrop-blur-md shadow-nav'
        : 'bg-transparent'
      : 'bg-forest shadow-nav';

  const textColor = overHero ? 'text-white/90' : 'text-sand-light';
  const hoverColor = 'hover:text-wood';
  const logoColor = overHero ? 'text-white' : 'text-sand-light';
  const currentPath = splitLanguage(location.pathname).path;

  const navLinks = [
    { label: t('nav.accommodations'), href: `${localize('/')}#accommodations`, onClick: scrollToAccommodations },
    { label: t('nav.explore'), to: localize('/explore') },
    { label: t('nav.contact'), to: localize('/contact') },
  ];

  return (
    <>
      <m.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to={localize('/')} className="flex items-center gap-2 group">
              <LogoMark className="h-8 w-8 lg:h-9 lg:w-9 text-wood shrink-0" />
              <span className={`text-xl lg:text-2xl font-brand font-semibold tracking-wide transition-colors duration-300 ${logoColor}`}>
                Metaxas Retreats
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(({ label, onClick, to, href }) =>
                onClick ? (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => { e.preventDefault(); onClick(); }}
                    className={`text-sm font-sans font-medium tracking-wide transition-colors duration-200 relative group ${textColor} ${hoverColor}`}
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-wood transition-all duration-300 group-hover:w-full" />
                  </a>
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
              <a
                href={bookHref}
                onClick={bookNow}
                className="btn-shimmer ml-2 px-5 py-2 rounded-full bg-wood text-forest-dark text-sm font-sans font-semibold tracking-wide transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-95"
              >
                {t('nav.bookNow')}
              </a>

              <LanguageSwitcher isLight={overHero} />
            </div>

            {/* Mobile: language + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher isLight={overHero} />
              <button
                type="button"
                aria-label={t('nav.menu')}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className={`p-2 rounded-md transition-colors ${textColor} ${mobileMenuOpen ? 'bg-white/10' : 'hover:bg-white/10'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={mobileMenuOpen ? 'x' : 'menu'}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </m.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </m.nav>

      {/* Mobile menu: a solid panel under the bar, the page dimmed behind it */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            key="mobile-menu-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-forest-dark/70 md:hidden"
          />
        )}
        {mobileMenuOpen && (
          <m.div
            key="mobile-menu"
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-16 inset-x-0 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-forest border-t border-white/10 shadow-xl md:hidden"
          >
            <ul className="px-5 pt-2">
              {navLinks.map(({ label, onClick, to, href }) => {
                const current = to !== undefined && to === localize(currentPath);
                const className = `flex items-center justify-between py-4 text-lg font-sans font-medium border-b border-white/10 transition-colors ${
                  current ? 'text-wood' : 'text-sand-light hover:text-wood'
                }`;
                const arrow = <ChevronRight aria-hidden="true" className="h-5 w-5 text-wood/70" />;
                return (
                  <li key={label}>
                    {onClick ? (
                      <a
                        href={href}
                        onClick={(e) => { e.preventDefault(); onClick(); setMobileMenuOpen(false); }}
                        className={className}
                      >
                        {label}
                        {arrow}
                      </a>
                    ) : (
                      <Link
                        to={to!}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={current ? 'page' : undefined}
                        className={className}
                      >
                        {label}
                        {arrow}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="px-5 pt-6 pb-8">
              <a
                href={bookHref}
                onClick={bookNow}
                className="block w-full text-center py-3.5 rounded-full bg-wood text-forest-dark font-sans font-semibold text-base tracking-wide active:scale-[0.98] transition-transform"
              >
                {t('nav.bookNow')}
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
