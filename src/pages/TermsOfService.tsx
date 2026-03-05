import Layout from '@/components/Layout/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

const TermsOfService = () => {
  const { language, t } = useLanguage();

  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: language === 'el' ? 'Όροι Χρήσης - Metaxas Retreats' : 'Terms of Service - Metaxas Retreats',
    description:
      language === 'el'
        ? 'Όροι χρήσης και κανονισμοί διαμονής στο Metaxas Retreats στη Λευκάδα'
        : 'Terms of service and house rules for staying at Metaxas Retreats in Lefkada',
    url: 'https://metaxasretreats.gr/terms',
  };

  const sections = [
    { title: t('terms.section1.title'), content: <p>{t('terms.section1.content')}</p> },
    {
      title: t('terms.section2.title'),
      content: (
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{t('terms.section2.checkin')}</li>
          <li>{t('terms.section2.checkout')}</li>
        </ul>
      ),
    },
    {
      title: t('terms.section3.title'),
      content: (
        <>
          <p className="mb-2">{t('terms.section3.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>{t('terms.section3.rule1')}</li>
            <li>{t('terms.section3.rule2')}</li>
            <li>{t('terms.section3.rule3')}</li>
            <li>{t('terms.section3.rule4')}</li>
          </ul>
        </>
      ),
    },
    { title: t('terms.section4.title'), content: <p>{t('terms.section4.content')}</p> },
  ];

  return (
    <Layout>
      <SEOHead
        title="Terms of Service - Metaxas Retreats"
        titleEl="Όροι Χρήσης - Metaxas Retreats"
        description="Read our terms of service including booking policies, house rules, and cancellation terms for Metaxas Retreats in Lefkada, Greece."
        descriptionEl="Διαβάστε τους όρους χρήσης μας, συμπεριλαμβανομένων πολιτικών κράτησης, κανόνων διαμονής και όρων ακύρωσης για το Metaxas Retreats στη Λευκάδα."
        canonicalUrl="/terms"
        schema={termsSchema}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <FadeUp>
          <div className="mb-12">
            <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">{t('terms.title')}</h1>
            <p className="text-gray-400 text-sm font-sans">
              {language === 'el' ? 'Τελευταία ενημέρωση: Μάρτιος 2026' : 'Last updated: March 2026'}
            </p>
          </div>
        </FadeUp>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <FadeUp key={i} delay={i * 0.04}>
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-lg font-heading font-semibold text-forest-dark mb-3">{section.title}</h2>
                <div className="text-gray-600 text-sm leading-relaxed space-y-2">{section.content}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
