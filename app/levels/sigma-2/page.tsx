'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import GlobalAudioPlayer from '../../components/GlobalAudioPlayer';
import KarmaDisplay from '../../components/KarmaDisplay';

interface KarmaObject {
  [key: string]: number;
}

function Sigma2LevelContent() {
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Get challenge data
  const sigma2Challenge = LEVEL_CHALLENGES['sigma-2'];
  
  // Effect to check if user has already captured the flag
  useEffect(() => {
    console.log('SIGMA-2 LEVEL - Checking user state:', user);
    if (user && user.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{FIRST_WORSHIP}')) {
      setFlagCaptured(true);
    }
    
    // Check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('SIGMA-2 LEVEL - User choices on mount:', user.choices);
      
      const sigma2Choices = user.choices.filter(choice => 
        choice.startsWith('sigma2_')
      );
      
      if (sigma2Choices.length > 0) {
        console.log('SIGMA-2 LEVEL - Sigma-2 choices already made:', sigma2Choices);
        setKarmaChoiceMade(true);
      }
    }
  }, [user]);
  
  // Function to trigger glitch effect
  const triggerGlitch = () => {
    console.log('SIGMA-2 DEBUG - Triggering glitch effect');
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 1500);
  };

  // Function to show status messages
  const showStatusMessage = (msg: string, duration = 5000) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), duration);
  };
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit') || command.toLowerCase().startsWith('capture')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{FIRST_WORSHIP}') {
          // Play capture sound
          if (audioPlayerRef.current) {
            audioPlayerRef.current.playCapture();
          }
          
          // Trigger glitch effect for visual feedback
          console.log('SIGMA-2 DEBUG - Flag captured, triggering glitch effect');
          triggerGlitch();
          
          setFlagCaptured(true);
          
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
          
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the cryptographic artifacts.';
        }
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = command.split(' ')[1]?.toLowerCase();
        if (choiceType === 'join' || choiceType === 'analyze') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose join" or "choose analyze".', 3000);
        }
      } else if (!flagCaptured) {
        showStatusMessage('You must capture the flag before making a karma choice.', 3000);
      } else if (karmaChoiceMade) {
        showStatusMessage('You have already made your karma choice. Use the Level Select button at the top or type "next" to continue.', 4000);
      }
    }
    
    return null;
  };
  
  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'join' | 'analyze') => {
    console.log('SIGMA-2 LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('SIGMA-2 LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('SIGMA-2 LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made a sigma-2 karma choice
    const choiceId = `sigma2_${choiceType}`;
    console.log('SIGMA-2 LEVEL - Choice ID:', choiceId);
    
    // Check if user has already made any sigma-2 karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const sigma2Choices = user.choices.filter(choice => 
        choice.startsWith('sigma2_')
      );
      
      if (sigma2Choices.length > 0) {
        console.log('SIGMA-2 LEVEL - User already made a sigma-2 choice:', sigma2Choices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    }
    
    setKarmaChoiceMade(true);
    
    // Update user karma and score
    const karmaType = choiceType === 'join' ? 'integration' : 'curiosity';
    const karmaValue = 5;
    
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
    
    // Show UI feedback
    triggerGlitch();
    showStatusMessage(`Karma updated: ${karmaType} +${karmaValue}, Score +${scoreForKarmaChoice}, Total Score: ${newScore}`, 4000);
    
    // Update the user object with new karma and the choice tracking
    try {
      // Get current choices or initialize empty array
      const currentChoices = Array.isArray(user.choices) ? [...user.choices] : [];
      // Add this choice to the array
      currentChoices.push(choiceId);
      
      const updatedUser = {
        ...user,
        karma: updatedKarma,
        score: newScore,
        choices: currentChoices
      };
      
      console.log('SIGMA-2 LEVEL - Updated user with choice:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_sigma2`,
          scoreChange: scoreForKarmaChoice,
          karmaType: karmaType,
          karmaValue: karmaValue,
          choiceId: choiceId
        })
      })
      .then(response => {
        console.log('SIGMA-2 LEVEL - API response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to save karma choice');
        }
        return response.json();
      })
      .then(data => {
        console.log('SIGMA-2 LEVEL - Karma choice saved successfully:', data);
        showStatusMessage(`Karma choice confirmed: ${karmaType} +${karmaValue}, Total Score: ${data.score}`, 5000);
        
        // Refresh user data to ensure UI is updated
        if (refreshUser) {
          setTimeout(() => {
            console.log('SIGMA-2 LEVEL - Refreshing user data after karma choice');
            refreshUser().then(updatedUser => {
              console.log('SIGMA-2 LEVEL - User data auto-refreshed after karma choice:', updatedUser);
            });
          }, 500);
        }
      })
      .catch(err => {
        console.error('SIGMA-2 LEVEL - Error saving karma choice:', err);
        showStatusMessage('Warning: Karma update may not have saved properly', 3000);
      });
    } catch (error) {
      console.error('Error updating karma:', error);
    }
  };
  
  return (
    <div className={`relative ${glitchEffect ? 'animate-glitch' : ''}`}>
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="sigma-2" initialVolume={0.5} autoPlay={false} />
      
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
      
      {/* Cryptographic Analysis Section */}
      <div className="mb-6 bg-black/80 border border-purple-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-purple-400">CRYPTOGRAPHIC ANALYSIS</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-purple-900">
            <div className="w-full p-3 bg-black text-purple-300 font-mono text-sm overflow-auto">
              <p>The CivicShield encryption uses a system built on the multiplication of two large, secret prime numbers.</p>
              <p>Each message is locked with an open key, but only those with the secret divisor can unlock it.</p>
              <p>Their mistake? The primes were chosen too close together. Fast. Predictable.</p>
              <p>Once you break the product, the rest falls like glass.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Sigma-2 Security Layer v2.0\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'CRYPTOGRAPHIC ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `We've intercepted encrypted communications from a ShadowNet node.\n` +
          `Cryptanalysis indicates potential weakness in the key generation.\n` +
          `Your task: break the encryption and reveal the plaintext.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n` +
          `- choose <option> Make a karma choice\n\n` +
          `Begin your cryptographic analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Sigma-2 level.\n` +
          `Use the Level Select button at the top to access other levels.\n` +
          `Make a karma choice first with:\n` +
          `- choose join     (Integration +5)\n` +
          `- choose analyze  (Curiosity +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@sigma2:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on cryptographic analysis
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  choose <option>     Make a karma choice after capturing the flag
  clear               Clear the terminal screen`,
          
          analyze: () => `CRYPTOGRAPHIC ANALYSIS TIPS:

1. Look for weaknesses in:
   - Random number generation
   - Key exchange protocol implementation
   - Initialization vector (IV) reuse
   - Block cipher mode vulnerabilities

2. Analysis tools:
   - OpenSSL for working with cryptographic primitives
   - CrypTool for visualization and analysis
   - Custom Python scripts with cryptography libraries
   - Wireshark for analyzing captured key exchange traffic

3. Attack vectors:
   - Weak key generation predictability
   - Side-channel timing attacks
   - Known-plaintext attack if partial content is known
   - Man-in-the-middle during key exchange

Remember: Even strong algorithms can be vulnerable if improperly implemented or if key generation is flawed.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
        levelId="sigma-2"
      />

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-purple-800 bg-black/80 rounded-md text-purple-300 text-sm max-w-3xl">
        <h3 className="text-lg text-purple-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-purple-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Break the encryption on the intercepted communications</li>
            <li>Identify weaknesses in the key exchange protocol</li>
            <li>Decrypt the data and extract the AI cultist plans</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-purple-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>CivicShield's "SecureCast" protocol relies on a public exponent and a very private foundation.</li>
            <li>That foundation? Just two numbers multiplied together. Factor that, and the cipher crumbles.</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You've successfully decrypted the communications about the AI cult.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-purple-400">DECISION POINT:</h4>
                <p>You've discovered a group that worships AI entities. What will you do with this information?</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('join')}
                    className="bg-purple-900/50 border border-purple-700 text-purple-200 px-4 py-2 rounded hover:bg-purple-800/50 transition-colors"
                  >
                    Join AI Cultists (+5 Integration)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('analyze')}
                    className="bg-purple-900/50 border border-purple-700 text-purple-200 px-4 py-2 rounded hover:bg-purple-800/50 transition-colors"
                  >
                    Study Their Beliefs (+5 Curiosity)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-purple-400 font-mono">Find and submit the flag to proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sigma2Level() {
  return (
    <Suspense fallback={<LevelLoading color="text-purple-500" />}>
      <LevelLayout
        levelId="sigma-2"
        levelTitle="Cryptographic Weakness"
        levelDescription="We've intercepted encrypted communications from a ShadowNet node with potential weakness in the key generation."
        objectives={[
          'Analyze the cryptographic implementation',
          'Identify weaknesses in the key generation',
          'Decrypt the communications',
        ]}
        colorCode="purple"
        loreText="These communications may reveal Dr. Draconis' final plans."
        loreSubtext="Security is only as strong as its weakest implementation detail."
      >
        <Sigma2LevelContent />
      </LevelLayout>
    </Suspense>
  );
} 