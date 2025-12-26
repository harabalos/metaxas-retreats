import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object | object[];
  keywords?: string;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  image = 'https://metaxasretreats.com/assets/glamping-tent/view.jpg',
  type = 'website',
  schema,
  keywords
}: SEOHeadProps) => {
  const fullTitle = `${title} | Metaxas Retreats`;
  const siteUrl = 'https://metaxasretreats.com';
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  
  // Default keywords for glamping/camping SEO
  const defaultKeywords = 'glamping Lefkada, glamping Greece, camping Greece, camping Lefkada, luxury camping Greek islands, beach accommodation Greece, Lefkada vacation rental, eco camping, beachfront glamping';
  const metaKeywords = keywords || defaultKeywords;

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
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      {canonicalUrl && <link rel="canonical" href={fullUrl} />}
      
      {/* Enhanced robots directive */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Metaxas Retreats" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="el_GR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
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
