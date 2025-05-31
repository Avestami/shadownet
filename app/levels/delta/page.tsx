'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import { useRouter } from 'next/navigation';
import KarmaDisplay from '../../components/KarmaDisplay';
import GlobalAudioPlayer from '../../components/GlobalAudioPlayer';

function DeltaLevelContent() {
  const router = useRouter();
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [glitchEffect, setGlitchEffect] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Define the flag value in one place to ensure consistency
  const DELTA_FLAG = 'SHADOWNET{NEUR0LINK}';
  
  // Trigger glitch effect
  const triggerGlitch = () => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 1000);
  };
  
  // Show status message with timeout
  const showStatusMessage = (msg: string, duration = 5000) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), duration);
  };
  
  // Check if flag is already captured when component mounts
  useEffect(() => {
    console.log('Delta level - User data on mount:', user);
    
    if (user?.flagsCaptured && user.flagsCaptured.includes(DELTA_FLAG)) {
      console.log('Delta level - Flag already captured:', DELTA_FLAG);
      setFlagCaptured(true);
    }
    
    // Also check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('Delta level - User choices:', user.choices);
      
      const deltaChoices = user.choices.filter(choice => 
        choice.startsWith('delta_')
      );
      
      if (deltaChoices.length > 0) {
        console.log('Delta level - User already made delta choices:', deltaChoices);
        setKarmaChoiceMade(true);
      }
    } else {
      console.log('Delta level - No choices found or choices is not an array:', user?.choices);
    }
  }, [user]);
  
  // Define karma choices for delta level
  const deltaChallenge = {
    karmaChoices: [
      { id: 'secure', type: 'loyalty', score: 5, description: 'Secure the system: Patch the memory vulnerability' },
      { id: 'exploit', type: 'defiance', score: 5, description: 'Exploit the weakness: Use the memory flaw for access' }
    ]
  };
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
    if (command.toLowerCase() === 'capture') {
      const flag = output;
      
      if (flag === DELTA_FLAG) {
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
            
            // Calculate score increase
            const scoreIncrease = 100;
            
            // Update user data with score increase
            const updatedUser = {
              ...user,
              flagsCaptured: updatedFlags,
              score: (user.score || 0) + scoreIncrease
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
        // Add the error message directly to the terminal using the window function
        setTimeout(() => {
          if (typeof window !== 'undefined' && (window as any).terminalAddMessage) {
            (window as any).terminalAddMessage('ERROR: Incorrect flag. Keep analyzing the memory dump.');
          }
        }, 500);
        
        // Return an empty string since we're adding the message directly
        return '';
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = output.toLowerCase();
        if (choiceType === 'secure' || choiceType === 'exploit') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose secure" or "choose exploit".', 3000);
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
  const handleKarmaChoice = (choiceType: 'secure' | 'exploit') => {
    if (!user) return;
    
    // First check if user has already made this choice
    const choiceId = `delta_${choiceType}`;
    
    // Debug info
    console.log('Checking if choice was already made:', choiceId);
    console.log('User choices:', user.choices);
    
    // Check if user has already made this or any delta karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const deltaChoices = user.choices.filter(choice => 
        choice.startsWith('delta_')
      );
      
      if (deltaChoices.length > 0) {
        console.log('User already made a delta choice:', deltaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
      
      if (user.choices.includes(choiceId)) {
        console.log('User already made this specific choice:', choiceId);
        showStatusMessage('You have already made this karma choice.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    }
    
    setKarmaChoiceMade(true);
    
    // Find the karma choice data
    const choiceData = deltaChallenge.karmaChoices.find(c => c.id === choiceType);
    if (!choiceData) return;
    
    // Update user karma and score
    const karmaType = choiceData.type;
    const karmaValue = choiceData.score;
    
    // Create a copy of user.karma if it exists, or initialize a new object
    const updatedKarma: any = {};
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
    
    // Show UI feedback
    triggerGlitch();
    showStatusMessage(`Karma updated: ${karmaType} +${karmaValue}, Score +${scoreForKarmaChoice}, Total Score: ${newScore}`, 4000);
    
    // Create updated choices array
    const updatedChoices = [...(user.choices || [])];
    if (!updatedChoices.includes(choiceId)) {
      updatedChoices.push(choiceId);
    }
    
    // Update the user object
    try {
      const updatedUser = {
        ...user,
        karma: updatedKarma,
        score: newScore,
        choices: updatedChoices
      };
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_delta`,
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
  
  return (
    <div className={`relative ${glitchEffect ? 'animate-glitch' : ''}`}>
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="delta" initialVolume={0.5} autoPlay={false} />
      
      {message && (
        <div className="mb-4 p-3 bg-purple-900/50 border border-purple-800 rounded text-purple-200 text-sm font-mono">
          <p className="flex items-center">
            <span className="mr-2">▶</span>
            {message}
          </p>
        </div>
      )}
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-purple-900/30 border border-purple-700 rounded text-purple-300 text-sm font-mono">
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
      
      {/* Memory Analysis Section */}
      
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Delta Security Layer v1.3\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'MEMORY ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `A relic of the Cold War has surfaced – a compromised intel \n` +
          `manual. Its secrets are shielded by layers of seemingly innocent \n` +
          `ciphers, a playful facade masking a lethal payload. Decipher this\n` +
          `chain of nostalgic traps. The past holds the key to ShadowNet's \n` +
          `present vulnerability. Break the code. Retrieve the asset.\n\n` +
          `Begin your memory forensics analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Delta level.\n` +
          `Use the Level Select button at the top to access other levels\n` +
          `or type "next" to proceed to the next level.\n` +
          `Make a karma choice first with:\n` +
          `- choose secure    (Loyalty +5)\n` +
          `- choose exploit   (Defiance +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@delta:~$ "
        levelId="delta"
        onCommandExecuted={handleTerminalCommand}
      />
      
      {/* Challenge information */}
      <div className="mt-4 p-4 border border-purple-800 bg-black/80 rounded-md text-purple-300 text-sm max-w-3xl">
        <h3 className="text-lg text-purple-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-purple-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Engage the intercepted file.</li>
            <li>Trace the pattern beneath the ink.</li>
            <li>Recover the original message.</li>
            <li>Deliver the final phrase without alteration.</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-purple-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>The first shift is simple.</li>
            <li>A grid holds the next secret.</li>
            <li>Numbers can hide text? Maybe , You can Try.</li>
            <li>The final key dances with letters.</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-purple-400">FLAG CAPTURED!</h4>
            <p>You've successfully analyzed the memory dump and identified the compromise.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-purple-400">DECISION POINT:</h4>
                <p>You've discovered a critical memory vulnerability. What will you do with this knowledge?</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('secure')}
                    className="bg-purple-900/50 border border-purple-700 text-purple-200 px-4 py-2 rounded hover:bg-purple-800/50 transition-colors"
                  >
                    Secure the System (+5 Loyalty)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('exploit')}
                    className="bg-purple-900/50 border border-purple-700 text-purple-200 px-4 py-2 rounded hover:bg-purple-800/50 transition-colors"
                  >
                    Exploit the Weakness (+5 Defiance)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-purple-400 font-mono">Find and capture the flag to proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeltaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-purple-500" />}>
      <LevelLayout
        levelId="delta"
        levelTitle="Memory Residue"
        levelDescription="ShadowNet detected an anomalous breach event. We've acquired a memory dump from the compromised system."
        objectives={[
          'Uncover and capture the hidden flag by decrypting the intel manual.',
          `Attention:
You have to report what you find immediately.`
        ]}
        colorCode="purple"
        loreText="This breach may be connected to Dr. Tenebris Draconis' operations."
        loreSubtext="Memory never truly forgets; it just reorganizes the truth."
      >
        <DeltaLevelContent />
      </LevelLayout>
    </Suspense>
  );
} 