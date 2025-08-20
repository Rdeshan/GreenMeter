import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const userLoggedIn = false; // Replace with actual auth check
      setIsAuthenticated(userLoggedIn);
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }
}