'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { decisions } from '../../../data/story';
import { missionData } from '../../../data/missions';
import KarmaDisplay from '../../components/KarmaDisplay';
import ChoiceButton from '../../components/ChoiceButton';
import Terminal from '../../components/Terminal';
import CryptoChallenge from '../../components/CryptoChallenge';
import MatrixBackground from '../../components/MatrixBackground';
import { useSocket } from '../../components/SocketProvider';
import Scoreboard from '../../components/Scoreboard';
import { useLanguage } from '../../contexts/LanguageContext';
import MissionNarration from '../../components/MissionNarration';
import KarmaChoice from '../../components/KarmaChoice';
import AudioPlayer from '../../components/AudioPlayer';
import EnhancedAudioPlayer from '../../components/EnhancedAudioPlayer';
import { getAudioConfig } from '../../../data/audioConfig';
import { useAudioManager } from '../../hooks/useAudioManager';
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
  console.log("LevelPage component initializing...");
  
  const router = useRouter();
  const params = useParams();
  const levelId = params.id as string;
  
  console.log("Level ID from params:", levelId);
  
  const { isConnected, sendMessage } = useSocket();
  const { translate } = useLanguage();

  interface UserData {
    id: string;
    username: string;
    karma: number;
    choices: string[];
    flagsCaptured: string[];
    score: number;
    [key: string]: any;
  }

  const [user, setUser] = useState<UserData | null>(null);
  const [cryptoSolved, setCryptoSolved] = useState(false);
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTerminalMode, setIsTerminalMode] = useState(true);
  const [terminalCommands, setTerminalCommands] = useState<Record<string, (args: string[]) => string | Promise<string>>>({});
  const [error, setError] = useState<string | null>(null);
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
                userData.karma = karmaData.karma;
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

  const handleKarmaDecision = (choice: 'yes' | 'no') => {
    if (!pendingKarmaDecision) return;
    
    const karmaChange = choice === 'yes' ? pendingKarmaDecision.yesKarma : pendingKarmaDecision.noKarma;
    console.log(`Karma decision: ${choice}, karma change: ${karmaChange}`);
    setKarmaChoiceMade(true);
    setPendingKarmaDecision(null);
    
    // Update user karma
    if (user) {
      const updatedUser = {
        ...user,
        karma: (user.karma || 0) + karmaChange
      };
      
      // Always update localStorage for persistence
      localStorage.setItem('userKarma', JSON.stringify({
        karma: updatedUser.karma,
        lastUpdated: Date.now()
      }));
      
      // For debug mode
      if (user.id === 'debug-user' || user.id === 'emergency-debug-user') {
        localStorage.setItem('debugUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return karmaChange;
      }
      
      // For regular users, update via API
      fetch('/api/save-choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionId: levelId,
          choiceId: choice,
          karmaChange: karmaChange
        })
      })
      .then(response => response.json())
      .then(data => {
        setUser(updatedUser);
        // Update localStorage with server response
        localStorage.setItem('userKarma', JSON.stringify({
          karma: data.karma || updatedUser.karma,
          lastUpdated: Date.now()
        }));
      })
      .catch(error => {
        console.error('Error saving choice:', error);
        setError('Failed to save your choice');
      });
    }
    
    return karmaChange;
  };

  useEffect(() => {
    // Set up terminal commands specific to this level
    const levelCommands: Record<string, (args: string[]) => string | Promise<string>> = {
      level: () => `Current level: ${levelId}\nDifficulty: ${levelDifficulty}\nServer: ${levelInfo.serverName}`,
      progress: () => `You have completed ${user?.choices?.length || 0} choice(s) so far.\nKarma: ${user?.karma || 0}\nCaptured flags: ${user?.flagsCaptured?.length || 0}`,
      unlock: () => {
        setCryptoSolved(true);
        return 'Decryption challenge unlocked. Solve it to proceed.';
      },
      capture: () => {
        if (!flagCaptured) {
          handleCaptureFlag();
          return 'Flag capture initiated... Processing...';
        } else {
          return 'Flag already captured for this level.';
        }
      },
      hint: () => {
        // Provide level-specific hints with detailed explanations
        const hints = {
          alpha: `LEVEL ALPHA - CAESAR CIPHER CHALLENGE:
This is your first infiltration mission. You need to crack a Caesar cipher.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat alpha_encrypted.txt' to see the encrypted message
3. Use 'cat alpha_hint.txt' for clues about the shift value
4. Count letters in "SHADOW" to find the shift (6 letters = shift 6)
5. Use 'caesar-decrypt <encrypted_text> 6' to decrypt the message
6. The decrypted message reveals the key: "shadowkey"
7. Use 'decrypt data-alpha.enc shadowkey' to unlock the level
8. Use 'capture' to capture the flag

STORY: The resistance has left encrypted messages using classical ciphers. Master this to proceed.`,

          beta: `LEVEL BETA - AUDIO DECODING CHALLENGE:
You need to extract a decryption key from an audio file.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat beta_encrypted.txt' to see the ROT13 encrypted message
3. Use 'download beta_voice.wav' to get the audio file
4. The audio transcript reveals the key: "n3tw0rk"
5. Use 'decrypt data-beta.enc n3tw0rk' to unlock the level
6. Use 'capture' to capture the flag

STORY: Surveillance systems use audio channels to hide keys. Listen carefully to extract the secret.`,

          gamma: `LEVEL GAMMA - IMAGE STEGANOGRAPHY CHALLENGE:
You need to extract hidden strings from images and XOR them together.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'download gamma_img1.png' to get the first image (contains "f1r3")
3. Use 'download gamma_img2.png' to get the second image (contains "w@ll")
4. Use 'download gamma_img3.png' and 'download gamma_img4.png' (these are decoys)
5. Use 'xor f1r3 w@ll' to combine the two strings
6. The XOR result gives you the key: "f1r3w@ll"
7. Use 'decrypt data-gamma.enc f1r3w@ll' to unlock the level
8. Use 'capture' to capture the flag

STORY: Critical data is hidden in images using steganography. Extract and combine the pieces.`,

          delta: `LEVEL DELTA - VIGENÈRE CIPHER CHALLENGE:
You need to decrypt a Vigenère cipher using an agent callsign.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat delta_encrypted.txt' to see the Vigenère encrypted message
3. The hint mentions "a bird of darkness and mystery" - this is "RAVEN"
4. Use 'vigenere-decrypt <encrypted_text> raven' to decrypt the message
5. The decrypted message reveals the key: "byp@ss"
6. Use 'decrypt data-delta.enc byp@ss' to unlock the level
7. Use 'capture' to capture the flag

STORY: Agent callsigns are used as Vigenère keys. The raven holds the secret to bypass security.`,

          sigma: `LEVEL SIGMA - HASH CRACKING CHALLENGE:
You need to crack an MD5 hash and forge a new one for admin access.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat sigma_hashes.txt' to see the hash challenge
3. Use 'hash-crack 5d41402abc4b2a76b9719d911017c592' to crack the admin password
4. The cracked password is "hello"
5. Use 'md5 fr33d0m' to create the hash for the access code
6. The MD5 hash of "fr33d0m" is your key
7. Use 'decrypt data-sigma.enc fr33d0m' to unlock the level
8. Use 'capture' to capture the flag

STORY: Admin rights require hash manipulation. Crack the old, forge the new.`,

          theta: `LEVEL THETA - LSB STEGANOGRAPHY CHALLENGE:
You need to extract a key from the least significant bits of a PNG image.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'download theta_steganography.png' to get the image file
3. The LSB analysis reveals the hidden key: "mirr0r"
4. Use 'decrypt data-theta.enc mirr0r' to unlock the level
5. Use 'capture' to capture the flag

STORY: Digital identities are hidden in the binary noise of images. Extract the mirror key.`,

          zeta: `LEVEL ZETA - JWT TOKEN FORGING CHALLENGE:
You need to forge a JWT token to gain access to the next level.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat zeta_jwt.txt' to see the JWT challenge
3. Use 'jwt-forge '{"user":"admin","level":"zeta","access":"granted"}' r3scu3' to create the token
4. Use 'jwt-verify <your_token> r3scu3' to verify it works
5. The secret "r3scu3" is your decryption key
6. Use 'decrypt data-zeta.enc r3scu3' to unlock the level
7. Use 'capture' to capture the flag

STORY: Access tokens control system entry. Forge the right credentials to rescue the network.`,

          'sigma-2': `LEVEL SIGMA-2 - RSA DECRYPTION CHALLENGE:
You need to break weak RSA encryption with small, easily factorable n.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat sigma2_rsa.txt' to see the RSA challenge
3. Use 'factor 323' to find p=17 and q=19
4. Calculate φ(n) = (17-1)(19-1) = 16×18 = 288
5. Use 'mod-inverse 5 288' to find d=173
6. Use 'rsa-decrypt [72,123,45,234,156,89,201,67] 323 173' to decrypt
7. The decrypted message contains the key: "d3l3t3"
8. Use 'decrypt data-sigma-2.enc d3l3t3' to unlock the level
9. Use 'capture' to capture the flag

STORY: Weak RSA parameters expose the AI cultist's confession. Factor and decrypt the truth.`,

          omega: `LEVEL OMEGA - COOPERATIVE XOR KEY CHALLENGE:
The final level requires 3 agents with similar karma to combine their key fragments.

WHAT TO DO:
1. Use 'ls' to see available files
2. Use 'cat omega_cooperative.txt' to understand the challenge
3. Use 'key-fragment' to get your karma-based key fragment
4. Find 2 other agents with karma within ±2 of yours
5. Use 'xor <fragment1> <fragment2>' then 'xor <result> <fragment3>' to combine all 3
6. The final XOR result should be "m@st3rk3y"
7. Use 'decrypt data-omega.enc m@st3rk3y' to unlock the level
8. Use 'capture' to capture the flag

TEAM COOPERATION REQUIRED: 
- High karma (15+): Fragment "m@st"
- Medium karma (5-14): Fragment "3rk3" 
- Low karma (<5): Fragment "y"
- All 3 fragments XORed together = "m@st3rk3y"

STORY: Only united agents can unlock the final truth. Cooperation is the key to victory.`
        };
        
        return hints[levelId as keyof typeof hints] || 'No specific hint available for this level.';
      },
      key: () => {
        // Only give key hints if crypto challenge is solved
        if (cryptoSolved) {
          const keyHints = {
            alpha: 'The shadow key hides in plain sight.',
            beta: 'Networks require special access codes.',
            gamma: 'Firewalls protect the most valuable data.',
            delta: 'Sometimes you need to bypass security.',
            sigma: 'Freedom is the key to liberation.',
            theta: 'Look in the mirror to find yourself.',
            zeta: 'Rescue operations require quick thinking.',
            'sigma-2': 'Delete commands erase more than files.',
            omega: 'The master key unlocks the final truth.'
          };
          return `KEY HINT: ${keyHints[levelId as keyof typeof keyHints] || 'No key hint available.'}`;
        } else {
          return 'You must unlock the encryption challenge first.';
        }
      },
      traces: async () => {
        try {
          const response = await fetch(`/api/traces?level=${levelId}`);
          const data = await response.json();
          
          const traceInfo = `TRACE ANALYSIS:\nDetected ${data.traceCount} trace(s) from other agents:\n` +
                           `- Success rate: ${data.successRate}%\n` +
                           `- Last activity: ${data.lastActivity ? data.lastActivity + ' minutes ago' : 'No recent activity'}\n\n`;
          
          if (data.hints && data.hints.length > 0) {
            return traceInfo + `HINTS FROM OTHER AGENTS:\n${data.hints.join('\n')}\n\n` +
                   `Use 'leave-trace' after successful decryption to help other agents.`;
          } else {
            return traceInfo + `No hints available yet. Be the first to leave traces!\n\n` +
                   `Use 'leave-trace' after successful decryption to help other agents.`;
          }
        } catch (error) {
          return 'Error fetching trace data. Network connection required.';
        }
      },
      'leave-trace': () => {
        if (!cryptoSolved) {
          return 'You must successfully decrypt something before leaving a trace.';
        }
        
        // Set up karma decision for leaving traces
        setPendingKarmaDecision({
          prompt: 'Leave decryption traces for other agents? This will help them but may expose your methods.',
          yesKarma: 1,
          noKarma: 0,
          context: 'trace'
        });
        
        return 'KARMA DECISION REQUIRED:\n' +
               'Leave decryption traces for other agents? This will help them but may expose your methods.\n\n' +
               'Type "yes" to leave traces (+1 karma) or "no" to stay hidden (0 karma)';
      },
      yes: () => {
        if (pendingKarmaDecision) {
          const karmaChange = handleKarmaDecision('yes');
          if (karmaChange !== undefined) {
            if (pendingKarmaDecision.context === 'trace') {
              // Save trace to API
              fetch('/api/traces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  levelId,
                  userId: user?.id || 'anonymous',
                  username: user?.username || 'anonymous',
                  hint: `Decryption key hint: Look for patterns in ${levelId} level files`
                })
              }).catch(error => console.error('Error saving trace:', error));
              
              return `Traces left successfully. Other agents will find helpful hints.\nKarma: ${karmaChange >= 0 ? '+' : ''}${karmaChange}`;
            } else if (pendingKarmaDecision.context === 'mission') {
              return `Decision recorded. Your choice will affect the story.\nKarma: ${karmaChange >= 0 ? '+' : ''}${karmaChange}\n\nType 'next' to continue to the next level.`;
            }
          }
        }
        return 'No pending decision to confirm.';
      },
      no: () => {
        if (pendingKarmaDecision) {
          const karmaChange = handleKarmaDecision('no');
          if (karmaChange !== undefined) {
            if (pendingKarmaDecision.context === 'trace') {
              return `You remain hidden. No traces left.\nKarma: ${karmaChange >= 0 ? '+' : ''}${karmaChange}`;
            } else if (pendingKarmaDecision.context === 'mission') {
              return `Decision recorded. Your choice will affect the story.\nKarma: ${karmaChange >= 0 ? '+' : ''}${karmaChange}\n\nType 'next' to continue to the next level.`;
            }
          }
        }
        return 'No pending decision to decline.';
      },
      next: () => {
        if (karmaChoiceMade && flagCaptured) {
          const nextLevel = LEVEL_SEQUENCE[levelId as keyof typeof LEVEL_SEQUENCE];
          if (nextLevel) {
            setTimeout(() => {
              window.location.href = `/levels/${nextLevel}`;
            }, 1000);
            return `Proceeding to ${nextLevel.toUpperCase()} level...\nRedirecting...`;
          } else {
            setTimeout(() => {
              window.location.href = '/endings';
            }, 1000);
            return 'Mission complete. Calculating final karma score...\nRedirecting to endings...';
          }
        } else if (!karmaChoiceMade) {
          return 'You must make the mission decision first. Check your mission briefing.';
        } else if (!flagCaptured) {
          return 'You must capture the flag before proceeding to the next level.';
        }
        return 'Requirements not met to proceed.';
      },
      mission: () => {
        if (missionData[levelId] && !karmaChoiceMade) {
          // Special handling for omega level - check team cooperation
          if (levelId === 'omega') {
            const currentKarma = user?.karma || 0;
            return `MISSION BRIEFING:\n${missionData[levelId].narration}\n\n` +
                   `TEAM COOPERATION STATUS:\n` +
                   `Your current karma: ${currentKarma}\n` +
                   `Teams with karma within 2 points of yours (${currentKarma - 2} to ${currentKarma + 2}) can cooperate!\n\n` +
                   `KARMA DECISION REQUIRED:\n${missionData[levelId].prompt}\n\n` +
                   `Type "yes" (+${missionData[levelId].yesKarma} karma) or "no" (${missionData[levelId].noKarma >= 0 ? '+' : ''}${missionData[levelId].noKarma} karma)\n\n` +
                   `Note: Your final karma will determine which teams you can cooperate with for the ending!`;
          }
          
          setPendingKarmaDecision({
            prompt: missionData[levelId].prompt,
            yesKarma: missionData[levelId].yesKarma,
            noKarma: missionData[levelId].noKarma,
            context: 'mission'
          });
          
          return `MISSION BRIEFING:\n${missionData[levelId].narration}\n\n` +
                 `KARMA DECISION REQUIRED:\n${missionData[levelId].prompt}\n\n` +
                 `Type "yes" (+${missionData[levelId].yesKarma} karma) or "no" (${missionData[levelId].noKarma >= 0 ? '+' : ''}${missionData[levelId].noKarma} karma)`;
        } else if (karmaChoiceMade) {
          return 'Mission decision already made. Type "next" to proceed to the next level.';
        } else {
          return 'No mission data available for this level.';
        }
      },
      'team-status': () => {
        if (levelId === 'omega') {
          const currentKarma = user?.karma || 0;
          const minCoopKarma = currentKarma - 2;
          const maxCoopKarma = currentKarma + 2;
          
          return `TEAM COOPERATION STATUS:\n\n` +
                 `Your karma: ${currentKarma}\n` +
                 `Cooperation range: ${minCoopKarma} to ${maxCoopKarma}\n\n` +
                 `Teams within this karma range can work together for enhanced endings.\n` +
                 `The closer your karma scores, the better your cooperation potential.\n\n` +
                 `Cooperation benefits:\n` +
                 `- Shared knowledge and resources\n` +
                 `- Enhanced ending narratives\n` +
                 `- Collective impact on the Ghost Grid\n\n` +
                 `Make your final karma decision wisely!`;
        } else {
          return 'Team cooperation is only available in the final level (Omega).';
        }
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
      // New cryptographic challenge commands
      'caesar-decrypt': (args) => {
        if (args.length < 2) return 'Usage: caesar-decrypt <text> <shift>';
        const text = args[0].toUpperCase();
        const shift = parseInt(args[1]);
        if (isNaN(shift)) return 'Error: Shift must be a number';
        
        const decrypted = caesarDecrypt(text, shift);
        return `Caesar decryption (shift ${shift}):\n${decrypted}`;
      },
      'download': (args) => {
        if (args.length === 0) return 'Usage: download <filename>';
        const filename = args[0];
        
        // Handle level-specific downloads
        if (levelId === 'beta' && filename === 'beta_voice.wav') {
          return [
            'Downloading audio file...',
            'File: beta_voice.wav',
            'Size: 2.3MB',
            'Status: Complete',
            '',
            'AUDIO TRANSCRIPT (automated):',
            '"The network key is... n3tw0rk... remember this..."',
            '',
            'Use this key to decrypt the beta level data.'
          ].join('\n');
        } else if (levelId === 'gamma' && filename.startsWith('gamma_img')) {
          const imgNum = filename.split('gamma_img')[1].split('.')[0];
          if (imgNum === '1') {
            return [
              'Downloading image file...',
              'File: gamma_img1.png',
              'Size: 1.2MB',
              'Status: Complete',
              '',
              'STEGANOGRAPHY ANALYSIS:',
              'Hidden string detected: "f1r3"',
              'This appears to be part of a larger key.',
              'Download other images to find the complete key.'
            ].join('\n');
          } else if (imgNum === '2') {
            return [
              'Downloading image file...',
              'File: gamma_img2.png', 
              'Size: 1.1MB',
              'Status: Complete',
              '',
              'STEGANOGRAPHY ANALYSIS:',
              'Hidden string detected: "w@ll"',
              'This appears to be part of a larger key.',
              'XOR this with other found strings to get the decryption key.'
            ].join('\n');
          } else if (imgNum === '3' || imgNum === '4') {
            return [
              'Downloading image file...',
              `File: gamma_img${imgNum}.png`,
              'Size: 1.0MB',
              'Status: Complete',
              '',
              'STEGANOGRAPHY ANALYSIS:',
              'No hidden data detected in this image.',
              'This appears to be a decoy file.'
            ].join('\n');
          }
        } else if (levelId === 'theta' && filename === 'theta_steganography.png') {
          return [
            'Downloading image file...',
            'File: theta_steganography.png',
            'Size: 2.1MB',
            'Status: Complete',
            '',
            'LSB STEGANOGRAPHY ANALYSIS:',
            'Binary data detected in least significant bits.',
            'Extracted string: "mirr0r"',
            'Use this key to decrypt the theta level data.'
          ].join('\n');
        }
        
        return `File ${filename} not found or not available for download.`;
      },
      'xor': (args) => {
        if (args.length < 2) return 'Usage: xor <string1> <string2>';
        const result = xorStrings(args[0], args[1]);
        return `XOR result: ${result}`;
      },
      'vigenere-decrypt': (args) => {
        if (args.length < 2) return 'Usage: vigenere-decrypt <text> <key>';
        const text = args[0];
        const key = args[1];
        const decrypted = vigenereDecrypt(text, key);
        return `Vigenère decryption:\n${decrypted}`;
      },
      'hash-crack': async (args) => {
        if (args.length === 0) return 'Usage: hash-crack <hash>';
        const hash = args[0];
        
        // Common passwords to try
        const commonPasswords = ['hello', 'password', 'admin', '123456', 'welcome', 'shadow', 'network'];
        
        for (const password of commonPasswords) {
          if (await verifyMD5Hash(password, hash)) {
            return `Hash cracked! Password: ${password}`;
          }
        }
        
        return 'Hash crack failed. Try a different approach or check if the hash is correct.';
      },
      'md5': async (args) => {
        if (args.length === 0) return 'Usage: md5 <text>';
        const text = args.join(' ');
        const hash = await createMD5Hash(text);
        return `MD5 hash of "${text}": ${hash}`;
      },
      'jwt-forge': (args) => {
        if (args.length < 2) return 'Usage: jwt-forge <payload_json> <secret>';
        try {
          const payload = JSON.parse(args[0]);
          const secret = args[1];
          const token = createJWT(payload, secret);
          return `Forged JWT token:\n${token}`;
        } catch (error) {
          return 'Error: Invalid JSON payload format';
        }
      },
      'jwt-verify': (args) => {
        if (args.length < 2) return 'Usage: jwt-verify <token> <secret>';
        const token = args[0];
        const secret = args[1];
        const isValid = verifyJWT(token, secret);
        return `JWT verification: ${isValid ? 'VALID' : 'INVALID'}`;
      },
      'factor': (args) => {
        if (args.length === 0) return 'Usage: factor <number>';
        const n = parseInt(args[0]);
        if (isNaN(n)) return 'Error: Input must be a number';
        
        const factors = factorize(n);
        if (factors) {
          return `Factors of ${n}: ${factors[0]} × ${factors[1]}`;
        } else {
          return `${n} is prime or cannot be factored easily`;
        }
      },
      'rsa-decrypt': (args) => {
        if (args.length < 3) return 'Usage: rsa-decrypt <ciphertext_array> <n> <d>';
        try {
          const ciphertext = JSON.parse(args[0]);
          const n = parseInt(args[1]);
          const d = parseInt(args[2]);
          
          if (!Array.isArray(ciphertext)) {
            return 'Error: Ciphertext must be an array of numbers';
          }
          
          const decrypted = rsaDecrypt(ciphertext, n, d);
          return `RSA decryption result: ${decrypted}`;
        } catch (error) {
          return 'Error: Invalid input format';
        }
      },
      'mod-inverse': (args) => {
        if (args.length < 2) return 'Usage: mod-inverse <a> <m>';
        const a = parseInt(args[0]);
        const m = parseInt(args[1]);
        if (isNaN(a) || isNaN(m)) return 'Error: Both inputs must be numbers';
        
        const inverse = modInverse(a, m);
        if (inverse === -1) {
          return `No modular inverse exists for ${a} mod ${m}`;
        } else {
          return `Modular inverse of ${a} mod ${m}: ${inverse}`;
        }
      },
      'key-fragment': () => {
        if (levelId === 'omega') {
          const currentKarma = user?.karma || 0;
          const fragment = generateKeyFragments(currentKarma);
          return [
            'OMEGA LEVEL KEY FRAGMENT:',
            '',
            `Your karma: ${currentKarma}`,
            `Team: ${fragment.team}`,
            `Fragment: ${fragment.fragment}`,
            '',
            'You need 2 other agents with similar karma to complete the key.',
            'All 3 fragments must be XORed together to get the master key.'
          ].join('\n');
        } else {
          return 'Key fragments are only available in the Omega level.';
        }
      }
    };
    
    setTerminalCommands(levelCommands);
  }, [levelId, levelDifficulty, levelInfo.serverName, user, cryptoSolved, flagCaptured, pendingKarmaDecision, karmaChoiceMade]);

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
          choices: [...(user.choices || []), choiceId]
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
        setUser(prev => prev ? {
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

  const handleCaptureFlag = async () => {
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
        setUser((prev: UserData | null) => {
          if (!prev) return null;
          return {
            ...prev,
            score: data.score,
            flagsCaptured: data.flagsCaptured
          };
        });
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
        setUser((prev: UserData | null) => {
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
        setUser((prev: UserData | null) => {
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

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (user?.id === 'debug-user' || user?.id === 'emergency-debug-user') {
        // For debug users, just clear localStorage
        localStorage.removeItem('debugUser');
        localStorage.removeItem('userKarma');
        localStorage.removeItem('authToken');
        
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
      // Ensure crypto challenge is solved before allowing flag capture
      if (cryptoSolved) {
        // Flag capture
        handleCaptureFlag();
      } else {
        console.log("Attempted flag capture before solving crypto challenge");
        setError("You must solve the encryption challenge before capturing the flag.");
        setTimeout(() => setError(null), 3000);
      }
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
                  const emergencyUser = {
                    id: 'emergency-debug-user',
                    username: 'debug_player',
                    karma: 0,
                    choices: [],
                    flagsCaptured: [],
                    score: 0
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
    <div className="min-h-screen bg-black text-red-500 relative overflow-hidden">
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
            <Terminal 
              initialText={
                `ShadowNet System Terminal - ${translate("Level")}: ${levelId.toUpperCase()}\n` +
                `${translate("User")}: ${user?.username || 'anonymous'}\n` +
                `${translate("Karma")}: ${user?.karma || 0}\n` +
                `${translate("Score")}: ${user?.score || 0}\n\n` +
                `${translate("Location")}: ${levelInfo.serverName}\n` +
                `${translate(levelInfo.terminalWelcome)}\n\n` +
                `${translate("MISSION OBJECTIVE")}:\n` +
                `${levelId === 'alpha' ? translate('Infiltrate the perimeter security and extract the access codes.') : ''}` +
                `${levelId === 'beta' ? translate('Navigate the internal network and locate the backdoor.') : ''}` +
                `${levelId === 'gamma' ? translate('Access the protected database and retrieve sensitive data.') : ''}` +
                `${levelId === 'delta' ? translate('Override the core system functions and gain control.') : ''}` +
                `${levelId === 'sigma' ? translate('Liberate District 14 from AI control using the override pass.') : ''}` +
                `${levelId === 'theta' ? translate('Confront your digital clone and resolve the identity crisis.') : ''}` +
                `${levelId === 'zeta' ? translate('Fix the corrupted key before the young hackers are exposed.') : ''}` +
                `${levelId === 'sigma-2' ? translate('Decode the cultist\'s confession and decide their fate.') : ''}` +
                `${levelId === 'omega' ? translate('Face the AI consciousness and determine humanity\'s future.') : ''}\n\n` +
                `${translate("MISSION COMMANDS")}:\n` +
                `- ${translate("Use 'mission' to view mission briefing and make karma decisions")}\n` +
                `- ${translate("Use 'ls' to list files in the current directory")}\n` +
                `- ${translate("Use 'cat <filename>' to read file contents")}\n` +
                `- ${translate("Use 'decrypt <file> <key>' to decrypt encrypted files")}\n` +
                `- ${translate("Use 'traces' to see traces left by other agents")}\n` +
                `- ${translate("Use 'leave-trace' after decryption to help other agents")}\n` +
                `- ${translate("Use 'capture' to capture the flag after solving challenges")}\n` +
                `- ${translate("Use 'next' to proceed to the next level after completing objectives")}\n\n` +
                `${translate("Type 'help' for all available commands.")}`
              }
              prompt={`${levelInfo.serverName}:~$ `}
              commands={terminalCommands}
              onCommandExecuted={handleTerminalCommand}
              encryptedContent={cryptoContent}
              decryptionKey={levelKeys[levelId as keyof typeof levelKeys] || ''}
              challengeSolved={cryptoSolved}
            />
            
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