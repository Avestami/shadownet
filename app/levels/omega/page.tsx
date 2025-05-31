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

function OmegaLevelContent() {
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Get challenge data
  const omegaChallenge = LEVEL_CHALLENGES.omega;
  
  // Effect to check if user has already captured the flag
  useEffect(() => {
    console.log('OMEGA LEVEL - Checking user state:', user);
    if (user && user.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{ASCENSION}')) {
      setFlagCaptured(true);
    }
    
    // Check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('OMEGA LEVEL - User choices on mount:', user.choices);
      
      const omegaChoices = user.choices.filter(choice => 
        choice.startsWith('omega_')
      );
      
      if (omegaChoices.length > 0) {
        console.log('OMEGA LEVEL - Omega choices already made:', omegaChoices);
        setKarmaChoiceMade(true);
      }
    }
  }, [user]);
  
  // Function to trigger glitch effect
  const triggerGlitch = () => {
    console.log('OMEGA DEBUG - Triggering glitch effect');
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
        
        if (flag === 'SHADOWNET{ASCENSION}') {
          // Play capture sound
          if (audioPlayerRef.current) {
            audioPlayerRef.current.playCapture();
          }
          
          // Trigger glitch effect for visual feedback
          console.log('OMEGA DEBUG - Flag captured, triggering glitch effect');
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
          return 'Incorrect flag. Continue exploring the convergence.';
        }
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = command.split(' ')[1]?.toLowerCase();
        if (choiceType === 'merge' || choiceType === 'destroy') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose merge" or "choose destroy".', 3000);
        }
      } else if (!flagCaptured) {
        showStatusMessage('You must capture the flag before making a karma choice.', 3000);
      } else if (karmaChoiceMade) {
        showStatusMessage('You have already made your karma choice. This was the final level.', 4000);
      }
    }
    
    return null;
  };
  
  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'merge' | 'destroy') => {
    console.log('OMEGA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('OMEGA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('OMEGA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made an omega karma choice
    const choiceId = `omega_${choiceType}`;
    console.log('OMEGA LEVEL - Choice ID:', choiceId);
    
    // Check if user has already made any omega karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const omegaChoices = user.choices.filter(choice => 
        choice.startsWith('omega_')
      );
      
      if (omegaChoices.length > 0) {
        console.log('OMEGA LEVEL - User already made an omega choice:', omegaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    }
    
    setKarmaChoiceMade(true);
    
    // Update user karma and score
    const karmaType = choiceType === 'merge' ? 'integration' : 'defiance';
    const karmaValue = 10; // Final level gives more karma points
    
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
    const scoreForKarmaChoice = karmaValue * 2; // Double points for final level
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
      
      console.log('OMEGA LEVEL - Updated user with choice:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_omega`,
          scoreChange: scoreForKarmaChoice,
          karmaType: karmaType,
          karmaValue: karmaValue,
          choiceId: choiceId
        })
      })
      .then(response => {
        console.log('OMEGA LEVEL - API response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to save karma choice');
        }
        return response.json();
      })
      .then(data => {
        console.log('OMEGA LEVEL - Karma choice saved successfully:', data);
        showStatusMessage(`Karma choice confirmed: ${karmaType} +${karmaValue}, Total Score: ${data.score}`, 5000);
        
        // Refresh user data to ensure UI is updated
        if (refreshUser) {
          setTimeout(() => {
            console.log('OMEGA LEVEL - Refreshing user data after karma choice');
            refreshUser().then(updatedUser => {
              console.log('OMEGA LEVEL - User data auto-refreshed after karma choice:', updatedUser);
            });
          }, 500);
        }
      })
      .catch(err => {
        console.error('OMEGA LEVEL - Error saving karma choice:', err);
        showStatusMessage('Warning: Karma update may not have saved properly', 3000);
      });
    } catch (error) {
      console.error('Error updating karma:', error);
    }
  };
  
  return (
    <div className={`relative ${glitchEffect ? 'animate-glitch' : ''}`}>
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="omega" initialVolume={0.5} autoPlay={false} />
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded text-green-300 text-sm font-mono">
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
      
      {/* Convergence Analysis Section */}
      <div className="mb-6 bg-black/80 border border-green-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-green-400">FINAL CONVERGENCE</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-green-900">
            <div className="w-full p-3 bg-black text-green-300 font-mono text-sm">
              <p>Challenge Bundle: Multi-layered security and encryption challenges</p>
              <p>Objective: Apply all previously acquired skills</p>
              <p>Environment: Custom virtual machine with integrated challenges</p>
              <p>Security Level: Maximum</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/omega/final_convergence.zip" 
              download
              className="px-4 py-2 bg-green-900/50 hover:bg-green-800 text-green-100 rounded-md font-mono text-sm"
            >
              Download Challenge Bundle
            </a>
          </div>
          <div className="text-green-300 text-sm mt-2 font-mono">
            <p>Dr. Tenebris Draconis' final challenge. All paths converge here.</p>
            <p>Dr. Tenebris Draconis Draconis&apos; final challenge. All paths converge here.</p>
            <p className="mt-1 text-xs text-green-400">Hint: Your karma path influences the available attack vectors. Consider your journey.</p>
          </div>
        </div>
      </div>
      
      {/* Karma Status Section */}
      <div className="mb-6 bg-black/80 border border-green-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-green-400">KARMA ALIGNMENT</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Loyalty:</span>
              <span className="text-blue-400">{typeof user?.karma === 'object' ? (user?.karma as any)?.loyalty || 0 : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Curiosity:</span>
              <span className="text-purple-400">{typeof user?.karma === 'object' ? (user?.karma as any)?.curiosity || 0 : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Mercy:</span>
              <span className="text-green-400">{typeof user?.karma === 'object' ? (user?.karma as any)?.mercy || 0 : 0}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Defiance:</span>
              <span className="text-red-400">{typeof user?.karma === 'object' ? (user?.karma as any)?.defiance || 0 : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Integration:</span>
              <span className="text-yellow-400">{typeof user?.karma === 'object' ? (user?.karma as any)?.integration || 0 : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Score:</span>
              <span className="text-white">{user?.score || 0}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Omega Security Layer v3.0\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'CONVERGENCE ACHIEVED' : 'FINAL CHALLENGE'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `Welcome to The Convergence. This is Dr. Tenebris Draconis' final test.\n` +
          `Welcome to The Convergence. This is Dr. Tenebris Draconis&apos; final test.\n` +
          `All your skills, choices, and karma have led to this moment.\n` +
          `Your task: Decode the ultimate truth about ShadowNet.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis guidance\n` +
          `- submit <flag>   Submit the final flag\n` +
          `- choose <option> Make your final karma choice\n\n` +
          `Begin the final challenge...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `CONVERGENCE ACHIEVED!\n` +
          `You have successfully completed the Omega level and the entire ShadowNet challenge.\n` +
          `Make your final choice with:\n` +
          `- choose merge    (Integration +10)\n` +
          `- choose destroy  (Defiance +10)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@omega:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get guidance on the final challenge
  karma               Display your current karma alignment
  submit <flag>       Submit the final flag (format: SHADOWNET{...})
  choose <option>     Make your final karma choice after capturing the flag
  history             View your journey through ShadowNet
  clear               Clear the terminal screen`,
          
          analyze: () => `THE CONVERGENCE - GUIDANCE:

This final challenge integrates elements from all previous levels:

1. Cryptographic knowledge from Signal Dissonance (Beta) and Cryptographic Weakness (Sigma-2)
2. Steganographic techniques from Spectral Overlay (Gamma)
3. Memory forensics from Memory Residue (Delta)
4. Network analysis from Network Shadows (Sigma)
5. Firmware analysis from Hardware Trojan (Theta)
6. Web security from Web Intrusion (Zeta)

Your karma path influences available solutions:

- High Loyalty: Direct command interface access
- High Curiosity: Hidden data extraction methods
- High Defiance: System override capabilities
- High Mercy: Alternative non-destructive pathways
- High Integration: Holistic system understanding

The challenge bundle contains a virtual environment with all necessary components. Your approach will be influenced by your previous choices.

Remember: There is no single correct path to the truth. Your journey defines your destiny.`,
          
          karma: () => {
            if (!user || !user.karma) return "Karma data unavailable.";
            
            const karmaObj = typeof user.karma === 'object' ? user.karma : {};
            
            return `KARMA ALIGNMENT:

Loyalty:     ${(karmaObj as any)?.loyalty || 0}
Curiosity:   ${(karmaObj as any)?.curiosity || 0}
Mercy:       ${(karmaObj as any)?.mercy || 0}
Defiance:    ${(karmaObj as any)?.defiance || 0}
Integration: ${(karmaObj as any)?.integration || 0}

Total Score: ${user.score || 0}

Your dominant alignment: ${getDominantKarma(karmaObj)}`;
          },
          
          history: () => `YOUR SHADOWNET JOURNEY:

Alpha Level: Echoed Transmission
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{DTHEREFORTH}') ? 'YES' : 'NO'}

Beta Level: Signal Dissonance
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{SOUND876}') ? 'YES' : 'NO'}

Gamma Level: Spectral Overlay
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{S3CR3T_D34TH}') ? 'YES' : 'NO'}

Delta Level: Memory Residue
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{MEMORY_BUFFER}') ? 'YES' : 'NO'}

Sigma Level: Network Shadows
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{DISTRICT_FREEDOM}') ? 'YES' : 'NO'}

Theta Level: Hardware Trojan
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{REFLECTIONS}') ? 'YES' : 'NO'}

Zeta Level: Web Intrusion
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{TOKEN_FORGED}') ? 'YES' : 'NO'}

Sigma-2 Level: Cryptographic Weakness
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{FIRST_WORSHIP}') ? 'YES' : 'NO'}

Omega Level: The Convergence
  - Status: ${flagCaptured ? 'COMPLETED' : 'IN PROGRESS'}`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
        levelId="omega"
      />

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-green-800 bg-black/80 rounded-md text-green-300 text-sm max-w-3xl">
        <h3 className="text-lg text-green-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-green-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Apply all previously acquired skills to the final challenge</li>
            <li>Adapt your approach based on your karma alignment</li>
            <li>Discover the ultimate truth about ShadowNet and Dr. Tenebris Draconis</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-green-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Your previous karma choices have shaped your available paths</li>
            <li>Consider how each previous level's techniques might apply here</li>
            <li>Consider how each previous level&apos;s techniques might apply here</li>
            <li>The truth about ShadowNet lies at the convergence of all paths</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">CONVERGENCE ACHIEVED!</h4>
            <p>You've successfully uncovered the truth about ShadowNet and Dr. Tenebris Draconis.</p>
            <p>You&apos;ve successfully uncovered the truth about ShadowNet and Dr. Tenebris Draconis.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-green-400">FINAL DECISION:</h4>
                <p>You've reached the moment of truth. You now have the power to shape the future of ShadowNet and humanity's relationship with AI. What will you do?</p>
                <p>You&apos;ve reached the moment of truth. You now have the power to shape the future of ShadowNet and humanity&apos;s relationship with AI. What will you do?</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('merge')}
                    className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded hover:bg-green-800/50 transition-colors"
                  >
                    Merge With ShadowNet (+10 Integration)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('destroy')}
                    className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded hover:bg-green-800/50 transition-colors"
                  >
                    Destroy ShadowNet (+10 Defiance)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-green-400 font-mono">Find and submit the flag to complete your journey.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to determine dominant karma
function getDominantKarma(karma: any) {
  if (!karma) return "Undefined";
  
  const types = [
    { type: 'Loyalty', value: karma.loyalty || 0 },
    { type: 'Curiosity', value: karma.curiosity || 0 },
    { type: 'Mercy', value: karma.mercy || 0 },
    { type: 'Defiance', value: karma.defiance || 0 },
    { type: 'Integration', value: karma.integration || 0 }
  ];
  
  types.sort((a, b) => b.value - a.value);
  
  if (types[0].value === 0) return "Neutral";
  
  // If there's a tie, return both
  if (types[0].value === types[1].value) {
    return `${types[0].type}/${types[1].type}`;
  }
  
  return types[0].type;
}

export default function OmegaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-green-500" />}>
      <LevelLayout
        levelId="omega"
        levelTitle="The Convergence"
        levelDescription="The final challenge from Dr. Tenebris Draconis. All your skills, choices, and karma have led to this moment."
        objectives={[
          'Apply techniques from all previous challenges',
          'Navigate the virtual environment based on your karma path',
          'Discover the ultimate truth about ShadowNet',
          'Make your final choice that determines the ending'
        ]}
        colorCode="green"
        loreText="Dr. Tenebris Draconis awaits your final decision."
        loreSubtext="The truth was fragmented across your entire journey. Now is the time for convergence."
      >
        <OmegaLevelContent />
      </LevelLayout>
    </Suspense>
  );
}