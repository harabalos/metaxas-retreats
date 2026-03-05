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

const PrivacyPolicy = () => {
  const { language, t } = useLanguage();

  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: language === 'el' ? 'Πολιτική Απορρήτου - Metaxas Retreats' : 'Privacy Policy - Metaxas Retreats',
    description:
      language === 'el'
        ? 'Πολιτική απορρήτου του Metaxas Retreats για την προστασία των προσωπικών σας δεδομένων'
        : 'Privacy policy of Metaxas Retreats regarding the protection of your personal data',
    url: 'https://metaxasretreats.gr/privacy',
  };

  const sections = [
    { title: t('privacy.section1.title'), content: <p>{t('privacy.section1.content')}</p> },
    {
      title: t('privacy.section2.title'),
      content: (
        <>
          <p className="mb-2">{t('privacy.section2.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>{t('privacy.section2.item1')}</li>
            <li>{t('privacy.section2.item2')}</li>
            <li>{t('privacy.section2.item3')}</li>
            <li>{t('privacy.section2.item4')}</li>
          </ul>
        </>
      ),
    },
    {
      title: t('privacy.section3.title'),
      content: (
        <>
          <p className="mb-2">{t('privacy.section3.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>{t('privacy.section3.item1')}</li>
            <li>{t('privacy.section3.item2')}</li>
            <li>{t('privacy.section3.item3')}</li>
          </ul>
        </>
      ),
    },
    { title: t('privacy.section4.title'), content: <p>{t('privacy.section4.content')}</p> },
    { title: t('privacy.section5.title'), content: <p>{t('privacy.section5.content')}</p> },
    {
      title: t('privacy.section6.title'),
      content: <p>{t('privacy.section6.content')}</p>,
    },
    {
      title: t('privacy.section7.title'),
      content: (
        <p>
          {t('privacy.section7.content')}{' '}
          <a href="mailto:metaxasretreats@gmail.com" className="text-forest hover:text-wood transition-colors underline underline-offset-2">
            metaxasretreats@gmail.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="Privacy Policy - Metaxas Retreats"
        titleEl="Πολιτική Απορρήτου - Metaxas Retreats"
        description="Learn how Metaxas Retreats protects your personal information. Our privacy policy explains data collection, usage, and your rights."
        descriptionEl="Μάθετε πώς το Metaxas Retreats προστατεύει τα προσωπικά σας δεδομένα. Η πολιτική απορρήτου μας εξηγεί τη συλλογή, χρήση δεδομένων και τα δικαιώματά σας."
        canonicalUrl="/privacy"
        schema={privacySchema}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <FadeUp>
          <div className="mb-12">
            <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">{t('privacy.title')}</h1>
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

export default PrivacyPolicy;
