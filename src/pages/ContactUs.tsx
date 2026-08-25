import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { contactFormSchema } from '@/lib/validationSchemas';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

const ContactUs = () => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const lat = 38.64003296086357;
  const lng = 20.699029254119495;

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Metaxas Retreats",
    "description": language === 'el' ? "Πολυτελές glamping και ενοικιαζόμενα διαμερίσματα διακοπών στον Μικρό Γιαλό, Λευκάδα, Ελλάδα" : "Luxury glamping and vacation rentals in Mikros Gialos, Lefkada, Greece",
    "url": "https://metaxasretreats.gr/contact",
    "telephone": "+30 6973219980",
    "email": "metaxasretreats@gmail.com",
    "address": { "@type": "PostalAddress", "streetAddress": "Mikros Gialos, Poros", "addressLocality": "Lefkada", "addressRegion": "Ionian Islands", "postalCode": "31082", "addressCountry": "GR" },
    "geo": { "@type": "GeoCoordinates", "latitude": lat.toString(), "longitude": lng.toString() },
    "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "08:00", "closes": "22:00" }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = contactFormSchema.parse({ fullName: formData.fullName, email: formData.email, phone: formData.phone, message: formData.message });
      if (!validated.message?.trim()) { toast.error(language === 'el' ? 'Παρακαλώ συμπληρώστε το μήνυμα' : 'Please fill in the message'); return; }
      if (!agreedToPolicy) { toast.error(language === 'el' ? 'Παρακαλώ αποδεχτείτε την Πολιτική Απορρήτου' : 'Please accept the Privacy Policy'); return; }
      setIsSubmitting(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: validated.fullName, email: validated.email, phone: validated.phone, message: validated.message, _subject: 'Contact Message - Metaxas Retreats' }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      setSubmitted(true);
    } catch (err) {
      if (err instanceof z.ZodError) { toast.error(err.errors[0].message); }
      else { toast.error(language === 'el' ? 'Υπήρξε πρόβλημα. Δοκιμάστε ξανά.' : 'There was a problem. Please try again.'); }
    } finally {
      setIsSubmitting(false);
    }
  };

  const waMsg = encodeURIComponent(language === 'el' ? 'Γεια σας! Θα ήθελα πληροφορίες για τα καταλύματά σας.' : 'Hello! I would like information about your accommodations.');

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

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">

        {/* Header */}
        <FadeUp>
          <div className="mb-12">
            <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">{language === 'el' ? 'Επικοινωνία' : 'Get in Touch'}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">{t('contact.title')}</h1>
            <p className="text-gray-500 max-w-xl leading-relaxed">{t('contact.subtitle')}</p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Form */}
          <FadeUp delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8">
              <h2 className="text-xl font-heading font-semibold text-forest-dark mb-6">
                {language === 'el' ? 'Αποστολή Μηνύματος' : 'Send a Message'}
              </h2>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle className="h-8 w-8 text-forest" />
                    </motion.div>
                    <h3 className="font-heading font-semibold text-2xl text-forest-dark mb-3">
                      {language === 'el' ? 'Το μήνυμά σας στάλθηκε!' : 'Message sent!'}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      {language === 'el'
                        ? 'Θα σας απαντήσουμε σύντομα — συνήθως εντός 1 ώρας.'
                        : "We'll get back to you soon — usually within 1 hour."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="fullName" className="text-sm text-gray-600 mb-1.5 block">{language === 'el' ? 'Ονοματεπώνυμο' : 'Full Name'} *</Label>
                        <Input id="fullName" type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder={language === 'el' ? 'Ονοματεπώνυμο' : 'Full name'} className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm text-gray-600 mb-1.5 block">Email *</Label>
                        <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm text-gray-600 mb-1.5 block">{language === 'el' ? 'Τηλέφωνο' : 'Phone'}</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={language === 'el' ? 'Τηλέφωνο' : 'Phone'} className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest" />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm text-gray-600 mb-1.5 block">{language === 'el' ? 'Μήνυμα' : 'Message'} *</Label>
                      <Textarea id="message" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={language === 'el' ? 'Πώς μπορούμε να σας βοηθήσουμε;' : 'How can we help you?'} rows={5} className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest resize-none" />
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="privacy" checked={agreedToPolicy} onCheckedChange={(v) => setAgreedToPolicy(v === true)} className="mt-0.5" />
                      <Label htmlFor="privacy" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                        {language === 'el' ? 'Συμφωνώ με την ' : 'I agree with the '}
                        <Link to="/privacy" className="text-forest hover:underline">{language === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}</Link>
                        {language === 'el' ? ' και την επεξεργασία των δεδομένων μου.' : ' and the processing of my data.'}
                      </Label>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="h-4 w-4" />
                      {isSubmitting ? (language === 'el' ? 'Αποστολή...' : 'Sending...') : (language === 'el' ? 'Αποστολή Μηνύματος' : 'Send Message')}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Right — Info + Map */}
          <div className="space-y-6">
            <FadeUp delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 space-y-6">
                <h2 className="text-xl font-heading font-semibold text-forest-dark">
                  {language === 'el' ? 'Στοιχεία Επικοινωνίας' : 'Contact Details'}
                </h2>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest/8 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-forest" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">{language === 'el' ? 'Διεύθυνση' : 'Address'}</p>
                    <p className="text-sm text-gray-500">{language === 'el' ? 'Μικρός Γιαλός, Πόρος' : 'Mikros Gialos, Poros'}</p>
                    <p className="text-sm text-gray-500">{language === 'el' ? 'Λευκάδα, Ελλάδα 31082' : 'Lefkada, Greece 31082'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest/8 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-forest" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">Email</p>
                    <a href="mailto:metaxasretreats@gmail.com" className="text-sm text-forest hover:text-wood transition-colors">metaxasretreats@gmail.com</a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gray-400 mb-3">WhatsApp</p>
                  <div className="space-y-2.5">
                    {[{ num: '306973219980', display: '+30 697 321 9980' }, { num: '306980429891', display: '+30 698 042 9891' }].map(({ num, display }) => (
                      <a key={num} href={`https://wa.me/${num}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group">
                        <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-sans font-semibold text-gray-700 group-hover:text-green-700 transition-colors">{display}</span>
                        <span className="ml-auto text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">WA</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Map */}
            <FadeUp delay={0.2}>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-card h-[260px]">
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
            </FadeUp>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
