import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Send, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams, Link } from 'react-router-dom';
import { accommodations } from '@/data/accommodations';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { contactFormSchema } from '@/lib/validationSchemas';
import { z } from 'zod';

const FORMSPREE_URL = 'https://formspree.io/f/mgoelyzg';

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const guestsParam = searchParams.get('guests');
  const id = window.location.pathname.split('/').pop();
  const tentParam = searchParams.get('tent');
  
  const accommodation = accommodations.find(acc => acc.id === id);
  const startDate = startParam ? new Date(startParam) : undefined;
  const endDate = endParam ? new Date(endParam) : undefined;
  const guests = guestsParam ? parseInt(guestsParam) : 1;
  const selectedTent = tentParam || "1";
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accommodationName = accommodation?.type === 'tent' 
    ? `${t('accommodation.glampingTent')} (${t('booking.tent')} ${selectedTent})`
    : t('accommodation.woodenHouse');

  const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

  const getWhatsAppMessage = () => {
    const checkIn = startDate ? formatDate(startDate) : '';
    const checkOut = endDate ? formatDate(endDate) : '';
    const message = language === 'el'
      ? `Γεια σας! Ενδιαφέρομαι για κράτηση στο ${accommodationName}.\n\nΆφιξη: ${checkIn}\nΑναχώρηση: ${checkOut}\nΕπισκέπτες: ${guests}`
      : `Hello! I'm interested in booking ${accommodationName}.\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}`;
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate with Zod
      const validatedData = contactFormSchema.parse({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests
      });

      if (!agreedToPolicy) {
        toast.error(language === 'el' ? 'Παρακαλώ αποδεχτείτε την Πολιτική Απορρήτου' : 'Please accept the Privacy Policy');
        return;
      }

      setIsSubmitting(true);

      const checkIn = startDate ? formatDate(startDate) : '';
      const checkOut = endDate ? formatDate(endDate) : '';

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.fullName,
          email: validatedData.email,
          phone: validatedData.phone || 'Not provided',
          accommodation: accommodationName,
          checkIn,
          checkOut,
          guests,
          message: validatedData.specialRequests || 'None',
          _subject: `Booking Request - ${accommodationName}`,
        }),
      });

      if (response.ok) {
        toast.success(language === 'el' ? 'Το αίτημά σας στάλθηκε επιτυχώς!' : 'Your request has been sent successfully!');
        setFormData({ fullName: '', email: '', phone: '', specialRequests: '' });
        setAgreedToPolicy(false);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error(language === 'el' ? 'Υπήρξε πρόβλημα. Δοκιμάστε ξανά.' : 'There was a problem. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Minimal booking details header */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pb-4">
          <span className="font-medium text-foreground">{accommodationName}</span>
          <span>{startDate ? formatDate(startDate) : '-'} → {endDate ? formatDate(endDate) : '-'}</span>
          <span>{guests} {language === 'el' ? 'επισκέπτες' : 'guests'}</span>
        </div>

        <Separator className="mb-6" />

        {/* WhatsApp Section */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 font-semibold mb-3">
            <MessageCircle className="h-5 w-5 text-green-600" />
            {t('booking.callWhatsapp')}
          </h3>
          <div className="space-y-2">
            <a 
              href={`https://wa.me/306973219980?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <div className="bg-green-500 p-2 rounded-full">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-800">+30 6973219980</p>
                <p className="text-xs text-green-600">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap for WhatsApp'}</p>
              </div>
            </a>
            
            <a 
              href={`https://wa.me/306980429891?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <div className="bg-green-500 p-2 rounded-full">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-800">+30 6980429891</p>
                <p className="text-xs text-green-600">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap for WhatsApp'}</p>
              </div>
            </a>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Email Form */}
        <div className="flex-1">
          <h3 className="flex items-center gap-2 font-semibold mb-3">
            <Mail className="h-5 w-5 text-sea" />
            {t('booking.emailUs')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t('form.fullName')} *</Label>
                <Input 
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={language === 'el' ? 'Ονοματεπώνυμο' : 'Full name'}
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="email">{t('form.email')} *</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="bg-background"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input 
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={language === 'el' ? 'Τηλέφωνο' : 'Phone number'}
                className="bg-background"
              />
            </div>
            
            <div>
              <Label htmlFor="specialRequests">{t('form.message')}</Label>
              <Textarea 
                id="specialRequests"
                name="message"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder={language === 'el' ? 'Το μήνυμά σας...' : 'Your message...'}
                rows={3}
                className="bg-background"
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="privacy-booking"
                checked={agreedToPolicy}
                onCheckedChange={(checked) => setAgreedToPolicy(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="privacy-booking" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
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
              disabled={isSubmitting}
              className="w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting 
                ? (language === 'el' ? 'Αποστολή...' : 'Sending...') 
                : t('form.sendRequest')}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSection;