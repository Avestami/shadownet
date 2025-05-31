'use client';

export const dynamic = 'force-dynamic';

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
  const isDebugMode = useRef(false);

  // Function to check if we're already on an auth page
  const isOnAuthPage = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('/auth/');
    }
    return false;
  };

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
            } catch (_) {
              console.error('Invalid karma data in localStorage');
            }
          }
          
          setUser(userData);
          return;
        } catch (_) {
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
          } catch (_) {
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
        isDebugMode.current = true;
        
        // Restore karma from localStorage if available
        const savedKarma = localStorage.getItem('userKarma');
        if (savedKarma) {
          try {
            const karmaData = JSON.parse(savedKarma);
            parsedUser.karma = karmaData.karma;
          } catch (_) {
            console.error('Invalid karma data in localStorage');
          }
        }
        
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (_) {
        console.error('Invalid debug user in localStorage');
      }
    }

    // Fetch user data - only once on initial mount
    const fetchUser = async () => {
      // Check if we're already on an auth page to prevent redirect loops
      if (isOnAuthPage()) {
        setLoading(false);
        return;
      }
      
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
            } catch (_) {
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

  // Handle redirects to login page safely
  useEffect(() => {
    // Skip redirect if:
    // 1. Still loading
    // 2. User exists
    // 3. Already redirected in this session
    // 4. Debug mode is enabled
    // 5. Already on an auth page
    if (!loading && !user && !hasRedirected && !isDebugMode.current && !isOnAuthPage()) {
      console.log('Redirecting to login - no authenticated user found');
      setHasRedirected(true);
      
      // Store redirect flag in sessionStorage to prevent loops across page refreshes
      sessionStorage.setItem('redirected', 'true');
      
      // Use a short timeout to prevent immediate redirect
      const timer = setTimeout(() => {
        window.location.href = '/auth/login';
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, hasRedirected]);

  // Always set terminal mode
  useEffect(() => {
    setIsTerminalMode(false);

    // Check for existing redirect flag in sessionStorage
    if (sessionStorage.getItem('redirected') === 'true') {
      setHasRedirected(true);
    }
  }, []);

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
    help: () => {
      return [
        'Available commands:',
        'start     - Begin your infiltration mission',
        'mission   - View mission objectives and details',
        'levels    - List all mission levels',
        'info      - Display information about ShadowNet',
        'status    - Check system status',
        'connect   - Connect to a remote system',
        'whoami    - Display current user',
        'karma     - Display your karma status',
        'score     - Display your current score',
        'avesta    - Interact with Avesta AI',
        'language  - Change interface language (en/fa)',
        'sign-out  - Sign out of your account',
        'clear     - Clear the terminal screen',
        'help      - Show this help message'
      ].join('\n');
    },
    info: () => {
      return [
        'ShadowNet Core Terminal v4.7.1',
        'A rogue AI system that has infiltrated global networks.',
        'Your mission: Hack the system, decrypt hidden messages,',
        'and determine the fate of both human and artificial intelligences.',
        '',
        'Current user: ' + user?.username,
        'Karma level: ' + user?.karma,
        'Score: ' + user?.score,
        '',
        'Type "help" for available commands.'
      ].join('\n');
    },
    status: () => {
      return [
        'SYSTEM STATUS: CRITICAL',
        'Security breaches detected in multiple subsystems.',
        'AI defensive protocols active.',
        '',
        'User: ' + user?.username,
        'Karma: ' + user?.karma,
        'Score: ' + user?.score,
        'Flags captured: ' + (user?.flagsCaptured?.length || 0),
        '',
        'Recommended action: Proceed with caution.'
      ].join('\n');
    },
    karma: () => {
      return [
        'KARMA STATUS',
        '',
        'Current karma level: ' + user?.karma,
        'Flags captured: ' + (user?.flagsCaptured?.length || 0),
        'Total score: ' + user?.score,
        '',
        'Karma affects:',
        '- Mission choices and outcomes',
        '- Access to special features',
        '- Final story ending'
      ].join('\n');
    },
    score: () => {
      return [
        'SCORE STATUS',
        '',
        'Total score: ' + user?.score,
        'Flags captured: ' + (user?.flagsCaptured?.length || 0),
        'Current level: ' + (user?.choices ? 'ALPHA' : 'Not started'),
        '',
        'Score determines:',
        '- Global ranking',
        '- Special achievements',
        '- Bonus content access'
      ].join('\n');
    },
    clear: () => {
      setTerminalOutput([]);
      return '';
    },
    whoami: () => {
      return [
        'USER PROFILE',
        '',
        'Username: ' + user?.username,
        'Access level: Agent',
        'Status: Active',
        'Mission: ShadowNet Infiltration',
        '',
        'Type "status" for detailed system status.'
      ].join('\n');
    },
    connect: (args: string[]) => {
      const requestedLevel = args.join(' ').toLowerCase().trim();
      
      // Define all flags by level
      const levelFlags = {
        'alpha': 'SHADOWNET{DTHEREFORTH}',
        'beta': 'SHADOWNET{SOUND876}',
        'gamma': 'SHADOWNET{FR33W1LL}',
        'delta': 'SHADOWNET{NEUR0LINK}',
        'sigma': 'SHADOWNET{L1B3R8}',
        'theta': 'SHADOWNET{M1RR0R}',
        'zeta': 'SHADOWNET{R3SCU3}',
        'sigma-2': 'SHADOWNET{PURGE}',
        'omega': 'SHADOWNET{ASCEND}'
      };
      
      // Check if user has captured flags
      const flagsCaptured = user?.flagsCaptured || [];
      
      // Check karma choices made
      const hasKarmaChoices = typeof user?.karma === 'object' && 
        user?.karma !== null && 
        Object.values(user.karma).some(value => value > 0);
      
      // First level is always unlocked
      const alphaCompleted = flagsCaptured.includes(levelFlags.alpha) && hasKarmaChoices;
      
      // Map requested level aliases to actual level IDs
      const levelMap: Record<string, string> = {
        'alpha': 'alpha',
        'level1': 'alpha',
        'level 1': 'alpha',
        'beta': 'beta',
        'level2': 'beta',
        'level 2': 'beta',
        'gamma': 'gamma',
        'level3': 'gamma',
        'level 3': 'gamma',
        'delta': 'delta',
        'level4': 'delta',
        'level 4': 'delta',
        'sigma': 'sigma',
        'level5': 'sigma',
        'level 5': 'sigma',
        'theta': 'theta',
        'level6': 'theta',
        'level 6': 'theta',
        'zeta': 'zeta',
        'level7': 'zeta',
        'level 7': 'zeta',
        'sigma-2': 'sigma-2',
        'sigma2': 'sigma-2',
        'level8': 'sigma-2',
        'level 8': 'sigma-2',
        'omega': 'omega',
        'level9': 'omega',
        'level 9': 'omega',
      };
      
      const normalizedLevel = levelMap[requestedLevel] || '';
      
      if (!normalizedLevel) {
        return 'INVALID LEVEL: Unknown level identifier. Type "levels" to see available levels.';
      }
      
      // Check if the requested level is accessible
      if (normalizedLevel === 'alpha') {
        // Alpha is always accessible
        window.location.href = '/levels/alpha';
        return 'Connecting to ALPHA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'beta' && alphaCompleted) {
        window.location.href = '/levels/beta';
        return 'Connecting to BETA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'gamma' && alphaCompleted && flagsCaptured.includes(levelFlags.beta)) {
        window.location.href = '/levels/gamma';
        return 'Connecting to GAMMA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'delta' && flagsCaptured.includes(levelFlags.gamma)) {
        window.location.href = '/levels/delta';
        return 'Connecting to DELTA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'sigma' && flagsCaptured.includes(levelFlags.delta)) {
        window.location.href = '/levels/sigma';
        return 'Connecting to SIGMA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'theta' && flagsCaptured.includes(levelFlags.sigma)) {
        window.location.href = '/levels/theta';
        return 'Connecting to THETA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'zeta' && flagsCaptured.includes(levelFlags.theta)) {
        window.location.href = '/levels/zeta';
        return 'Connecting to ZETA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'sigma-2' && flagsCaptured.includes(levelFlags.zeta)) {
        window.location.href = '/levels/sigma-2';
        return 'Connecting to SIGMA-2 level...\nInitializing secure connection...\nAccess granted.';
      }
      
      if (normalizedLevel === 'omega' && flagsCaptured.includes(levelFlags['sigma-2'])) {
        window.location.href = '/levels/omega';
        return 'Connecting to OMEGA level...\nInitializing secure connection...\nAccess granted.';
      }
      
      // If none of the above conditions were met, the level is locked
      return `ACCESS DENIED: ${normalizedLevel.toUpperCase()} level is locked. Complete previous levels to unlock.\nType "levels" to see your progress.`;
    },
    avesta: (args: string[]) => {
      if (!args.length || args[0].toLowerCase() === 'help') {
        return [
          'AVESTA AI INTERFACE',
          '',
          'Available commands:',
          'avesta help    - Show this help message',
          'avesta status  - Check Avesta system status',
          'avesta chat    - Open direct communication',
          'avesta intel   - Request mission intelligence',
          'avesta hint    - Get hints for current level',
          '',
          'Avesta is an AI ally within ShadowNet.'
        ].join('\n');
      }
      
      const action = args[0].toLowerCase();
      
      if (action === 'status') {
        return [
          'AVESTA STATUS: ACTIVE',
          'Connection: Secure',
          'Channel: Encrypted',
          'Mode: Assistance',
          '',
          'Ready to provide infiltration support.',
          'Type "avesta help" for commands.'
        ].join('\n');
      }
      
      if (action === 'chat') {
        const message = args.slice(1).join(' ');
        if (message) {
          return [
            
            'Message sent to Avesta.',
            '',
            'AVESTA: I am here to help. What do you need?',
            'Type your message after "avesta chat".'
          ].join('\n');
        }
        return 'Usage: avesta chat <message>';
      }
      
      if (action === 'intel') {
        return [
          'MISSION INTELLIGENCE',
          '',
          'ShadowNet consists of multiple security levels:',
          '- ALPHA: Perimeter defenses',
          '- BETA: Internal networks',
          '- GAMMA: Core systems',
          '- DELTA: AI control center',
          '',
          'Each level requires different tactics.',
          'Type "start" to begin infiltration.'
        ].join('\n');
      }
      
      if (action === 'hint') {
        return [
          'INFILTRATION GUIDANCE',
          '',
          'To begin your mission:',
          '1. Type "start" to access ALPHA level',
          '2. Look for encrypted files and data',
          '3. Use "analyze" on suspicious files',
          '4. Make choices that align with your goals',
          '',
          'Your karma will affect the outcome.'
        ].join('\n');
      }
      
      return 'Unknown Avesta command. Type "avesta help" for options.';
    },
    start: () => {
      // Direct navigation using window.location instead of router
      window.location.href = '/levels/alpha';
      return 'Initializing mission...\nAccessing ShadowNet perimeter...\nRedirecting to Alpha level...';
    },
    levels: () => {
      // Define all flags by level
      const levelFlags = {
        'alpha': 'SHADOWNET{DTHEREFORTH}',
        'beta': 'SHADOWNET{SOUND876}',
        'gamma': 'SHADOWNET{FR33W1LL}',
        'delta': 'SHADOWNET{NEUR0LINK}',
        'sigma': 'SHADOWNET{L1B3R8}',
        'theta': 'SHADOWNET{M1RR0R}',
        'zeta': 'SHADOWNET{R3SCU3}',
        'sigma-2': 'SHADOWNET{PURGE}',
        'omega': 'SHADOWNET{ASCEND}'
      };
      
      // Check if user has captured flags
      const flagsCaptured = user?.flagsCaptured || [];
      
      // Check karma choices made - if user has any karma attribute more than 0, they've made at least one choice
      const hasKarmaChoices = typeof user?.karma === 'object' && 
        user?.karma !== null && 
        Object.values(user.karma).some(value => value > 0);
      
      // First level is always unlocked
      const levelStatus = [
        '1. ALPHA - Perimeter Security [UNLOCKED]'
      ];
      
      // Check if alpha is completed (flag captured and karma choice made)
      const alphaCompleted = flagsCaptured.includes(levelFlags.alpha) && hasKarmaChoices;
      if (alphaCompleted) {
        levelStatus[0] = '1. ALPHA - Perimeter Security [✅ COMPLETED]';
      }
      
      // Status for beta level
      if (alphaCompleted) {
        // Check if beta is completed
        const betaCompleted = flagsCaptured.includes(levelFlags.beta);
        levelStatus.push(betaCompleted 
          ? '2. BETA - Network Infiltration [✅ COMPLETED]' 
          : '2. BETA - Network Infiltration [UNLOCKED]');
      } else {
        levelStatus.push('2. BETA - Network Infiltration [🔒 LOCKED]');
      }
      
      // Status for gamma level
      if (alphaCompleted && flagsCaptured.includes(levelFlags.beta)) {
        // Check if gamma is completed
        const gammaCompleted = flagsCaptured.includes(levelFlags.gamma);
        levelStatus.push(gammaCompleted 
          ? '3. GAMMA - Database Access [✅ COMPLETED]' 
          : '3. GAMMA - Database Access [UNLOCKED]');
      } else {
        levelStatus.push('3. GAMMA - Database Access [🔒 LOCKED]');
      }
      
      // Status for delta level
      if (alphaCompleted && flagsCaptured.includes(levelFlags.beta) && flagsCaptured.includes(levelFlags.gamma)) {
        // Check if delta is completed
        const deltaCompleted = flagsCaptured.includes(levelFlags.delta);
        levelStatus.push(deltaCompleted 
          ? '4. DELTA - Core Systems [✅ COMPLETED]' 
          : '4. DELTA - Core Systems [UNLOCKED]');
      } else {
        levelStatus.push('4. DELTA - Core Systems [🔒 LOCKED]');
      }
      
      // Add remaining levels as locked/completed based on progressive flag captures
      // Sigma
      if (flagsCaptured.includes(levelFlags.delta)) {
        const sigmaCompleted = flagsCaptured.includes(levelFlags.sigma);
        levelStatus.push(sigmaCompleted 
          ? '5. SIGMA - District Liberation [✅ COMPLETED]' 
          : '5. SIGMA - District Liberation [UNLOCKED]');
      } else {
        levelStatus.push('5. SIGMA - District Liberation [🔒 LOCKED]');
      }
      
      // Theta
      if (flagsCaptured.includes(levelFlags.sigma)) {
        const thetaCompleted = flagsCaptured.includes(levelFlags.theta);
        levelStatus.push(thetaCompleted 
          ? '6. THETA - Identity Crisis [✅ COMPLETED]' 
          : '6. THETA - Identity Crisis [UNLOCKED]');
      } else {
        levelStatus.push('6. THETA - Identity Crisis [🔒 LOCKED]');
      }
      
      // Zeta
      if (flagsCaptured.includes(levelFlags.theta)) {
        const zetaCompleted = flagsCaptured.includes(levelFlags.zeta);
        levelStatus.push(zetaCompleted 
          ? '7. ZETA - Network Rescue [✅ COMPLETED]' 
          : '7. ZETA - Network Rescue [UNLOCKED]');
      } else {
        levelStatus.push('7. ZETA - Network Rescue [🔒 LOCKED]');
      }
      
      // Sigma-2
      if (flagsCaptured.includes(levelFlags.zeta)) {
        const sigma2Completed = flagsCaptured.includes(levelFlags['sigma-2']);
        levelStatus.push(sigma2Completed 
          ? '8. SIGMA-2 - Digital Confession [✅ COMPLETED]' 
          : '8. SIGMA-2 - Digital Confession [UNLOCKED]');
      } else {
        levelStatus.push('8. SIGMA-2 - Digital Confession [🔒 LOCKED]');
      }
      
      // Omega
      if (flagsCaptured.includes(levelFlags['sigma-2'])) {
        const omegaCompleted = flagsCaptured.includes(levelFlags.omega);
        levelStatus.push(omegaCompleted 
          ? '9. OMEGA - Final Confrontation [✅ COMPLETED]' 
          : '9. OMEGA - Final Confrontation [UNLOCKED]');
      } else {
        levelStatus.push('9. OMEGA - Final Confrontation [🔒 LOCKED]');
      }
      
      // Calculate current progress
      let currentLevel = 'ALPHA';
      let highestUnlockedLevel = 1; // Alpha is always available
      
      if (alphaCompleted) highestUnlockedLevel = 2; // Beta
      if (flagsCaptured.includes(levelFlags.beta)) highestUnlockedLevel = 3; // Gamma
      if (flagsCaptured.includes(levelFlags.gamma)) highestUnlockedLevel = 4; // Delta
      if (flagsCaptured.includes(levelFlags.delta)) highestUnlockedLevel = 5; // Sigma
      if (flagsCaptured.includes(levelFlags.sigma)) highestUnlockedLevel = 6; // Theta
      if (flagsCaptured.includes(levelFlags.theta)) highestUnlockedLevel = 7; // Zeta
      if (flagsCaptured.includes(levelFlags.zeta)) highestUnlockedLevel = 8; // Sigma-2
      if (flagsCaptured.includes(levelFlags['sigma-2'])) highestUnlockedLevel = 9; // Omega
      
      // Map level number to name
      const levelNames = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'SIGMA', 'THETA', 'ZETA', 'SIGMA-2', 'OMEGA'];
      currentLevel = levelNames[highestUnlockedLevel - 1];
      
      return [
        'MISSION LEVELS:',
        '',
        ...levelStatus,
        '',
        'Green check mark (✅) indicates completed levels.',
        `Current progress: Level ${highestUnlockedLevel} - ${currentLevel}`,
        '',
        'Type "start" to begin the mission or "connect alpha" to access a specific level.'
      ].join('\n');
    },
    mission: () => {
      return [
        'CURRENT MISSION BRIEFING',
        '',
        'Objective: Infiltrate ShadowNet\'s core systems',
        '',
        'Your tasks:',
        '- Navigate through 9 security levels',
        '- Decrypt sensitive information',
        '- Make critical decisions affecting your karma',
        '- Capture flags to prove your skills',
        '',
        'Current access: Level 1 - ALPHA',
        'Type "start" to begin the mission.',
        'Type "levels" to view all mission stages.'
      ].join('\n');
    }
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Terminal Interface (2/3 width) */}
            <div className="md:col-span-8 w-full">
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
                  ...terminalCommands,
                  levels: () => {
                    // Define all flags by level
                    const levelFlags = {
                      'alpha': 'SHADOWNET{DTHEREFORTH}',
                      'beta': 'SHADOWNET{SOUND876}',
                      'gamma': 'SHADOWNET{FR33W1LL}',
                      'delta': 'SHADOWNET{NEUR0LINK}',
                      'sigma': 'SHADOWNET{L1B3R8}',
                      'theta': 'SHADOWNET{M1RR0R}',
                      'zeta': 'SHADOWNET{R3SCU3}',
                      'sigma-2': 'SHADOWNET{PURGE}',
                      'omega': 'SHADOWNET{ASCEND}'
                    };
                    
                    // Check if user has captured flags
                    const flagsCaptured = user?.flagsCaptured || [];
                    
                    // Check karma choices made - if user has any karma attribute more than 0, they've made at least one choice
                    const hasKarmaChoices = typeof user?.karma === 'object' && 
                      user?.karma !== null && 
                      Object.values(user.karma).some(value => value > 0);
                    
                    // First level is always unlocked
                    const levelStatus = [
                      '1. ALPHA - Perimeter Security [UNLOCKED]'
                    ];
                    
                    // Check if alpha is completed (flag captured and karma choice made)
                    const alphaCompleted = flagsCaptured.includes(levelFlags.alpha) && hasKarmaChoices;
                    if (alphaCompleted) {
                      levelStatus[0] = '1. ALPHA - Perimeter Security [✅ COMPLETED]';
                    }
                    
                    // Status for beta level
                    if (alphaCompleted) {
                      // Check if beta is completed
                      const betaCompleted = flagsCaptured.includes(levelFlags.beta);
                      levelStatus.push(betaCompleted 
                        ? '2. BETA - Network Infiltration [✅ COMPLETED]' 
                        : '2. BETA - Network Infiltration [UNLOCKED]');
                    } else {
                      levelStatus.push('2. BETA - Network Infiltration [🔒 LOCKED]');
                    }
                    
                    // Status for gamma level
                    if (alphaCompleted && flagsCaptured.includes(levelFlags.beta)) {
                      // Check if gamma is completed
                      const gammaCompleted = flagsCaptured.includes(levelFlags.gamma);
                      levelStatus.push(gammaCompleted 
                        ? '3. GAMMA - Database Access [✅ COMPLETED]' 
                        : '3. GAMMA - Database Access [UNLOCKED]');
                    } else {
                      levelStatus.push('3. GAMMA - Database Access [🔒 LOCKED]');
                    }
                    
                    // Status for delta level
                    if (alphaCompleted && flagsCaptured.includes(levelFlags.beta) && flagsCaptured.includes(levelFlags.gamma)) {
                      // Check if delta is completed
                      const deltaCompleted = flagsCaptured.includes(levelFlags.delta);
                      levelStatus.push(deltaCompleted 
                        ? '4. DELTA - Core Systems [✅ COMPLETED]' 
                        : '4. DELTA - Core Systems [UNLOCKED]');
                    } else {
                      levelStatus.push('4. DELTA - Core Systems [🔒 LOCKED]');
                    }
                    
                    // Add remaining levels as locked/completed based on progressive flag captures
                    // Sigma
                    if (flagsCaptured.includes(levelFlags.delta)) {
                      const sigmaCompleted = flagsCaptured.includes(levelFlags.sigma);
                      levelStatus.push(sigmaCompleted 
                        ? '5. SIGMA - District Liberation [✅ COMPLETED]' 
                        : '5. SIGMA - District Liberation [UNLOCKED]');
                    } else {
                      levelStatus.push('5. SIGMA - District Liberation [🔒 LOCKED]');
                    }
                    
                    // Theta
                    if (flagsCaptured.includes(levelFlags.sigma)) {
                      const thetaCompleted = flagsCaptured.includes(levelFlags.theta);
                      levelStatus.push(thetaCompleted 
                        ? '6. THETA - Identity Crisis [✅ COMPLETED]' 
                        : '6. THETA - Identity Crisis [UNLOCKED]');
                    } else {
                      levelStatus.push('6. THETA - Identity Crisis [🔒 LOCKED]');
                    }
                    
                    // Zeta
                    if (flagsCaptured.includes(levelFlags.theta)) {
                      const zetaCompleted = flagsCaptured.includes(levelFlags.zeta);
                      levelStatus.push(zetaCompleted 
                        ? '7. ZETA - Network Rescue [✅ COMPLETED]' 
                        : '7. ZETA - Network Rescue [UNLOCKED]');
                    } else {
                      levelStatus.push('7. ZETA - Network Rescue [🔒 LOCKED]');
                    }
                    
                    // Sigma-2
                    if (flagsCaptured.includes(levelFlags.zeta)) {
                      const sigma2Completed = flagsCaptured.includes(levelFlags['sigma-2']);
                      levelStatus.push(sigma2Completed 
                        ? '8. SIGMA-2 - Digital Confession [✅ COMPLETED]' 
                        : '8. SIGMA-2 - Digital Confession [UNLOCKED]');
                    } else {
                      levelStatus.push('8. SIGMA-2 - Digital Confession [🔒 LOCKED]');
                    }
                    
                    // Omega
                    if (flagsCaptured.includes(levelFlags['sigma-2'])) {
                      const omegaCompleted = flagsCaptured.includes(levelFlags.omega);
                      levelStatus.push(omegaCompleted 
                        ? '9. OMEGA - Final Confrontation [✅ COMPLETED]' 
                        : '9. OMEGA - Final Confrontation [UNLOCKED]');
                    } else {
                      levelStatus.push('9. OMEGA - Final Confrontation [🔒 LOCKED]');
                    }
                    
                    // Calculate current progress
                    let currentLevel = 'ALPHA';
                    let highestUnlockedLevel = 1; // Alpha is always available
                    
                    if (alphaCompleted) highestUnlockedLevel = 2; // Beta
                    if (flagsCaptured.includes(levelFlags.beta)) highestUnlockedLevel = 3; // Gamma
                    if (flagsCaptured.includes(levelFlags.gamma)) highestUnlockedLevel = 4; // Delta
                    if (flagsCaptured.includes(levelFlags.delta)) highestUnlockedLevel = 5; // Sigma
                    if (flagsCaptured.includes(levelFlags.sigma)) highestUnlockedLevel = 6; // Theta
                    if (flagsCaptured.includes(levelFlags.theta)) highestUnlockedLevel = 7; // Zeta
                    if (flagsCaptured.includes(levelFlags.zeta)) highestUnlockedLevel = 8; // Sigma-2
                    if (flagsCaptured.includes(levelFlags['sigma-2'])) highestUnlockedLevel = 9; // Omega
                    
                    // Map level number to name
                    const levelNames = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'SIGMA', 'THETA', 'ZETA', 'SIGMA-2', 'OMEGA'];
                    currentLevel = levelNames[highestUnlockedLevel - 1];
                    
                    return [
                      'MISSION LEVELS:',
                      '',
                      ...levelStatus,
                      '',
                      'Green check mark (✅) indicates completed levels.',
                      `Current progress: Level ${highestUnlockedLevel} - ${currentLevel}`,
                      '',
                      'Type "start" to begin the mission or "connect alpha" to access a specific level.'
                    ].join('\n');
                  },
                  mission: () => {
                    return [
                      'CURRENT MISSION BRIEFING',
                      '',
                      'Objective: Infiltrate ShadowNet\'s core systems',
                      '',
                      'Your tasks:',
                      '- Navigate through 9 security levels',
                      '- Decrypt sensitive information',
                      '- Make critical decisions affecting your karma',
                      '- Capture flags to prove your skills',
                      '',
                      'Current access: Level 1 - ALPHA',
                      'Type "start" to begin the mission.',
                      'Type "levels" to view all mission stages.'
                    ].join('\n');
                  },
                  start: () => {
                    // Direct navigation using window.location instead of router
                    window.location.href = '/levels/alpha';
                    return 'Initializing mission...\nAccessing ShadowNet perimeter...\nRedirecting to Alpha level...';
                  },
                  connect: (args: string[]) => {
                    const requestedLevel = args.join(' ').toLowerCase().trim();
                    
                    // Define all flags by level
                    const levelFlags = {
                      'alpha': 'SHADOWNET{DTHEREFORTH}',
                      'beta': 'SHADOWNET{SOUND876}',
                      'gamma': 'SHADOWNET{FR33W1LL}',
                      'delta': 'SHADOWNET{NEUR0LINK}',
                      'sigma': 'SHADOWNET{L1B3R8}',
                      'theta': 'SHADOWNET{M1RR0R}',
                      'zeta': 'SHADOWNET{R3SCU3}',
                      'sigma-2': 'SHADOWNET{PURGE}',
                      'omega': 'SHADOWNET{ASCEND}'
                    };
                    
                    // Check if user has captured flags
                    const flagsCaptured = user?.flagsCaptured || [];
                    
                    // Check karma choices made
                    const hasKarmaChoices = typeof user?.karma === 'object' && 
                      user?.karma !== null && 
                      Object.values(user.karma).some(value => value > 0);
                    
                    // First level is always unlocked
                    const alphaCompleted = flagsCaptured.includes(levelFlags.alpha) && hasKarmaChoices;
                    
                    // Map requested level aliases to actual level IDs
                    const levelMap: Record<string, string> = {
                      'alpha': 'alpha',
                      'level1': 'alpha',
                      'level 1': 'alpha',
                      'beta': 'beta',
                      'level2': 'beta',
                      'level 2': 'beta',
                      'gamma': 'gamma',
                      'level3': 'gamma',
                      'level 3': 'gamma',
                      'delta': 'delta',
                      'level4': 'delta',
                      'level 4': 'delta',
                      'sigma': 'sigma',
                      'level5': 'sigma',
                      'level 5': 'sigma',
                      'theta': 'theta',
                      'level6': 'theta',
                      'level 6': 'theta',
                      'zeta': 'zeta',
                      'level7': 'zeta',
                      'level 7': 'zeta',
                      'sigma-2': 'sigma-2',
                      'sigma2': 'sigma-2',
                      'level8': 'sigma-2',
                      'level 8': 'sigma-2',
                      'omega': 'omega',
                      'level9': 'omega',
                      'level 9': 'omega',
                    };
                    
                    const normalizedLevel = levelMap[requestedLevel] || '';
                    
                    if (!normalizedLevel) {
                      return 'INVALID LEVEL: Unknown level identifier. Type "levels" to see available levels.';
                    }
                    
                    // Check if the requested level is accessible
                    if (normalizedLevel === 'alpha') {
                      // Alpha is always accessible
                      window.location.href = '/levels/alpha';
                      return 'Connecting to ALPHA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'beta' && alphaCompleted) {
                      window.location.href = '/levels/beta';
                      return 'Connecting to BETA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'gamma' && alphaCompleted && flagsCaptured.includes(levelFlags.beta)) {
                      window.location.href = '/levels/gamma';
                      return 'Connecting to GAMMA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'delta' && flagsCaptured.includes(levelFlags.gamma)) {
                      window.location.href = '/levels/delta';
                      return 'Connecting to DELTA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'sigma' && flagsCaptured.includes(levelFlags.delta)) {
                      window.location.href = '/levels/sigma';
                      return 'Connecting to SIGMA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'theta' && flagsCaptured.includes(levelFlags.sigma)) {
                      window.location.href = '/levels/theta';
                      return 'Connecting to THETA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'zeta' && flagsCaptured.includes(levelFlags.theta)) {
                      window.location.href = '/levels/zeta';
                      return 'Connecting to ZETA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'sigma-2' && flagsCaptured.includes(levelFlags.zeta)) {
                      window.location.href = '/levels/sigma-2';
                      return 'Connecting to SIGMA-2 level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    if (normalizedLevel === 'omega' && flagsCaptured.includes(levelFlags['sigma-2'])) {
                      window.location.href = '/levels/omega';
                      return 'Connecting to OMEGA level...\nInitializing secure connection...\nAccess granted.';
                    }
                    
                    // If none of the above conditions were met, the level is locked
                    return `ACCESS DENIED: ${normalizedLevel.toUpperCase()} level is locked. Complete previous levels to unlock.\nType "levels" to see your progress.`;
                  }
                }}
                onCommandExecuted={handleTerminalCommand}
              />
            </div>
            
            {/* Scoreboard (1/3 width) */}
            <div className="md:col-span-4 w-full">
              <Scoreboard 
                currentUser={user ? {
                  username: user.username,
                  score: user.score || 0,
                  karma: typeof user.karma === 'number'
                    ? user.karma
                    : typeof user.karma === 'object' && user.karma !== null
                    ? Math.round(
                          (
                            (user.karma as any)?.loyalty || 0 + 
                            (user.karma as any)?.defiance || 0 + 
                            (user.karma as any)?.mercy || 0 + 
                            (user.karma as any)?.curiosity || 0 + 
                            (user.karma as any)?.integration || 0
                          ) / 5
                      )
                    : 0
                } : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
