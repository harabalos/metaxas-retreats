import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { Home, ArrowRight } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <Layout>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        robots="noindex, nofollow"
      />
      <div className="min-h-[85vh] flex items-center justify-center px-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-lg"
        >
          {/* Big editorial 404 */}
          <motion.p
            variants={itemVariants}
            className="font-heading font-semibold text-[clamp(6rem,20vw,12rem)] leading-none text-forest/8 select-none mb-2"
          >
            404
          </motion.p>

          <motion.p variants={itemVariants} className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-4 -mt-4">
            {language === 'el' ? 'Σελίδα δεν βρέθηκε' : 'Page not found'}
          </motion.p>

          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-heading font-semibold text-forest-dark mb-4">
            {language === 'el'
              ? 'Αυτή η σελίδα δεν υπάρχει'
              : "This page doesn't exist"}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
            {language === 'el'
              ? 'Η σελίδα που ψάχνετε μπορεί να έχει μετακινηθεί ή να μην υπάρχει πλέον.'
              : "The page you're looking for may have moved or no longer exists."}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className="btn-shimmer flex items-center gap-2 px-7 py-3 rounded-full bg-forest text-white font-sans font-semibold text-sm tracking-wide hover:bg-forest-dark transition-colors"
            >
              <Home className="h-4 w-4" />
              {language === 'el' ? 'Αρχική' : 'Return Home'}
            </Link>
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-2 px-7 py-3 rounded-full border border-gray-200 text-gray-600 font-sans font-semibold text-sm tracking-wide hover:border-forest hover:text-forest transition-colors"
            >
              {language === 'el' ? 'Επικοινωνία' : 'Contact Us'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
