import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import CookieConsent from "./components/Layout/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

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
const AdminAuth = React.lazy(() => import("./pages/AdminAuth"));
const ChannelManager = React.lazy(() => import("./pages/ChannelManager"));

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
  <div className="flex items-center justify-center min-h-screen bg-sand/10">
    <div className="w-8 h-8 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/accommodation/:id" element={<AccommodationDetail />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/explore" element={<ExploreIsland />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/mx-portal/login" element={<AdminAuth />} />
              <Route path="/mx-portal" element={<ProtectedRoute><ChannelManager /></ProtectedRoute>} />

              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />


              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>

          <CookieConsent />

        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;