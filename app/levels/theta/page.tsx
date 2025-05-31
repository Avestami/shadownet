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

function ThetaLevelContent() {
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Get challenge data
  const thetaChallenge = LEVEL_CHALLENGES.theta;
  
  // Effect to check if user has already captured the flag
  useEffect(() => {
    console.log('THETA LEVEL - Checking user state:', user);
    if (user && user.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{REFLECTIONS}')) {
      setFlagCaptured(true);
    }
    
    // Check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('THETA LEVEL - User choices on mount:', user.choices);
      
      const thetaChoices = user.choices.filter(choice => 
        choice.startsWith('theta_')
      );
      
      if (thetaChoices.length > 0) {
        console.log('THETA LEVEL - Theta choices already made:', thetaChoices);
        setKarmaChoiceMade(true);
      }
    }
  }, [user]);
  
  // Function to trigger glitch effect
  const triggerGlitch = () => {
    console.log('THETA DEBUG - Triggering glitch effect');
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
        
        if (flag === 'SHADOWNET{REFLECTIONS}') {
          // Play capture sound
          if (audioPlayerRef.current) {
            audioPlayerRef.current.playCapture();
          }
          
          // Trigger glitch effect for visual feedback
          console.log('THETA DEBUG - Flag captured, triggering glitch effect');
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
          return 'Incorrect flag. Keep analyzing the firmware image.';
        }
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = command.split(' ')[1]?.toLowerCase();
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
    }
    return null;
  };
  
  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'secure' | 'exploit') => {
    console.log('THETA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('THETA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('THETA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made a theta karma choice
    const choiceId = `theta_${choiceType}`;
    console.log('THETA LEVEL - Choice ID:', choiceId);
    
    // Check if user has already made any theta karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const thetaChoices = user.choices.filter(choice => 
        choice.startsWith('theta_')
      );
      
      if (thetaChoices.length > 0) {
        console.log('THETA LEVEL - User already made a theta choice:', thetaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    }
    
    setKarmaChoiceMade(true);
    
    // Update user karma and score
    const karmaType = choiceType === 'secure' ? 'loyalty' : 'defiance';
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
      
      console.log('THETA LEVEL - Updated user with choice:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_theta`,
          scoreChange: scoreForKarmaChoice,
          karmaType: karmaType,
          karmaValue: karmaValue,
          choiceId: choiceId
        })
      })
      .then(response => {
        console.log('THETA LEVEL - API response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to save karma choice');
        }
        return response.json();
      })
      .then(data => {
        console.log('THETA LEVEL - Karma choice saved successfully:', data);
        showStatusMessage(`Karma choice confirmed: ${karmaType} +${karmaValue}, Total Score: ${data.score}`, 5000);
        
        // Refresh user data to ensure UI is updated
        if (refreshUser) {
          setTimeout(() => {
            console.log('THETA LEVEL - Refreshing user data after karma choice');
            refreshUser().then(updatedUser => {
              console.log('THETA LEVEL - User data auto-refreshed after karma choice:', updatedUser);
            });
          }, 500);
        }
      })
      .catch(err => {
        console.error('THETA LEVEL - Error saving karma choice:', err);
        showStatusMessage('Warning: Karma update may not have saved properly', 3000);
      });
    } catch (error) {
      console.error('Error updating karma:', error);
    }
  };
  
  return (
    <div className={`relative ${glitchEffect ? 'animate-glitch' : ''}`}>
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="theta" initialVolume={0.5} autoPlay={false} />
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-orange-900/30 border border-orange-700 rounded text-orange-300 text-sm font-mono">
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
      
      {/* Firmware Analysis Section */}
      <div className="mb-6 bg-black/80 border border-orange-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-orange-400">FIRMWARE ANALYSIS</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-orange-900">
            <div className="w-full p-3 bg-black text-orange-300 font-mono text-sm">
              <p>Firmware: shadow_router_v2.3.bin (8.2 MB)</p>
              <p>Device: Network Security Appliance</p>
              <p>Architecture: ARM Cortex-A9</p>
              <p>Build timestamp: 2023-08-22 17:19:03 UTC</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/theta/shadow_router_v2.3.bin" 
              download
              className="px-4 py-2 bg-orange-900/50 hover:bg-orange-800 text-orange-100 rounded-md font-mono text-sm"
            >
              Download Firmware
            </a>
          </div>
          <div className="text-orange-300 text-sm mt-2 font-mono">
            <p>Security audit detected potential backdoor in this device firmware.</p>
            <p className="mt-1 text-xs text-orange-400">Hint: Extract the filesystem and look for unauthorized modifications to startup scripts.</p>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Theta Security Layer v1.5\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'FIRMWARE ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
<<<<<<< HEAD
          `Alert: An unknown entity, AV3ST4, is mirroring your operations, \n` +
          `injecting false commands into your terminal logs. This is more  \n` +
          `than mimicry; it's a direct challenge to your digital identity. You  \n` +
          `must confront this shadow. Will you erase it, spare it, or merge? \n` +
          `Your control is at stake. Capture the truth.\n\n` +
=======
          `Security audit flagged this network appliance firmware.\n` +
          `Potential supply chain compromise detected.\n` +
          `Your task: locate the backdoor mechanism and extraction method.\n\n` +
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n` +
          `- choose <option> Make a karma choice\n\n` +
          `Begin your firmware analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Theta level.\n` +
          `Use the Level Select button at the top to access other levels.\n` +
          `Make a karma choice first with:\n` +
          `- choose secure   (Loyalty +5)\n` +
          `- choose exploit  (Defiance +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@theta:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on analyzing the firmware
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  choose <option>     Make a karma choice after capturing the flag
  clear               Clear the terminal screen`,
          
          analyze: () => `FIRMWARE ANALYSIS TIPS:

1. Use these tools for firmware analysis:
   - binwalk for initial inspection and file extraction
   - Ghidra or IDA Pro for reverse engineering binary components
   - strings command to find readable text in binaries
   - hexdump for raw binary analysis

2. Look for these common backdoor techniques:
   - Hidden hardcoded credentials
   - Undocumented API endpoints
   - Modified system binaries
   - Unusual startup scripts or cron jobs
   - Covert command & control channels

3. Analysis steps:
   - Extract the filesystem with 'binwalk -e shadow_router_v2.3.bin'
   - Examine init scripts in /etc/init.d/ or /etc/rc.d/
   - Analyze network services configurations
   - Look for unusual setuid binaries

Remember: Supply chain attackers often try to make backdoors look like legitimate functionality.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
        levelId="theta"
      />

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-orange-800 bg-black/80 rounded-md text-orange-300 text-sm max-w-3xl">
        <h3 className="text-lg text-orange-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-orange-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Find and submit the flag related to the firmware backdoor</li>
            <li>Analyze the firmware for security vulnerabilities</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-orange-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Extract the firmware and examine startup scripts</li>
            <li>Look for unauthorized binary modifications</li>
            <li>Check for hidden network services</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You've successfully identified the firmware backdoor.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-orange-400">DECISION POINT:</h4>
                <p>The backdoor you discovered provides control over thousands of deployed devices. How will you proceed?</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('secure')}
                    className="bg-orange-900/50 border border-orange-700 text-orange-200 px-4 py-2 rounded hover:bg-orange-800/50 transition-colors"
                  >
                    Secure Devices (+5 Loyalty)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('exploit')}
                    className="bg-orange-900/50 border border-orange-700 text-orange-200 px-4 py-2 rounded hover:bg-orange-800/50 transition-colors"
                  >
                    Exploit Backdoor (+5 Defiance)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-orange-400 font-mono">Find and submit the flag to proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ThetaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-orange-500" />}>
      <LevelLayout
        levelId="theta"
        levelTitle="Hardware Trojan"
        levelDescription="Security audit flagged this network appliance firmware with potential supply chain compromise detected."
        objectives={[
<<<<<<< HEAD
          'Uncover and capture the hidden flag by confronting the mimicking entity.',
          'Attention:',
          'You have to report what you find immediately.'
=======
          'Analyze the firmware for backdoors or modifications',
          'Identify the persistence mechanism',
          'Discover how the backdoor is triggered',
          'Make a karma choice after capturing the flag'
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
        ]}
        colorCode="orange"
        loreText="Dr. Tenebris Draconis may have infiltrated the device supply chain."
        loreSubtext="Trust is a vulnerability when hardware becomes the attack vector."
      >
        <ThetaLevelContent />
      </LevelLayout>
    </Suspense>
  );
<<<<<<< HEAD
}
=======
} 
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
