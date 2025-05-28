
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 text-sea">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find the page you're looking for</p>
          <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
            Return to Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
