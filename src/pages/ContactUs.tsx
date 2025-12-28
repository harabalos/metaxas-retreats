import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ContactUs = () => {
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Google Maps embed coordinates
  const lat = 38.64003296086357;
  const lng = 20.699029254119495;

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
      "latitude": lat.toString(),
      "longitude": lng.toString()
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error(language === 'el' ? 'Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία' : 'Please fill in the required fields');
      return;
    }

    if (!agreedToPolicy) {
      toast.error(language === 'el' ? 'Παρακαλώ αποδεχτείτε την Πολιτική Απορρήτου' : 'Please accept the Privacy Policy');
      return;
    }

    const subject = encodeURIComponent(
      language === 'el' 
        ? `Μήνυμα Επικοινωνίας - Metaxas Retreats` 
        : `Contact Message - Metaxas Retreats`
    );
    
    const body = encodeURIComponent(
      language === 'el'
        ? `Γεια σας,

${formData.message}

Στοιχεία Επικοινωνίας:
Ονοματεπώνυμο: ${formData.fullName}
Email: ${formData.email}
Τηλέφωνο: ${formData.phone || 'Δεν παρέχεται'}

Ευχαριστώ!`
        : `Hello,

${formData.message}

Contact Details:
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Thank you!`
    );
    
    window.location.href = `mailto:metaxasretreats@gmail.com?subject=${subject}&body=${body}`;
    toast.success(language === 'el' ? 'Ανοίγει η εφαρμογή email...' : 'Opening email app...');
  };

  const contactItems = [
    {
      icon: MapPin,
      title: language === 'el' ? 'Διεύθυνση' : 'Address',
      lines: [
        language === 'el' ? 'Μικρός Γιαλός, Πόρος' : 'Mikros Gialos, Poros',
        language === 'el' ? 'Λευκάδα, Ελλάδα 31082' : 'Lefkada, Greece 31082'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      lines: ['metaxasretreats@gmail.com']
    }
  ];

  const whatsappNumbers = [
    { number: '+30 6973219980', link: '306973219980' },
    { number: '+30 6980429891', link: '306980429891' }
  ];

  const getWhatsAppMessage = () => {
    const message = language === 'el'
      ? 'Γεια σας! Θα ήθελα πληροφορίες για τα καταλύματά σας.'
      : 'Hello! I would like information about your accommodations.';
    return encodeURIComponent(message);
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
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Column - Contact Form */}
            <Card className="h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  {language === 'el' ? 'Αποστολή Μηνύματος' : 'Send Message'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="fullName" className="text-foreground">
                      {language === 'el' ? 'Ονοματεπώνυμο' : 'Full Name'} <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={language === 'el' ? 'Ονοματεπώνυμο' : 'Full name'}
                      className="mt-1.5 bg-background"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-foreground">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="mt-1.5 bg-background"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-foreground">
                      {language === 'el' ? 'Τηλέφωνο' : 'Phone'}
                    </Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={language === 'el' ? 'Τηλέφωνο' : 'Phone'}
                      className="mt-1.5 bg-background"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-foreground">
                      {language === 'el' ? 'Μήνυμα' : 'Message'} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea 
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'el' ? 'Μήνυμα' : 'Message'}
                      rows={5}
                      className="mt-1.5 bg-background resize-y"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="privacy"
                      checked={agreedToPolicy}
                      onCheckedChange={(checked) => setAgreedToPolicy(checked === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {language === 'el' 
                        ? 'Συμφωνώ με την Πολιτική Απορρήτου και την επεξεργασία των προσωπικών μου δεδομένων. '
                        : 'I agree with the Privacy Policy and the processing of my personal data. '}
                      <Link to="/privacy" className="text-sea hover:underline">
                        {language === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-sand hover:bg-sand-dark text-sand-foreground py-6"
                  >
                    {language === 'el' ? 'Αποστολή Μηνύματος' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Right Column - Contact Details + Map */}
            <div className="space-y-6">
              <Card className="h-auto">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                    {language === 'el' ? 'Στοιχεία Επικοινωνίας' : 'Contact Details'}
                  </h2>
                  
                  <div className="space-y-5">
                    {contactItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="bg-sand/30 p-3 rounded-full flex-shrink-0">
                          <item.icon className="h-5 w-5 text-sand-dark" />
                        </div>
                        <div className="pt-0.5">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          {item.lines.map((line, lineIndex) => (
                            <p key={lineIndex} className="text-muted-foreground text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* WhatsApp Section */}
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="pt-0.5 flex-1">
                        <h3 className="font-medium text-foreground">WhatsApp</h3>
                        <div className="space-y-2 mt-1">
                          {whatsappNumbers.map((item, index) => (
                            <a 
                              key={index}
                              href={`https://wa.me/${item.link}?text=${getWhatsAppMessage()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>{item.number}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Google Maps Embed */}
              <Card className="overflow-hidden">
                <div className="h-[280px]">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDM4JzI0LjEiTiAyMMKwNDEnNTYuNSJF!5e0!3m2!1sen!2sgr!4v1700000000000!5m2!1sen!2sgr`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Metaxas Retreats Location"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;