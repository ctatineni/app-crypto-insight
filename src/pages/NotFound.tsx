
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-crypto-blue">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page at <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> was not found.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="flex items-center justify-center gap-2 bg-crypto-teal hover:bg-crypto-blue"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
