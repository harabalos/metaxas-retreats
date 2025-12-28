import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'el' | 'it' | 'de';

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
    'home.hero.welcome': 'Welcome to Metaxas Retreats',
    'home.hero.subtitle': 'Luxury glamping experience above the perfect turquoise waters of Mikros Gialos bay in Lefkada',
    'home.hero.viewAccommodations': 'View Accommodations',
    'home.section.title': 'Glamping in Lefkada',
    'home.section.description': 'Nestled among olive trees and overlooking the crystal-clear waters of Mikros Gialos bay, our accommodations offer an unparalleled blend of luxury camping and authentic Greek island living, just steps away from one of Lefkada\'s most beautiful beaches.',
    'home.wooden.title': 'Wooden House',
    'home.wooden.description': 'Our spacious wooden house offers panoramic sea views of Mikros Gialos bay, for an authentic island experience.',
    'home.glamping.title': 'Glamping Tent',
    'home.glamping.description': 'Experience luxury camping in our elegant tent with premium bedding and amenities, surrounded by nature yet just a short walk to the turquoise waters of Mikros Gialos beach.',
    'home.accommodations.title': 'Our Accommodations',
    'home.reviews.title': 'Guest Reviews',
    'home.cta.title': 'Experience Lefkada in Style',
    'home.cta.description': 'Book your glamping getaway now and wake up to stunning views of the turquoise waters of one of Lefkada\'s most beautiful bays.',
    'home.cta.button': 'Book Your Stay',
    
    // Accommodation Card
    'card.guests': 'guests',
    'card.beds': 'beds',
    'card.viewDetails': 'View Details',
    'card.fromPrice': 'From',
    'card.perNight': '/night',
    
    // About Page
    'about.title': 'About Us',
    'about.welcome': 'Welcome to Metaxas Retreats, your gateway to authentic Greek island living in the stunning Mikros Gialos bay of Lefkada.',
    'about.founded': 'Founded by the Metaxas family with a deep love for this beautiful corner of Lefkada, we offer charming accommodations that blend traditional Greek elements with modern comfort.',
    'about.location': 'Our properties are nestled in the tranquil area of Poros in Mikros Gialos, surrounded by olive trees and just steps away from one of the most beautiful beaches on the island. We take pride in providing our guests with a peaceful retreat where they can experience the authentic beauty and rhythm of Greek island life.',
    'about.family.title': 'Our Family',
    'about.family.description': 'For three generations, the Metaxas family has been welcoming visitors to Mikros Gialos, sharing our love for Lefkada\'s natural beauty and traditional hospitality.',
    'about.passion.title': 'Our Passion',
    'about.passion.description': 'We\'re passionate about creating memorable experiences for our guests, offering authentic accommodations that reflect the true spirit of Greek island living.',
    'about.promise.title': 'Our Promise',
    'about.promise.description': 'We promise personal attention, clean and comfortable accommodations, and insider knowledge to help you discover the very best of Lefkada.',
    'about.story.title': 'Our Story',
    'about.story.p1': 'The story of Metaxas Retreats began in the 1980s when Georgios Metaxas, enchanted by the pristine beauty of Mikros Gialos, built a summer home for his family in this peaceful corner of Lefkada. As friends began asking to stay in this idyllic location, the idea for Metaxas Retreats was born.',
    'about.story.p2': 'Over the years, what started as a simple guesthouse has evolved into our current collection of charming accommodations, each designed to provide comfort while preserving the authentic character of traditional Greek island living.',
    'about.story.p3': 'Today, the second and third generations of the Metaxas family continue this tradition of hospitality, welcoming guests from around the world to experience the magic of Mikros Gialos.',
    'about.story.p4': 'While we\'ve added modern amenities and comforts, our philosophy remains the same: to share the authentic beauty, flavors, and rhythms of life in this special corner of Lefkada island.',
    'about.why.title': 'Why Choose Mikros Gialos?',
    'about.why.intro': 'Mikros Gialos is one of Lefkada\'s most beautiful bays, offering a perfect balance of natural beauty, tranquility, and convenience. Our location in the Poros area provides:',
    'about.why.beach': 'A stunning pebble beach with crystal-clear turquoise waters, ideal for swimming and snorkeling',
    'about.why.peaceful': 'Peaceful surroundings away from the island\'s more crowded areas',
    'about.why.tavernas': 'Walking distance to excellent local tavernas serving fresh seafood and traditional Greek cuisine',
    'about.why.boats': 'Easy access to boat trips exploring the beautiful east coast of Lefkada',
    'about.why.base': 'A perfect base for exploring the entire island, with Lefkada Town just 25km away',
    'about.why.beaches': 'Close proximity to other beautiful beaches including Agiofili and Vassiliki',
    'about.why.cta': 'Experience the authentic charm of Greek island living at Metaxas Retreats in Mikros Gialos!',
    
    // Explore Page
    'explore.title': 'Explore Lefkada Island',
    'explore.intro': 'Discover the emerald jewel of the Ionian Sea. Lefkada offers breathtaking beaches, charming mountain villages, delicious local cuisine, and exciting activities for every type of traveler.',
    'explore.beaches': 'Beaches',
    'explore.villages': 'Villages',
    'explore.activities': 'Activities',
    'explore.cuisine': 'Local Cuisine',
    'explore.plan.title': 'Plan Your Perfect Day',
    'explore.plan.beach.title': 'Beach Day',
    'explore.plan.beach.description': 'Wake up in your glamping tent in Mikros Gialos, head to the beach for a morning swim, enjoy lunch at a local taverna in Mikros Gialos or Sivota, and finish with sunset drinks at Eksantheia village.',
    'explore.plan.village.title': 'Village Exploration',
    'explore.plan.village.description': 'Start your day in Mikros Gialos or Sivota, drive to mountain village Karya for lunch, and end your day in Agios Nikitas for dinner by the sea.',
    'explore.plan.water.title': 'Water Activities',
    'explore.plan.water.description': 'Take a morning sailing trip from Nidri around nearby islands, enjoy lunch at Meganisi, and spend the afternoon windsurfing in Vasiliki.',
    'explore.specialties.title': 'Local Specialties',
    'explore.specialties.subtitle': 'Traditional dishes you must try',
    'explore.restaurants.title': 'Where to Eat',
    'explore.restaurants.subtitle': 'Recommended restaurants and tavernas',
    'explore.products.title': 'Local Products',
    'explore.products.subtitle': 'Take a taste of Lefkada home with you',
    
    // Contact Page
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
    'footer.about': 'Experience the magic of Greek island living with our charming accommodations in Mikros Gialos, nestled among beautiful trees and just steps from the azure Ionian Sea.',
    'footer.quickLinks': 'Quick Links',
    'footer.ourAccommodations': 'Our Accommodations',
    'footer.contactUs': 'Contact Us',
    'footer.rights': 'All rights reserved.',
    'footer.poweredBy': 'Powered by',
    
    // Accommodations
    'accommodation.woodenHouse': 'Wooden House',
    'accommodation.glampingTent': 'Glamping Tent',
    'accommodation.woodenHouse.description': 'Experience authentic Greek island living in our charming wooden house. Nestled among olive trees with stunning sea views. The spacious terrace is ideal for enjoying the famous Greek sunsets while sipping local wine. Inside, you\'ll find a fully equipped kitchen, comfortable living area, and thoughtfully designed bedrooms with premium linens.',
    'accommodation.woodenHouse.short': 'Charming wooden house with sea views for comfortable vacation',
    'accommodation.glampingTent.description': 'Our luxury glamping tent offers an unforgettable experience combining the adventure of camping with hotel-like amenities. Set in a peaceful location among ancient olive trees, this spacious tent features one comfortable double-sized bed and 3 single beds with premium linens, electricity, and stylish furnishings. The private outdoor seating area is perfect for morning coffee or evening relaxation under the stars. Experience the magic of island living with all the comforts you need.',
    'accommodation.glampingTent.short': 'Spacious glamping experience with hotel-quality comfort surrounded by beautiful trees',
    
    // Amenities
    'amenity.seaView': 'Sea view',
    'amenity.parking': 'Parking',
    'amenity.beachDistance': '50m from the beach',
    'amenity.airConditioning': 'Air conditioning',
    'amenity.kitchen': 'Fully equipped kitchen',
    'amenity.wifi': 'High-speed Wi-Fi',
    'amenity.terrace': 'Private terrace',
    'amenity.outdoorDining': 'Outdoor dining area',
    'amenity.washingMachine': 'Washing machine',
    'amenity.rampAccess': 'Ramp access',
    'amenity.outdoorSeating': 'Private outdoor seating',
    'amenity.ecoFriendly': 'Eco-friendly amenities',
    
    // Accommodation Detail Page
    'detail.notFound': 'Accommodation Not Found',
    'detail.notFoundText': 'The accommodation you\'re looking for doesn\'t exist.',
    'detail.returnHome': 'Return to Home',
    'detail.about': 'About this accommodation',
    'detail.features': 'Features',
    'detail.guests': 'guests',
    'detail.bedrooms': 'bedrooms',
    'detail.beds': 'beds',
    'detail.bathrooms': 'bathrooms',
    'detail.amenities': 'Amenities',
    
    // Booking Summary
    'summary.title': 'Booking Summary',
    'summary.checkIn': 'Check-in',
    'summary.checkOut': 'Check-out',
    'summary.guests': 'Guests',
    'summary.total': 'Total',
    
    // Booking Page
    'booking.pageTitle': 'Contact Us for Booking',
    'booking.pageSubtitle': 'Contact us directly to confirm availability and complete your booking.',
    'booking.missingInfo': 'Booking Information Missing',
    'booking.selectFirst': 'Please select an accommodation and dates before proceeding.',
    'booking.tent': 'Tent',
    'booking.contactTitle': 'Contact for Booking',
    'booking.saveDiscount': 'Save 15% by booking direct!',
    'booking.discountDescription': 'Our website prices are 15% cheaper than Airbnb/Booking.com.',
    'booking.callWhatsapp': 'Call or Text (WhatsApp)',
    'booking.emailUs': 'Email Us',
    'booking.selectedDates': 'Your Selected Dates',
    'booking.referenceDates': 'Please reference your selected dates and accommodation when contacting us so we can assist you more efficiently.',
    'booking.alsoAvailable': 'Also available on:',
    
    // Privacy Policy
    'privacy.title': 'Privacy Policy',
    'privacy.section1.title': '1. Introduction',
    'privacy.section1.content': 'Welcome to Metaxas Retreats ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you visit our website or make a booking at our property in Mikros Gialos, Lefkada.',
    'privacy.section2.title': '2. Information We Collect',
    'privacy.section2.intro': 'We collect personal information that you voluntarily provide to us when you make a reservation or contact us, including:',
    'privacy.section2.item1': 'Names and Contact Details (Email, Phone Number)',
    'privacy.section2.item2': 'Booking Details (Arrival/Departure dates, Number of guests)',
    'privacy.section2.item3': 'Payment Information (Processed securely by our payment providers; we do not store credit card details on our servers)',
    'privacy.section3.title': '3. How We Use Your Information',
    'privacy.section3.intro': 'We use your information to:',
    'privacy.section3.item1': 'Facilitate your booking and provide requested services.',
    'privacy.section3.item2': 'Communicate with you regarding your stay (e.g., check-in instructions).',
    'privacy.section3.item3': 'Comply with local legal obligations (e.g., Greek tourism tax records).',
    'privacy.section4.title': '4. Cookies and Tracking',
    'privacy.section4.content': 'We use cookies and similar tracking technologies (like Google Analytics) to access or store information. This helps us analyze website traffic and improve your user experience. You can refuse the use of cookies by adjusting your browser settings.',
    'privacy.section5.title': '5. Data Retention',
    'privacy.section5.content': 'We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law (such as tax, accounting, or other legal requirements).',
    'privacy.section6.title': '6. Contact Us',
    'privacy.section6.content': 'If you have questions or comments about this policy, you may email us at metaxasretreats@gmail.com.',
    
    // Terms of Service
    'terms.title': 'Terms of Service',
    'terms.section1.title': '1. Agreement to Terms',
    'terms.section1.content': 'These Terms of Service constitute a legally binding agreement made between you ("the Guest") and Metaxas Retreats regarding your stay at our property in Lefkada. By making a reservation, you agree to these terms.',
    'terms.section2.title': '2. Booking and Cancellation',
    'terms.section2.checkin': 'Check-in: After 3:00 PM.',
    'terms.section2.checkout': 'Check-out: Before 11:00 AM.',
    'terms.section2.cancellation': 'Cancellation: Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival. No refund for cancellations within 14 days of arrival.',
    'terms.section3.title': '3. House Rules',
    'terms.section3.intro': 'To ensure a pleasant stay for everyone:',
    'terms.section3.rule1': 'No smoking inside the accommodations.',
    'terms.section3.rule2': 'No parties or events without prior approval.',
    'terms.section3.rule3': 'Quiet hours are from 11:00 PM to 8:00 AM.',
    'terms.section3.rule4': 'Guests are responsible for any damages caused to the property during their stay.',
    'terms.section4.title': '4. Liability',
    'terms.section4.content': 'Metaxas Retreats is not liable for any loss, damage, or theft of personal property. Guests use the facilities at their own risk. We are not responsible for accidents or injuries occurring on the premises unless caused by our proven negligence.',
    'terms.section5.title': '5. Governing Law',
    'terms.section5.content': 'These terms shall be governed by and defined following the laws of Greece. Metaxas Retreats and yourself irrevocably consent that the courts of Lefkada shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.',
    
    // Footer
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  el: {
    // Navigation
    'nav.home': 'Αρχική',
    'nav.accommodations': 'Καταλύματα',
    'nav.explore': 'Εξερευνήστε τη Λευκάδα',
    'nav.about': 'Σχετικά με Εμάς',
    'nav.contact': 'Επικοινωνία',
    
    // Homepage
    'home.hero.welcome': 'Καλώς Ήρθατε στο Metaxas Retreats',
    'home.hero.subtitle': 'Πολυτελής εμπειρία glamping πάνω από τα τέλεια τιρκουάζ νερά του κόλπου του Μικρού Γιαλού στη Λευκάδα',
    'home.hero.viewAccommodations': 'Δείτε τα Καταλύματα',
    'home.section.title': 'Glamping στη Λευκάδα',
    'home.section.description': 'Φωλιασμένα ανάμεσα σε ελαιόδεντρα με θέα στα κρυστάλλινα νερά του κόλπου του Μικρού Γιαλού, τα καταλύματά μας προσφέρουν έναν απαράμιλλο συνδυασμό πολυτελούς κατασκήνωσης και αυθεντικής ελληνικής νησιωτικής ζωής, σε απόσταση αναπνοής από μία από τις ομορφότερες παραλίες της Λευκάδας.',
    'home.wooden.title': 'Ξύλινο Σπίτι',
    'home.wooden.description': 'Το ευρύχωρο ξύλινο σπίτι μας προσφέρει πανοραμική θέα στη θάλασσα του κόλπου του Μικρού Γιαλού, για μια αυθεντική νησιωτική εμπειρία.',
    'home.glamping.title': 'Σκηνή Glamping',
    'home.glamping.description': 'Απολαύστε την πολυτελή κατασκήνωση στην κομψή μας σκηνή με premium κλινοσκεπάσματα και ανέσεις, περιτριγυρισμένοι από τη φύση αλλά σε μικρή απόσταση με τα πόδια από τα τιρκουάζ νερά της παραλίας του Μικρού Γιαλού.',
    'home.accommodations.title': 'Τα Καταλύματά Μας',
    'home.reviews.title': 'Κριτικές Επισκεπτών',
    'home.cta.title': 'Ζήστε τη Λευκάδα με Στυλ',
    'home.cta.description': 'Κάντε κράτηση για την glamping απόδρασή σας τώρα και ξυπνήστε με εκπληκτική θέα στα τιρκουάζ νερά ενός από τους ομορφότερους κόλπους της Λευκάδας.',
    'home.cta.button': 'Κάντε Κράτηση',
    
    // Accommodation Card
    'card.guests': 'άτομα',
    'card.beds': 'κρεβάτια',
    'card.viewDetails': 'Δείτε Λεπτομέρειες',
    'card.fromPrice': 'Από',
    'card.perNight': '/βράδυ',
    
    // About Page
    'about.title': 'Σχετικά με Εμάς',
    'about.welcome': 'Καλώς ήρθατε στο Metaxas Retreats, η πύλη σας στην αυθεντική ελληνική νησιωτική ζωή στον εκπληκτικό κόλπο του Μικρού Γιαλού της Λευκάδας.',
    'about.founded': 'Ιδρύθηκε από την οικογένεια Μεταξά με βαθιά αγάπη για αυτή την όμορφη γωνιά της Λευκάδας, προσφέρουμε γοητευτικά καταλύματα που συνδυάζουν παραδοσιακά ελληνικά στοιχεία με σύγχρονη άνεση.',
    'about.location': 'Οι ιδιοκτησίες μας βρίσκονται στην ήσυχη περιοχή του Πόρου στον Μικρό Γιαλό, περιτριγυρισμένες από ελαιόδεντρα και σε απόσταση αναπνοής από μία από τις πιο όμορφες παραλίες του νησιού. Είμαστε περήφανοι που παρέχουμε στους επισκέπτες μας ένα ειρηνικό καταφύγιο όπου μπορούν να βιώσουν την αυθεντική ομορφιά και τον ρυθμό της ελληνικής νησιωτικής ζωής.',
    'about.family.title': 'Η Οικογένειά Μας',
    'about.family.description': 'Για τρεις γενιές, η οικογένεια Μεταξά καλωσορίζει επισκέπτες στον Μικρό Γιαλό, μοιράζοντας την αγάπη μας για τη φυσική ομορφιά της Λευκάδας και την παραδοσιακή φιλοξενία.',
    'about.passion.title': 'Το Πάθος Μας',
    'about.passion.description': 'Είμαστε παθιασμένοι με τη δημιουργία αξέχαστων εμπειριών για τους επισκέπτες μας, προσφέροντας αυθεντικά καταλύματα που αντικατοπτρίζουν το αληθινό πνεύμα της ελληνικής νησιωτικής ζωής.',
    'about.promise.title': 'Η Υπόσχεσή Μας',
    'about.promise.description': 'Υποσχόμαστε προσωπική προσοχή, καθαρά και άνετα καταλύματα, και γνώσεις από μέσα για να σας βοηθήσουμε να ανακαλύψετε το καλύτερο της Λευκάδας.',
    'about.story.title': 'Η Ιστορία Μας',
    'about.story.p1': 'Η ιστορία του Metaxas Retreats ξεκίνησε τη δεκαετία του 1980 όταν ο Γεώργιος Μεταξάς, γοητευμένος από την παρθένα ομορφιά του Μικρού Γιαλού, έχτισε ένα εξοχικό σπίτι για την οικογένειά του σε αυτή την ήσυχη γωνιά της Λευκάδας. Καθώς οι φίλοι άρχισαν να ζητούν να μείνουν σε αυτή την ειδυλλιακή τοποθεσία, γεννήθηκε η ιδέα για το Metaxas Retreats.',
    'about.story.p2': 'Με τα χρόνια, αυτό που ξεκίνησε ως ένας απλός ξενώνας έχει εξελιχθεί στη σημερινή συλλογή γοητευτικών καταλυμάτων, καθένα σχεδιασμένο να παρέχει άνεση διατηρώντας τον αυθεντικό χαρακτήρα της παραδοσιακής ελληνικής νησιωτικής ζωής.',
    'about.story.p3': 'Σήμερα, η δεύτερη και τρίτη γενιά της οικογένειας Μεταξά συνεχίζει αυτή την παράδοση φιλοξενίας, καλωσορίζοντας επισκέπτες από όλο τον κόσμο να βιώσουν τη μαγεία του Μικρού Γιαλού.',
    'about.story.p4': 'Ενώ έχουμε προσθέσει σύγχρονες ανέσεις, η φιλοσοφία μας παραμένει η ίδια: να μοιραστούμε την αυθεντική ομορφιά, τις γεύσεις και τους ρυθμούς της ζωής σε αυτή την ξεχωριστή γωνιά του νησιού της Λευκάδας.',
    'about.why.title': 'Γιατί να Επιλέξετε τον Μικρό Γιαλό;',
    'about.why.intro': 'Ο Μικρός Γιαλός είναι ένας από τους ομορφότερους κόλπους της Λευκάδας, προσφέροντας τέλεια ισορροπία φυσικής ομορφιάς, ηρεμίας και ευκολίας. Η τοποθεσία μας στην περιοχή του Πόρου παρέχει:',
    'about.why.beach': 'Μια εκπληκτική παραλία με βότσαλα και κρυστάλλινα τιρκουάζ νερά, ιδανική για κολύμπι και κατάδυση με αναπνευστήρα',
    'about.why.peaceful': 'Ήσυχο περιβάλλον μακριά από τις πιο πολυσύχναστες περιοχές του νησιού',
    'about.why.tavernas': 'Σε απόσταση περπατήματος από εξαιρετικές τοπικές ταβέρνες που σερβίρουν φρέσκα θαλασσινά και παραδοσιακή ελληνική κουζίνα',
    'about.why.boats': 'Εύκολη πρόσβαση σε εκδρομές με σκάφος που εξερευνούν την όμορφη ανατολική ακτή της Λευκάδας',
    'about.why.base': 'Τέλεια βάση για εξερεύνηση ολόκληρου του νησιού, με την πόλη της Λευκάδας μόλις 25 χλμ μακριά',
    'about.why.beaches': 'Κοντά σε άλλες όμορφες παραλίες όπως η Αγιοφύλι και η Βασιλική',
    'about.why.cta': 'Ζήστε την αυθεντική γοητεία της ελληνικής νησιωτικής ζωής στο Metaxas Retreats στον Μικρό Γιαλό!',
    
    // Explore Page
    'explore.title': 'Εξερευνήστε τη Λευκάδα',
    'explore.intro': 'Ανακαλύψτε το σμαραγδένιο διαμάντι του Ιονίου Πελάγους. Η Λευκάδα προσφέρει εκπληκτικές παραλίες, γραφικά ορεινά χωριά, νόστιμη τοπική κουζίνα και συναρπαστικές δραστηριότητες για κάθε τύπο ταξιδιώτη.',
    'explore.beaches': 'Παραλίες',
    'explore.villages': 'Χωριά',
    'explore.activities': 'Δραστηριότητες',
    'explore.cuisine': 'Τοπική Κουζίνα',
    'explore.plan.title': 'Σχεδιάστε την Τέλεια Ημέρα σας',
    'explore.plan.beach.title': 'Ημέρα στην Παραλία',
    'explore.plan.beach.description': 'Ξυπνήστε στη σκηνή glamping σας στον Μικρό Γιαλό, πηγαίνετε στην παραλία για πρωινή βουτιά, απολαύστε μεσημεριανό σε τοπική ταβέρνα στον Μικρό Γιαλό ή τα Σύβοτα, και τελειώστε με ποτά στο ηλιοβασίλεμα στο χωριό Εξάνθεια.',
    'explore.plan.village.title': 'Εξερεύνηση Χωριών',
    'explore.plan.village.description': 'Ξεκινήστε την ημέρα σας στον Μικρό Γιαλό ή τα Σύβοτα, οδηγήστε στο ορεινό χωριό Καρυά για μεσημεριανό, και τελειώστε την ημέρα σας στον Άγιο Νικήτα για δείπνο δίπλα στη θάλασσα.',
    'explore.plan.water.title': 'Θαλάσσιες Δραστηριότητες',
    'explore.plan.water.description': 'Κάντε πρωινή εκδρομή με ιστιοπλοϊκό από το Νυδρί γύρω από τα κοντινά νησιά, απολαύστε μεσημεριανό στο Μεγανήσι, και περάστε το απόγευμα κάνοντας windsurfing στη Βασιλική.',
    'explore.specialties.title': 'Τοπικές Σπεσιαλιτέ',
    'explore.specialties.subtitle': 'Παραδοσιακά πιάτα που πρέπει να δοκιμάσετε',
    'explore.restaurants.title': 'Πού να Φάτε',
    'explore.restaurants.subtitle': 'Προτεινόμενα εστιατόρια και ταβέρνες',
    'explore.products.title': 'Τοπικά Προϊόντα',
    'explore.products.subtitle': 'Πάρτε μια γεύση από τη Λευκάδα μαζί σας',
    
    // Contact Page
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
    'footer.about': 'Ζήστε τη μαγεία της ελληνικής νησιωτικής ζωής με τα γοητευτικά καταλύματά μας στον Μικρό Γιαλό, φωλιασμένα ανάμεσα σε όμορφα δέντρα και σε απόσταση αναπνοής από το γαλάζιο Ιόνιο Πέλαγος.',
    'footer.quickLinks': 'Γρήγοροι Σύνδεσμοι',
    'footer.ourAccommodations': 'Τα Καταλύματά μας',
    'footer.contactUs': 'Επικοινωνία',
    'footer.rights': 'Με επιφύλαξη παντός δικαιώματος.',
    'footer.poweredBy': 'Υποστηρίζεται από',
    
    // Accommodations
    'accommodation.woodenHouse': 'Ξύλινο Σπίτι',
    'accommodation.glampingTent': 'Σκηνή Glamping',
    'accommodation.woodenHouse.description': 'Ζήστε την αυθεντική ελληνική νησιωτική ζωή στο γοητευτικό ξύλινο σπίτι μας. Φωλιασμένο ανάμεσα σε ελαιόδεντρα με εκπληκτική θέα στη θάλασσα. Η ευρύχωρη βεράντα είναι ιδανική για να απολαύσετε τα διάσημα ελληνικά ηλιοβασιλέματα πίνοντας τοπικό κρασί. Μέσα θα βρείτε πλήρως εξοπλισμένη κουζίνα, άνετο σαλόνι και προσεκτικά σχεδιασμένα υπνοδωμάτια με κορυφαία σεντόνια.',
    'accommodation.woodenHouse.short': 'Γοητευτικό ξύλινο σπίτι με θέα στη θάλασσα για άνετες διακοπές',
    'accommodation.glampingTent.description': 'Η πολυτελής σκηνή glamping μας προσφέρει μια αξέχαστη εμπειρία που συνδυάζει την περιπέτεια της κατασκήνωσης με ανέσεις ξενοδοχείου. Τοποθετημένη σε μια ήσυχη τοποθεσία ανάμεσα σε αιωνόβια ελαιόδεντρα, αυτή η ευρύχωρη σκηνή διαθέτει ένα άνετο διπλό κρεβάτι και 3 μονά κρεβάτια με premium σεντόνια, ηλεκτρικό ρεύμα και κομψή επίπλωση. Ο ιδιωτικός εξωτερικός χώρος καθιστικού είναι τέλειος για πρωινό καφέ ή βραδινή χαλάρωση κάτω από τα αστέρια. Ζήστε τη μαγεία της νησιωτικής ζωής με όλες τις ανέσεις που χρειάζεστε.',
    'accommodation.glampingTent.short': 'Ευρύχωρη εμπειρία glamping με άνεση ξενοδοχείου περιτριγυρισμένη από όμορφα δέντρα',
    
    // Amenities
    'amenity.seaView': 'Θέα στη θάλασσα',
    'amenity.parking': 'Πάρκινγκ',
    'amenity.beachDistance': '50μ από την παραλία',
    'amenity.airConditioning': 'Κλιματισμός',
    'amenity.kitchen': 'Πλήρως εξοπλισμένη κουζίνα',
    'amenity.wifi': 'Υψηλής ταχύτητας Wi-Fi',
    'amenity.terrace': 'Ιδιωτική βεράντα',
    'amenity.outdoorDining': 'Εξωτερικός χώρος φαγητού',
    'amenity.washingMachine': 'Πλυντήριο ρούχων',
    'amenity.rampAccess': 'Πρόσβαση με ράμπα',
    'amenity.outdoorSeating': 'Ιδιωτικός εξωτερικός χώρος καθιστικού',
    'amenity.ecoFriendly': 'Οικολογικές παροχές',
    
    // Accommodation Detail Page
    'detail.notFound': 'Το Κατάλυμα δεν Βρέθηκε',
    'detail.notFoundText': 'Το κατάλυμα που ψάχνετε δεν υπάρχει.',
    'detail.returnHome': 'Επιστροφή στην Αρχική',
    'detail.about': 'Σχετικά με αυτό το κατάλυμα',
    'detail.features': 'Χαρακτηριστικά',
    'detail.guests': 'άτομα',
    'detail.bedrooms': 'υπνοδωμάτια',
    'detail.beds': 'κρεβάτια',
    'detail.bathrooms': 'μπάνια',
    'detail.amenities': 'Παροχές',
    
    // Booking Summary
    'summary.title': 'Σύνοψη Κράτησης',
    'summary.checkIn': 'Άφιξη',
    'summary.checkOut': 'Αναχώρηση',
    'summary.guests': 'Επισκέπτες',
    'summary.total': 'Σύνολο',
    
    // Booking Page
    'booking.pageTitle': 'Επικοινωνήστε για Κράτηση',
    'booking.pageSubtitle': 'Επικοινωνήστε απευθείας μαζί μας για να επιβεβαιώσετε τη διαθεσιμότητα και να ολοκληρώσετε την κράτησή σας.',
    'booking.missingInfo': 'Λείπουν Πληροφορίες Κράτησης',
    'booking.selectFirst': 'Παρακαλούμε επιλέξτε κατάλυμα και ημερομηνίες πριν συνεχίσετε.',
    'booking.tent': 'Σκηνή',
    'booking.contactTitle': 'Επικοινωνία για Κράτηση',
    'booking.saveDiscount': 'Εξοικονομήστε 15% κλείνοντας απευθείας!',
    'booking.discountDescription': 'Οι τιμές μας είναι 15% φθηνότερες από Airbnb/Booking.com.',
    'booking.callWhatsapp': 'Τηλεφωνήστε ή Στείλτε Μήνυμα (WhatsApp)',
    'booking.emailUs': 'Στείλτε Email',
    'booking.selectedDates': 'Οι Επιλεγμένες Ημερομηνίες σας',
    'booking.referenceDates': 'Παρακαλούμε αναφέρετε τις επιλεγμένες ημερομηνίες και το κατάλυμα όταν επικοινωνείτε μαζί μας για να σας εξυπηρετήσουμε πιο αποτελεσματικά.',
    'booking.alsoAvailable': 'Επίσης διαθέσιμο σε:',
    
    // Privacy Policy
    'privacy.title': 'Πολιτική Απορρήτου',
    'privacy.section1.title': '1. Εισαγωγή',
    'privacy.section1.content': 'Καλώς ήρθατε στο Metaxas Retreats ("εμείς", "μας"). Δεσμευόμαστε να προστατεύουμε τα προσωπικά σας δεδομένα και το δικαίωμά σας στην ιδιωτικότητα. Αυτή η Πολιτική Απορρήτου εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και μοιραζόμαστε τις πληροφορίες σας όταν επισκέπτεστε τον ιστότοπό μας ή κάνετε κράτηση στην ιδιοκτησία μας στον Μικρό Γιαλό, Λευκάδα.',
    'privacy.section2.title': '2. Πληροφορίες που Συλλέγουμε',
    'privacy.section2.intro': 'Συλλέγουμε προσωπικές πληροφορίες που μας παρέχετε εθελοντικά όταν κάνετε κράτηση ή επικοινωνείτε μαζί μας, συμπεριλαμβανομένων:',
    'privacy.section2.item1': 'Ονόματα και Στοιχεία Επικοινωνίας (Email, Τηλέφωνο)',
    'privacy.section2.item2': 'Στοιχεία Κράτησης (Ημερομηνίες άφιξης/αναχώρησης, Αριθμός επισκεπτών)',
    'privacy.section2.item3': 'Πληροφορίες Πληρωμής (Επεξεργάζονται με ασφάλεια από τους παρόχους πληρωμών μας· δεν αποθηκεύουμε στοιχεία πιστωτικών καρτών στους διακομιστές μας)',
    'privacy.section3.title': '3. Πώς Χρησιμοποιούμε τις Πληροφορίες σας',
    'privacy.section3.intro': 'Χρησιμοποιούμε τις πληροφορίες σας για να:',
    'privacy.section3.item1': 'Διευκολύνουμε την κράτησή σας και να παρέχουμε τις ζητούμενες υπηρεσίες.',
    'privacy.section3.item2': 'Επικοινωνούμε μαζί σας σχετικά με τη διαμονή σας (π.χ., οδηγίες check-in).',
    'privacy.section3.item3': 'Συμμορφωνόμαστε με τοπικές νομικές υποχρεώσεις (π.χ., ελληνικά αρχεία τουριστικού φόρου).',
    'privacy.section4.title': '4. Cookies και Παρακολούθηση',
    'privacy.section4.content': 'Χρησιμοποιούμε cookies και παρόμοιες τεχνολογίες παρακολούθησης (όπως το Google Analytics) για πρόσβαση ή αποθήκευση πληροφοριών. Αυτό μας βοηθά να αναλύουμε την επισκεψιμότητα του ιστότοπου και να βελτιώνουμε την εμπειρία χρήστη. Μπορείτε να αρνηθείτε τη χρήση cookies προσαρμόζοντας τις ρυθμίσεις του προγράμματος περιήγησής σας.',
    'privacy.section5.title': '5. Διατήρηση Δεδομένων',
    'privacy.section5.content': 'Διατηρούμε τις πληροφορίες σας για όσο διάστημα είναι απαραίτητο για την εκπλήρωση των σκοπών που περιγράφονται σε αυτήν την πολιτική απορρήτου, εκτός εάν απαιτείται μεγαλύτερη περίοδος διατήρησης από το νόμο (όπως φορολογικές, λογιστικές ή άλλες νομικές απαιτήσεις).',
    'privacy.section6.title': '6. Επικοινωνήστε Μαζί Μας',
    'privacy.section6.content': 'Εάν έχετε ερωτήσεις ή σχόλια σχετικά με αυτήν την πολιτική, μπορείτε να μας στείλετε email στο metaxasretreats@gmail.com.',
    
    // Terms of Service
    'terms.title': 'Όροι Χρήσης',
    'terms.section1.title': '1. Αποδοχή Όρων',
    'terms.section1.content': 'Αυτοί οι Όροι Χρήσης αποτελούν νομικά δεσμευτική συμφωνία μεταξύ εσάς ("ο Επισκέπτης") και του Metaxas Retreats σχετικά με τη διαμονή σας στην ιδιοκτησία μας στη Λευκάδα. Κάνοντας κράτηση, αποδέχεστε αυτούς τους όρους.',
    'terms.section2.title': '2. Κράτηση και Ακύρωση',
    'terms.section2.checkin': 'Check-in: Μετά τις 15:00.',
    'terms.section2.checkout': 'Check-out: Πριν τις 11:00.',
    'terms.section2.cancellation': 'Ακύρωση: Πλήρης επιστροφή χρημάτων εάν ακυρωθεί 30 ημέρες πριν την άφιξη. 50% επιστροφή εάν ακυρωθεί 14 ημέρες πριν την άφιξη. Καμία επιστροφή για ακυρώσεις εντός 14 ημερών από την άφιξη.',
    'terms.section3.title': '3. Κανόνες Διαμονής',
    'terms.section3.intro': 'Για να διασφαλίσουμε μια ευχάριστη διαμονή για όλους:',
    'terms.section3.rule1': 'Απαγορεύεται το κάπνισμα εντός των καταλυμάτων.',
    'terms.section3.rule2': 'Απαγορεύονται πάρτι ή εκδηλώσεις χωρίς προηγούμενη έγκριση.',
    'terms.section3.rule3': 'Ώρες κοινής ησυχίας από 23:00 έως 08:00.',
    'terms.section3.rule4': 'Οι επισκέπτες είναι υπεύθυνοι για τυχόν ζημιές που προκληθούν στην ιδιοκτησία κατά τη διαμονή τους.',
    'terms.section4.title': '4. Ευθύνη',
    'terms.section4.content': 'Το Metaxas Retreats δεν ευθύνεται για απώλεια, ζημιά ή κλοπή προσωπικών αντικειμένων. Οι επισκέπτες χρησιμοποιούν τις εγκαταστάσεις με δική τους ευθύνη. Δεν είμαστε υπεύθυνοι για ατυχήματα ή τραυματισμούς που συμβαίνουν στις εγκαταστάσεις εκτός εάν προκλήθηκαν από αποδεδειγμένη αμέλειά μας.',
    'terms.section5.title': '5. Εφαρμοστέο Δίκαιο',
    'terms.section5.content': 'Αυτοί οι όροι διέπονται και ερμηνεύονται σύμφωνα με τους νόμους της Ελλάδας. Το Metaxas Retreats και εσείς συμφωνείτε αμετάκλητα ότι τα δικαστήρια της Λευκάδας θα έχουν αποκλειστική δικαιοδοσία για την επίλυση οποιασδήποτε διαφοράς που μπορεί να προκύψει σε σχέση με αυτούς τους όρους.',
    
    // Footer
    'footer.privacy': 'Πολιτική Απορρήτου',
    'footer.terms': 'Όροι Χρήσης',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.accommodations': 'Alloggi',
    'nav.explore': 'Esplora Lefkada',
    'nav.about': 'Chi Siamo',
    'nav.contact': 'Contattaci',
    
    // Homepage
    'home.hero.welcome': 'Benvenuti a Metaxas Retreats',
    'home.hero.subtitle': "Esperienza di glamping di lusso sopra le perfette acque turchesi della baia di Mikros Gialos a Lefkada",
    'home.hero.viewAccommodations': 'Vedi Alloggi',
    'home.section.title': 'Glamping a Lefkada',
    'home.section.description': "Immersi tra gli ulivi e affacciati sulle acque cristalline della baia di Mikros Gialos, i nostri alloggi offrono un connubio impareggiabile tra campeggio di lusso e autentica vita insulare greca, a pochi passi da una delle spiagge più belle di Lefkada.",
    'home.wooden.title': 'Casa in Legno',
    'home.wooden.description': "La nostra spaziosa casa in legno offre una vista panoramica sul mare della baia di Mikros Gialos, per un'autentica esperienza insulare.",
    'home.glamping.title': 'Tenda Glamping',
    'home.glamping.description': "Vivi il campeggio di lusso nella nostra elegante tenda con biancheria e servizi premium, circondato dalla natura ma a pochi passi dalle acque turchesi della spiaggia di Mikros Gialos.",
    'home.accommodations.title': 'I Nostri Alloggi',
    'home.reviews.title': 'Recensioni degli Ospiti',
    'home.cta.title': 'Vivi Lefkada con Stile',
    'home.cta.description': "Prenota ora la tua vacanza glamping e svegliati con una vista mozzafiato sulle acque turchesi di una delle baie più belle di Lefkada.",
    'home.cta.button': 'Prenota il Tuo Soggiorno',
    
    // Accommodation Card
    'card.guests': 'ospiti',
    'card.beds': 'letti',
    'card.viewDetails': 'Vedi Dettagli',
    'card.fromPrice': 'Da',
    'card.perNight': '/notte',
    
    // About Page
    'about.title': 'Chi Siamo',
    'about.welcome': "Benvenuti a Metaxas Retreats, la vostra porta d'accesso all'autentica vita insulare greca nella splendida baia di Mikros Gialos a Lefkada.",
    'about.founded': "Fondata dalla famiglia Metaxas con un profondo amore per questo angolo di Lefkada, offriamo alloggi affascinanti che fondono elementi tradizionali greci con comfort moderno.",
    'about.location': "Le nostre proprietà sono immerse nella tranquilla zona di Poros a Mikros Gialos, circondate da ulivi e a pochi passi da una delle spiagge più belle dell'isola. Siamo orgogliosi di offrire ai nostri ospiti un rifugio tranquillo dove possono vivere l'autentica bellezza e il ritmo della vita insulare greca.",
    'about.family.title': 'La Nostra Famiglia',
    'about.family.description': "Da tre generazioni, la famiglia Metaxas accoglie visitatori a Mikros Gialos, condividendo il nostro amore per la bellezza naturale di Lefkada e l'ospitalità tradizionale.",
    'about.passion.title': 'La Nostra Passione',
    'about.passion.description': "Siamo appassionati nel creare esperienze memorabili per i nostri ospiti, offrendo alloggi autentici che riflettono il vero spirito della vita insulare greca.",
    'about.promise.title': 'La Nostra Promessa',
    'about.promise.description': 'Promettiamo attenzione personale, alloggi puliti e confortevoli, e conoscenza locale per aiutarvi a scoprire il meglio di Lefkada.',
    'about.story.title': 'La Nostra Storia',
    'about.story.p1': "La storia di Metaxas Retreats è iniziata negli anni '80 quando Georgios Metaxas, incantato dalla bellezza incontaminata di Mikros Gialos, costruì una casa estiva per la sua famiglia in questo angolo tranquillo di Lefkada. Quando gli amici iniziarono a chiedere di soggiornare in questo luogo idilliaco, nacque l'idea di Metaxas Retreats.",
    'about.story.p2': "Nel corso degli anni, quella che era iniziata come una semplice pensione si è evoluta nella nostra attuale collezione di alloggi affascinanti, ognuno progettato per offrire comfort preservando il carattere autentico della tradizionale vita insulare greca.",
    'about.story.p3': "Oggi, la seconda e terza generazione della famiglia Metaxas continua questa tradizione di ospitalità, accogliendo ospiti da tutto il mondo per vivere la magia di Mikros Gialos.",
    'about.story.p4': "Pur avendo aggiunto comfort e servizi moderni, la nostra filosofia rimane la stessa: condividere l'autentica bellezza, i sapori e i ritmi della vita in questo angolo speciale dell'isola di Lefkada.",
    'about.why.title': 'Perché Scegliere Mikros Gialos?',
    'about.why.intro': "Mikros Gialos è una delle baie più belle di Lefkada, offrendo un perfetto equilibrio tra bellezza naturale, tranquillità e comodità. La nostra posizione nella zona di Poros offre:",
    'about.why.beach': 'Una splendida spiaggia di ciottoli con acque cristalline turchesi, ideale per nuotare e fare snorkeling',
    'about.why.peaceful': "Dintorni tranquilli lontano dalle zone più affollate dell'isola",
    'about.why.tavernas': 'A pochi passi da eccellenti taverne locali che servono pesce fresco e cucina tradizionale greca',
    'about.why.boats': 'Facile accesso a gite in barca che esplorano la bellissima costa orientale di Lefkada',
    'about.why.base': "Base perfetta per esplorare l'intera isola, con la città di Lefkada a soli 25km",
    'about.why.beaches': 'Vicino ad altre belle spiagge tra cui Agiofili e Vassiliki',
    'about.why.cta': "Vivi l'autentico fascino della vita insulare greca a Metaxas Retreats a Mikros Gialos!",
    
    // Explore Page
    'explore.title': "Esplora l'Isola di Lefkada",
    'explore.intro': "Scopri il gioiello smeraldo del Mar Ionio. Lefkada offre spiagge mozzafiato, affascinanti villaggi di montagna, deliziosa cucina locale e attività entusiasmanti per ogni tipo di viaggiatore.",
    'explore.beaches': 'Spiagge',
    'explore.villages': 'Villaggi',
    'explore.activities': 'Attività',
    'explore.cuisine': 'Cucina Locale',
    'explore.plan.title': 'Pianifica la Tua Giornata Perfetta',
    'explore.plan.beach.title': 'Giornata al Mare',
    'explore.plan.beach.description': 'Svegliati nella tua tenda glamping a Mikros Gialos, vai in spiaggia per un bagno mattutino, gusta il pranzo in una taverna locale a Mikros Gialos o Sivota, e termina con un aperitivo al tramonto nel villaggio di Eksantheia.',
    'explore.plan.village.title': 'Esplorazione dei Villaggi',
    'explore.plan.village.description': 'Inizia la tua giornata a Mikros Gialos o Sivota, guida fino al villaggio di montagna Karya per pranzo, e termina la giornata ad Agios Nikitas per cena sul mare.',
    'explore.plan.water.title': 'Attività Acquatiche',
    'explore.plan.water.description': 'Fai una gita in barca mattutina da Nidri intorno alle isole vicine, gusta il pranzo a Meganisi, e trascorri il pomeriggio facendo windsurf a Vasiliki.',
    'explore.specialties.title': 'Specialità Locali',
    'explore.specialties.subtitle': 'Piatti tradizionali da provare assolutamente',
    'explore.restaurants.title': 'Dove Mangiare',
    'explore.restaurants.subtitle': 'Ristoranti e taverne consigliati',
    'explore.products.title': 'Prodotti Locali',
    'explore.products.subtitle': 'Porta a casa un assaggio di Lefkada',
    
    // Contact Page
    'contact.title': 'Contattaci',
    'contact.subtitle': "Saremo felici di sentirti! Trovaci nella bellissima zona di Poros, Mikros Gialos nell'isola di Lefkada, oppure contattaci telefonicamente o via email.",
    'contact.visit': 'Visitaci',
    'contact.call': 'Chiamaci',
    'contact.email': 'Scrivici',
    'contact.location': 'La Nostra Posizione',
    'contact.mapNote': "Nota: Mikros Gialos è una delle baie più belle di Lefkada, con acque cristalline e un'atmosfera tranquilla. I nostri alloggi sono a pochi passi dalla spiaggia!",
    'contact.reach': 'Come Raggiungerci',
    'contact.byCar': 'In Auto',
    'contact.byBus': 'In Autobus',
    'contact.byBoat': 'In Barca',
    'contact.book': 'Prenota il Tuo Soggiorno a Mikros Gialos',
    'contact.bookDescription': "Vivi la bellezza e la tranquillità della baia di Mikros Gialos, con le sue acque cristalline turchesi, la spiaggia di ciottoli e le affascinanti taverne. I nostri alloggi offrono la base perfetta per esplorare questo gioiello nascosto dell'isola di Lefkada.",
    'contact.callToAction': 'Contattaci ora per verificare la disponibilità per le tue date preferite!',

    // Footer
    'footer.about': "Vivi la magia della vita insulare greca con i nostri affascinanti alloggi a Mikros Gialos, immersi tra bellissimi alberi e a pochi passi dall'azzurro Mar Ionio.",
    'footer.quickLinks': 'Link Rapidi',
    'footer.ourAccommodations': 'I Nostri Alloggi',
    'footer.contactUs': 'Contattaci',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.poweredBy': 'Powered by',
    
    // Accommodations
    'accommodation.woodenHouse': 'Casa in Legno',
    'accommodation.glampingTent': 'Tenda Glamping',
    'accommodation.woodenHouse.description': "Vivi l'autentica vita insulare greca nella nostra affascinante casa in legno. Immersa tra gli ulivi con splendida vista sul mare. L'ampia terrazza è ideale per godersi i famosi tramonti greci sorseggiando vino locale. All'interno troverai una cucina completamente attrezzata, un comodo soggiorno e camere da letto progettate con cura con biancheria premium.",
    'accommodation.woodenHouse.short': 'Affascinante casa in legno con vista mare per una vacanza confortevole',
    'accommodation.glampingTent.description': "La nostra lussuosa tenda glamping offre un'esperienza indimenticabile che combina l'avventura del campeggio con servizi da hotel. Situata in una posizione tranquilla tra antichi ulivi, questa spaziosa tenda dispone di un comodo letto matrimoniale e 3 letti singoli con biancheria premium, elettricità e arredi eleganti. L'area salotto esterna privata è perfetta per il caffè mattutino o il relax serale sotto le stelle. Vivi la magia della vita insulare con tutti i comfort di cui hai bisogno.",
    'accommodation.glampingTent.short': 'Spaziosa esperienza glamping con comfort da hotel circondato da bellissimi alberi',
    
    // Amenities
    'amenity.seaView': 'Vista mare',
    'amenity.parking': 'Parcheggio',
    'amenity.beachDistance': '50m dalla spiaggia',
    'amenity.airConditioning': 'Aria condizionata',
    'amenity.kitchen': 'Cucina completamente attrezzata',
    'amenity.wifi': 'Wi-Fi ad alta velocità',
    'amenity.terrace': 'Terrazza privata',
    'amenity.outdoorDining': 'Area pranzo esterna',
    'amenity.washingMachine': 'Lavatrice',
    'amenity.rampAccess': 'Accesso con rampa',
    'amenity.outdoorSeating': 'Area salotto esterna privata',
    'amenity.ecoFriendly': 'Servizi eco-friendly',
    
    // Accommodation Detail Page
    'detail.notFound': 'Alloggio Non Trovato',
    'detail.notFoundText': "L'alloggio che stai cercando non esiste.",
    'detail.returnHome': 'Torna alla Home',
    'detail.about': 'Informazioni su questo alloggio',
    'detail.features': 'Caratteristiche',
    'detail.guests': 'ospiti',
    'detail.bedrooms': 'camere',
    'detail.beds': 'letti',
    'detail.bathrooms': 'bagni',
    'detail.amenities': 'Servizi',
    
    // Booking Summary
    'summary.title': 'Riepilogo Prenotazione',
    'summary.checkIn': 'Check-in',
    'summary.checkOut': 'Check-out',
    'summary.guests': 'Ospiti',
    'summary.total': 'Totale',
    
    // Booking Page
    'booking.pageTitle': 'Contattaci per Prenotare',
    'booking.pageSubtitle': 'Contattaci direttamente per confermare la disponibilità e completare la tua prenotazione.',
    'booking.missingInfo': 'Informazioni di Prenotazione Mancanti',
    'booking.selectFirst': 'Seleziona un alloggio e le date prima di procedere.',
    'booking.tent': 'Tenda',
    'booking.contactTitle': 'Contatta per Prenotare',
    'booking.saveDiscount': 'Risparmia il 15% prenotando direttamente!',
    'booking.discountDescription': 'I prezzi sul nostro sito sono il 15% più economici di Airbnb/Booking.com.',
    'booking.callWhatsapp': 'Chiama o Scrivi (WhatsApp)',
    'booking.emailUs': 'Scrivici via Email',
    'booking.selectedDates': 'Le Tue Date Selezionate',
    'booking.referenceDates': 'Per favore indica le date selezionate e l\'alloggio quando ci contatti per assisterti più efficacemente.',
    'booking.alsoAvailable': 'Disponibile anche su:',
    
    // Privacy Policy
    'privacy.title': 'Informativa sulla Privacy',
    'privacy.section1.title': '1. Introduzione',
    'privacy.section1.content': 'Benvenuto a Metaxas Retreats ("noi" o "nostro"). Ci impegniamo a proteggere le tue informazioni personali e il tuo diritto alla privacy. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo e condividiamo le tue informazioni quando visiti il nostro sito web o effettui una prenotazione presso la nostra struttura a Mikros Gialos, Lefkada.',
    'privacy.section2.title': '2. Informazioni che Raccogliamo',
    'privacy.section2.intro': 'Raccogliamo informazioni personali che fornisci volontariamente quando effettui una prenotazione o ci contatti, tra cui:',
    'privacy.section2.item1': 'Nomi e Contatti (Email, Numero di Telefono)',
    'privacy.section2.item2': 'Dettagli della Prenotazione (Date di arrivo/partenza, Numero di ospiti)',
    'privacy.section2.item3': 'Informazioni di Pagamento (Elaborate in sicurezza dai nostri fornitori di pagamento; non memorizziamo i dati della carta di credito sui nostri server)',
    'privacy.section3.title': '3. Come Utilizziamo le Tue Informazioni',
    'privacy.section3.intro': 'Utilizziamo le tue informazioni per:',
    'privacy.section3.item1': 'Facilitare la tua prenotazione e fornire i servizi richiesti.',
    'privacy.section3.item2': 'Comunicare con te riguardo al tuo soggiorno (es. istruzioni per il check-in).',
    'privacy.section3.item3': 'Rispettare gli obblighi legali locali (es. registri fiscali del turismo greco).',
    'privacy.section4.title': '4. Cookie e Tracciamento',
    'privacy.section4.content': 'Utilizziamo cookie e tecnologie di tracciamento simili (come Google Analytics) per accedere o memorizzare informazioni. Questo ci aiuta ad analizzare il traffico del sito web e migliorare la tua esperienza utente. Puoi rifiutare l\'uso dei cookie modificando le impostazioni del browser.',
    'privacy.section5.title': '5. Conservazione dei Dati',
    'privacy.section5.content': 'Conserviamo le tue informazioni per il tempo necessario a soddisfare gli scopi delineati in questa informativa sulla privacy, a meno che un periodo di conservazione più lungo sia richiesto dalla legge (come requisiti fiscali, contabili o altri requisiti legali).',
    'privacy.section6.title': '6. Contattaci',
    'privacy.section6.content': 'Se hai domande o commenti su questa informativa, puoi scriverci a metaxasretreats@gmail.com.',
    
    // Terms of Service
    'terms.title': 'Termini di Servizio',
    'terms.section1.title': '1. Accettazione dei Termini',
    'terms.section1.content': 'Questi Termini di Servizio costituiscono un accordo legalmente vincolante tra te ("l\'Ospite") e Metaxas Retreats riguardo al tuo soggiorno presso la nostra struttura a Lefkada. Effettuando una prenotazione, accetti questi termini.',
    'terms.section2.title': '2. Prenotazione e Cancellazione',
    'terms.section2.checkin': 'Check-in: Dopo le 15:00.',
    'terms.section2.checkout': 'Check-out: Prima delle 11:00.',
    'terms.section2.cancellation': "Cancellazione: Rimborso completo se cancellato 30 giorni prima dell'arrivo. Rimborso del 50% se cancellato 14 giorni prima dell'arrivo. Nessun rimborso per cancellazioni entro 14 giorni dall'arrivo.",
    'terms.section3.title': '3. Regole della Casa',
    'terms.section3.intro': 'Per garantire un soggiorno piacevole a tutti:',
    'terms.section3.rule1': 'Vietato fumare all\'interno degli alloggi.',
    'terms.section3.rule2': 'Nessuna festa o evento senza approvazione preventiva.',
    'terms.section3.rule3': 'Ore di silenzio dalle 23:00 alle 08:00.',
    'terms.section3.rule4': 'Gli ospiti sono responsabili per eventuali danni causati alla proprietà durante il soggiorno.',
    'terms.section4.title': '4. Responsabilità',
    'terms.section4.content': 'Metaxas Retreats non è responsabile per perdita, danno o furto di beni personali. Gli ospiti utilizzano le strutture a proprio rischio. Non siamo responsabili per incidenti o infortuni che si verificano nei locali a meno che non siano causati da nostra comprovata negligenza.',
    'terms.section5.title': '5. Legge Applicabile',
    'terms.section5.content': 'Questi termini sono regolati e interpretati secondo le leggi della Grecia. Metaxas Retreats e voi acconsentite irrevocabilmente che i tribunali di Lefkada avranno giurisdizione esclusiva per risolvere qualsiasi controversia che possa sorgere in relazione a questi termini.',
    
    // Footer
    'footer.privacy': 'Informativa sulla Privacy',
    'footer.terms': 'Termini di Servizio',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.accommodations': 'Unterkünfte',
    'nav.explore': 'Lefkada Entdecken',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
    
    // Homepage
    'home.hero.welcome': 'Willkommen bei Metaxas Retreats',
    'home.hero.subtitle': 'Luxuriöses Glamping-Erlebnis über dem perfekten türkisfarbenen Wasser der Bucht von Mikros Gialos auf Lefkada',
    'home.hero.viewAccommodations': 'Unterkünfte Ansehen',
    'home.section.title': 'Glamping auf Lefkada',
    'home.section.description': 'Eingebettet zwischen Olivenbäumen mit Blick auf das kristallklare Wasser der Bucht von Mikros Gialos bieten unsere Unterkünfte eine unvergleichliche Mischung aus Luxus-Camping und authentischem griechischen Inselleben, nur wenige Schritte von einem der schönsten Strände Lefkadas entfernt.',
    'home.wooden.title': 'Holzhaus',
    'home.wooden.description': 'Unser geräumiges Holzhaus bietet einen Panoramablick auf das Meer der Bucht von Mikros Gialos für ein authentisches Inselerlebnis.',
    'home.glamping.title': 'Glamping-Zelt',
    'home.glamping.description': 'Erleben Sie Luxus-Camping in unserem eleganten Zelt mit Premium-Bettwäsche und Annehmlichkeiten, umgeben von Natur und nur wenige Gehminuten vom türkisfarbenen Wasser des Strandes von Mikros Gialos entfernt.',
    'home.accommodations.title': 'Unsere Unterkünfte',
    'home.reviews.title': 'Gästebewertungen',
    'home.cta.title': 'Erleben Sie Lefkada mit Stil',
    'home.cta.description': 'Buchen Sie jetzt Ihren Glamping-Urlaub und wachen Sie mit atemberaubendem Blick auf das türkisfarbene Wasser einer der schönsten Buchten Lefkadas auf.',
    'home.cta.button': 'Jetzt Buchen',
    
    // Accommodation Card
    'card.guests': 'Gäste',
    'card.beds': 'Betten',
    'card.viewDetails': 'Details Ansehen',
    'card.fromPrice': 'Ab',
    'card.perNight': '/Nacht',
    
    // About Page
    'about.title': 'Über Uns',
    'about.welcome': 'Willkommen bei Metaxas Retreats, Ihrem Tor zum authentischen griechischen Inselleben in der atemberaubenden Bucht von Mikros Gialos auf Lefkada.',
    'about.founded': 'Gegründet von der Familie Metaxas mit tiefer Liebe zu dieser wunderschönen Ecke Lefkadas, bieten wir charmante Unterkünfte, die traditionelle griechische Elemente mit modernem Komfort verbinden.',
    'about.location': 'Unsere Unterkünfte befinden sich in der ruhigen Gegend von Poros in Mikros Gialos, umgeben von Olivenbäumen und nur wenige Schritte von einem der schönsten Strände der Insel entfernt. Wir sind stolz darauf, unseren Gästen einen friedlichen Rückzugsort zu bieten, an dem sie die authentische Schönheit und den Rhythmus des griechischen Insellebens erleben können.',
    'about.family.title': 'Unsere Familie',
    'about.family.description': 'Seit drei Generationen heißt die Familie Metaxas Besucher in Mikros Gialos willkommen und teilt unsere Liebe zur natürlichen Schönheit Lefkadas und zur traditionellen Gastfreundschaft.',
    'about.passion.title': 'Unsere Leidenschaft',
    'about.passion.description': 'Wir sind leidenschaftlich daran interessiert, unvergessliche Erlebnisse für unsere Gäste zu schaffen und authentische Unterkünfte anzubieten, die den wahren Geist des griechischen Insellebens widerspiegeln.',
    'about.promise.title': 'Unser Versprechen',
    'about.promise.description': 'Wir versprechen persönliche Aufmerksamkeit, saubere und komfortable Unterkünfte sowie Insider-Wissen, um Ihnen zu helfen, das Beste von Lefkada zu entdecken.',
    'about.story.title': 'Unsere Geschichte',
    'about.story.p1': 'Die Geschichte von Metaxas Retreats begann in den 1980er Jahren, als Georgios Metaxas, verzaubert von der unberührten Schönheit von Mikros Gialos, ein Sommerhaus für seine Familie in dieser friedlichen Ecke Lefkadas baute. Als Freunde anfingen, in dieser idyllischen Lage übernachten zu wollen, wurde die Idee für Metaxas Retreats geboren.',
    'about.story.p2': 'Im Laufe der Jahre hat sich das, was als einfaches Gästehaus begann, zu unserer heutigen Sammlung charmanter Unterkünfte entwickelt, die jeweils so gestaltet sind, dass sie Komfort bieten und gleichzeitig den authentischen Charakter des traditionellen griechischen Insellebens bewahren.',
    'about.story.p3': 'Heute führen die zweite und dritte Generation der Familie Metaxas diese Tradition der Gastfreundschaft fort und heißen Gäste aus aller Welt willkommen, um die Magie von Mikros Gialos zu erleben.',
    'about.story.p4': 'Während wir moderne Annehmlichkeiten und Komfort hinzugefügt haben, bleibt unsere Philosophie dieselbe: die authentische Schönheit, die Aromen und die Rhythmen des Lebens in dieser besonderen Ecke der Insel Lefkada zu teilen.',
    'about.why.title': 'Warum Mikros Gialos wählen?',
    'about.why.intro': 'Mikros Gialos ist eine der schönsten Buchten Lefkadas und bietet eine perfekte Balance aus natürlicher Schönheit, Ruhe und Bequemlichkeit. Unsere Lage in der Gegend von Poros bietet:',
    'about.why.beach': 'Einen atemberaubenden Kiesstrand mit kristallklarem türkisfarbenem Wasser, ideal zum Schwimmen und Schnorcheln',
    'about.why.peaceful': 'Friedliche Umgebung abseits der überfüllteren Gebiete der Insel',
    'about.why.tavernas': 'Fußläufig zu ausgezeichneten lokalen Tavernen mit frischen Meeresfrüchten und traditioneller griechischer Küche',
    'about.why.boats': 'Einfacher Zugang zu Bootsausflügen entlang der wunderschönen Ostküste Lefkadas',
    'about.why.base': 'Perfekte Basis zur Erkundung der gesamten Insel, mit Lefkada-Stadt nur 25 km entfernt',
    'about.why.beaches': 'In der Nähe anderer schöner Strände wie Agiofili und Vassiliki',
    'about.why.cta': 'Erleben Sie den authentischen Charme des griechischen Insellebens bei Metaxas Retreats in Mikros Gialos!',
    
    // Explore Page
    'explore.title': 'Die Insel Lefkada Entdecken',
    'explore.intro': 'Entdecken Sie das smaragdgrüne Juwel des Ionischen Meeres. Lefkada bietet atemberaubende Strände, charmante Bergdörfer, köstliche lokale Küche und aufregende Aktivitäten für jeden Reisetyp.',
    'explore.beaches': 'Strände',
    'explore.villages': 'Dörfer',
    'explore.activities': 'Aktivitäten',
    'explore.cuisine': 'Lokale Küche',
    'explore.plan.title': 'Planen Sie Ihren Perfekten Tag',
    'explore.plan.beach.title': 'Strandtag',
    'explore.plan.beach.description': 'Wachen Sie in Ihrem Glamping-Zelt in Mikros Gialos auf, gehen Sie zum Strand für ein morgendliches Bad, genießen Sie das Mittagessen in einer lokalen Taverne in Mikros Gialos oder Sivota, und beenden Sie den Tag mit Getränken zum Sonnenuntergang im Dorf Eksantheia.',
    'explore.plan.village.title': 'Dorferkundung',
    'explore.plan.village.description': 'Beginnen Sie Ihren Tag in Mikros Gialos oder Sivota, fahren Sie zum Bergdorf Karya zum Mittagessen, und beenden Sie Ihren Tag in Agios Nikitas mit Abendessen am Meer.',
    'explore.plan.water.title': 'Wasseraktivitäten',
    'explore.plan.water.description': 'Machen Sie einen morgendlichen Segeltörn von Nidri zu den nahegelegenen Inseln, genießen Sie das Mittagessen auf Meganisi, und verbringen Sie den Nachmittag mit Windsurfen in Vasiliki.',
    'explore.specialties.title': 'Lokale Spezialitäten',
    'explore.specialties.subtitle': 'Traditionelle Gerichte, die Sie probieren müssen',
    'explore.restaurants.title': 'Wo Essen',
    'explore.restaurants.subtitle': 'Empfohlene Restaurants und Tavernen',
    'explore.products.title': 'Lokale Produkte',
    'explore.products.subtitle': 'Nehmen Sie einen Geschmack von Lefkada mit nach Hause',
    
    // Contact Page
    'contact.title': 'Kontaktieren Sie Uns',
    'contact.subtitle': 'Wir freuen uns von Ihnen zu hören! Finden Sie uns in der schönen Gegend von Poros, Mikros Gialos auf der Insel Lefkada, oder kontaktieren Sie uns per Telefon oder E-Mail.',
    'contact.visit': 'Besuchen Sie Uns',
    'contact.call': 'Rufen Sie Uns An',
    'contact.email': 'E-Mail',
    'contact.location': 'Unser Standort',
    'contact.mapNote': 'Hinweis: Mikros Gialos ist eine der schönsten Buchten Lefkadas mit kristallklarem Wasser und friedlicher Atmosphäre. Unsere Unterkünfte sind nur wenige Gehminuten vom Strand entfernt!',
    'contact.reach': 'So Erreichen Sie Uns',
    'contact.byCar': 'Mit dem Auto',
    'contact.byBus': 'Mit dem Bus',
    'contact.byBoat': 'Mit dem Boot',
    'contact.book': 'Buchen Sie Ihren Aufenthalt in Mikros Gialos',
    'contact.bookDescription': 'Erleben Sie die Schönheit und Ruhe der Bucht von Mikros Gialos mit ihrem kristallklaren türkisfarbenen Wasser, dem Kiesstrand und den charmanten Tavernen. Unsere Unterkünfte bieten die perfekte Basis, um dieses versteckte Juwel der Insel Lefkada zu erkunden.',
    'contact.callToAction': 'Kontaktieren Sie uns jetzt, um die Verfügbarkeit für Ihre gewünschten Daten zu prüfen!',

    // Footer
    'footer.about': 'Erleben Sie die Magie des griechischen Insellebens mit unseren charmanten Unterkünften in Mikros Gialos, eingebettet zwischen schönen Bäumen und nur wenige Schritte vom azurblauen Ionischen Meer entfernt.',
    'footer.quickLinks': 'Schnelllinks',
    'footer.ourAccommodations': 'Unsere Unterkünfte',
    'footer.contactUs': 'Kontakt',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.poweredBy': 'Powered by',
    
    // Accommodations
    'accommodation.woodenHouse': 'Holzhaus',
    'accommodation.glampingTent': 'Glamping-Zelt',
    'accommodation.woodenHouse.description': 'Erleben Sie authentisches griechisches Inselleben in unserem charmanten Holzhaus. Eingebettet zwischen Olivenbäumen mit atemberaubendem Meerblick. Die geräumige Terrasse ist ideal, um die berühmten griechischen Sonnenuntergänge bei einem Glas lokalem Wein zu genießen. Im Inneren finden Sie eine voll ausgestattete Küche, einen gemütlichen Wohnbereich und durchdacht gestaltete Schlafzimmer mit Premium-Bettwäsche.',
    'accommodation.woodenHouse.short': 'Charmantes Holzhaus mit Meerblick für einen komfortablen Urlaub',
    'accommodation.glampingTent.description': 'Unser luxuriöses Glamping-Zelt bietet ein unvergessliches Erlebnis, das das Abenteuer des Campings mit hotelähnlichen Annehmlichkeiten verbindet. In einer ruhigen Lage zwischen alten Olivenbäumen gelegen, verfügt dieses geräumige Zelt über ein komfortables Doppelbett und 3 Einzelbetten mit Premium-Bettwäsche, Strom und stilvoller Einrichtung. Der private Außensitzbereich ist perfekt für den Morgenkaffee oder die abendliche Entspannung unter den Sternen. Erleben Sie die Magie des Insellebens mit allem Komfort, den Sie brauchen.',
    'accommodation.glampingTent.short': 'Geräumiges Glamping-Erlebnis mit Hotelqualität, umgeben von schönen Bäumen',
    
    // Amenities
    'amenity.seaView': 'Meerblick',
    'amenity.parking': 'Parkplatz',
    'amenity.beachDistance': '50m vom Strand',
    'amenity.airConditioning': 'Klimaanlage',
    'amenity.kitchen': 'Voll ausgestattete Küche',
    'amenity.wifi': 'Highspeed-WLAN',
    'amenity.terrace': 'Private Terrasse',
    'amenity.outdoorDining': 'Essbereich im Freien',
    'amenity.washingMachine': 'Waschmaschine',
    'amenity.rampAccess': 'Rampe',
    'amenity.outdoorSeating': 'Privater Außensitzbereich',
    'amenity.ecoFriendly': 'Umweltfreundliche Ausstattung',
    
    // Accommodation Detail Page
    'detail.notFound': 'Unterkunft Nicht Gefunden',
    'detail.notFoundText': 'Die gesuchte Unterkunft existiert nicht.',
    'detail.returnHome': 'Zurück zur Startseite',
    'detail.about': 'Über diese Unterkunft',
    'detail.features': 'Ausstattung',
    'detail.guests': 'Gäste',
    'detail.bedrooms': 'Schlafzimmer',
    'detail.beds': 'Betten',
    'detail.bathrooms': 'Badezimmer',
    'detail.amenities': 'Ausstattung',
    
    // Booking Summary
    'summary.title': 'Buchungsübersicht',
    'summary.checkIn': 'Check-in',
    'summary.checkOut': 'Check-out',
    'summary.guests': 'Gäste',
    'summary.total': 'Gesamt',
    
    // Booking Page
    'booking.pageTitle': 'Kontaktieren Sie Uns für Buchung',
    'booking.pageSubtitle': 'Kontaktieren Sie uns direkt, um die Verfügbarkeit zu bestätigen und Ihre Buchung abzuschließen.',
    'booking.missingInfo': 'Buchungsinformationen Fehlen',
    'booking.selectFirst': 'Bitte wählen Sie eine Unterkunft und Daten aus, bevor Sie fortfahren.',
    'booking.tent': 'Zelt',
    'booking.contactTitle': 'Kontakt für Buchung',
    'booking.saveDiscount': 'Sparen Sie 15% bei Direktbuchung!',
    'booking.discountDescription': 'Unsere Website-Preise sind 15% günstiger als Airbnb/Booking.com.',
    'booking.callWhatsapp': 'Anrufen oder Schreiben (WhatsApp)',
    'booking.emailUs': 'E-Mail Schreiben',
    'booking.selectedDates': 'Ihre Ausgewählten Daten',
    'booking.referenceDates': 'Bitte geben Sie Ihre ausgewählten Daten und die Unterkunft an, wenn Sie uns kontaktieren, damit wir Ihnen effizienter helfen können.',
    'booking.alsoAvailable': 'Auch verfügbar auf:',
    
    // Privacy Policy
    'privacy.title': 'Datenschutzerklärung',
    'privacy.section1.title': '1. Einleitung',
    'privacy.section1.content': 'Willkommen bei Metaxas Retreats ("wir" oder "uns"). Wir verpflichten uns, Ihre persönlichen Daten und Ihr Recht auf Privatsphäre zu schützen. Diese Datenschutzerklärung erklärt, wie wir Ihre Informationen sammeln, verwenden und teilen, wenn Sie unsere Website besuchen oder eine Buchung bei unserer Unterkunft in Mikros Gialos, Lefkada vornehmen.',
    'privacy.section2.title': '2. Informationen, die Wir Sammeln',
    'privacy.section2.intro': 'Wir sammeln persönliche Informationen, die Sie uns freiwillig zur Verfügung stellen, wenn Sie eine Reservierung vornehmen oder uns kontaktieren, einschließlich:',
    'privacy.section2.item1': 'Namen und Kontaktdaten (E-Mail, Telefonnummer)',
    'privacy.section2.item2': 'Buchungsdetails (An-/Abreisedaten, Anzahl der Gäste)',
    'privacy.section2.item3': 'Zahlungsinformationen (Sicher verarbeitet durch unsere Zahlungsanbieter; wir speichern keine Kreditkartendaten auf unseren Servern)',
    'privacy.section3.title': '3. Wie Wir Ihre Informationen Verwenden',
    'privacy.section3.intro': 'Wir verwenden Ihre Informationen um:',
    'privacy.section3.item1': 'Ihre Buchung zu erleichtern und angeforderte Dienstleistungen bereitzustellen.',
    'privacy.section3.item2': 'Mit Ihnen bezüglich Ihres Aufenthalts zu kommunizieren (z.B. Check-in-Anweisungen).',
    'privacy.section3.item3': 'Lokalen gesetzlichen Verpflichtungen nachzukommen (z.B. griechische Tourismussteueraufzeichnungen).',
    'privacy.section4.title': '4. Cookies und Tracking',
    'privacy.section4.content': 'Wir verwenden Cookies und ähnliche Tracking-Technologien (wie Google Analytics), um Informationen zu speichern oder darauf zuzugreifen. Dies hilft uns, den Website-Traffic zu analysieren und Ihre Benutzererfahrung zu verbessern. Sie können die Verwendung von Cookies ablehnen, indem Sie Ihre Browser-Einstellungen anpassen.',
    'privacy.section5.title': '5. Datenaufbewahrung',
    'privacy.section5.content': 'Wir bewahren Ihre Informationen so lange auf, wie es notwendig ist, um die in dieser Datenschutzerklärung beschriebenen Zwecke zu erfüllen, es sei denn, eine längere Aufbewahrungsfrist ist gesetzlich vorgeschrieben (wie Steuer-, Buchhaltungs- oder andere gesetzliche Anforderungen).',
    'privacy.section6.title': '6. Kontaktieren Sie Uns',
    'privacy.section6.content': 'Wenn Sie Fragen oder Kommentare zu dieser Erklärung haben, können Sie uns per E-Mail an metaxasretreats@gmail.com kontaktieren.',
    
    // Terms of Service
    'terms.title': 'Nutzungsbedingungen',
    'terms.section1.title': '1. Zustimmung zu den Bedingungen',
    'terms.section1.content': 'Diese Nutzungsbedingungen stellen eine rechtsverbindliche Vereinbarung zwischen Ihnen ("dem Gast") und Metaxas Retreats bezüglich Ihres Aufenthalts in unserer Unterkunft auf Lefkada dar. Mit einer Reservierung stimmen Sie diesen Bedingungen zu.',
    'terms.section2.title': '2. Buchung und Stornierung',
    'terms.section2.checkin': 'Check-in: Nach 15:00 Uhr.',
    'terms.section2.checkout': 'Check-out: Vor 11:00 Uhr.',
    'terms.section2.cancellation': 'Stornierung: Vollständige Rückerstattung bei Stornierung 30 Tage vor Anreise. 50% Rückerstattung bei Stornierung 14 Tage vor Anreise. Keine Rückerstattung bei Stornierung innerhalb von 14 Tagen vor Anreise.',
    'terms.section3.title': '3. Hausregeln',
    'terms.section3.intro': 'Um einen angenehmen Aufenthalt für alle zu gewährleisten:',
    'terms.section3.rule1': 'Rauchen in den Unterkünften ist nicht gestattet.',
    'terms.section3.rule2': 'Keine Partys oder Veranstaltungen ohne vorherige Genehmigung.',
    'terms.section3.rule3': 'Ruhezeiten sind von 23:00 bis 08:00 Uhr.',
    'terms.section3.rule4': 'Gäste sind für alle während ihres Aufenthalts verursachten Schäden an der Unterkunft verantwortlich.',
    'terms.section4.title': '4. Haftung',
    'terms.section4.content': 'Metaxas Retreats haftet nicht für Verlust, Beschädigung oder Diebstahl von persönlichem Eigentum. Gäste nutzen die Einrichtungen auf eigenes Risiko. Wir sind nicht verantwortlich für Unfälle oder Verletzungen auf dem Gelände, es sei denn, sie wurden durch unsere nachgewiesene Fahrlässigkeit verursacht.',
    'terms.section5.title': '5. Anwendbares Recht',
    'terms.section5.content': 'Diese Bedingungen unterliegen den Gesetzen Griechenlands und werden nach diesen ausgelegt. Metaxas Retreats und Sie stimmen unwiderruflich zu, dass die Gerichte von Lefkada die ausschließliche Zuständigkeit haben, um alle Streitigkeiten zu lösen, die im Zusammenhang mit diesen Bedingungen entstehen können.',
    
    // Footer
    'footer.privacy': 'Datenschutzerklärung',
    'footer.terms': 'Nutzungsbedingungen',
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
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'el' || savedLanguage === 'it' || savedLanguage === 'de')) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'el') {
        setLanguageState('el');
      } else if (browserLang === 'it') {
        setLanguageState('it');
      } else if (browserLang === 'de') {
        setLanguageState('de');
      }
    }
  }, []);

  // Update html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
