import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const linkClass = 'text-sand-dark/60 hover:text-wood text-sm transition-colors duration-200';

  return (
    <footer className="bg-forest-dark text-sand-light">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wood/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Link to="/" onClick={scrollToTop}>
              <h2 className="text-2xl font-heading font-semibold text-sand-light mb-3 hover:text-wood transition-colors">
                Metaxas Retreats
              </h2>
            </Link>
            <p className="text-sand-dark/60 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.about')}
            </p>

            {/* Social */}
            <div className="flex gap-3">

              <a
                href="https://wa.me/306973219980"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-sand-dark/50 hover:border-wood/50 hover:text-wood transition-all duration-200"
              >
                {/* WhatsApp SVG */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-dark/40 mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li><Link to="/" className={linkClass} onClick={scrollToTop}>{t('nav.home')}</Link></li>
              <li><Link to="/?scrollToAccommodations=true" className={linkClass}>{t('footer.ourAccommodations')}</Link></li>
              <li><Link to="/explore" className={linkClass} onClick={scrollToTop}>{t('nav.explore')}</Link></li>
              <li><Link to="/contact" className={linkClass} onClick={scrollToTop}>{t('footer.contactUs')}</Link></li>
            </ul>
          </div>

          {/* Accommodations */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-dark/40 mb-4">
              {t('footer.accommodationsTitle')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/accommodation/wooden-house" className={linkClass} onClick={scrollToTop}>
                  {t('accommodation.woodenHouse')}
                </Link>
              </li>
              <li>
                <Link to="/accommodation/glamping-tent" className={linkClass} onClick={scrollToTop}>
                  {t('accommodation.glampingTent')}
                </Link>
              </li>
            </ul>
            <div className="mt-5 pt-5 border-t border-white/8">
              <p className="text-sand-dark/35 text-xs leading-relaxed">
                {t('footer.accommodationsTags')}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-dark/40 mb-4">
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-wood/60 mt-0.5 flex-shrink-0" />
                <span className="text-sand-dark/60 text-sm leading-snug">
                  {t('footer.address')}
                </span>
              </li>
              <li className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-wood/60 flex-shrink-0" />
                  <a href="tel:+306973219980" className="text-sand-dark/60 text-sm hover:text-wood transition-colors">
                    +30 697 321 9980
                  </a>
                </div>
                <div className="flex items-center gap-3 ml-7">
                  <a href="tel:+306980429891" className="text-sand-dark/60 text-sm hover:text-wood transition-colors">
                    +30 698 042 9891
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-wood/60 flex-shrink-0" />
                <a href="mailto:metaxasretreats@gmail.com" className="text-sand-dark/60 text-sm hover:text-wood transition-colors break-all">
                  metaxasretreats@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-sand-dark/30 text-xs select-none"
          >
            &copy; {new Date().getFullYear()} Metaxas Retreats. {t('footer.rights')}
          </p>

          <div className="flex items-center gap-5 text-xs text-sand-dark/30">
            <Link to="/privacy" className="hover:text-wood transition-colors" onClick={scrollToTop}>
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-wood transition-colors" onClick={scrollToTop}>
              {t('footer.terms')}
            </Link>
            <span>
              {t('footer.poweredBy')}{' '}
              <a href="https://www.amox.gr" target="_blank" rel="noopener noreferrer" className="hover:text-wood transition-colors">
                Amox
              </a>
              {' & '}
              <a href="https://www.thebluehourvillas.com/" target="_blank" rel="noopener noreferrer" className="hover:text-wood transition-colors">
                The Blue Hour Villas
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
