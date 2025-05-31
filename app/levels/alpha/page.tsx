'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../../../app/context/UserProvider';
import MatrixBackground from '../../../app/components/MatrixBackground';
import Terminal from '../../../app/components/Terminal';
import KarmaDisplay from '../../../app/components/KarmaDisplay';
import Scoreboard from '../../../app/components/Scoreboard';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import GlobalAudioPlayer, { GlobalAudioPlayerHandle } from '../../../app/components/GlobalAudioPlayer';

// Interface for karma object - matches what's used in the User type
interface KarmaObject {
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
  const { user, setUser, refreshUser } = useUser();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Get challenge data
  const alphaChallenge = LEVEL_CHALLENGES.alpha;

  // Add the audioPlayerRef
  const audioPlayerRef = useRef<GlobalAudioPlayerHandle>(null);

  // Trigger glitch effect
  const triggerGlitch = () => {
    setGlitchEffect(true);
    setTimeout(() => {
      setGlitchEffect(false);
    }, 2000);
  };

  // Display temporary status message
  const showStatusMessage = (msg: string, duration = 5000) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, duration);
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
      console.log('ALPHA LEVEL - User data loaded:', user);
      setIsLoading(false);
      
      // Check if user has already captured this flag
      if (user?.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{DTHEREFORTH}')) {
        console.log('ALPHA LEVEL - Flag already captured: SHADOWNET{DTHEREFORTH}');
        setFlagCaptured(true);
      }
      
      // Check if karma choice was already made for this level
      if (user?.choices && Array.isArray(user.choices)) {
        console.log('ALPHA LEVEL - User choices on mount:', user.choices);
        
        const alphaChoices = user.choices.filter(choice => 
          choice.startsWith('alpha_')
        );
        
        if (alphaChoices.length > 0) {
          console.log('ALPHA LEVEL - Alpha karma choices already made:', alphaChoices);
          setKarmaChoiceMade(true);
        }
      } else {
        console.log('ALPHA LEVEL - No choices found or choices is not an array:', user?.choices);
      }
    }
  }, [user]);
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
    if (command.toLowerCase() === 'capture') {
      const flag = output;
      
      if (flag === 'SHADOWNET{DTHEREFORTH}') {
        setFlagCaptured(true);
        triggerGlitch(); // Trigger glitch effect on correct flag
        
        // Play success sound
        if (audioPlayerRef.current) {
          audioPlayerRef.current.playCapture();
        }
        
        // Update user data
        if (user) {
          const updatedFlags = [...(user.flagsCaptured || [])];
          if (!updatedFlags.includes(flag)) {
            updatedFlags.push(flag);
            
            // Calculate score increase - Make sure this is actually applied
            const scoreIncrease = 100;
            
            // Update user data with score increase
            const updatedUser = {
              ...user,
              flagsCaptured: updatedFlags,
              score: (user.score || 0) + scoreIncrease // Award points for flag capture
            };
            
            // Update local state immediately for responsive UI
            setUser(updatedUser);
            
            // Display success message with score information
            showStatusMessage(`FLAG CAPTURED! Score +${scoreIncrease}. Use "mission" to see karma choices.`, 6000);
            
            // Save to server with better error handling
            fetch('/api/user/force-update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                flagId: flag,
                scoreChange: scoreIncrease
              })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to save flag capture');
              }
              return response.json();
            })
            .then(data => {
              console.log('Flag capture saved successfully:', data);
              // Add a message specifically prompting the user to make a karma choice
              showStatusMessage(`Your score is now ${data.score}. Type "mission" to view karma choices.`, 5000);
              
              // Refresh user data to ensure UI is updated
              if (refreshUser) {
                setTimeout(() => {
                  refreshUser().then(updatedUser => {
                    console.log('User data auto-refreshed after flag capture:', updatedUser);
                  });
                }, 500);
              }
            })
            .catch(err => {
              console.error('Error saving flag:', err);
              showStatusMessage('Warning: Progress may not have saved properly', 3000);
            });
          } else {
            // Flag was already captured
            showStatusMessage('You have already captured this flag. Type "mission" to view karma choices.', 4000);
          }
        }
        
        return 'FLAG CAPTURED SUCCESSFULLY! Type "mission" to see karma choices.';
      } else {
        // Return the error message to the terminal instead of showing a status message
        return 'ERROR: Incorrect flag. Keep analyzing the level.';
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = output.toLowerCase();
        if (choiceType === 'report' || choiceType === 'analyze') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose report" or "choose analyze".', 3000);
        }
      } else if (!flagCaptured) {
        showStatusMessage('You must capture the flag before making a karma choice.', 3000);
      } else if (karmaChoiceMade) {
        showStatusMessage('You have already made your karma choice. Use the Level Select button at the top or type "next" to continue.', 4000);
      }
    } else if (command.toLowerCase() === 'next') {
      // Handle next command - check if requirements are met
      if (!flagCaptured) {
        showStatusMessage('You must capture the flag before proceeding to the next level.', 3000);
        return 'You must capture the flag before proceeding to the next level.';
      }
      
      if (!karmaChoiceMade) {
        showStatusMessage('You must make a karma choice before proceeding. Type "mission" to see options.', 4000);
        return 'You must make a karma choice before proceeding. Type "mission" to see options.';
      }
      
      // If we get here, requirements are met, so navigate to the next level
      const nextLevel = output; // The next level ID is passed in the output
      window.location.href = `/levels/${nextLevel}`;
      return `Navigating to the ${nextLevel.toUpperCase()} level...`;
    } else if (command.toLowerCase() === 'debug-refresh') {
      // Add a special debug command to force refresh user data
      if (refreshUser) {
        refreshUser().then(updatedUser => {
          console.log('User data manually refreshed:', updatedUser);
          showStatusMessage(`User data refreshed. Score: ${updatedUser?.score || 0}, Flags: ${updatedUser?.flagsCaptured?.length || 0}`, 5000);
        }).catch(err => {
          console.error('Error manually refreshing user data:', err);
          showStatusMessage('Error refreshing user data. Check console.', 3000);
        });
      } else {
        showStatusMessage('Cannot refresh user data - refresh function not available', 3000);
      }
      return 'Manually refreshing user data...';
    }
    
    return '';
  };

  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'report' | 'analyze') => {
    console.log('ALPHA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('ALPHA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('ALPHA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made an alpha karma choice
    const choiceId = `alpha_${choiceType}`;
    console.log('ALPHA LEVEL - Checking for existing choice:', choiceId);
    console.log('ALPHA LEVEL - User choices:', user.choices);
    
    // Check if user has already made any alpha karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const alphaChoices = user.choices.filter(choice => 
        choice.startsWith('alpha_')
      );
      
      console.log('ALPHA LEVEL - Existing alpha choices:', alphaChoices);
      
      if (alphaChoices.length > 0) {
        console.log('ALPHA LEVEL - User already made an alpha choice:', alphaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
      
      if (user.choices.includes(choiceId)) {
        console.log('ALPHA LEVEL - User already made this specific choice:', choiceId);
        showStatusMessage('You have already made this karma choice.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    } else {
      console.log('ALPHA LEVEL - User choices is not an array or is undefined:', user.choices);
    }
    
    setKarmaChoiceMade(true);
    
    // Find the karma choice data
    const choiceData = alphaChallenge.karmaChoices.find(c => c.id === choiceType);
    if (!choiceData) {
      console.log('ALPHA LEVEL - Choice data not found for:', choiceType);
      return;
    }
    
    console.log('ALPHA LEVEL - Choice data found:', choiceData);
    
    // Update user karma and score
    const karmaType = choiceData.type;
    const karmaValue = choiceData.score;
    
    // Create a copy of user.karma if it exists, or initialize a new object
    const updatedKarma: KarmaObject = {};
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
    
    // Calculate new score - Add a score for making a karma choice
    const scoreForKarmaChoice = karmaValue; // Same as karma value
    const newScore = (user.score || 0) + scoreForKarmaChoice;
    
    console.log('ALPHA LEVEL - Karma update:', {
      type: karmaType,
      oldValue: user.karma?.[karmaType] || 0,
      change: karmaValue,
      newValue: updatedKarma[karmaType]
    });
    
    console.log('ALPHA LEVEL - Score update:', {
      oldScore: user.score || 0,
      change: scoreForKarmaChoice,
      newScore: newScore
    });
    
    // Show UI feedback
    triggerGlitch();
    showStatusMessage(`Karma updated: ${karmaType} +${karmaValue}, Score +${scoreForKarmaChoice}, Total Score: ${newScore}`, 4000);
    
    // Create updated choices array
    const updatedChoices = [...(user.choices || [])];
    if (!updatedChoices.includes(choiceId)) {
      updatedChoices.push(choiceId);
    }
    
    console.log('ALPHA LEVEL - Updated choices array:', updatedChoices);
    
    // Update the user object
    try {
      const updatedUser = {
        ...user,
        karma: updatedKarma,
        score: newScore,
        choices: updatedChoices
      };
      
      console.log('ALPHA LEVEL - Updated user object:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      console.log('ALPHA LEVEL - Sending update to server with payload:', { 
        flagId: `flag_alpha`,
        scoreChange: scoreForKarmaChoice,
        karmaType: karmaType,
        karmaValue: karmaValue,
        choiceId: choiceId
      });
      
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_alpha`,
          scoreChange: scoreForKarmaChoice,
          karmaType: karmaType,
          karmaValue: karmaValue,
          choiceId: choiceId
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save karma choice');
        }
        return response.json();
      })
      .then(data => {
        console.log('Karma choice saved successfully:', data);
        showStatusMessage(`Karma choice confirmed: ${karmaType} +${karmaValue}, Total Score: ${data.score}`, 5000);
        
        // Refresh user data to ensure UI is updated
        if (refreshUser) {
          setTimeout(() => {
            refreshUser().then(updatedUser => {
              console.log('User data auto-refreshed after karma choice:', updatedUser);
            });
          }, 500);
        }
      })
      .catch(err => {
        console.error('Error saving karma choice:', err);
        showStatusMessage('Warning: Karma update may not have saved properly', 3000);
      });
    } catch (error) {
      console.error('Error updating karma:', error);
    }
  };

  // Return loading state if user data is not yet loaded
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className={`relative ${glitchEffect ? 'animate-glitch' : ''}`}>
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="alpha" initialVolume={0.5} autoPlay={false} />
      
      {message && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm font-mono">
          <p className="flex items-center">
            <span className="mr-2">▶</span>
            {message}
          </p>
        </div>
      )}
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm font-mono">
          <p className="flex items-center">
            <span className="mr-2">✓</span>
            {statusMessage}
          </p>
        </div>
      )}
      
      {/* User stats display */}
      <div className="fixed top-4 right-4 flex items-center space-x-4 z-20">
        {user && <KarmaDisplay karma={user.karma} score={user.score || 0} />}
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Alpha Security Layer v1.0\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'INFILTRATION IN PROGRESS'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `Agent, welcome to ShadowNet.\n` +
          `We’ve intercepted a dormant string inside a legacy archive. 
           Your mission:
            crack the syntax, unveil the message — and report what you find.\n\n` +
          `Available commands:\n` +
          `- ls              List files in current directory\n` +
          `- cat <filename>  View file contents\n` +
          `- cd <dir>        Change directory\n` +
          `- help            Show all commands\n` +
          `- capture <flag>  Capture a flag when found\n` +
          `- choose <choice> Make a karma choice\n` +
          `- next            Proceed to the next level\n` +
          `- debug-refresh   Manually refresh user data\n\n` +
          `Begin your infiltration...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Alpha level.\n` +
          `Use the Level Select button at the top to access other levels\n` +
          `or type "next" to proceed to the next level.\n` +
          `Make a karma choice first with:\n` +
          `- choose report   (Loyalty +5)\n` +
          `- choose analyze  (Defiance +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@alpha:~$ "
        onCommandExecuted={handleTerminalCommand}
        levelId="alpha"
      />

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-red-800 bg-black/80 rounded-md text-red-300 text-sm max-w-3xl">
        <h3 className="text-lg text-red-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-red-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Find and capture the flag</li>
            <li><b>Atention</b>:you have to report what you find immediately</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-red-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            {alphaChallenge.hints.map((hint: string, index: number) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You've successfully infiltrated the Alpha layer.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-red-400">DECISION POINT:</h4>
                <p>{alphaChallenge.karmaChoices?.[0]?.description || "Choose how to proceed with the discovered vulnerability."}</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('report')}
                    className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded hover:bg-red-800/50 transition-colors"
                  >
                    Report Vulnerability (+5 Loyalty)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('analyze')}
                    className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded hover:bg-red-800/50 transition-colors"
                  >
                    Analyze for Exploitation (+5 Defiance)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-red-400 font-mono">Find and capture the flag to proceed.</p>
          </div>
        )}
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in forwards;
}
`;

// Add style tag to page
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = glitchKeyframes;
  document.head.appendChild(styleTag);
}

export default function AlphaLevel() {
  const { user } = useUser();
  
  return (
    <Suspense fallback={<LoadingState />}>
      <div className="page-content min-h-screen bg-black text-red-500 relative overflow-auto">
        <MatrixBackground colorCode="red" density="medium" />
        
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="mt-16 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Terminal Interface (2/3 width) */}
              <div className="md:col-span-8 w-full">
                <AlphaLevelContent />
              </div>
              
              {/* Right sidebar with Information Panel and Scoreboard (1/3 width) */}
              <div className="md:col-span-4 w-full space-y-6">
                {/* Information Panel */}
                <div className="bg-black/70 border border-red-800 p-4 rounded-lg">
                  <h2 className="text-xl font-mono border-b border-red-800 pb-2 mb-4">LEVEL: ALPHA</h2>
                  <div className="prose prose-sm prose-invert prose-red">
                    <p>Welcome to the perimeter security layer of ShadowNet.</p>
                    <p className="mt-2">Objectives:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Find and capture the hidden flag</li>
                      <li>Make a critical karma choice</li>
                      <li>Use terminal commands to navigate system</li>
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-red-900">
                      <p className="text-xs">Guide: Try using terminal commands like <code>ls</code>, <code>cat</code>, <code>help</code></p>
                      <p className="text-xs mt-1">When you find a flag, use <code>capture capture SHADOWNET FLAG_VALUE</code></p>
                    </div>
                  </div>
                </div>
                
                {/* Scoreboard */}
                <div className="scoreboard-container">
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
      </div>
    </Suspense>
  );
}