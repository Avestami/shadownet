'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';
import GlobalAudioPlayer from '../../components/GlobalAudioPlayer';
import { useRouter } from 'next/navigation';
import KarmaDisplay from '../../components/KarmaDisplay';

function GammaLevelContent() {
  const router = useRouter();
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [glitchEffect, setGlitchEffect] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const audioPlayerRef = useRef<any>(null);
  
  // Define the flag value in one place to ensure consistency
  const GAMMA_FLAG = 'SHADOWNET{S3CR3T_D34TH}';
  
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
    console.log('GAMMA LEVEL - User data loaded:', user);
    
    if (user?.flagsCaptured && user.flagsCaptured.includes(GAMMA_FLAG)) {
      console.log('GAMMA LEVEL - Flag already captured:', GAMMA_FLAG);
      setFlagCaptured(true);
    }
    
    // Check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('GAMMA LEVEL - User choices on mount:', user.choices);
      
      const gammaChoices = user.choices.filter(choice => 
        choice.startsWith('gamma_')
      );
      
      if (gammaChoices.length > 0) {
        console.log('GAMMA LEVEL - Gamma karma choices already made:', gammaChoices);
        setKarmaChoiceMade(true);
      }
    } else {
      console.log('GAMMA LEVEL - No choices found or choices is not an array:', user?.choices);
    }
  }, [user]);
  
  // Define karma choices for gamma level
  const gammaChallenge = {
    karmaChoices: [
      { id: 'erase', type: 'mercy', score: 5, description: 'Erase evidence: Remove traces of harmful data' },
      { id: 'preserve', type: 'curiosity', score: 5, description: 'Preserve evidence: Keep detailed records of findings' }
    ]
  };
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
    const fullCommand = command.toLowerCase();
    
    // Special handling for the capture command
    if (fullCommand.startsWith('capture')) {
      // Extract the flag from the full command
      const parts = fullCommand.split(' ');
      const flag = parts.slice(1).join(' ').toUpperCase();
      
      console.log("Processing flag capture with command:", fullCommand);
      console.log("Extracted flag:", flag);
      
      if (flag === GAMMA_FLAG) {
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
        // Return the error message to the terminal instead of showing a status message
        return 'ERROR: Incorrect flag. Keep analyzing the image file.';
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = output.toLowerCase();
        if (choiceType === 'erase' || choiceType === 'preserve') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose erase" or "choose preserve".', 3000);
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
  const handleKarmaChoice = (choiceType: 'erase' | 'preserve') => {
    console.log('GAMMA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('GAMMA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('GAMMA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made a gamma karma choice
    const choiceId = `gamma_${choiceType}`;
    console.log('GAMMA LEVEL - Checking for existing choice:', choiceId);
    console.log('GAMMA LEVEL - User choices:', user.choices);
    
    // Check if user has already made any gamma karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const gammaChoices = user.choices.filter(choice => 
        choice.startsWith('gamma_')
      );
      
      console.log('GAMMA LEVEL - Existing gamma choices:', gammaChoices);
      
      if (gammaChoices.length > 0) {
        console.log('GAMMA LEVEL - User already made a gamma choice:', gammaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
      
      if (user.choices.includes(choiceId)) {
        console.log('GAMMA LEVEL - User already made this specific choice:', choiceId);
        showStatusMessage('You have already made this karma choice.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    } else {
      console.log('GAMMA LEVEL - User choices is not an array or is undefined:', user.choices);
    }
    
    setKarmaChoiceMade(true);
    
    // Find the karma choice data
    const choiceData = gammaChallenge.karmaChoices.find(c => c.id === choiceType);
    if (!choiceData) {
      console.log('GAMMA LEVEL - Choice data not found for:', choiceType);
      return;
    }
    
    console.log('GAMMA LEVEL - Choice data found:', choiceData);
    
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
    
    console.log('GAMMA LEVEL - Karma update:', {
      type: karmaType,
      oldValue: typeof user.karma === 'object' && user.karma !== null ? user.karma[karmaType] || 0 : 0,
      change: karmaValue,
      newValue: updatedKarma[karmaType]
    });
    
    console.log('GAMMA LEVEL - Score update:', {
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
    
    console.log('GAMMA LEVEL - Updated choices array:', updatedChoices);
    
    // Update the user object
    try {
      const updatedUser = {
        ...user,
        karma: updatedKarma,
        score: newScore,
        choices: updatedChoices
      };
      
      console.log('GAMMA LEVEL - Updated user object:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      console.log('GAMMA LEVEL - Sending update to server with payload:', { 
        flagId: `flag_gamma`,
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
          flagId: `flag_gamma`,
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
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="gamma" initialVolume={0.5} autoPlay={false} />
      
      {message && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-800 rounded text-green-200 text-sm font-mono">
          <p className="flex items-center">
            <span className="mr-2">▶</span>
            {message}
          </p>
        </div>
      )}
      
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
      
      {/* Image Analysis Section */}
      <div className="mb-6 bg-black/80 border border-green-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-green-400">IMAGE ANALYSIS</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-green-900">
            <img 
              ref={imageRef}
              src="/challenges/gamma/whistleblower.png" 
              alt="Encrypted Image"
              className="w-full max-h-64 object-contain"
            />
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/gamma/whistleblower.png" 
              download
              className="px-4 py-2 bg-green-900/50 hover:bg-green-800 text-green-100 rounded-md font-mono text-sm"
            >
              Download for Analysis
            </a>
          </div>
          <div className="text-green-300 text-sm mt-2 font-mono">
            <p>Steganographic content detected. Check all channels separately.</p>
            <p className="mt-1 text-xs text-green-400">Hint: Try analyzing the blue channel with LSB extraction.</p>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Gamma Security Layer v1.2\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'IMAGE ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `Agent. A whistleblower's image was uploaded to a darknet dead drop.\n` +
          `Within it is the truth. But truth is layered.\n` +
          `Choose wisely — the image hides more than pixels.\n\n` +
          `Begin your steganographic analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Gamma level.\n` +
          `Use the Level Select button at the top to access other levels\n` +
          `or type "next" to proceed to the next level.\n` +
          `Make a karma choice first with:\n` +
          `- choose erase      (Mercy +5)\n` +
          `- choose preserve   (Curiosity +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@gamma:~$ "
        levelId="gamma"
        onCommandExecuted={handleTerminalCommand}
      />
      
      {/* Challenge information */}
      <div className="mt-4 p-4 border border-green-800 bg-black/80 rounded-md text-green-300 text-sm max-w-3xl">
        <h3 className="text-lg text-green-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-green-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Find and capture the flag hidden in the image data</li>
            <li>Extract steganographic content from the image</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-green-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Steganography involves hiding data within other data</li>
            <li>Image files contain multiple color channels (RGB)</li>
            <li>The blue channel often contains hidden messages</li>
            <li>The least significant bits (LSB) can store hidden data</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You've successfully analyzed the image and extracted the hidden data.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-green-400">DECISION POINT:</h4>
                <p>The whistleblower's data contains incriminating evidence. What will you do with this sensitive information?</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('erase')}
                    className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded hover:bg-green-800/50 transition-colors"
                  >
                    Erase Evidence (+5 Mercy)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('preserve')}
                    className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded hover:bg-green-800/50 transition-colors"
                  >
                    Preserve Evidence (+5 Curiosity)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-green-400 font-mono">Find and capture the flag to proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GammaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-green-500" />}>
      <LevelLayout
        levelId="gamma"
        levelTitle="Spectral Overlay"
        levelDescription="A whistleblower's image was uploaded to a darknet dead drop. Within it is the truth. But truth is layered."
        objectives={[
          'Analyze the image for hidden steganographic data',
          'Extract the message from the image channels',
          'Find the flag hidden within the image',
          'Make a karma choice after capturing the flag'
        ]}
        colorCode="green"
        loreText="The whistleblower claims to have evidence against Dr. Tenebris Draconis."
        loreSubtext="Digital images can hide many secrets in their binary structure."
      >
        <GammaLevelContent />
      </LevelLayout>
    </Suspense>
  );
}
