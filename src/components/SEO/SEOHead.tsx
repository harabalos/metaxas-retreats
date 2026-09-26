import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGES, localizePath } from '@/lib/i18nRoutes';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object | object[];
  keywords?: string;
  robots?: string;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  image = 'https://www.metaxasretreats.gr/assets/glamping-tent/view.jpg',
  type = 'website',
  schema,
  keywords,
  robots
}: SEOHeadProps) => {
  const { t, language } = useLanguage();

  // Pages pass text already translated for the current language.
  const displayTitle = title;
  const displayDescription = description;

  // Some page titles already end in the brand ("… | Metaxas Retreats"); don't add it twice.
  const fullTitle = displayTitle.includes('Metaxas Retreats')
    ? displayTitle
    : `${displayTitle} | Metaxas Retreats`;
  const siteUrl = 'https://www.metaxasretreats.gr';
  // canonicalUrl is the page's language-neutral path; each language has its own URL.
  const fullUrl = canonicalUrl ? `${siteUrl}${localizePath(language, canonicalUrl)}` : siteUrl;
  const indexable = !robots?.includes('noindex');

  const defaultKeywords = t('seo.defaultKeywords');
  const metaKeywords = keywords || defaultKeywords;

  // Compute locale from language for og tags
  const getLocale = (lang: string) => {
    switch (lang) {
      case 'el': return 'el_GR';
      case 'it': return 'it_IT';
      case 'de': return 'de_DE';
      case 'ro': return 'ro_RO';
      default: return 'en_US';
    }
  };
  const ogLocale = getLocale(language);

  // Handle both single schema and array of schemas
  const schemaString = schema
    ? Array.isArray(schema)
      ? JSON.stringify(schema)
      : JSON.stringify(schema)
    : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={displayDescription} />
      <meta name="keywords" content={metaKeywords} />
      {canonicalUrl && <link rel="canonical" href={fullUrl} />}
      {/* The same page in every language, English as the default for everyone else. */}
      {canonicalUrl && indexable && LANGUAGES.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={`${siteUrl}${localizePath(lang, canonicalUrl)}`} />
      ))}
      {canonicalUrl && indexable && <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl}`} />}

      {/* Enhanced robots directive */}
      <meta name="robots" content={robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={displayDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Metaxas Retreats" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={displayDescription} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org structured data */}
      {schemaString && (
        <script type="application/ld+json">
          {schemaString}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
