import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'el';

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
    'amenity.beach': '50m from the beach',
    'amenity.airConditioning': 'Air conditioning',
    'amenity.kitchen': 'Fully equipped kitchen',
    'amenity.wifi': 'High-speed Wi-Fi',
    'amenity.terrace': 'Private terrace',
    'amenity.outdoor': 'Outdoor dining area',
    'amenity.washing': 'Washing machine',
    'amenity.ramp': 'Ramp access',
    'amenity.eco': 'Eco-friendly amenities',
    'amenity.outdoorSeating': 'Private outdoor seating',
    
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
    'amenity.beach': '50μ από την παραλία',
    'amenity.airConditioning': 'Κλιματισμός',
    'amenity.kitchen': 'Πλήρως εξοπλισμένη κουζίνα',
    'amenity.wifi': 'Υψηλής ταχύτητας Wi-Fi',
    'amenity.terrace': 'Ιδιωτική βεράντα',
    'amenity.outdoor': 'Εξωτερικός χώρος φαγητού',
    'amenity.washing': 'Πλυντήριο ρούχων',
    'amenity.ramp': 'Πρόσβαση με ράμπα',
    'amenity.eco': 'Οικολογικές παροχές',
    'amenity.outdoorSeating': 'Ιδιωτικός εξωτερικός χώρος καθιστικού',
    
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
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'el') {
        setLanguageState('el');
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
