import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/context/LanguageContext';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object | object[];
  keywords?: string;
  titleEl?: string;
  descriptionEl?: string;
  robots?: string;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  image = 'https://metaxasretreats.gr/assets/glamping-tent/view.jpg',
  type = 'website',
  schema,
  keywords,
  titleEl,
  descriptionEl,
  robots
}: SEOHeadProps) => {
  const { t, language } = useLanguage();

  // Use language-specific content
  const displayTitle = language === 'el' && titleEl ? titleEl : title;
  const displayDescription = language === 'el' && descriptionEl ? descriptionEl : description;

  const fullTitle = `${displayTitle} | Metaxas Retreats`;
  const siteUrl = 'https://metaxasretreats.gr';
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

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

      {/* Hreflang tags for international SEO */}
      {canonicalUrl && (
        <>
          <link rel="alternate" hrefLang="en" href={`${siteUrl}${canonicalUrl}`} />
          <link rel="alternate" hrefLang="el" href={`${siteUrl}${canonicalUrl}`} />
          <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl}`} />
        </>
      )}

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
