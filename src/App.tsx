import React, { Suspense, useEffect, useLayoutEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isLanguageLoaded, loadLanguage } from "./i18n";
import { LANGUAGES, localizePath, type Language } from "./lib/i18nRoutes";
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
const ExploreIsland = React.lazy(() => import("./pages/ExploreIsland"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-cream">
    <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
  </div>
);

// useLayoutEffect warns when prerendering; it only matters in the browser.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Keeps i18n on the language of the URL. The first render already matches
// (main.tsx and the prerender load it first); this handles moving between
// languages, before the browser paints. A language that hasn't been fetched
// yet suspends the page (the Suspense fallback) until its texts arrive.
const LanguageScope = ({ language }: { language: Language }) => {
  const { i18n } = useTranslation();
  if (!isLanguageLoaded(language)) throw loadLanguage(language);
  useIsomorphicLayoutEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [i18n, language]);
  return <Outlet />;
};

// Fade transition wrapper — must live inside the router to use useLocation
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
            {/* The same pages under each language: / for English, /el, /it, … */}
            {LANGUAGES.map((language) => (
              <Route key={language} path={localizePath(language, '/')} element={<LanguageScope language={language} />}>
                <Route index element={<HomePage />} />
                <Route path="accommodation/:id" element={<AccommodationDetail />} />
                <Route path="booking/:id" element={<BookingPage />} />
                <Route path="explore" element={<ExploreIsland />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            ))}
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

// The router comes from outside: BrowserRouter in main.tsx, StaticRouter when
// prerendering (entry-server.tsx).
const App = () => (
  <>
    <LanguageProvider>
      <Toaster />
      <ErrorBoundary>
        <AnimatedRoutes />
      </ErrorBoundary>
      <CookieConsent />
    </LanguageProvider>
    <Analytics />
    <SpeedInsights />
  </>
);

export default App;