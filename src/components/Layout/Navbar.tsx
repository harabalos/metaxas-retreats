
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToAccommodations = () => {
    if (location.pathname === '/') {
      // If already on homepage, simply scroll to the accommodations section
      const accommodationsSection = document.getElementById('accommodations');
      if (accommodationsSection) {
        accommodationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If on another page, navigate to homepage and then scroll
      navigate('/?scrollToAccommodations=true');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-heading font-bold text-forest">Metaxas Retreats</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToAccommodations}
              className="text-forest-dark hover:text-forest-light transition-colors"
            >
              Accommodations
            </button>
            <Link to="/explore" className="text-forest-dark hover:text-forest-light transition-colors">
              Explore
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-forest hover:bg-forest hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-forest-dark p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1 bg-white shadow-md">
            <button 
              onClick={() => {
                scrollToAccommodations();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-4 text-base hover:bg-forest-light hover:text-white transition-colors"
            >
              Accommodations
            </button>
            <Link 
              to="/explore" 
              className="block py-2 px-4 text-base hover:bg-forest-light hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 px-4 text-base hover:bg-forest-light hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
