import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { validateEmail } from '@/utils/validation';
import { toast } from 'sonner';

interface GuestInformationFormProps {
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
  }) => void;
}

const GuestInformationForm = ({ onSubmit }: GuestInformationFormProps) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      toast.error(t('form.errorRequired'));
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t('form.errorEmail'));
      return;
    }

    onSubmit({ firstName, lastName, email, phone, specialRequests });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('form.guestInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('form.firstName')} *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('form.lastName')} *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">{t('form.specialRequests')}</Label>
            <Input
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full md:w-auto bg-sea hover:bg-sea-dark">
            {t('form.completeBooking')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestInformationForm;
