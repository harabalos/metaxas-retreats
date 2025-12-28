import Layout from '@/components/Layout/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const TermsOfService = () => {
  const { language, t } = useLanguage();

  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": language === 'el' ? "Όροι Χρήσης - Metaxas Retreats" : "Terms of Service - Metaxas Retreats",
    "description": language === 'el'
      ? "Όροι χρήσης και κανονισμοί διαμονής στο Metaxas Retreats στη Λευκάδα"
      : "Terms of service and house rules for staying at Metaxas Retreats in Lefkada",
    "url": "https://metaxasretreats.com/terms"
  };

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
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-8 text-center">
          {t('terms.title')}
        </h1>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <ScrollArea className="h-[600px] pr-4">
            <div className="prose prose-green max-w-none text-gray-700 space-y-6">
              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('terms.section1.title')}</h3>
                <p>{t('terms.section1.content')}</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('terms.section2.title')}</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>{t('terms.section2.checkin')}</strong></li>
                  <li><strong>{t('terms.section2.checkout')}</strong></li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('terms.section3.title')}</h3>
                <p>{t('terms.section3.intro')}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>{t('terms.section3.rule1')}</li>
                  <li>{t('terms.section3.rule2')}</li>
                  <li>{t('terms.section3.rule3')}</li>
                  <li>{t('terms.section3.rule4')}</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('terms.section4.title')}</h3>
                <p>{t('terms.section4.content')}</p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
