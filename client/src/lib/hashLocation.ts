// hashLocation.ts
import { useState, useEffect, useCallback } from 'react';

// Custom hook for hash-based routing
export const useHashLocation = () => {
  // Initialize with either the hash part of the URL (minus the # symbol)
  // or the root path if there's no hash
  const [currentPath, setCurrentPath] = useState(() => 
    window.location.hash ? window.location.hash.substring(1) : "/"
  );

  // Listen for hash changes and update state
  useEffect(() => {
    // Update path when hash changes
    const handleHashChange = () => {
      const path = window.location.hash.substring(1) || "/";
      setCurrentPath(path);
    };

    // Add event listeners
    window.addEventListener("hashchange", handleHashChange);
    
    // Initial call to set path correctly on page load
    handleHashChange();
    
    // Clean up
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Navigate function that changes the URL hash
  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [currentPath, navigate] as const;
};