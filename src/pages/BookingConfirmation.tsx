import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Home, CalendarDays, Users, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import SEOHead from '@/components/SEO/SEOHead';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-forest-dark mb-4">Booking Information Missing</h1>
            <p className="text-gray-500 mb-8">Please complete a booking before accessing this page.</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full bg-forest text-white font-sans font-semibold text-sm hover:bg-forest-dark transition-colors">
              Return to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { accommodation, startDate, endDate, guests, totalPrice, customerName, paymentMethod, isDepositOnly } = bookingData;

  const fmt = (date: Date) => format(new Date(date), 'EEE, d MMM yyyy');
  const depositAmount = Math.round(totalPrice * 0.25);
  const remainingAmount = totalPrice - depositAmount;

  const bankDetails = (
    <div className="mt-3 p-4 rounded-xl bg-forest/4 text-sm space-y-1 font-mono">
      <p><span className="text-gray-400">IBAN:</span> <span className="text-gray-800">GR16 0172 2020 0052 2012 9152 477</span></p>
      <p><span className="text-gray-400">BIC/SWIFT:</span> <span className="text-gray-800">PIRBGRAA</span></p>
      <p><span className="text-gray-400">Bank:</span> <span className="text-gray-800">Piraeus Bank</span></p>
      <p><span className="text-gray-400">Beneficiary:</span> <span className="text-gray-800">Metaxas Retreats</span></p>
    </div>
  );

  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'card':
        return { icon: CreditCard, title: 'Bank Transfer', description: `Full amount of €${totalPrice} to be paid by bank transfer.`, extra: bankDetails };
      case 'deposit':
        return {
          icon: Banknote,
          title: isDepositOnly ? '25% Deposit + Cash on Arrival' : 'Full Payment by Bank Transfer',
          description: isDepositOnly
            ? `Deposit of €${depositAmount} by bank transfer. Remaining €${remainingAmount} in cash on arrival.`
            : `Full amount of €${totalPrice} by bank transfer.`,
          extra: bankDetails,
        };
      default:
        return { icon: CreditCard, title: 'Payment', description: `Total: €${totalPrice}`, extra: null };
    }
  };

  const pd = getPaymentDetails();
  const PayIcon = pd.icon;

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <Layout>
      <SEOHead
        title="Booking Confirmed — Metaxas Retreats"
        description="Your booking confirmation at Metaxas Retreats glamping in Lefkada, Greece."
        robots="noindex, nofollow"
      />

      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

          {/* Animated checkmark */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6"
            >
              <motion.svg
                viewBox="0 0 52 52"
                className="w-10 h-10"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M14 27 L22 35 L38 19"
                  stroke="#1E3B2F"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                />
              </motion.svg>
            </motion.div>

            <h1 className="text-4xl font-heading font-semibold text-forest-dark mb-3">Booking Confirmed!</h1>
            <p className="text-gray-500">Thank you, <strong>{customerName}</strong>. We look forward to welcoming you to Metaxas Retreats.</p>
          </motion.div>

          {/* Booking details card */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
            <h2 className="text-xl font-heading font-semibold text-forest-dark">Booking Details</h2>

            {/* Property */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={accommodation.images[0] || '/images/placeholder.svg'} alt={accommodation.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-forest-dark">{accommodation.name}</h3>
                <p className="text-xs text-gray-400">Mikros Gialos, Lefkada, Greece</p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: CalendarDays, label: 'Check-in', value: fmt(startDate) },
                { icon: CalendarDays, label: 'Check-out', value: fmt(endDate) },
                { icon: Users, label: 'Guests', value: guests },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <Icon className="h-4 w-4 text-forest/60 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Payment */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PayIcon className="h-4 w-4 text-forest/60" />
                <span className="font-semibold text-gray-800 text-sm">{pd.title}</span>
              </div>
              <p className="text-sm text-gray-600">{pd.description}</p>
              {pd.extra}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-heading font-semibold text-forest-dark">€{totalPrice}</span>
            </div>
          </motion.div>

          {/* What's next */}
          <motion.div variants={itemVariants} className="bg-forest/4 rounded-2xl p-6 space-y-3">
            <h2 className="font-heading font-semibold text-forest-dark text-lg">What's Next?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We've sent a confirmation email with all the details. If you have any questions or special requests, don't hesitate to contact us.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 px-6 py-2.5 rounded-full bg-forest text-white font-sans font-semibold text-sm hover:bg-forest-dark transition-colors"
            >
              <Home className="h-4 w-4 inline-block mr-2 -mt-0.5" />
              Return to Home
            </button>
          </motion.div>

        </motion.div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
