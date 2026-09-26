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
  const { t } = useLanguage();

  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${t('terms.title')} - Metaxas Retreats`,
    description: t('terms.schema.description'),
    url: 'https://www.metaxasretreats.gr/terms',
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
        title={t('terms.title')}
        description={t('terms.schema.description')}
        canonicalUrl="/terms"
        robots="noindex, follow"
        schema={termsSchema}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <FadeUp>
          <div className="mb-12">
            <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">{t('legal.eyebrow')}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">{t('terms.title')}</h1>
            <p className="text-gray-400 text-sm font-sans">
              {t('legal.lastUpdated')}
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
