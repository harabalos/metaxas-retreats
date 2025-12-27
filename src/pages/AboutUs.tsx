import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, ThumbsUp } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEOHead
        title="About Us - The Metaxas Family Story"
        titleEl="Σχετικά με Εμάς - Η Ιστορία της Οικογένειας Μεταξά"
        description="Learn about Metaxas Retreats, a family-run glamping retreat in Mikros Gialos, Lefkada. Three generations of Greek hospitality welcoming guests to our beautiful island."
        descriptionEl="Μάθετε για το Metaxas Retreats, ένα οικογενειακό glamping καταφύγιο στον Μικρό Γιαλό, Λευκάδα. Τρεις γενιές ελληνικής φιλοξενίας καλωσορίζουν επισκέπτες στο όμορφο νησί μας."
        canonicalUrl="/about"
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">{t('about.title')}</h1>
        
        <div className="max-w-3xl mb-10">
          <p className="text-lg text-gray-700 mb-4">
            {t('about.welcome')}
          </p>
          <p className="text-gray-700 mb-4">
            {t('about.founded')}
          </p>
          <p className="text-gray-700 mb-6">
            {t('about.location')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-forest-light/10 border-forest/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-wood-light p-3 rounded-full">
                  <Users className="h-6 w-6 text-forest" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-center text-forest-dark mb-3">{t('about.family.title')}</h3>
              <p className="text-gray-700 text-center">
                {t('about.family.description')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-forest-light/10 border-forest/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-wood-light p-3 rounded-full">
                  <Heart className="h-6 w-6 text-forest" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-center text-forest-dark mb-3">{t('about.passion.title')}</h3>
              <p className="text-gray-700 text-center">
                {t('about.passion.description')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-forest-light/10 border-forest/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-wood-light p-3 rounded-full">
                  <ThumbsUp className="h-6 w-6 text-forest" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-center text-forest-dark mb-3">{t('about.promise.title')}</h3>
              <p className="text-gray-700 text-center">
                {t('about.promise.description')}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-12">
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">{t('about.story.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
              <p>{t('about.story.p4')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-wood-light/20 rounded-lg p-6">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">{t('about.why.title')}</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              {t('about.why.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t('about.why.beach')}</li>
              <li>{t('about.why.peaceful')}</li>
              <li>{t('about.why.tavernas')}</li>
              <li>{t('about.why.boats')}</li>
              <li>{t('about.why.base')}</li>
              <li>{t('about.why.beaches')}</li>
            </ul>
            <p className="text-forest-dark font-medium mt-4">
              {t('about.why.cta')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;