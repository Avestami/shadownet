'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../../context/UserProvider';
import MatrixBackground from '../../components/MatrixBackground';
import Terminal from '../../components/Terminal';
import Scoreboard from '../../components/Scoreboard';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import GlobalAudioPlayer, { GlobalAudioPlayerHandle } from '../../components/GlobalAudioPlayer';

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
  const { user, setUser, refreshUser } = useUser();
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
      console.log('BETA LEVEL - User data loaded:', user);
      setIsLoading(false);
      
      // Check if user has already captured this flag
      if (user?.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{SOUND876}')) {
        console.log('BETA LEVEL - Flag already captured: SHADOWNET{SOUND876}');
        setFlagCaptured(true);
      }
      
      // Check if karma choice was already made for this level
      if (user?.choices && Array.isArray(user.choices)) {
        console.log('BETA LEVEL - User choices on mount:', user.choices);
        
        const betaChoices = user.choices.filter(choice => 
          choice.startsWith('beta_')
        );
        
        if (betaChoices.length > 0) {
          console.log('BETA LEVEL - Beta karma choices already made:', betaChoices);
          setKarmaChoiceMade(true);
        }
      } else {
        console.log('BETA LEVEL - No choices found or choices is not an array:', user?.choices);
      }
    }
  }, [user]);
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
<<<<<<< HEAD
    if (command.toLowerCase() === 'capture') {
      const flag = output;
      
=======
    const fullCommand = command.toLowerCase();
    
    // Special handling for the capture command
    if (fullCommand.startsWith('capture')) {
      // Use the output parameter which already contains the extracted flag
      // Convert to uppercase for consistent comparison
      const flag = output.toUpperCase();
      
      console.log("Processing flag capture with command:", fullCommand);
      console.log("Extracted flag:", flag);
      
      // Check for the actual flag
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
      if (flag === 'SHADOWNET{SOUND876}') {
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
            setUser(updatedUser as any);
            
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
        return 'ERROR: Incorrect flag. Try analyzing the audio more carefully.';
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
    }
    
    return '';
  };

  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'purge' | 'investigate') => {
    console.log('BETA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('BETA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('BETA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made a beta karma choice
    const choiceId = `beta_${choiceType}`;
    console.log('BETA LEVEL - Checking for existing choice:', choiceId);
    console.log('BETA LEVEL - User choices:', user.choices);
    
    // Check if user has already made any beta karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const betaChoices = user.choices.filter(choice => 
        choice.startsWith('beta_')
      );
      
      console.log('BETA LEVEL - Existing beta choices:', betaChoices);
      
      if (betaChoices.length > 0) {
        console.log('BETA LEVEL - User already made a beta choice:', betaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
      
      if (user.choices.includes(choiceId)) {
        console.log('BETA LEVEL - User already made this specific choice:', choiceId);
        showStatusMessage('You have already made this karma choice.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    } else {
      console.log('BETA LEVEL - User choices is not an array or is undefined:', user.choices);
    }
    
    setKarmaChoiceMade(true);
    
    // Find the karma choice data
    const choiceData = betaChallenge.karmaChoices.find(c => c.id === choiceType);
    if (!choiceData) {
      console.log('BETA LEVEL - Choice data not found for:', choiceType);
      return;
    }
    
    console.log('BETA LEVEL - Choice data found:', choiceData);
    
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
    
    console.log('BETA LEVEL - Karma update:', {
      type: karmaType,
<<<<<<< HEAD
      oldValue: user.karma?.[karmaType] || 0,
=======
      oldValue: typeof user.karma === 'object' && user.karma !== null ? user.karma[karmaType] || 0 : 0,
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
      change: karmaValue,
      newValue: updatedKarma[karmaType]
    });
    
    console.log('BETA LEVEL - Score update:', {
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
    
    console.log('BETA LEVEL - Updated choices array:', updatedChoices);
    
    // Update the user object
    try {
      // Use type assertion to fix type mismatch between KarmaObject and number
      const updatedUser = {
        ...user,
        karma: updatedKarma,
        score: newScore,
        choices: updatedChoices
      };
      
      console.log('BETA LEVEL - Updated user object:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any); // Type assertion for karma object
      
      // Better server update with error handling
      console.log('BETA LEVEL - Sending update to server with payload:', { 
        flagId: `flag_beta`,
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
          flagId: `flag_beta`,
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
      {/* Audio player with volume control */}
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="beta" initialVolume={0.5} autoPlay={false} />
      
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
<<<<<<< HEAD
          `ShadowNet's core communications breached. We've captured an\n` +
          `audio anomaly, laden with a hidden intelligence fragment. \n` +
          `Decrypt this signal, extract the embedded data, and secure the\n` +
          `flag. Time is critical.\n\n` +
=======
          `We've intercepted encrypted audio communications from ShadowNet.\n` +
          `Your task: analyze the audio file to extract the hidden data.\n` +
          `Use the download button below to save the audio evidence file for analysis.\n\n` +
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- capture <flag>  Capture the flag when found\n` +
          `- choose <choice> Make a karma choice\n` +
          `- next            Proceed to the next level\n\n` +
          `Begin your audio analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Beta level.\n` +
          `Use the Level Select button at the top to access other levels\n` +
          `or type "next" to proceed to the next level.\n` +
          `Make a karma choice first with:\n` +
          `- choose purge       (Loyalty +5)\n` +
          `- choose investigate (Curiosity +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@beta:~$ "
        onCommandExecuted={handleTerminalCommand}
        levelId="beta"
      />

      {/* Audio Download Button */}
      <div className="my-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
        <p className="text-blue-300 text-sm mb-2">
          <span className="mr-2">📂</span>
          Download the audio evidence file for offline analysis:
        </p>
        <a 
<<<<<<< HEAD
          href="/challenges/beta/dissonance.wav" 
          download="/challenges/beta/dissonance.wav"
=======
          href="/challenges/beta/audio-evidence.mp3" 
          download="shadownet-beta-evidence.mp3"
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
          className="inline-flex items-center bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Download Audio Evidence
        </a>
      </div>

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-blue-800 bg-black/80 rounded-md text-blue-300 text-sm max-w-3xl">
        <h3 className="text-lg text-blue-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-blue-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
<<<<<<< HEAD
            <li>Find hidden data inside the sound file.</li>
            <li>Find the secret code (flag) hidden in the sound changes.</li>
=======
            <li>Find and capture the flag hidden in the audio data</li>
            <li>{betaChallenge.description}</li>
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
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
<<<<<<< HEAD
                      <li>Uncover and capture the hidden flag embedded within the intercepted audio data.</li>
                      <li>Attention: You have to purge what you find immediately.</li>
=======
                      <li>Analyze the audio file for hidden data</li>
                      <li>Extract information from both audio channels</li>
                      <li>Find the flag encoded in the frequencies</li>
                      <li>Make a karma choice after capturing the flag</li>
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
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