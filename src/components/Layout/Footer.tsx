import { Link } from 'react-router-dom';
import { BookOpen, Mail, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <footer className="bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Metaxas Retreats</h3>
            <p className="text-forest-light mb-4">
              Experience the magic of Greek island living with our charming accommodations in Mikros Gialos, 
              nestled among beautiful trees and just steps from the azure Ionian Sea.
            </p>
            
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-forest-light hover:text-wood transition-colors" onClick={scrollToTop}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/?scrollToAccommodations=true" className="text-forest-light hover:text-wood transition-colors">
                  Our Accommodations
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-forest-light hover:text-wood transition-colors" onClick={scrollToTop}>
                  Explore Lefkada
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-forest-light hover:text-wood transition-colors" onClick={scrollToTop}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span className="text-forest-light">Poros, Mikros Gialos, Lefkada, Greece</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} />
                <span className="text-forest-light">+30 6973219980 +30 6980429891</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} />
                <span className="text-forest-light">metaxasretreats@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-forest-light mt-8 pt-8 text-center text-forest-light">
          <p>&copy; {new Date().getFullYear()} Metaxas Retreats. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;