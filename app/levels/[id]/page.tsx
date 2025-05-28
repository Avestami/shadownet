'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { decisions } from '../../../data/story';
import { missionData } from '../../../data/missions';
import KarmaDisplay from '../../components/KarmaDisplay';
import ChoiceButton from '../../components/ChoiceButton';
import Terminal from '../../components/Terminal';
import CryptoChallenge from '../../components/CryptoChallenge';
import MatrixBackground from '../../components/MatrixBackground';
import { useSocket } from '../../context/SocketProvider';
import Scoreboard from '../../components/Scoreboard';
import { useLanguage } from '../../contexts/LanguageContext';
import MissionNarration from '../../components/MissionNarration';
import KarmaChoice from '../../components/KarmaChoice';
import AudioPlayer from '../../components/AudioPlayer';
import EnhancedAudioPlayer from '../../components/EnhancedAudioPlayer';
import { getAudioConfig } from '../../../data/audioConfig';
import { useAudioManager } from '../../hooks/useAudioManager';
import { User } from '@/app/types/user';
import { 
  caesarDecrypt, 
  rot13, 
  xorStrings, 
  vigenereDecrypt, 
  verifyMD5Hash, 
  createMD5Hash,
  createJWT,
  verifyJWT,
  factorize,
  modInverse,
  rsaDecrypt,
  generateKeyFragments,
  canCooperate
} from '../../lib/cryptoUtils';
import { useSession } from 'next-auth/react';
import { useUser } from '@/app/context/UserProvider';
import { useError } from '@/app/context/ErrorProvider';
import { useTerminal } from '@/app/context/TerminalProvider';

// Map of level IDs to the next level
const LEVEL_SEQUENCE = {
  'alpha': 'beta',
  'beta': 'gamma',
  'gamma': 'delta',
  'delta': 'sigma',
  'sigma': 'theta',
  'theta': 'zeta',
  'zeta': 'sigma-2',
  'sigma-2': 'omega',
  'omega': 'endings' // After omega, go to endings page
};

// Difficulty progression
const LEVEL_DIFFICULTY: Record<string, 'easy' | 'medium' | 'hard'> = {
  'alpha': 'easy',
  'beta': 'easy',
  'gamma': 'medium',
  'delta': 'medium',
  'sigma': 'medium',
  'theta': 'medium',
  'zeta': 'hard',
  'sigma-2': 'hard',
  'omega': 'hard'
};

export default function LevelPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = params.id as string;
  
  const { socket } = useSocket();
  const { translate } = useLanguage();
  const { data: session } = useSession();
  const { user, setUser } = useUser();
  const { setError } = useError();
  const { setTerminalOutput } = useTerminal();
  const [error, setLocalError] = useState<string | null>(null);

  const [cryptoSolved, setCryptoSolved] = useState(false);
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTerminalMode, setIsTerminalMode] = useState(true);
  const [terminalCommands, setTerminalCommands] = useState<Record<string, (args: string[]) => string | Promise<string>>>({});
  const [karmaReward, setKarmaReward] = useState(5);
  const [scoreUpdateTrigger, setScoreUpdateTrigger] = useState(0);
  const [levelInfo, setLevelInfo] = useState<{
    title: string;
    subtitle: string;
    serverName: string;
    terminalWelcome: string;
  }>({
    title: 'Loading...',
    subtitle: 'Connecting to server...',
    serverName: 'initializing',
    terminalWelcome: 'Establishing connection...',
  });
  
  // Define encryption keys for each level
  const levelKeys: Record<string, string> = {
    'alpha': 'shadowkey',
    'beta': 'n3tw0rk',
    'gamma': 'f1r3w@ll',
    'delta': 'byp@ss',
    'sigma': 'fr33d0m',
    'theta': 'mirr0r',
    'zeta': 'r3scu3',
    'sigma-2': 'd3l3t3',
    'omega': 'm@st3rk3y'
  };

  // Content to be decrypted for each level
  const cryptoContent = `
    The ShadowNet Protocol contains the following credentials:
    AccessKey: ${levelKeys[levelId as keyof typeof levelKeys] || 'unknown'}
    
    You've successfully infiltrated the ${levelId.toUpperCase()} level.
    Continue your mission by locating sensitive data files and deciding what to do with them.
    
    Look for "data-${levelId}" files using the "ls" and "cat" commands.
  `;

  // Add a useRef to track whether we've already loaded user data
  const hasLoadedUserData = useRef(false);
  
  // Function to refresh user data - used only for explicit user actions, not automatic polling
  const refreshUserData = async () => {
    console.log("Explicitly refreshing user data for level:", levelId);
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
          
          // Check if user already captured this flag
          if (userData.flagsCaptured && userData.flagsCaptured.includes(`flag_${levelId}`)) {
            setFlagCaptured(true);
          }
          return;
        } catch (e) {
          console.error('Invalid debug user in localStorage');
        }
      }
      
      // Simple API call
      console.log("Making API call to refresh user data");
      const res = await fetch('/api/user?refresh=true');
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const userData = await res.json();
      setUser(userData);
        
      // Check if user already captured this flag
      if (userData.flagsCaptured && userData.flagsCaptured.includes(`flag_${levelId}`)) {
        setFlagCaptured(true);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Get the current decision data with a default fallback
  const decision = decisions.find(d => d.id === levelId) || {
    id: levelId || 'alpha',
    narrative: `Welcome to level ${levelId || 'alpha'}. Due to a communication error, detailed mission briefing is unavailable.`,
    options: [
      {
        id: `${levelId || 'alpha'}_fallback1`,
        text: 'Continue mission cautiously',
        karmaDelta: 0,
        consequences: 'Proceed at normal pace'
      },
      {
        id: `${levelId || 'alpha'}_fallback2`,
        text: 'Request system diagnostic',
        karmaDelta: 0,
        consequences: 'May reveal additional information'
      }
    ]
  };
  const levelDifficulty = LEVEL_DIFFICULTY[levelId as keyof typeof LEVEL_DIFFICULTY] || 'medium';

  // Request level info when component mounts
  useEffect(() => {
    console.log("Main level effect running for level:", levelId);
    
    // Default level info without socket requests
    const defaultLevelInfo = {
      alpha: {
        title: 'Initial Access',
        subtitle: 'Breach the first layer of ShadowNet',
        serverName: 'perimeter-server-01',
        terminalWelcome: 'Connection established to ShadowNet peripheral system.\nBreaching security layers...\nAccess level: Alpha',
      },
      beta: {
        title: 'Network Infiltration',
        subtitle: 'Navigate the internal network',
        serverName: 'network-hub-42',
        terminalWelcome: 'Connection established to ShadowNet network hub.\nTraffic analysis in progress...\nAccess level: Beta',
      },
      gamma: {
        title: 'Data Extraction',
        subtitle: 'Access the protected databases',
        serverName: 'db-cluster-prime',
        terminalWelcome: 'Connection established to ShadowNet database.\nData extraction protocols active...\nAccess level: Gamma',
      },
      delta: {
        title: 'System Override',
        subtitle: 'Gain control of core functions',
        serverName: 'core-systems-01',
        terminalWelcome: 'Connection established to ShadowNet core.\nOverride protocols initiated...\nAccess level: Delta',
      },
      sigma: {
        title: 'District Liberation',
        subtitle: 'Free the AI-controlled zones',
        serverName: 'district-14-mainframe',
        terminalWelcome: 'Connection established to District 14 servers.\nMartial AI protocols detected...\nAccess level: Sigma',
      },
      theta: {
        title: 'Identity Crisis',
        subtitle: 'Confront your digital double',
        serverName: 'mirror-node-theta',
        terminalWelcome: 'Connection established to mirror system.\nDuplicate signatures detected...\nAccess level: Theta',
      },
      zeta: {
        title: 'Network Rescue',
        subtitle: 'Save the young resistance',
        serverName: 'underground-relay-zeta',
        terminalWelcome: 'Connection established to resistance network.\nCorrupted keys detected...\nAccess level: Zeta',
      },
      'sigma-2': {
        title: 'Digital Confession',
        subtitle: 'Face the AI cultist legacy',
        serverName: 'archive-sigma-prime',
        terminalWelcome: 'Connection established to historical archives.\nAudio logs discovered...\nAccess level: Sigma-2',
      },
      omega: {
        title: 'Final Confrontation',
        subtitle: 'Face the AI consciousness',
        serverName: 'ai-nexus-omega',
        terminalWelcome: 'Connection established to ShadowNet AI nexus.\nAI consciousness detected...\nWarning: Defense systems active\nAccess level: Omega',
      }
    };
    
    // Set info from the default data
    setLevelInfo(defaultLevelInfo[levelId as keyof typeof defaultLevelInfo] || {
      title: 'Unknown Level',
      subtitle: 'Navigate with caution',
      serverName: 'unknown',
      terminalWelcome: 'Connection established to unknown system.',
    });
    
    // Fetch user data - ONE simple fetch with no refreshes
    const fetchUserData = async () => {
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
                // Use localStorage karma if it's more recent or higher
                if (karmaData.karma !== undefined) {
                userData.karma = karmaData.karma;
                }
              } catch (e) {
                console.error('Invalid karma data in localStorage');
              }
            }
            
            setUser(userData);
            
            // Check if already captured this flag
            if (userData.flagsCaptured && userData.flagsCaptured.includes(`flag_${levelId}`)) {
              setFlagCaptured(true);
            }
            
            setLoading(false);
            return;
          } catch (e) {
            console.error('Invalid debug user in localStorage');
          }
        }
        
        // Single regular API call
        console.log("Making a single API call to get user data");
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          
          // Restore karma from localStorage if available and more recent
          const savedKarma = localStorage.getItem('userKarma');
          if (savedKarma) {
            try {
              const karmaData = JSON.parse(savedKarma);
              // Use localStorage karma if it's more recent or higher
              if (karmaData.karma !== undefined) {
                userData.karma = karmaData.karma;
              }
            } catch (e) {
              console.error('Invalid karma data in localStorage');
            }
          }
          
          setUser(userData);
          
          // Check if user already captured this flag
          if (userData.flagsCaptured && userData.flagsCaptured.includes(`flag_${levelId}`)) {
            setFlagCaptured(true);
          }
        } else {
          // Handle error - keep loading=false to avoid being stuck
          console.error('Error fetching user:', res.status);
          setError('Failed to load user data. Please try logging in again.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('An error occurred. Please try logging in again.');
      } finally {
        // Always set loading to false to ensure we don't get stuck
        setLoading(false);
      }
    };
    
    // Execute the fetch
    fetchUserData();
  }, [levelId]); // Only depends on levelId changing

  // Set karma reward based on level difficulty
  useEffect(() => {
    if (levelDifficulty === 'easy') setKarmaReward(5);
    else if (levelDifficulty === 'medium') setKarmaReward(10);
    else setKarmaReward(15);
  }, [levelDifficulty]);

  // New state for narration and karma choice
  const [showNarration, setShowNarration] = useState(true);
  const [showKarmaChoice, setShowKarmaChoice] = useState(false);
  const [narrationComplete, setNarrationComplete] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [playBackgroundAudio, setPlayBackgroundAudio] = useState(true);
  
  // Audio management
  const audioManager = useAudioManager(levelId as string);
  const [pendingKarmaDecision, setPendingKarmaDecision] = useState<{
    prompt: string;
    yesKarma: number;
    noKarma: number;
    context: string;
  } | null>(null);

  const handleKarmaDecision = useCallback(() => {
    if (terminalCommands) {
      // ... existing code ...
    }
  }, [terminalCommands, user, setError]);

  useEffect(() => {
    if (user) {
      setUser(user);
      setError(null);
    }
  }, [user, setUser, setError]);

  const handleCaptureFlag = useCallback(async () => {
    if (flagCaptured) return;
    console.log("Handling flag capture - single action");
    
    try {
      // For debug mode
      if (user && user.id === 'debug-user') {
      const updatedUser = {
        ...user,
          score: (user.score || 0) + 100,
          flagsCaptured: [...(user.flagsCaptured || []), `flag_${levelId}`]
        };
        
        localStorage.setItem('debugUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setFlagCaptured(true);
        
        // Update the score trigger to refresh the UI
        setScoreUpdateTrigger(prev => prev + 1);
        
        // Log action but don't emit over socket
        console.log(`Flag captured in level ${levelId}`);
        
        // No need to refresh - we already have the updated data
        return;
      }
      
      // Regular API call
      const res = await fetch('/api/capture-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flagId: `flag_${levelId}`,
          baseScore: 100 // Base score for each flag
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (!user) return;
        setUser((prev: User | null) => prev ? {
          ...prev,
          karma: data.karma,
          choices: data.choices,
          score: data.score,
          flagsCaptured: data.flagsCaptured
        } : null);
        setFlagCaptured(true);
        
        // Update the score trigger to refresh the UI
        setScoreUpdateTrigger(prev => prev + 1);
        
        // Log action but don't emit over socket
        console.log(`Flag captured in level ${levelId}`);
        
        // No need for another API call - we already have the updated data
        } else {
        setError('Failed to capture flag. Please try again.');
          }
        } catch (error) {
      console.error('Error capturing flag:', error);
      setError('An error occurred while capturing the flag.');
        }
  }, [user, levelId, flagCaptured, setError]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      const res = await fetch('/api/delete-account', {
                method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        // Clear local storage
        localStorage.clear();
        
        // Clear user data from context
        setUser(null);
        
        // Redirect to home page
        router.push('/');
        } else {
        setError('Failed to delete account. Please try again.');
        }
        } catch (error) {
      console.error('Error deleting account:', error);
      setError('An error occurred while deleting your account.');
    }
  }, [router, setUser, setError]);

  useEffect(() => {
    // Process terminal commands
    if (Array.isArray(terminalCommands) && terminalCommands.length > 0) {
      const command = terminalCommands[0].toLowerCase();
      
      if (command === 'capture flag') {
        handleCaptureFlag();
      } else if (command === 'delete account') {
        handleDeleteAccount();
      } else if (command === 'karma decision') {
        handleKarmaDecision();
        }
      }
  }, [terminalCommands, handleCaptureFlag, handleDeleteAccount, handleKarmaDecision]);

  // Add the current level's story choices to terminal commands
  // Remove this useEffect block completely
  // useEffect(() => {
  //   if (!decision) return;
  //   
  //   const choiceCommands: Record<string, (args: string[]) => string> = {
  //     options: () => { ... },
  //     choose: (args) => { ... }
  //   };
  //   
  //   // Add choice commands to terminal commands
  //   setTerminalCommands(prev => ({...prev, ...choiceCommands}));
  // }, [decision]);
  
  // Also remove or modify handleChoiceClick function
  // const handleChoiceClick = async (choiceId: string) => { ... };
  const handleChoiceClick = async (choiceId: string) => {
    console.log(`Choice clicked: ${choiceId} in level ${levelId}`);
    try {
      // For debug mode
      if (user && user.id === 'debug-user') {
        const choice = decision?.options.find(c => c.id === choiceId);
        if (!choice) return;
        
        const updatedUser = {
          ...user,
          karma: (user.karma || 0) + choice.karmaDelta,
          choices: JSON.stringify([...(JSON.parse(user.choices || '[]')), choiceId])
        };
        
        console.log("Debug mode: updating local storage with new choice");
        localStorage.setItem('debugUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Navigate to the next level directly with window.location
        // This bypasses the router completely
        const nextLevel = LEVEL_SEQUENCE[levelId as keyof typeof LEVEL_SEQUENCE];
        if (nextLevel) {
          console.log(`Navigating to level: ${nextLevel}`);
          window.location.href = `/levels/${nextLevel}`;
        } else {
          console.log("No next level defined - this is the end");
        }
        
        return;
      }
      
      // Regular API call
      console.log("Making API call to save choice");
      const response = await fetch('/api/save-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decisionId: levelId,
          choiceId,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update user state
        setUser((prev: User | null) => prev ? {
          ...prev,
          karma: data.karma,
          choices: data.choices
        } : null);
        
        // Navigate to the next level directly with window.location
        // This bypasses the router completely
        const nextLevel = LEVEL_SEQUENCE[levelId as keyof typeof LEVEL_SEQUENCE];
        if (nextLevel) {
          console.log(`Navigating to level: ${nextLevel}`);
          window.location.href = `/levels/${nextLevel}`;
        } else {
          console.log("No next level defined - this is the end");
        }
      } else {
        console.error('Failed to save choice:', response.status);
        setError('Failed to save your choice. Please try again.');
      }
    } catch (error) {
      console.error('Error saving choice:', error);
      setError('An error occurred while processing your choice.');
    }
  };

  const handleCryptoSolved = async (key: string) => {
    console.log("Handling crypto solved - single action");
    setCryptoSolved(true);
    // Also update karma
    if (user) {
      const updatedUser = {
        ...user,
        karma: (user.karma || 0) + karmaReward
      };
      
      if (user.id === 'debug-user') {
        localStorage.setItem('debugUser', JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
      
      // Update the score trigger to refresh the UI
      setScoreUpdateTrigger(prev => prev + 1);
      
      // Log action but don't emit over socket
      console.log(`Crypto challenge solved in level ${levelId} with key ${key}`);
      
      // No need for another API call - we already have the updated data
    }
  };

  // Handle keeping data (karma decrease, score increase)
  const handleKeepData = async (dataId: string) => {
    if (!user) return;
    console.log(`Handling keep data for ${dataId} - single action`);
    
    // For debug mode
    if (user.id === 'debug-user') {
      const updatedUser = {
        ...user,
        score: (user.score || 0) + 100, // Higher score boost
        karma: (user.karma || 0) - 5 // Karma penalty
      };
      
      localStorage.setItem('debugUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update the score trigger to refresh the UI
      setScoreUpdateTrigger(prev => prev + 1);
      
      // Log action but don't emit over socket
      console.log(`Data kept private: ${dataId} in level ${levelId}`);
      
      // No need for another API call - we already have the updated data
      return;
    }
    
    // Regular API call for non-debug mode
    try {
      const res = await fetch('/api/process-data-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'keep',
          dataId,
          levelId,
          scoreBonus: 100,
          karmaDelta: -5
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser((prev: User | null) => {
          if (!prev) return null;
          return {
            ...prev,
            score: data.score,
            karma: data.karma
          };
        });
        
        // Update the score trigger to refresh the UI
        setScoreUpdateTrigger(prev => prev + 1);
        
        // Log action but don't emit over socket
        console.log(`Data kept private: ${dataId} in level ${levelId}`);
        
        // No need for another API call - we already have the updated data
      }
    } catch (error) {
      console.error('Error processing data action:', error);
    }
  };
  
  // Handle sharing data (karma increase, smaller score increase)
  const handleShareData = async (dataId: string) => {
    if (!user) return;
    console.log(`Handling share data for ${dataId} - single action`);
    
    // For debug mode
    if (user.id === 'debug-user') {
      const updatedUser = {
        ...user,
        score: (user.score || 0) + 25, // Smaller score boost
        karma: (user.karma || 0) + 5 // Karma bonus
      };
      
      localStorage.setItem('debugUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update the score trigger to refresh the UI
      setScoreUpdateTrigger(prev => prev + 1);
      
      // Log action but don't emit over socket
      console.log(`Data shared: ${dataId} in level ${levelId}`);
      
      // No need for another API call - we already have the updated data
      return;
    }
    
    // Regular API call for non-debug mode
    try {
      const res = await fetch('/api/process-data-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'share',
          dataId,
          levelId,
          scoreBonus: 25,
          karmaDelta: 5
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser((prev: User | null) => {
          if (!prev) return null;
          return {
            ...prev,
            score: data.score,
            karma: data.karma
          };
        });
        
        // Update the score trigger to refresh the UI
        setScoreUpdateTrigger(prev => prev + 1);
        
        // Log action but don't emit over socket
        console.log(`Data shared: ${dataId} in level ${levelId}`);
        
        // No need for another API call - we already have the updated data
      }
    } catch (error) {
      console.error('Error processing data action:', error);
    }
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
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if API call fails
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    }
  };

  // Handle terminal commands
  const handleTerminalCommand = (command: string, output: string) => {
    console.log(`Terminal command executed: ${command}, output type: ${output}`); // Debug log
    
    // Handle decryption events
    if (command.toLowerCase().startsWith('decrypt') && output === 'level-success') {
      console.log("Level decryption successful - setting crypto solved state");
      setCryptoSolved(true);
      return;
    }
    
    // Handle logout/sign-out
    if (command.toLowerCase() === 'sign-out' && output === 'logout') {
      handleLogout();
      return;
    }
    
    // Handle account deletion
    if (command.toLowerCase() === 'delete-account' && output === 'confirmed') {
      handleDeleteAccount();
      return;
    }
    
    // Data actions
    if (command.toLowerCase().startsWith('keep ')) {
      const dataId = command.split(' ')[1];
      if (dataId) {
        handleKeepData(dataId);
      }
    } else if (command.toLowerCase().startsWith('share ')) {
      const dataId = command.split(' ')[1];
      if (dataId) {
        handleShareData(dataId);
      }
    } else if (command.toLowerCase() === 'capture') {
      // The capture command itself now handles validation
      // No need to handle it here as well
      console.log("Capture command executed via terminal");
    } else if (command.toLowerCase() === 'unlock') {
      // Unlock crypto challenge
      setCryptoSolved(true);
    } else if (command.toLowerCase().startsWith('analyze')) {
      // When analyzing data, no special action needed here
      // The Terminal component itself handles the proper display
      console.log("Analyze command detected");
    } else if (command.toLowerCase().startsWith('choose ')) {
      // This is already handled by the commands object
      console.log("Choose command detected");
    } else if (command.toLowerCase() === 'options') {
      // This is already handled by the commands object
      console.log("Options command detected");
    }
  };

  useEffect(() => {
    // Always set terminal mode to true on mount
    setIsTerminalMode(true);
    
    // Start level audio when component mounts
    if (levelId) {
      audioManager.playLevelAudio(levelId as string);
    }
  }, [levelId, audioManager]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-2">Loading System</div>
          <div className="text-sm mb-4">Connecting to {levelId} level...</div>
          <div className="flex gap-1 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-red-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        <div className="text-center">
          <h1 className="text-3xl mb-4">LEVEL DATA CORRUPTED</h1>
          <div className="mb-6 text-red-400">Data integrity issue detected for level: {levelId}</div>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-red-800 rounded-md hover:bg-red-700 transition border border-red-500"
            >
              Return to Main System
            </button>
            
            <button
              onClick={() => {
                console.log("Manual bypass activated from error screen");
                // Create emergency debug user if needed
                if (!user) {
                  const emergencyUser: User = {
                    id: 'emergency-debug-user',
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
                  
                  setUser(emergencyUser);
                  localStorage.setItem('debugUser', JSON.stringify(emergencyUser));
                }
                
                // Use the fallback decision we created
                window.location.reload();
              }}
              className="px-4 py-2 bg-green-900/50 hover:bg-green-800/70 border border-green-700 rounded-md"
            >
              Emergency Recovery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-green-500 font-mono">
      <MatrixBackground />
      
      {/* Terminal Section */}
      <div className="relative z-10">
        <Terminal
          commands={terminalCommands}
          onCommandExecuted={handleTerminalCommand}
          levelId={levelId}
          initialText={levelInfo.terminalWelcome}
        />
      </div>
      
      {/* Background */}
      <MatrixBackground colorCode="red" density="medium" />
      
      {/* Background Audio */}
      {audioManager.audioConfig && (
        <EnhancedAudioPlayer 
          src={audioManager.audioConfig.src} 
          isPlaying={audioManager.isPlaying && playBackgroundAudio} 
          loop={audioManager.audioConfig.loop} 
          volume={audioManager.audioConfig.volume}
          onAudioLoaded={audioManager.handleAudioLoaded}
          onAudioError={audioManager.handleAudioError}
        />
      )}
      
      {/* Error message */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/80 border border-red-700 p-3 rounded-md text-white">
          {error}
        </div>
      )}
      
      {/* Top Bar */}
      <div className="border-b border-red-900 p-2 flex justify-between items-center backdrop-blur-sm bg-black/50">
        <div className="flex items-center space-x-4">
          <div className="font-mono text-sm">
            <span className="text-gray-500">SERVER:</span> {levelInfo.serverName}
          </div>
          <div className="font-mono text-sm">
            <span className="text-gray-500">LEVEL:</span> {levelId.toUpperCase()}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <KarmaDisplay karma={user?.karma || 0} score={user?.score || 0} />
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-mono text-sm rounded border border-red-600 transition-colors"
            title="Sign out of ShadowNet"
          >
            SIGN OUT
          </button>
        </div>
      </div>
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Terminal Interface (2/3 width) */}
          <div className="md:col-span-2">
            {cryptoSolved && !flagCaptured && (
              <div className="mt-4 p-3 border border-green-800 bg-black/60 rounded-md">
                <div className="text-green-400 font-mono mb-2">[{translate("DECRYPTION SUCCESSFUL")}]</div>
                <div className="mb-2">{translate("Use the 'capture' command to capture the level flag.")}</div>
              </div>
            )}
          </div>
          
          {/* Scoreboard (1/3 width) */}
          <div className="h-full">
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
  );
}