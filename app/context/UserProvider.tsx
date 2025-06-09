'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types/user';

interface UserUpdate {
  timestamp: number;
  action: string;
  previousScore?: number;
  newScore?: number;
  karmaChange?: { type: string; value: number };
  data?: any;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userUpdates: UserUpdate[];
  trackUpdate: (action: string, data?: any) => void;
  debugUser: () => void;
  refreshUser: () => Promise<User | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userUpdates, setUserUpdates] = useState<UserUpdate[]>([]);

  // Track user updates for debugging
  const trackUpdate = useCallback((action: string, data?: any) => {
    const update: UserUpdate = {
      timestamp: Date.now(),
      action,
      previousScore: user?.score,
      data
    };
    
    console.log('[USER] Tracking update:', update);
    
    setUserUpdates(prev => {
      // Keep only the last 20 updates to avoid memory issues
      const newUpdates = [...prev, update].slice(-20);
      return newUpdates;
    });
  }, [user?.score]);

  // Enhanced setUser that tracks updates
  const setUserWithTracking = useCallback((newUser: User | null) => {
    setUser(prevUser => {
      if (!prevUser && newUser) {
        // Initial user set
        trackUpdate('initial_load', { user: newUser });
      } else if (prevUser && newUser) {
        // Check for score changes
        if (prevUser.score !== newUser.score) {
          trackUpdate('score_update', { 
            previousScore: prevUser.score, 
            newScore: newUser.score,
            difference: (newUser.score || 0) - (prevUser.score || 0)
          });
        }
        
        // Check for karma changes
        if (JSON.stringify(prevUser.karma) !== JSON.stringify(newUser.karma)) {
          trackUpdate('karma_update', { 
            previousKarma: prevUser.karma, 
            newKarma: newUser.karma 
          });
        }
        
        // Check for flag captures
        if (prevUser.flagsCaptured?.length !== newUser.flagsCaptured?.length) {
          trackUpdate('flags_update', { 
            previousFlags: prevUser.flagsCaptured, 
            newFlags: newUser.flagsCaptured,
            addedFlags: newUser.flagsCaptured?.filter(
              flag => !prevUser.flagsCaptured?.includes(flag)
            )
          });
        }
      }
      
      return newUser;
    });
  }, [trackUpdate]);

  // Function to refresh user data from the server
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      console.log('[USER] Refreshing user data from server');
      trackUpdate('refresh_requested');
      
      // First check if we're in debug mode with localStorage
      const debugUser = localStorage.getItem('debugUser');
      if (debugUser) {
        try {
          const userData = JSON.parse(debugUser);
          console.log('[USER] Debug user found in localStorage:', userData);
          setUserWithTracking(userData);
          return userData;
        } catch (error) {
          console.error('[USER] Error parsing debug user:', error);
        }
      }
      
      // Make sure we use the correct base URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Make an API call to refresh user data
      const response = await fetch(`${baseUrl}/api/user?refresh=true`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error('[USER] Error response from API:', response.status, response.statusText);
        throw new Error(`Failed to refresh user data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[USER] User data refreshed from server:', data);
      
      if (data.user) {
        console.log('[USER] Setting user data from API response:', data.user);
        setUserWithTracking(data.user);
        trackUpdate('refresh_success', data.user);
        return data.user;
      } else {
        console.error('[USER] No user data returned from server, data:', data);
        trackUpdate('refresh_empty', data);
        return null;
      }
    } catch (error) {
      console.error('[USER] Error refreshing user data:', error);
      trackUpdate('refresh_error', { error: String(error) });
      return null;
    }
  }, [setUserWithTracking, trackUpdate]);

  // Initial load of user data
  useEffect(() => {
    if (!user) {
      refreshUser().catch(err => {
        console.error('[USER] Initial load error:', err);
      });
    }
  }, [refreshUser, user]);

  // Debug helper
  const debugUser = useCallback(() => {
    console.log('[USER-DEBUG] Current user state:', user);
    console.log('[USER-DEBUG] Update history:', userUpdates);
    
    if (user) {
      console.log('[USER-DEBUG] Score:', user.score);
      console.log('[USER-DEBUG] Karma:', user.karma);
      console.log('[USER-DEBUG] Flags captured:', user.flagsCaptured);
    } else {
      console.log('[USER-DEBUG] No user loaded');
    }
    
    return { user, updates: userUpdates };
  }, [user, userUpdates]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserWithTracking, 
      userUpdates, 
      trackUpdate,
      debugUser,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 