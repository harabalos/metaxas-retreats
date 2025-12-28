import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { accommodations } from '@/data/accommodations';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

  const accommodationName = accommodation?.type === 'tent' 
    ? `${t('accommodation.glampingTent')} (${t('booking.tent')} ${selectedTent})`
    : t('accommodation.woodenHouse');

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  const getWhatsAppMessage = () => {
    const checkIn = startDate ? formatDate(startDate) : '';
    const checkOut = endDate ? formatDate(endDate) : '';
    const message = language === 'el'
      ? `Γεια σας! Ενδιαφέρομαι για κράτηση στο ${accommodationName}.\n\nΆφιξη: ${checkIn}\nΑναχώρηση: ${checkOut}\nΕπισκέπτες: ${guests}`
      : `Hello! I'm interested in booking ${accommodationName}.\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}`;
    return encodeURIComponent(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error(language === 'el' ? 'Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία' : 'Please fill in the required fields');
      return;
    }

    const checkIn = startDate ? formatDate(startDate) : '';
    const checkOut = endDate ? formatDate(endDate) : '';
    
    const subject = encodeURIComponent(
      language === 'el' 
        ? `Αίτημα Κράτησης - ${accommodationName}` 
        : `Booking Request - ${accommodationName}`
    );
    
    const body = encodeURIComponent(
      language === 'el'
        ? `Γεια σας,

Θα ήθελα να κάνω κράτηση:

Κατάλυμα: ${accommodationName}
Άφιξη: ${checkIn}
Αναχώρηση: ${checkOut}
Επισκέπτες: ${guests}

Στοιχεία Επικοινωνίας:
Ονοματεπώνυμο: ${formData.fullName}
Email: ${formData.email}
Τηλέφωνο: ${formData.phone || 'Δεν παρέχεται'}

Ειδικά Αιτήματα:
${formData.specialRequests || 'Κανένα'}

Ευχαριστώ!`
        : `Hello,

I would like to make a booking:

Accommodation: ${accommodationName}
Check-in: ${checkIn}
Check-out: ${checkOut}
Guests: ${guests}

Contact Details:
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Special Requests:
${formData.specialRequests || 'None'}

Thank you!`
    );
    
    window.location.href = `mailto:metaxasretreats@gmail.com?subject=${subject}&body=${body}`;
    toast.success(language === 'el' ? 'Ανοίγει η εφαρμογή email...' : 'Opening email app...');
  };
  
  return (
    <div className="space-y-6">
      {/* Email Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-sea" />
            {t('booking.emailUs')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div>
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input 
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={language === 'el' ? 'Το τηλέφωνό σας' : 'Your phone number'}
              />
            </div>
            
            <div>
              <Label htmlFor="specialRequests">{t('form.message')}</Label>
              <Textarea 
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder={language === 'el' ? 'Το μήνυμά σας...' : 'Your message...'}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-sea hover:bg-sea-dark">
              <Send className="h-4 w-4 mr-2" />
              {t('form.sendRequest')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* WhatsApp Contact - Below Email Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            {t('booking.callWhatsapp')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
              <p className="text-sm text-green-600">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap for WhatsApp'}</p>
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
              <p className="text-sm text-green-600">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap for WhatsApp'}</p>
            </div>
          </a>
        </CardContent>
      </Card>

    </div>
  );
};

export default ContactSection;
