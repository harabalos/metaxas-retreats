
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
type Language = 'en' | 'el';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.accommodations': 'Accommodations',
    'nav.explore': 'Explore Lefkada',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    
    // Homepage
    'home.hero.title': 'Experience the Magic of Greek Island Living',
    'home.hero.subtitle': 'Beautiful accommodations nestled between trees and the azure Aegean Sea',
    'home.hero.viewAccommodations': 'View Accommodations',
    'home.hero.exploreIsland': 'Explore the Island',
    'home.welcome.title': 'Welcome to Metaxas Retreats',
    'home.welcome.description': 'Our beautiful accommodations offer the perfect blend of authenticity, comfort, and natural beauty. Choose between our charming wooden house or luxury glamping tent to experience the true essence of Greek island living surrounded by beautiful trees.',
    'home.wooden.title': 'Wooden House',
    'home.wooden.description': 'Our spacious wooden house combines traditional architecture with modern comforts, offering stunning sea views and a private outdoor area.',
    'home.glamping.title': 'Glamping Tent',
    'home.glamping.description': 'Experience luxury camping in our beautifully decorated tent, combining the adventure of outdoor living with hotel-like amenities and comfort.',
    'home.accommodations.title': 'Our Accommodations',
    'home.accommodations.subtitle': 'Choose from our unique accommodations, each offering a special experience of island living surrounded by nature.',
    'home.cta.title': 'Ready for Your Greek Island Getaway?',
    'home.cta.description': 'Book your stay now and experience the beauty, tranquility, and authentic charm of our island accommodations.',
    'home.cta.button': 'Book Your Stay',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We\'d love to hear from you! Find us in the beautiful area of Poros, Mikros Gialos in Lefkada island, or reach out through phone or email.',
    'contact.visit': 'Visit Us',
    'contact.call': 'Call Us',
    'contact.email': 'Email Us',
    'contact.location': 'Our Location',
    'contact.mapNote': 'Note: Mikros Gialos is one of the most beautiful bays in Lefkada, with crystal clear waters and a peaceful atmosphere. Our accommodations are just a short walk from the beach!',
    'contact.reach': 'How to Reach Us',
    'contact.byCar': 'By Car',
    'contact.byBus': 'By Bus',
    'contact.byBoat': 'By Boat',
    'contact.book': 'Book Your Stay in Mikros Gialos',
    'contact.bookDescription': 'Experience the beauty and tranquility of Mikros Gialos bay, with its crystal-clear turquoise waters, pebble beach, and charming tavernas. Our accommodations offer the perfect base to explore this hidden gem of Lefkada island.',
    'contact.callToAction': 'Contact us now to check availability for your preferred dates!',

    // Footer
    'footer.rights': 'All Rights Reserved',
  },
  el: {
    // Navigation
    'nav.home': 'Αρχική',
    'nav.accommodations': 'Καταλύματα',
    'nav.explore': 'Εξερευνήστε τη Λευκάδα',
    'nav.about': 'Σχετικά με Εμάς',
    'nav.contact': 'Επικοινωνία',
    
    // Homepage
    'home.hero.title': 'Ζήστε τη Μαγεία της Ελληνικής Νησιωτικής Ζωής',
    'home.hero.subtitle': 'Όμορφα καταλύματα ανάμεσα σε δέντρα και το γαλάζιο Αιγαίο',
    'home.hero.viewAccommodations': 'Δείτε τα Καταλύματα',
    'home.hero.exploreIsland': 'Εξερευνήστε το Νησί',
    'home.welcome.title': 'Καλώς Ήρθατε στο Metaxas Retreats',
    'home.welcome.description': 'Τα όμορφα καταλύματά μας προσφέρουν τον τέλειο συνδυασμό αυθεντικότητας, άνεσης και φυσικής ομορφιάς. Επιλέξτε ανάμεσα στο γοητευτικό μας ξύλινο σπίτι ή την πολυτελή σκηνή glamping για να βιώσετε την αληθινή ουσία της ελληνικής νησιωτικής ζωής περιτριγυρισμένοι από όμορφα δέντρα.',
    'home.wooden.title': 'Ξύλινο Σπίτι',
    'home.wooden.description': 'Το ευρύχωρο ξύλινο σπίτι μας συνδυάζει την παραδοσιακή αρχιτεκτονική με τις σύγχρονες ανέσεις, προσφέροντας εκπληκτική θέα στη θάλασσα και ιδιωτικό εξωτερικό χώρο.',
    'home.glamping.title': 'Σκηνή Glamping',
    'home.glamping.description': 'Απολαύστε την πολυτελή κατασκήνωση στην όμορφα διακοσμημένη σκηνή μας, συνδυάζοντας την περιπέτεια της υπαίθριας διαβίωσης με ανέσεις ξενοδοχείου και άνεση.',
    'home.accommodations.title': 'Τα Καταλύματά Μας',
    'home.accommodations.subtitle': 'Επιλέξτε από τα μοναδικά μας καταλύματα, το καθένα προσφέροντας μια ξεχωριστή εμπειρία νησιωτικής ζωής περιτριγυρισμένη από τη φύση.',
    'home.cta.title': 'Έτοιμοι για τις Ελληνικές Νησιωτικές Διακοπές σας;',
    'home.cta.description': 'Κάντε κράτηση τώρα και απολαύστε την ομορφιά, την ηρεμία και την αυθεντική γοητεία των νησιωτικών καταλυμάτων μας.',
    'home.cta.button': 'Κάντε Κράτηση',
    
    // Contact
    'contact.title': 'Επικοινωνία',
    'contact.subtitle': 'Θα χαρούμε να σας ακούσουμε! Βρείτε μας στην όμορφη περιοχή του Πόρου, στον Μικρό Γιαλό της Λευκάδας, ή επικοινωνήστε μαζί μας τηλεφωνικά ή μέσω email.',
    'contact.visit': 'Επισκεφθείτε μας',
    'contact.call': 'Καλέστε μας',
    'contact.email': 'Email',
    'contact.location': 'Η Τοποθεσία μας',
    'contact.mapNote': 'Σημείωση: Ο Μικρός Γιαλός είναι ένας από τους ομορφότερους κόλπους της Λευκάδας, με κρυστάλλινα νερά και γαλήνια ατμόσφαιρα. Τα καταλύματά μας βρίσκονται μόλις λίγα λεπτά με τα πόδια από την παραλία!',
    'contact.reach': 'Πώς να Φτάσετε σε Εμάς',
    'contact.byCar': 'Με Αυτοκίνητο',
    'contact.byBus': 'Με Λεωφορείο',
    'contact.byBoat': 'Με Βάρκα',
    'contact.book': 'Κάντε Κράτηση στον Μικρό Γιαλό',
    'contact.bookDescription': 'Απολαύστε την ομορφιά και την ηρεμία του κόλπου του Μικρού Γιαλού, με τα κρυστάλλινα τιρκουάζ νερά, την παραλία με βότσαλα και τις γραφικές ταβέρνες. Τα καταλύματά μας προσφέρουν την τέλεια βάση για να εξερευνήσετε αυτό το κρυμμένο διαμάντι του νησιού της Λευκάδας.',
    'contact.callToAction': 'Επικοινωνήστε μαζί μας τώρα για να ελέγξετε τη διαθεσιμότητα για τις επιθυμητές σας ημερομηνίες!',

    // Footer
    'footer.rights': 'Όλα τα Δικαιώματα Διατηρούνται',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize with English as default
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'el')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
