import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

// Fix the Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ContactUs = () => {
  const { t, language } = useLanguage();
  
  // Updated coordinates as requested - [lat, lng] format for Leaflet
  const metaxasRentsCoords: [number, number] = [38.640048782722396, 20.69898862142832];
  const position = metaxasRentsCoords;

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Metaxas Retreats",
    "description": language === 'el' 
      ? "Πολυτελές glamping και ενοικιαζόμενα διαμερίσματα διακοπών στον Μικρό Γιαλό, Λευκάδα, Ελλάδα"
      : "Luxury glamping and vacation rentals in Mikros Gialos, Lefkada, Greece",
    "url": "https://metaxasretreats.com/contact",
    "telephone": "+30 6973219980",
    "email": "metaxasretreats@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mikros Gialos, Poros",
      "addressLocality": "Lefkada",
      "addressRegion": "Ionian Islands",
      "postalCode": "31082",
      "addressCountry": "GR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.640048",
      "longitude": "20.698988"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Metaxas Retreats - Book Your Stay in Lefkada"
        titleEl="Επικοινωνία - Κάντε Κράτηση στη Λευκάδα"
        description="Contact us for reservations at our glamping retreat in Mikros Gialos, Lefkada, Greece. Phone, email, and directions to find us. Response within 1 hour."
        descriptionEl="Επικοινωνήστε μαζί μας για κρατήσεις στο glamping καταφύγιό μας στον Μικρό Γιαλό, Λευκάδα. Τηλέφωνο, email και οδηγίες. Απάντηση εντός 1 ώρας."
        canonicalUrl="/contact"
        schema={contactSchema}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">{t('contact.title')}</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl">
          {t('contact.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">{t('contact.visit')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Metaxas Retreats</p>
              <p className="text-gray-700">{language === 'el' ? 'Πόρος, Μικρός Γιαλός' : 'Poros, Mikros Gialos'}</p>
              <p className="text-gray-700">{language === 'el' ? 'Λευκάδα, Ιόνια Νησιά' : 'Lefkada, Ionian Islands'}</p>
              <p className="text-gray-700">{language === 'el' ? 'Ελλάδα' : 'Greece'}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <Phone className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">{t('contact.call')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">+30 6973219980 +30 6980429891</p>
              <p className="text-gray-600 mt-2">{language === 'el' ? 'Διαθέσιμοι καθημερινά' : 'Available daily'}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <Mail className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">{t('contact.email')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">metaxasretreats@gmail.com</p>
              <p className="text-gray-600 mt-2">{language === 'el' ? 'Θα απαντήσουμε εντός μίας ώρας' : "We'll respond within an hour"}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-10">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark p-4 border-b">{t('contact.location')}</h2>
          <div className="h-[500px] relative">
            <MapContainer 
              center={position}
              zoom={11} 
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <b>Metaxas Retreats</b><br />
                  {language === 'el' ? 'Πόρος, Μικρός Γιαλός, Λευκάδα' : 'Poros, Mikros Gialos, Lefkada'}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="p-4 bg-forest-light/10">
            <p className="text-forest-dark">
              <strong>{language === 'el' ? 'Σημείωση:' : 'Note:'}</strong> {t('contact.mapNote')}
            </p>
          </div>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-forest-dark">{t('contact.reach')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-forest text-lg mb-2">{t('contact.byCar')}</h3>
              <p className="text-gray-700">
                {language === 'el' 
                  ? 'Από την πόλη της Λευκάδας, ακολουθήστε τις πινακίδες προς το Νυδρί και συνεχίστε νότια. Τα καταλύματά μας βρίσκονται στην περιοχή του Μικρού Γιαλού, μόλις 50μ από την παραλία.'
                  : 'From Lefkada Town, follow the signs to Nidri and continue south. Our accommodations are located in the area of Mikros Gialos, just 50m from the beach.'}
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium text-forest text-lg mb-2">{t('contact.byBus')}</h3>
              <p className="text-gray-700">
                {language === 'el'
                  ? 'Υπάρχουν τακτικά δρομολόγια λεωφορείων από την πόλη της Λευκάδας προς τα Σύβοτα. Από τα Σύβοτα, μπορείτε να πάρετε ταξί για τον Μικρό Γιαλό (περίπου 5 χλμ).'
                  : 'There are regular bus services from Lefkada Town to Sivota. From Sivota, you can take a taxi to Mikros Gialos (approximately 5km).'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-forest text-lg mb-2">{t('contact.byBoat')}</h3>
              <p className="text-gray-700">
                {language === 'el'
                  ? 'Ο Μικρός Γιαλός είναι προσβάσιμος με σκάφος από διάφορα σημεία κατά μήκος της ανατολικής ακτής της Λευκάδας.'
                  : 'Mikros Gialos is accessible by boat from various points along the east coast of Lefkada.'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-wood-light/20 rounded-lg p-6">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">{t('contact.book')}</h2>
          <p className="text-gray-700 mb-4">
            {t('contact.bookDescription')}
          </p>
          <p className="text-forest-dark">
            {t('contact.callToAction')}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;