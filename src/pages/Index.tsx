
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Metaxas Retreats</h1>
        <p className="text-xl text-gray-600 mb-8">Discover our beautiful accommodations</p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-sea hover:bg-sea-dark text-white"
        >
          Go to Home Page
        </Button>
      </div>
    </div>
  );
};

export default Index;
