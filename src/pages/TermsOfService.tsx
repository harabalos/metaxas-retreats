import Layout from '@/components/Layout/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-8 text-center">Terms of Service</h1>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <ScrollArea className="h-[600px] pr-4">
            <div className="prose prose-green max-w-none text-gray-700 space-y-6">
              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">1. Agreement to Terms</h3>
                <p>
                  These Terms of Service constitute a legally binding agreement made between you ("the Guest") and Metaxas Retreats regarding your stay at our property in Lefkada. By making a reservation, you agree to these terms.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">2. Booking and Cancellation</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Check-in:</strong> After 3:00 PM.</li>
                  <li><strong>Check-out:</strong> Before 11:00 AM.</li>
                  <li><strong>Cancellation:</strong> Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival. No refund for cancellations within 14 days of arrival.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">3. House Rules</h3>
                <p>To ensure a pleasant stay for everyone:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>No smoking inside the accommodations.</li>
                  <li>No parties or events without prior approval.</li>
                  <li>Quiet hours are from 11:00 PM to 8:00 AM.</li>
                  <li>Guests are responsible for any damages caused to the property during their stay.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">4. Liability</h3>
                <p>
                  Metaxas Retreats is not liable for any loss, damage, or theft of personal property. Guests use the facilities at their own risk. We are not responsible for accidents or injuries occurring on the premises unless caused by our proven negligence.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">5. Governing Law</h3>
                <p>
                  These terms shall be governed by and defined following the laws of Greece. Metaxas Retreats and yourself irrevocably consent that the courts of Lefkada shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;