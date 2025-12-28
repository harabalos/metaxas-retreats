import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Fix the Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ContactUs = () => {
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const getWhatsAppMessage = () => {
    const message = language === 'el'
      ? 'Γεια σας! Θα ήθελα πληροφορίες για τα καταλύματά σας.'
      : 'Hello! I would like information about your accommodations.';
    return encodeURIComponent(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error(language === 'el' ? 'Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία' : 'Please fill in the required fields');
      return;
    }

    const subjectText = formData.subject || (language === 'el' ? 'Γενικό Ερώτημα' : 'General Inquiry');
    const subject = encodeURIComponent(`${subjectText} - Metaxas Retreats`);
    
    const body = encodeURIComponent(
      language === 'el'
        ? `Γεια σας,

${formData.message}

Στοιχεία Επικοινωνίας:
Ονοματεπώνυμο: ${formData.fullName}
Email: ${formData.email}

Ευχαριστώ!`
        : `Hello,

${formData.message}

Contact Details:
Full Name: ${formData.fullName}
Email: ${formData.email}

Thank you!`
    );
    
    window.location.href = `mailto:metaxasretreats@gmail.com?subject=${subject}&body=${body}`;
    toast.success(language === 'el' ? 'Ανοίγει η εφαρμογή email...' : 'Opening email app...');
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
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          {t('contact.subtitle')}
        </p>
        
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">{t('contact.visit')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">Metaxas Retreats</p>
              <p className="text-foreground">{language === 'el' ? 'Πόρος, Μικρός Γιαλός' : 'Poros, Mikros Gialos'}</p>
              <p className="text-foreground">{language === 'el' ? 'Λευκάδα, Ιόνια Νησιά' : 'Lefkada, Ionian Islands'}</p>
              <p className="text-foreground">{language === 'el' ? 'Ελλάδα' : 'Greece'}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-forest-dark">{t('contact.call')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a 
                href={`https://wa.me/306973219980?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-green-800 font-medium">+30 6973219980</span>
              </a>
              <a 
                href={`https://wa.me/306980429891?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-green-800 font-medium">+30 6980429891</span>
              </a>
              <p className="text-sm text-muted-foreground">{language === 'el' ? 'Διαθέσιμοι καθημερινά' : 'Available daily'}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <Mail className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">{t('contact.email')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">metaxasretreats@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-2">{language === 'el' ? 'Θα απαντήσουμε εντός μίας ώρας' : "We'll respond within an hour"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Form */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-forest-dark flex items-center gap-2">
              <Send className="h-5 w-5" />
              {t('form.sendMessage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">{t('form.fullName')} *</Label>
                  <Input 
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={language === 'el' ? 'Το ονοματεπώνυμό σας' : 'Your full name'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">{t('form.email')} *</Label>
                  <Input 
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'el' ? 'Το email σας' : 'Your email'}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">{t('form.subject')}</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'el' ? 'Επιλέξτε θέμα' : 'Select a subject'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={language === 'el' ? 'Γενικό Ερώτημα' : 'General Inquiry'}>
                      {language === 'el' ? 'Γενικό Ερώτημα' : 'General Inquiry'}
                    </SelectItem>
                    <SelectItem value={language === 'el' ? 'Ερώτηση Διαθεσιμότητας' : 'Availability Question'}>
                      {language === 'el' ? 'Ερώτηση Διαθεσιμότητας' : 'Availability Question'}
                    </SelectItem>
                    <SelectItem value={language === 'el' ? 'Άλλο' : 'Other'}>
                      {language === 'el' ? 'Άλλο' : 'Other'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">{t('form.message')} *</Label>
                <Textarea 
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={language === 'el' ? 'Το μήνυμά σας...' : 'Your message...'}
                  rows={5}
                />
              </div>

              <Button type="submit" className="bg-sea hover:bg-sea-dark">
                <Send className="h-4 w-4 mr-2" />
                {t('form.sendMessage')}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Map */}
        <div className="bg-card shadow-lg rounded-lg overflow-hidden mb-10">
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
        
        {/* CTA Banner */}
        <div className="bg-sea-light/20 rounded-lg p-6 border border-sea/20">
          <h2 className="text-2xl font-heading font-semibold text-sea-dark mb-4">{t('contact.book')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('contact.bookDescription')}
          </p>
          <Link to="/#accommodations">
            <Button className="bg-sea hover:bg-sea-dark">
              {language === 'el' ? 'Δείτε τα Καταλύματά μας' : 'View Our Accommodations'}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
