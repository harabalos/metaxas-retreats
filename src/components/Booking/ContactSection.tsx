import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send } from 'lucide-react';
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
      {/* Minimal booking details */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground border-b pb-4">
        <span><strong>{accommodationName}</strong></span>
        <span>{startDate ? formatDate(startDate) : '-'} → {endDate ? formatDate(endDate) : '-'}</span>
        <span>{guests} {language === 'el' ? 'επισκέπτες' : 'guests'}</span>
      </div>

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
    </div>
  );
};

export default ContactSection;
