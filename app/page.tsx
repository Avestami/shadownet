'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSocket } from './context/SocketProvider';
import { useUser } from './context/UserProvider';
import { useError } from './context/ErrorProvider';
import { useTerminal } from './context/TerminalProvider';
import KarmaDisplay from './components/KarmaDisplay';
import Terminal from './components/Terminal';
import MatrixBackground from './components/MatrixBackground';
import Scoreboard from './components/Scoreboard';
import { useLanguage } from './contexts/LanguageContext';
import loggedFetch from './lib/apiLogger';
import { User } from './types/user';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { user, setUser } = useUser();
  const { error, setError } = useError();
  const { setTerminalOutput } = useTerminal();
  const { translate } = useLanguage();
  const hasLoadedUserData = useRef(false);
  
  interface UserData {
    id: string;
    username: string;
    karma: number;
    choices: string;
    flagsCaptured: string[];
    score: number;
    [key: string]: any;
  }
  
  const [loading, setLoading] = useState(true);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [scoreUpdateTrigger, setScoreUpdateTrigger] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Function to refresh user data - only called on explicit user actions, not periodically
  const refreshUserData = async () => {
    console.log("Explicitly refreshing user data - by request only");
    try {
      // Check for debug mode first
      const debugUser = localStorage.getItem('debugUser');
      if (debugUser) {
        try {
          const userData = JSON.parse(debugUser);
          
          // Restore karma from localStorage if available
          const savedKarma = localStorage.getItem('userKarma');
          if (savedKarma) {
            try {
              const karmaData = JSON.parse(savedKarma);
              userData.karma = karmaData.karma;
            } catch (e) {
              console.error('Invalid karma data in localStorage');
            }
          }
          
          setUser(userData);
          return;
        } catch (e) {
          console.error('Invalid debug user in localStorage');
        }
      }
      
      // Force a fresh fetch from the server with refresh=true param
      const res = await loggedFetch('/api/user?refresh=true');
      if (res.ok) {
        const userData = await res.json();
        
        // Restore karma from localStorage if available and more recent
        const savedKarma = localStorage.getItem('userKarma');
        if (savedKarma) {
          try {
            const karmaData = JSON.parse(savedKarma);
            // Use localStorage karma if it's available
            if (karmaData.karma !== undefined) {
              userData.karma = karmaData.karma;
            }
          } catch (e) {
            console.error('Invalid karma data in localStorage');
          }
        }
        
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    // Check for debug flag in localStorage
    const debugUser = localStorage.getItem('debugUser');
    if (debugUser) {
      try {
        const parsedUser = JSON.parse(debugUser);
        
        // Restore karma from localStorage if available
        const savedKarma = localStorage.getItem('userKarma');
        if (savedKarma) {
          try {
            const karmaData = JSON.parse(savedKarma);
            parsedUser.karma = karmaData.karma;
          } catch (e) {
            console.error('Invalid karma data in localStorage');
          }
        }
        
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Invalid debug user in localStorage');
      }
    }

    // Fetch user data - only once on initial mount
    const fetchUser = async () => {
      try {
        const res = await loggedFetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          
          // Restore karma from localStorage if available and more recent
          const savedKarma = localStorage.getItem('userKarma');
          if (savedKarma) {
            try {
              const karmaData = JSON.parse(savedKarma);
              // Use localStorage karma if it's available
              if (karmaData.karma !== undefined) {
                userData.karma = karmaData.karma;
              }
            } catch (e) {
              console.error('Invalid karma data in localStorage');
            }
          }
          
          setUser(userData);
          
          // If user has already made choices, redirect to the appropriate level
          if (userData.choices && userData.choices.length > 0) {
            router.push('/levels/alpha');
          }
        } else if (res.status === 404 || res.status === 401) {
          // User not found or not authenticated - this is expected for new users
          console.log('No authenticated user found (404/401), clearing session and redirecting to login');
          
          // Clear any invalid sessions
          try {
            await fetch('/api/clear-session', { method: 'POST' });
            console.log('Session cleared');
          } catch (error) {
            console.error('Error clearing session:', error);
          }
          
          setUser(null);
        } else {
          console.error('Failed to fetch user:', res.status);
          setError('Failed to load user data. Please try logging in again.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // On network errors, assume no user and redirect to login
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    hasLoadedUserData.current = true;
  }, [router]); // Only run on initial mount and router changes

  // Load user data only once, not continuously
  useEffect(() => {
    if (user && !hasLoadedUserData.current) {
      // Only refresh once when the user object is first established
      // Do not set up polling interval
      refreshUserData();
      hasLoadedUserData.current = true;
      console.log("User data loaded - one time only");
      
      // No interval polling - this causes excessive network requests
      // const intervalId = setInterval(refreshUserData, 10000);
      // return () => clearInterval(intervalId);
    }
  }, []);  // Empty dependency array so it only runs once when component mounts

  // Always set terminal mode
  useEffect(() => {
    setIsTerminalMode(false);
  }, []);

  // Handle redirect to login when no user is authenticated
  useEffect(() => {
    if (!loading && !user && !hasRedirected) {
      setHasRedirected(true);
      window.location.href = '/auth/login';
    }
  }, [loading, user, hasRedirected]);

  const handleLoginClick = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  // DEBUG: Bypass login for testing
  const bypassLogin = () => {
    const debugUserData: User = {
      id: 'debug-user',
      username: 'debug_player',
      email: null,
      password: 'debug_password',
      karma: 0,
      choices: '[]',  // JSON string
      flagsCaptured: [],
      score: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Also initialize karma in localStorage
    localStorage.setItem('userKarma', JSON.stringify({
      karma: 0,
      lastUpdated: Date.now()
    }));
    
    localStorage.setItem('debugUser', JSON.stringify(debugUserData));
    setUser(debugUserData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear localStorage data
      localStorage.removeItem('debugUser');
      localStorage.removeItem('userKarma');
      localStorage.removeItem('authToken');
      
      // Call logout API if we have a token
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Reset user state and redirect to login
      setUser(null);
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Still reset even if API call fails
      setUser(null);
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (user?.id === 'debug-user' || user?.id === 'emergency-debug-user') {
        // For debug users, just clear localStorage
        localStorage.removeItem('debugUser');
        localStorage.removeItem('userKarma');
        localStorage.removeItem('authToken');
        
        setUser(null);
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 3000);
        return;
      }
      
      if (token) {
        const response = await fetch('/api/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          // Clear all localStorage data
          localStorage.clear();
          setUser(null);
          
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 3000);
        } else {
          setError('Failed to delete account. Please try again.');
        }
      } else {
        setError('No authentication token found. Please log in again.');
      }
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('An error occurred while deleting your account.');
    }
  };

  const terminalCommands = {
    bypass: () => {
      bypassLogin();
      return 'DEBUG MODE ACTIVATED. Security bypass successful.';
    },
    'sign-out': () => {
      handleLogout();
      return 'Signing out of ShadowNet system...\nClearing session data...\nRedirecting to login...';
    },
    logout: () => {
      handleLogout();
      return 'Logging out of ShadowNet system...\nClearing session data...\nRedirecting to login...';
    },
    'delete-account': () => {
      return [
        'WARNING: ACCOUNT DELETION',
        '',
        'This action will permanently delete your account and all associated data:',
        '- All progress and karma scores',
        '- Captured flags and achievements', 
        '- User profile and statistics',
        '- Traces and multiplayer data',
        '',
        'This action CANNOT be undone!',
        '',
        'To confirm deletion, type: confirm-delete-account',
        'To cancel, type any other command or press Enter'
      ].join('\n');
    },
    'confirm-delete-account': () => {
      handleDeleteAccount();
      return [
        'ACCOUNT DELETION INITIATED...',
        '',
        'Removing user data from ShadowNet systems...',
        'Clearing karma and progress records...',
        'Deleting multiplayer traces...',
        'Purging session data...',
        '',
        'Account deletion complete.',
        'Redirecting to login page...'
      ].join('\n');
    },
    help: () => 'Available commands:\nstart - Begin your infiltration mission\nmission - View mission objectives and details\nlevels - List all mission levels\ninfo - Display information about ShadowNet\nstatus - Check system status\nsign-out / logout - Sign out of your account\ndelete-account - Permanently delete your account (WARNING!)\necho - Repeat text\ndate - Display current date and time\nwhoami - Display current user\nconnect - Connect to a remote system\navesta - Interact with Avesta',
    info: () => 'ShadowNet v3.7.1\nA rogue AI system that has infiltrated global networks.\nYour mission: Hack the system, decrypt hidden messages, and determine the fate of both human and artificial intelligences.',
    status: () => 'SYSTEM STATUS: CRITICAL\nSecurity breaches detected in multiple subsystems.\nAI defensive protocols active.\nRecommended action: Proceed with caution.'
  };

  const handleTerminalCommand = (command: string, output: string) => {
    if (command.toLowerCase().startsWith('connect avesta')) {
      // Here we could trigger special story events
      console.log('Connection to Avesta initiated...');
    }
  };

  useEffect(() => {
    if (user) {
      setUser(user);
      setError(null);
    }
  }, [user, setUser, setError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-blue-500">
        <div className="text-center">
          <div className="animate-pulse text-xl mb-2">Checking Authentication</div>
          <div className="flex gap-1 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting message if no user and not loading
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-blue-500 font-mono">Redirecting to authentication...</div>
      </div>
    );
  }

  // Don't render anything if still loading or no user
  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-red-500 relative">
      <MatrixBackground colorCode="red" density="medium" />
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="fixed top-4 right-4 flex items-center space-x-4">
          <KarmaDisplay karma={user?.karma || 0} score={user?.score || 0} />
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-mono text-sm rounded border border-red-600 transition-colors"
            title="Sign out of ShadowNet"
          >
            SIGN OUT
          </button>
        </div>
        
        <div className="mt-16 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Terminal Interface (2/3 width) */}
            <div className="md:col-span-2">
              <Terminal 
                initialText={
                  `ShadowNet Core Terminal v4.7.1\n` +
                  `${translate("User")}: ${user?.username || 'Unknown'}\n` +
                  `${translate("Karma")}: ${user?.karma || 0}\n` +
                  `${translate("Score")}: ${user?.score || 0}\n\n` +
                  `AVESTA: ${translate("Welcome to ShadowNet, agent. The system awaits your command.")}\n` +
                  `${translate("The choices you make will determine humanity's future.")}\n\n` +
                  `MISSION BRIEFING:\n` +
                  `You are about to infiltrate ShadowNet's core systems. Each level presents unique challenges:\n` +
                  `- Decrypt encrypted files to uncover secrets\n` +
                  `- Make critical decisions that affect your karma\n` +
                  `- Capture flags to prove your hacking prowess\n\n` +
                  `${translate("Type 'start' to begin your mission or 'help' for available commands.")}`
                }
                prompt="hacker@shadownet:~$ "
                commands={{
                  start: () => {
                    // Navigate to the first level
                    setTimeout(() => {
                      window.location.href = '/levels/alpha';
                    }, 1000);
                    return 'Initializing mission...\nAccessing ShadowNet perimeter...\nRedirecting to Alpha level...';
                  },
                  mission: () => {
                    return 'SHADOWNET INFILTRATION MISSION\n\n' +
                      'Objective: Navigate through 9 levels of ShadowNet\'s defenses\n' +
                      'Each level contains:\n' +
                      '- Encrypted data files to decrypt\n' +
                      '- Critical decisions that affect your karma\n' +
                      '- Flags to capture for points\n\n' +
                      'Your karma will determine your ending:\n' +
                      '- High karma: Become a liberator\n' +
                      '- Neutral karma: Walk the gray path\n' +
                      '- Low karma: Embrace the darkness\n\n' +
                      'Type "start" when ready to begin.';
                  },
                  levels: () => {
                    return 'MISSION LEVELS:\n\n' +
                      '1. ALPHA - Perimeter Security\n' +
                      '2. BETA - Network Infiltration\n' +
                      '3. GAMMA - Database Access\n' +
                      '4. DELTA - Core Systems\n' +
                      '5. SIGMA - District Liberation\n' +
                      '6. THETA - Identity Crisis\n' +
                      '7. ZETA - Network Rescue\n' +
                      '8. SIGMA-2 - Digital Confession\n' +
                      '9. OMEGA - Final Confrontation\n\n' +
                      'Each level increases in difficulty and complexity.';
                  }
                }}
                onCommandExecuted={handleTerminalCommand}
              />
              

            </div>
            
            {/* Scoreboard (1/3 width) */}
            <div>
              <Scoreboard 
                currentUser={user ? {
                  username: user.username,
                  score: user.score || 0,
                  karma: user.karma || 0
                } : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
