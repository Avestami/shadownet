'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../../context/UserProvider';
import MatrixBackground from '../../components/MatrixBackground';
import Terminal from '../../components/Terminal';
import Scoreboard from '../../components/Scoreboard';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import AudioPlayer, { AudioPlayerHandle } from '../../components/AudioPlayer';

// Interface for karma object
interface KarmaObject {
  [key: string]: number;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-black text-blue-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-xl mb-2">Loading Level Data</div>
        <div className="flex gap-1 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BetaLevelContent() {
  const { user, setUser } = useUser();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Get challenge data
  const betaChallenge = LEVEL_CHALLENGES.beta;

  // Add the audioPlayerRef
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

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
      setIsLoading(false);
      
      // Check if user has already captured this flag
      if (user?.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{SOUND876}')) {
        setFlagCaptured(true);
      }
    }
  }, [user]);
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
    if (command.toLowerCase() === 'capture') {
      const flag = output;
      
      if (flag === 'SHADOWNET{SOUND876}') {
        setFlagCaptured(true);
        triggerGlitch(); // Trigger glitch effect on correct flag
        showStatusMessage('Flag captured! Your score has increased by 100 points. Choose your next action or type "next-level" to proceed.');
        
        // Play success sound
        if (audioPlayerRef.current) {
          audioPlayerRef.current.playCapture();
        }
        
        // Update user data
        if (user) {
          const updatedFlags = [...(user.flagsCaptured || [])];
          if (!updatedFlags.includes(flag)) {
            updatedFlags.push(flag);
            
            // Update user data with score increase
            const updatedUser = {
              ...user,
              flagsCaptured: updatedFlags,
              score: (user.score || 0) + 100 // Award points for flag capture
            };
            
            setUser(updatedUser as any);
            
            // Save to server with better error handling
            fetch('/api/capture-flag', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                flagId: flag,
                baseScore: 100
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
              // Update UI with score increase message
              if (data.scoreAdded) {
                showStatusMessage(`Flag captured successfully! Score +${data.scoreAdded} points.`, 5000);
              }
            })
            .catch(err => {
              console.error('Error saving flag:', err);
              showStatusMessage('Warning: Progress may not have saved properly', 3000);
            });
          }
        }
      } else {
        showStatusMessage('Incorrect flag. Try analyzing the audio more carefully.', 3000);
      }
    } else if (command.toLowerCase() === 'next-level') {
      if (flagCaptured) {
        proceedToNextLevel();
      } else {
        showStatusMessage('You must capture the flag before proceeding to the next level.', 3000);
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = output.toLowerCase();
        if (choiceType === 'purge' || choiceType === 'investigate') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose purge" or "choose investigate".', 3000);
        }
      } else if (!flagCaptured) {
        showStatusMessage('You must capture the flag before making a karma choice.', 3000);
      } else if (karmaChoiceMade) {
        showStatusMessage('You have already made your karma choice.', 3000);
      }
    }
  };

  // Function to handle proceeding to next level
  const proceedToNextLevel = () => {
    if (!user) return;
    
    showStatusMessage('Preparing to proceed to next level...', 3000);
    
    // Call the API to progress to next level
    fetch('/api/next-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentLevel: 'beta'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to progress to next level');
      }
      return response.json();
    })
    .then(data => {
      console.log('Level progression successful:', data);
      // Redirect to next level
      window.location.href = `/levels/${data.nextLevel}`;
    })
    .catch(err => {
      console.error('Error progressing to next level:', err);
      showStatusMessage('Error: Could not proceed to next level. Please try again.', 5000);
    });
  };

  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'purge' | 'investigate') => {
    setKarmaChoiceMade(true);
    
    if (!user) return;
    
    // Find the karma choice data
    const choiceData = betaChallenge.karmaChoices.find(c => c.id === choiceType);
    if (!choiceData) return;
    
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
    
    // Calculate new score
    const newScore = (user.score || 0) + karmaValue;
    
    // Show UI feedback
    triggerGlitch();
    showStatusMessage(`Karma updated: ${karmaType} +${karmaValue}, Score: ${newScore}`, 4000);
    
    // Update the user object
    try {
      // Use type assertion to fix type mismatch between KarmaObject and number
      const updatedUser = {
        ...user,
        karma: updatedKarma,
        score: newScore
      };
      
      setUser(updatedUser as any); // Type assertion for karma object
      
      // Better server update with error handling
      fetch('/api/user/karma-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          levelId: 'beta',
          choiceId: choiceType,
          karmaType: karmaType,
          karmaValue: karmaValue,
          score: karmaValue
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
        showStatusMessage(`Karma choice confirmed: ${karmaType} +${karmaValue}, Total Score: ${newScore}`, 5000);
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
      {/* Audio player with volume control */}
      <AudioPlayer ref={audioPlayerRef} levelId="beta" initialVolume={0.5} />
      
      {message && (
        <div className="mb-4 p-3 bg-blue-900/50 border border-blue-800 rounded text-blue-200 text-sm font-mono">
          <p className="flex items-center">
            <span className="mr-2">▶</span>
            {message}
          </p>
        </div>
      )}
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-blue-300 text-sm font-mono">
          <p className="flex items-center">
            <span className="mr-2">✓</span>
            {statusMessage}
          </p>
        </div>
      )}
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Beta Security Layer v1.1\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'AUDIO ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `We've intercepted encrypted audio communications from ShadowNet.\n` +
          `Your task: analyze the audio file to extract the hidden data.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- capture <flag>  Capture the flag when found\n` +
          `- next-level      Proceed to the next level\n` +
          `- choose <choice> Make a karma choice\n\n` +
          `Begin your audio analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Beta level.\n` +
          `Type "next-level" to proceed to Gamma level.\n` +
          `or make a karma choice with:\n` +
          `- choose purge       (Loyalty +5)\n` +
          `- choose investigate (Curiosity +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@beta:~$ "
        onCommandExecuted={handleTerminalCommand}
        levelId="beta"
      />

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-blue-800 bg-black/80 rounded-md text-blue-300 text-sm max-w-3xl">
        <h3 className="text-lg text-blue-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-blue-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Find and capture the flag hidden in the audio data</li>
            <li>{betaChallenge.description}</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-blue-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            {betaChallenge.hints.map((hint: string, index: number) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You've successfully analyzed the audio data and extracted the flag.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-blue-400">DECISION POINT:</h4>
                <p>{betaChallenge.karmaChoices[0].description}</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('purge')}
                    className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-2 rounded hover:bg-blue-800/50 transition-colors"
                  >
                    Purge the Data (+5 Loyalty)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('investigate')}
                    className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-2 rounded hover:bg-blue-800/50 transition-colors"
                  >
                    Investigate Further (+5 Curiosity)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-blue-400 font-mono">Find and capture the flag to proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BetaLevel() {
  const { user } = useUser();
  
  return (
    <Suspense fallback={<LoadingState />}>
      <div className="page-content min-h-screen bg-black text-blue-500 relative overflow-auto">
        <MatrixBackground colorCode="blue" density="medium" />
        
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="mt-16 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Terminal Interface (2/3 width) */}
              <div className="md:col-span-8 w-full">
                <BetaLevelContent />
              </div>
              
              {/* Right sidebar with Information Panel and Scoreboard (1/3 width) */}
              <div className="md:col-span-4 w-full space-y-6">
                {/* Information Panel */}
                <div className="bg-black/70 border border-blue-800 p-4 rounded-lg">
                  <h2 className="text-xl font-mono border-b border-blue-800 pb-2 mb-4">LEVEL: BETA</h2>
                  <div className="prose prose-sm prose-invert prose-blue">
                    <p>Welcome to the Signal Dissonance challenge.</p>
                    <p className="mt-2">Objectives:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Analyze the audio file for hidden data</li>
                      <li>Extract information from both audio channels</li>
                      <li>Find the flag encoded in the frequencies</li>
                      <li>Make a karma choice after capturing the flag</li>
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-blue-900">
                      <p className="text-xs">Dr. Tenebris Draconis has embedded a message in this signal.</p>
                      <p className="text-xs mt-1">Use audio analysis tools to decode it.</p>
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