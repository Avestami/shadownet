'use client';

import { useEffect, useState } from 'react';
import SignOutButton from './SignOutButton';

const SignOutButtonWrapper: React.FC = () => {
  // Track if user is logged in via localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if there's a debug user in localStorage or user in session
    const checkLoginStatus = () => {
      const hasDebugUser = !!localStorage.getItem('debugUser');
      const hasAuthToken = !!localStorage.getItem('authToken');
      // We can also check cookie existence if needed, but localStorage is primary for this client-side check
      setIsLoggedIn(hasDebugUser || hasAuthToken);
    };

    checkLoginStatus();
    
    // Set up an event listener for storage changes
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically
    const checkInterval = setInterval(checkLoginStatus, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, []);
  
  // Only render the button if the user is logged in
  if (!isLoggedIn) {
    return null;
  }
  
  return <SignOutButton />;
};

export default SignOutButtonWrapper; 