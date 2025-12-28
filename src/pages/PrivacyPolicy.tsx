import Layout from '@/components/Layout/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-8 text-center">Privacy Policy</h1>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <ScrollArea className="h-[600px] pr-4">
            <div className="prose prose-green max-w-none text-gray-700 space-y-6">
              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">1. Introduction</h3>
                <p>
                  Welcome to Metaxas Retreats ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you visit our website or make a booking at our property in Mikros Gialos, Lefkada.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">2. Information We Collect</h3>
                <p>We collect personal information that you voluntarily provide to us when you make a reservation or contact us, including:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Names and Contact Details (Email, Phone Number)</li>
                  <li>Booking Details (Arrival/Departure dates, Number of guests)</li>
                  <li>Payment Information (Processed securely by our payment providers; we do not store credit card details on our servers)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">3. How We Use Your Information</h3>
                <p>We use your information to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Facilitate your booking and provide requested services.</li>
                  <li>Communicate with you regarding your stay (e.g., check-in instructions).</li>
                  <li>Comply with local legal obligations (e.g., Greek tourism tax records).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">4. Cookies and Tracking</h3>
                <p>
                  We use cookies and similar tracking technologies (like Google Analytics) to access or store information. This helps us analyze website traffic and improve your user experience. You can refuse the use of cookies by adjusting your browser settings.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">5. Data Retention</h3>
                <p>
                  We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law (such as tax, accounting, or other legal requirements).
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-forest-dark mb-2">6. Contact Us</h3>
                <p>
                  If you have questions or comments about this policy, you may email us at contact@metaxasretreats.com.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;