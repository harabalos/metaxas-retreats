import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccommodationDetail from "./pages/AccommodationDetail";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import ExploreIsland from "./pages/ExploreIsland";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./context/LanguageContext";

// --- NEW IMPORTS ---
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookieConsent from "./components/Layout/CookieConsent";
// -------------------

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/explore" element={<ExploreIsland />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* --- NEW ROUTES --- */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            {/* ------------------ */}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* --- ADD COOKIE BANNER --- */}
          <CookieConsent />
          
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;