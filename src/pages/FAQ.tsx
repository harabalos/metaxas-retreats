import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ_ITEMS } from '@/data/faq';
import { breadcrumbs, business, faqPage, graph } from '@/lib/schema';

/**
 * Questions guests ask, answered in full. Linked only from the footer: it's
 * here for the visitors who look for it, and for search engines and AI
 * assistants, which also get the answers as FAQPage schema and in llms.txt.
 * Nothing fades in, so the answers are readable in the prerendered HTML.
 */
const FAQ = () => {
  const { t, localize } = useLanguage();

  const schema = graph(
    business(t),
    faqPage(t),
    breadcrumbs(t, [[t('faq.title'), '/faq']]),
  );

  return (
    <Layout>
      <SEOHead
        title={t('seo.faq.title')}
        description={t('seo.faq.description')}
        canonicalUrl="/faq"
        schema={schema}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <div className="mb-12">
          <p className="text-wood-deep text-xs font-sans font-semibold uppercase tracking-widest mb-3">{t('faq.eyebrow')}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark">{t('faq.title')}</h1>
        </div>

        <div className="space-y-10">
          {FAQ_ITEMS.map(({ q, a }) => (
            <section key={q} className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-heading font-semibold text-forest-dark mb-3">{t(q)}</h2>
              <p className="text-gray-600 leading-relaxed">{t(a)}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-gray-100 pt-8 text-gray-600">
          {t('faq.more')}{' '}
          <Link to={localize('/contact')} className="text-forest font-medium underline underline-offset-2 hover:text-wood transition-colors">
            {t('home.accommodations.getInTouch')}
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default FAQ;
