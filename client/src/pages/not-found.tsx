import React from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  const [, navigate] = useLocation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="mt-8"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
