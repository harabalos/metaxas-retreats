import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ContactSection = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.contactTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 p-3 rounded-md text-sm">
          <p className="font-medium text-green-800">{t('booking.saveDiscount')}</p>
          <p className="text-green-700">{t('booking.discountDescription')}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md border">
            <Phone className="h-5 w-5 text-sea mt-0.5" />
            <div>
              <h3 className="font-medium">{t('booking.callWhatsapp')}</h3>
              <p className="text-lg font-medium text-sea-dark">+30 6973219980 +30 6980429891</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md border">
            <Mail className="h-5 w-5 text-sea mt-0.5" />
            <div>
              <h3 className="font-medium">{t('booking.emailUs')}</h3>
              <p className="text-lg font-medium text-sea-dark">metaxasretreats@gmail.com</p>
            </div>
          </div>
          
          <div className="p-4 bg-sea-light/10 rounded-md border border-sea/20">
            <h3 className="font-medium mb-2">{t('booking.selectedDates')}</h3>
            <p className="text-gray-700">{t('booking.referenceDates')}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            <p>{t('booking.alsoAvailable')}</p>
            <div className="flex space-x-3 mt-1">
              <a 
                href="https://www.airbnb.gr/rooms/936140564087838043?source_impression_id=p3_1745246045_P32OFwyiKEHNkXyt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-sea"
              >
                <span>Airbnb</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a 
                href="https://www.booking.com/hotel/gr/metaxaki.el.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-sea"
              >
                <span>Booking.com</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSection;
