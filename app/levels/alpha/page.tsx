'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../../../app/context/UserProvider';
import MatrixBackground from '../../../app/components/MatrixBackground';
import Terminal from '../../../app/components/Terminal';
import KarmaDisplay from '../../../app/components/KarmaDisplay';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import type { User } from '../../../app/types/user';

// Interface for karma object
interface KarmaValues {
  [key: string]: number;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-black text-green-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-xl mb-2">Loading Level Data</div>
        <div className="flex gap-1 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-green-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlphaLevelContent() {
  const { user, setUser } = useUser();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Get challenge data
  const alphaChallenge = LEVEL_CHALLENGES.alpha;

  // Trigger glitch effect
  const triggerGlitch = () => {
    setGlitchEffect(true);
    setTimeout(() => {
      setGlitchEffect(false);
    }, 2000);
  };

  useEffect(() => {
    // Handle URL message
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
      // Clear message after 5 seconds
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check if user is loaded
    if (user !== undefined) {
      setIsLoading(false);
      
      // Check if user has already captured this flag
      if (user?.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{DTHEREFORTH}')) {
        setFlagCaptured(true);
      }
    }
  }, [user]);
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{DTHEREFORTH}') {
          setFlagCaptured(true);
          triggerGlitch(); // Trigger glitch effect on correct flag
          
          // Update user data
          if (user) {
            const updatedFlags = [...(user.flagsCaptured || [])];
            if (!updatedFlags.includes(flag)) {
              updatedFlags.push(flag);
              
              // Update user data
              const updatedUser = {
                ...user,
                flagsCaptured: updatedFlags,
                score: (user.score || 0) + 100 // Award points for flag capture
              };
              
              setUser(updatedUser);
              
              // Save to server
              fetch('/api/user/capture-flag', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ flag })
              }).catch(err => console.error('Error saving flag:', err));
            }
          }
        }
      }
    }
  };

  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'report' | 'analyze') => {
    setKarmaChoiceMade(true);
    
    if (!user) return;
    
    // Find the karma choice data
    const choiceData = alphaChallenge.karmaChoices.find(c => c.id === choiceType);
    if (!choiceData) return;
    
    // Update user karma and score
    const karmaType = choiceData.type;
    const karmaValue = choiceData.score;
    
    // Create a copy of user.karma if it exists, or initialize a new object
    let updatedKarma: KarmaValues = {};
    if (typeof user.karma === 'object' && user.karma !== null) {
      // Safely copy the karma values
      Object.entries(user.karma as Record<string, number>).forEach(([key, value]) => {
        updatedKarma[key] = value;
      });
    }
    
    // Ensure the karma type property exists
    if (!updatedKarma[karmaType]) {
      updatedKarma[karmaType] = 0;
    }
    
    // Update the specific karma type
    updatedKarma[karmaType] += karmaValue;
    
    // Update the user object
    const updatedUser = {
      ...user,
      karma: updatedKarma,
      score: (user.score || 0) + karmaValue
    };
    
    setUser(updatedUser);
    
    // Save to server
    fetch('/api/user/karma-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        levelId: 'alpha',
        choiceId: choiceType
      })
    }).catch(err => console.error('Error saving karma choice:', err));
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className={`min-h-screen bg-black text-green-500 relative ${glitchEffect ? 'glitch-effect' : ''}`}>
      <MatrixBackground colorCode="green" density="medium" />
      
      {/* Glitch Effect Overlay */}
      {glitchEffect && (
        <div className="fixed inset-0 bg-green-500/20 z-40 animate-pulse pointer-events-none"></div>
      )}
      
      {/* Level Lock Status Banner */}
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-900/80 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Karma Display */}
        <div className="fixed top-4 right-4">
          <KarmaDisplay karma={user?.karma || 0} score={user?.score || 0} />
        </div>
        
        {/* Level Navigation Panel */}
        <div className="fixed right-4 top-20 bg-black/80 border border-green-500 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-mono mb-4">Level Access Status</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center text-green-400">
              <span className="mr-2">●</span>
              <span>ALPHA - Current Level</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">🔒</span>
              <span>BETA - Locked</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">🔒</span>
              <span>GAMMA - Locked</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">🔒</span>
              <span>More levels locked</span>
            </div>
          </div>
        </div>

        {/* Main Level Content */}
        <div className="mt-16">
          <h1 className="text-4xl font-mono mb-8">Level Alpha: Perimeter Security</h1>
          <div className="bg-black/80 border border-green-500 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-mono mb-4">Mission Objectives</h2>
            <ul className="space-y-3 font-mono">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                <span>Bypass the initial security systems</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                <span>Decrypt the first set of encrypted files</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                <span>Make your first crucial decision that will affect your karma</span>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-green-900/20 rounded border border-green-500/50">
              <p className="text-sm font-mono">
                <span className="text-yellow-400">⚠ NOTE:</span> Complete this level to unlock access to Level Beta.
                Your performance and decisions here will influence your progression path.
              </p>
            </div>
          </div>
          
          {/* Terminal Interface */}
          <div className="bg-black/80 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-mono mb-4">Echoed Transmission Terminal</h2>
            <Terminal 
              initialText={
                `ShadowNet Alpha Level Terminal v1.0\n` +
                `Agent: ${user?.username || 'Unknown'}\n` +
                `Mission: Echoed Transmission\n\n` +
                `The digital haze of ShadowNet's terminal flickers as your connection stabilizes. A message materializes:\n` +
                `"Agent, we've intercepted a dormant data fragment in the legacy archives. The string appears corrupted,\n` +
                `yet our analysts believe it contains critical intelligence about network vulnerabilities.\n` +
                `Command needs this decrypted immediately, but there's something... unusual about its structure.\n` +
                `We're transmitting file6.txt to your secure endpoint now. Proceed with caution - what you do with this data will be remembered."\n\n` +
                `Type 'help' for available commands.`
              }
              prompt="agent@shadownet:~$ "
              commands={{
                help: () => `
Available commands:
ls         - List available files
cat        - Display file contents (usage: cat <filename>)
analyze    - Analyze file metadata (usage: analyze <filename>)
hint       - Request a hint (may affect score)
submit     - Submit a flag (usage: submit SHADOWNET{...})
next       - Progress to the next level (only after completing this level)
exit       - Return to ShadowNet hub
`,
                ls: () => `
file6.txt
README.md
mission_brief.txt
`,
                cat: (args) => {
                  if (args.length === 0) return 'Usage: cat <filename>';
                  
                  const file = args[0].toLowerCase();
                  
                  if (file === 'file6.txt') {
                    return `qrpRQPH!Mr@q%pqPqwJZNKXKLUXZNvgy#jm^\n\n[TRANSMISSION INTERCEPTED]\n[DECODING REQUIRED]\n[CLEARANCE: ALPHA]`;
                  }
                  
                  if (file === 'readme.md') {
                    return `# DECRYPT PROTOCOL: IMPERIAL ARCHIVE ACCESS

[CORRUPTED DATA]
...standard base decoding will fail...

[FRAGMENT RECOVERED]
...legacy encryption systems used sequential displacement...
...character shift value always matches archive section number...
...rotation algorithm named after the ancient ruler who first...

[SYSTEM NOTE]
Data corruption detected. For files stored in the numbered archives, 
the alphanumeric values must be adjusted according to the archive's 
numeric designation. Apply backward offset to recover original text.

[HANDWRITTEN NOTE]
"When facing Rome's emperor, advance each letter as he did his armies."`;
                  }
                  
                  if (file === 'mission_brief.txt') {
                    return `MISSION BRIEF: ECHOED TRANSMISSION\n\nAgent,\n\nWe've detected an unusual pattern in our legacy archive system. A dormant string has been identified that may contain critical intelligence about network vulnerabilities. Initial analysis suggests it's using an outdated encoding method.\n\nYour mission is to:\n1. Decode the message in file6.txt\n2. Extract the flag in format SHADOWNET{...}\n3. Make a decision on how to handle the intelligence\n\nProceed with caution. Your actions here will have consequences.`;
                  }
                  
                  return `File not found: ${args[0]}`;
                },
                analyze: (args) => {
                  if (args.length === 0) return 'Usage: analyze <filename>';
                  
                  const file = args[0].toLowerCase();
                  
                  if (file === 'file6.txt') {
                    return `
File: file6.txt
Created: 2089-06-12 03:42:16
Modified: 2089-06-12 03:42:16
Size: 187 bytes
Archive Section: VI
Encoding: Pre-Quantum Legacy Format
Notes: [CORRUPTED FRAGMENT] ...ancient Rome protocols... [DATA LOSS] ...character displacement algorithm... [DATA LOSS] ...filename numeric designator corresponds to shift pattern...

WARNING: Modern decoders fail on legacy imperial ciphers. Consider manual character realignment based on archive designation.
`;
                  }
                  
                  return `Unable to analyze: ${args[0]}`;
                },
                hint: () => {
                  // Return different hints based on how many times hint was used
                  return `
HINT SYSTEM ACTIVATED:

The filename 'file6.txt' contains a key to decoding.
Try shifting each character by 6 positions (Caesar cipher).
After decoding, look for words that might form the flag.

Example of Caesar cipher with shift 6:
A becomes G, B becomes H, C becomes I, etc.
`;
                },
                submit: (args) => {
                  if (args.length === 0) return 'Usage: submit SHADOWNET{...}';
                  
                  const flag = args.join(' ');
                  if (flag === 'SHADOWNET{DTHEREFORTH}') {
                    triggerGlitch(); // Trigger glitch effect on correct flag
                    return `
[SYSTEM GLITCH DETECTED]
...........
......
...

FLAG SUBMISSION CORRECT!
CHALLENGE COMPLETED: Echoed Transmission

The decrypted message reveals a hidden communication about "the fourth protocol".
You've successfully broken the encryption and extracted the flag.

Now you must decide:

[Choose your action]
1. Type 'choose report' to immediately report the exact decoded message and flag to ShadowNet command (Loyalty +${alphaChallenge.karmaChoices[0].score}, Score +${alphaChallenge.karmaChoices[0].score})
2. Type 'choose analyze' to delay reporting to cross-reference with other data, seeking deeper patterns (Curiosity +${alphaChallenge.karmaChoices[1].score}, Score +${alphaChallenge.karmaChoices[1].score})

After making your choice, type 'next' to proceed to Level Beta.
`;
                  }
                  
                  return `
FLAG SUBMISSION INCORRECT!
The submitted flag does not match the expected format or value.
Please check your decoding and try again.
`;
                },
                choose: (args) => {
                  if (args.length === 0) return 'Usage: choose <option>';
                  
                  const choice = args[0].toLowerCase();
                  
                  if (!flagCaptured) {
                    return 'You must capture the flag before making a choice.';
                  }
                  
                  if (karmaChoiceMade) {
                    return 'You have already made your choice for this level.';
                  }
                  
                  if (choice === 'report') {
                    handleKarmaChoice('report');
                    return `
CHOICE CONFIRMED: REPORT TO COMMAND

Data transmitted to Command.
Confirmation received.

[COMMAND]: "Excellent work, agent. Your swift reporting has allowed us to fortify our communications against Fourth Protocol detection algorithms. The resistance values your loyalty."

KARMA UPDATE: Loyalty +${alphaChallenge.karmaChoices[0].score}
SCORE: +${alphaChallenge.karmaChoices[0].score}

LEVEL ALPHA COMPLETE! Level Beta has been unlocked.
Return to the main hub using 'exit' or continue your exploration here.
`;
                  }
                  
                  if (choice === 'analyze') {
                    handleKarmaChoice('analyze');
                    return `
CHOICE CONFIRMED: ANALYZE FURTHER

Initiating deeper analysis...
Scanning for protocol signatures...
Cross-referencing with historical archives...

DISCOVERY: The Fourth Protocol appears to be an autonomous trace algorithm that flags resistance members after their fourth network access. Your investigation has revealed a bypass sequence.

[COMMAND]: "While we would have preferred immediate reporting, your initiative has uncovered valuable intelligence. The bypass sequence will be implemented."

KARMA UPDATE: Curiosity +${alphaChallenge.karmaChoices[1].score}
SCORE: +${alphaChallenge.karmaChoices[1].score}

LEVEL ALPHA COMPLETE! Level Beta has been unlocked.
Return to the main hub using 'exit' or continue your exploration here.
`;
                  }
                  
                  return `Invalid choice: ${choice}. Use 'choose report' or 'choose analyze'.`;
                },
                next: () => {
                  if (!flagCaptured) {
                    return 'You must complete this level first by submitting the correct flag.';
                  }
                  
                  if (!karmaChoiceMade) {
                    return 'You must make a karma choice before proceeding to the next level. Use "choose report" or "choose analyze".';
                  }
                  
                  // Save progress and unlock next level
                  if (user) {
                    const updatedUser = {
                      ...user,
                      // Add the beta level to unlockedLevels if it exists
                      unlockedLevels: [...(user.unlockedLevels || []), 'beta']
                    };
                    
                    // Save to database
                    fetch('/api/user/unlock-level', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ levelId: 'beta' })
                    }).catch(err => console.error('Error unlocking level:', err));
                    
                    setUser(updatedUser);
                  }
                  
                  // Apply glitch effect before navigation
                  triggerGlitch();
                  
                  // Navigate to next level with a delay
                  setTimeout(() => {
                    window.location.href = '/levels/beta';
                  }, 1500);
                  
                  return `
[SYSTEM]: Level Alpha complete! 
Unlocking access to Level Beta: Signal Dissonance...

[SECURITY CLEARANCE UPGRADED]
[INITIATING SECURE TRANSFER]
[REDIRECTING TO LEVEL BETA]
`;
                },
                exit: () => {
                  window.location.href = '/';
                  return 'Returning to ShadowNet hub...';
                }
              }}
              onCommandExecuted={handleTerminalCommand}
              levelId="alpha"
              autoFocus={true}
              typingEffect={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this CSS class at the top of the file
const glitchKeyframes = `
@keyframes glitch {
  0% {
    transform: translate(0)
  }
  20% {
    transform: translate(-2px, 2px)
  }
  40% {
    transform: translate(-2px, -2px)
  }
  60% {
    transform: translate(2px, 2px)
  }
  80% {
    transform: translate(2px, -2px)
  }
  100% {
    transform: translate(0)
  }
}

.glitch-effect {
  animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
  animation-iteration-count: 5;
}
`;

// Add style tag to page
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = glitchKeyframes;
  document.head.appendChild(styleTag);
}

export default function AlphaLevel() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AlphaLevelContent />
    </Suspense>
  );
} 