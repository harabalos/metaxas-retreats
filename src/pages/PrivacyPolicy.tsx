import Layout from '@/components/Layout/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const PrivacyPolicy = () => {
  const { language, t } = useLanguage();

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": language === 'el' ? "Πολιτική Απορρήτου - Metaxas Retreats" : "Privacy Policy - Metaxas Retreats",
    "description": language === 'el' 
      ? "Πολιτική απορρήτου του Metaxas Retreats για την προστασία των προσωπικών σας δεδομένων"
      : "Privacy policy of Metaxas Retreats regarding the protection of your personal data",
    "url": "https://metaxasretreats.com/privacy"
  };

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
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-8 text-center">
          {t('privacy.title')}
        </h1>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <ScrollArea className="h-[600px] pr-4">
            <div className="prose prose-green max-w-none text-gray-700 space-y-6">
              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('privacy.section1.title')}</h3>
                <p>{t('privacy.section1.content')}</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('privacy.section2.title')}</h3>
                <p>{t('privacy.section2.intro')}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>{t('privacy.section2.item1')}</li>
                  <li>{t('privacy.section2.item2')}</li>
                  <li>{t('privacy.section2.item3')}</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('privacy.section3.title')}</h3>
                <p>{t('privacy.section3.intro')}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>{t('privacy.section3.item1')}</li>
                  <li>{t('privacy.section3.item2')}</li>
                  <li>{t('privacy.section3.item3')}</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('privacy.section4.title')}</h3>
                <p>{t('privacy.section4.content')}</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('privacy.section5.title')}</h3>
                <p>{t('privacy.section5.content')}</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">{t('privacy.section6.title')}</h3>
                <p>{t('privacy.section6.content')}</p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
