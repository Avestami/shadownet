'use client';

import { useEffect, useState } from 'react';
import SignOutButton from './SignOutButton';

const SignOutButtonWrapper: React.FC = () => {
  // Track if user is logged in via localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if there's a debug user in localStorage
    const hasUser = !!localStorage.getItem('debugUser');
    setIsLoggedIn(hasUser);
    
    // Set up an event listener for storage changes
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('debugUser'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically
    const checkInterval = setInterval(() => {
      setIsLoggedIn(!!localStorage.getItem('debugUser'));
    }, 5000);
    
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