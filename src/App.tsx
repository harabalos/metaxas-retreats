import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import CookieConsent from "./components/Layout/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy-loaded pages
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AccommodationDetail = React.lazy(() => import("./pages/AccommodationDetail"));
const BookingPage = React.lazy(() => import("./pages/BookingPage"));
const BookingConfirmation = React.lazy(() => import("./pages/BookingConfirmation"));
const ExploreIsland = React.lazy(() => import("./pages/ExploreIsland"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-cream">
    <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
  </div>
);

// Fade transition wrapper — must live inside BrowserRouter to use useLocation
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/explore" element={<ExploreIsland />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
          <CookieConsent />
        </BrowserRouter>
      </LanguageProvider>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;