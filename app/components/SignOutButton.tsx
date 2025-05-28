'use client';

import React from 'react';

const SignOutButton: React.FC = () => {
  const handleSignOut = () => {
    console.log("Signing out - without clearing game data");
    
    // Just remove the debug user but keep other game data
    localStorage.removeItem('debugUser');
    
    // Redirect to the home page
    window.location.href = '/';
    
    // Could also make an API call to clear server-side session if needed
    // fetch('/api/auth/logout', { method: 'POST' });
  };
  
  const handleGameReset = () => {
    console.log("Resetting game - clearing all game data");
    
    // Clear all game-related localStorage data
    localStorage.removeItem('debugUser');
    localStorage.removeItem('choices');
    localStorage.removeItem('flagsCaptured');
    localStorage.removeItem('karma');
    localStorage.removeItem('score');
    localStorage.removeItem('language');
    
    // For a complete cleanup, you could clear all localStorage
    // localStorage.clear();
    
    // Redirect to the home page with a clean slate
    window.location.href = '/';
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 
                 text-white text-sm uppercase tracking-wider border border-blue-500 
                 rounded-md transition-all duration-200 flex items-center shadow-lg"
        title="Sign Out"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
        Sign Out
      </button>
      
      <button
        onClick={handleGameReset}
        className="px-4 py-2 bg-red-700 hover:bg-red-600 
                 text-white text-sm uppercase tracking-wider border border-red-500 
                 rounded-md transition-all duration-200 flex items-center shadow-lg"
        title="Reset Game Data"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        Reset Game
      </button>
    </div>
  );
};

export default SignOutButton; 