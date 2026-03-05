import { useState } from 'react';
import { Mail, Send, Phone, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { useAccommodations } from '@/hooks/useAccommodations';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { contactFormSchema } from '@/lib/validationSchemas';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const guestsParam = searchParams.get('guests');
  const tentParam = searchParams.get('tent');

  const { data: accommodations } = useAccommodations();
  const accommodation = accommodations?.find(acc => acc.id === id);
  const startDate = startParam ? new Date(startParam) : undefined;
  const endDate = endParam ? new Date(endParam) : undefined;
  const guests = guestsParam ? parseInt(guestsParam) : 1;
  const selectedTent = tentParam || '1';

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', specialRequests: '' });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const accommodationName = accommodation?.type === 'tent'
    ? `${t('accommodation.glampingTent')} (${t('booking.tent')} ${selectedTent})`
    : t('accommodation.woodenHouse');

  const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

  const getWhatsAppMessage = () => {
    const checkIn = startDate ? formatDate(startDate) : '';
    const checkOut = endDate ? formatDate(endDate) : '';
    const msg = language === 'el'
      ? `Γεια σας! Ενδιαφέρομαι για κράτηση στο ${accommodationName}.\n\nΆφιξη: ${checkIn}\nΑναχώρηση: ${checkOut}\nΕπισκέπτες: ${guests}`
      : `Hello! I'm interested in booking ${accommodationName}.\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}`;
    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = contactFormSchema.parse(formData);
      if (!agreedToPolicy) {
        toast.error(language === 'el' ? 'Παρακαλώ αποδεχτείτε την Πολιτική Απορρήτου' : 'Please accept the Privacy Policy');
        return;
      }
      setIsSubmitting(true);
      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          fullName: validated.fullName,
          email: validated.email,
          phone: validated.phone,
          specialRequests: validated.specialRequests,
          accommodation: accommodationName,
          checkIn: startDate ? formatDate(startDate) : '',
          checkOut: endDate ? formatDate(endDate) : '',
          guests,
          _subject: `Booking Request - ${accommodationName}`,
        },
      });
      if (error) throw new Error(error.message);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(language === 'el' ? 'Υπήρξε πρόβλημα. Δοκιμάστε ξανά.' : 'There was a problem. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const waNumbers = [
    { number: '306973219980', display: '+30 697 321 9980' },
    { number: '306980429891', display: '+30 698 042 9891' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-7">

      {/* WhatsApp */}
      <div>
        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gray-400 mb-4">
          {t('booking.callWhatsapp')}
        </p>
        <div className="space-y-3">
          {waNumbers.map(({ number, display }) => (
            <a
              key={number}
              href={`https://wa.me/${number}?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="font-sans font-semibold text-gray-800">{display}</p>
                <p className="text-xs text-gray-400">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap to open WhatsApp'}</p>
              </div>
              {/* WhatsApp logo pill */}
              <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">WhatsApp</span>
            </a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-sans">{language === 'el' ? 'ή στείλτε email' : 'or send an email'}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Email Form */}
      <div>
        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" />
          {t('booking.emailUs')}
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-7 w-7 text-forest" />
              </motion.div>
              <h3 className="font-heading font-semibold text-xl text-forest-dark mb-2">
                {language === 'el' ? 'Το μήνυμά σας στάλθηκε!' : 'Message sent!'}
              </h3>
              <p className="text-gray-500 text-sm">
                {language === 'el'
                  ? 'Θα σας απαντήσουμε σύντομα — συνήθως εντός μερικών ωρών.'
                  : "We'll get back to you soon — usually within a few hours."}
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm text-gray-600 mb-1 block">{t('form.fullName')} *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={language === 'el' ? 'Ονοματεπώνυμο' : 'Full name'}
                    className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-600 mb-1 block">{t('form.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm text-gray-600 mb-1 block">{t('form.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={language === 'el' ? 'Τηλέφωνο' : 'Phone number'}
                  className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest"
                />
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-sm text-gray-600 mb-1 block">{t('form.message')}</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder={language === 'el' ? 'Ειδικές απαιτήσεις ή ερωτήσεις...' : 'Special requests or questions...'}
                  rows={3}
                  className="rounded-xl border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy-booking"
                  checked={agreedToPolicy}
                  onCheckedChange={(v) => setAgreedToPolicy(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="privacy-booking" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                  {language === 'el'
                    ? 'Συμφωνώ με την '
                    : 'I agree with the '}
                  <Link to="/privacy" className="text-forest hover:underline">
                    {language === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
                  </Link>
                  {language === 'el'
                    ? ' και την επεξεργασία των προσωπικών μου δεδομένων.'
                    : ' and the processing of my personal data.'}
                </Label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {isSubmitting
                  ? (language === 'el' ? 'Αποστολή...' : 'Sending...')
                  : t('form.sendRequest')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactSection;
