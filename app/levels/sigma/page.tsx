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

function SigmaLevelContent() {
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Get challenge data
  const sigmaChallenge = LEVEL_CHALLENGES.sigma;
  
  // Effect to check if user has already captured the flag
  useEffect(() => {
    if (user && user.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{DISTRICT_FREEDOM}')) {
      setFlagCaptured(true);
    }
    
    // Check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('SIGMA LEVEL - User choices on mount:', user.choices);
      
      const sigmaChoices = user.choices.filter(choice => 
        choice.startsWith('sigma_')
      );
      
      if (sigmaChoices.length > 0) {
        console.log('SIGMA LEVEL - Sigma choices already made:', sigmaChoices);
        setKarmaChoiceMade(true);
      }
    }
  }, [user]);
  
  // Function to trigger glitch effect
  const triggerGlitch = () => {
    console.log('SIGMA DEBUG - Triggering glitch effect');
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
    console.log('SIGMA DEBUG - Command received:', command);
    
    // First check for exact flag capture command regardless of format
    if (command.toLowerCase().includes('shadownet{district_freedom}')) {
      console.log('SIGMA DEBUG - Flag string found in command!');
      // Extract the flag from the command
      const match = command.match(/SHADOWNET\{DISTRICT_FREEDOM\}/i);
      if (match) {
        const exactFlag = 'SHADOWNET{DISTRICT_FREEDOM}'; // Use the exact casing
        console.log('SIGMA DEBUG - Processing exact flag:', exactFlag);
        processCorrectFlag(exactFlag);
        return 'Flag captured successfully! Choose your next action.';
      }
    }
    
    // Process commands in the format "command arg1 arg2..."
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    
    console.log('SIGMA DEBUG - Command parts:', parts);
    console.log('SIGMA DEBUG - First part (cmd):', cmd);
    
    if (cmd === 'capture' || cmd === 'submit' || 
        command.toLowerCase().startsWith('capture ') || 
        command.toLowerCase().startsWith('submit ')) {
      console.log('SIGMA DEBUG - Capture or submit command detected');
      
      // If the command itself contains "capture" or "submit", extract the flag part
      let flag;
      if (cmd === 'capture' || cmd === 'submit') {
        // Format: capture FLAG or submit FLAG
        flag = parts.slice(1).join(' ');
      } else if (command.toLowerCase().startsWith('capture ')) {
        // Format: "capture FLAG" (from Terminal)
        flag = command.substring('capture '.length);
      } else if (command.toLowerCase().startsWith('submit ')) {
        // Format: "submit FLAG" (from Terminal)
        flag = command.substring('submit '.length);
      }
      
      if (flag) {
        console.log('SIGMA DEBUG - Flag extracted:', flag);
        
        // Check for whitespace issues
        const trimmedFlag = flag.trim();
        console.log('SIGMA DEBUG - Trimmed flag:', trimmedFlag);
        
        // Try case-insensitive comparison
        const caseInsensitiveMatch = trimmedFlag.toUpperCase() === 'SHADOWNET{DISTRICT_FREEDOM}'.toUpperCase();
        console.log('SIGMA DEBUG - Case insensitive match:', caseInsensitiveMatch);
        
        if (trimmedFlag === 'SHADOWNET{DISTRICT_FREEDOM}' || caseInsensitiveMatch) {
          console.log('SIGMA DEBUG - Correct flag detected!');
          processCorrectFlag('SHADOWNET{DISTRICT_FREEDOM}'); // Use the exact casing
          return 'Flag captured successfully! Choose your next action.';
        } else {
          console.log('SIGMA DEBUG - Incorrect flag:', flag);
          return 'Incorrect flag. Keep analyzing the network capture.';
        }
      }
    } else if (cmd === 'choose' || command.toLowerCase().startsWith('choose ')) {
      console.log('SIGMA DEBUG - Choose command detected');
      
      let choice;
      if (cmd === 'choose') {
        // Format: choose OPTION
        choice = parts[1]?.toLowerCase();
      } else if (command.toLowerCase().startsWith('choose ')) {
        // Format: "choose OPTION" (from Terminal)
        choice = command.substring('choose '.length).trim().toLowerCase();
      }
      
      if (choice) {
        console.log('SIGMA DEBUG - Choice extracted:', choice);
        
        if (flagCaptured && !karmaChoiceMade) {
          if (choice === 'expose' || choice === 'monitor') {
            handleKarmaChoice(choice as 'expose' | 'monitor');
          } else {
            showStatusMessage('Invalid choice. Use "choose expose" or "choose monitor".', 3000);
          }
        } else if (!flagCaptured) {
          showStatusMessage('You must capture the flag before making a karma choice.', 3000);
        } else if (karmaChoiceMade) {
          showStatusMessage('You have already made your karma choice. Use the Level Select button at the top or type "next" to continue.', 4000);
        }
      }
    }
    
    // Default return if no condition is met
    return null;
  };
  
  // Helper function to process a correct flag submission
  const processCorrectFlag = (flag: string) => {
    // Play capture sound
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playCapture();
    }
    
    // Trigger glitch effect for visual feedback
    triggerGlitch();
    
    setFlagCaptured(true);
    
    // Update user data
    if (user) {
      console.log('SIGMA DEBUG - User data before update:', user);
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
        
        console.log('SIGMA DEBUG - Updated user data:', updatedUser);
        
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
          console.log('SIGMA DEBUG - API response status:', response.status);
          if (!response.ok) {
            throw new Error('Failed to save flag capture');
          }
          return response.json();
        })
        .then(data => {
          console.log('SIGMA DEBUG - Flag capture saved successfully:', data);
          // Add a message specifically prompting the user to make a karma choice
          showStatusMessage(`Your score is now ${data.score}. Type "mission" to view karma choices.`, 5000);
          
          // Refresh user data to ensure UI is updated
          if (refreshUser) {
            setTimeout(() => {
              console.log('SIGMA DEBUG - Refreshing user data after flag capture');
              refreshUser().then(updatedUser => {
                console.log('SIGMA DEBUG - User data auto-refreshed after flag capture:', updatedUser);
              });
            }, 500);
          }
        })
        .catch(err => {
          console.error('SIGMA DEBUG - Error saving flag:', err);
          showStatusMessage('Warning: Progress may not have saved properly', 3000);
        });
      } else {
        // Flag was already captured
        showStatusMessage('You have already captured this flag. Type "mission" to view karma choices.', 4000);
      }
    }
  };
  
  // Function to handle karma choices
  const handleKarmaChoice = (choiceType: 'expose' | 'monitor') => {
    console.log('SIGMA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('SIGMA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('SIGMA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made a sigma karma choice
    const choiceId = `sigma_${choiceType}`;
    console.log('SIGMA LEVEL - Checking for existing choice:', choiceId);
    console.log('SIGMA LEVEL - User choices:', user.choices);
    
    // Check if user has already made any sigma karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const sigmaChoices = user.choices.filter(choice => 
        choice.startsWith('sigma_')
      );
      
      if (sigmaChoices.length > 0) {
        console.log('SIGMA LEVEL - User already made a sigma choice:', sigmaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    }
    
    setKarmaChoiceMade(true);
    
    // Update user karma and score
    const karmaType = choiceType === 'expose' ? 'defiance' : 'curiosity';
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
      
      console.log('SIGMA LEVEL - Updated user with choice:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_sigma`,
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
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="sigma" initialVolume={0.5} autoPlay={false} />
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-cyan-900/30 border border-cyan-700 rounded text-cyan-300 text-sm font-mono">
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
      
      {/* Network Analysis Section */}
      <div className="mb-6 bg-black/80 border border-cyan-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-cyan-400">NETWORK TRAFFIC ANALYSIS</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-cyan-900">
            <div className="w-full p-3 bg-black text-cyan-300 font-mono text-sm">
              <p>PCAP file: suspicious_traffic.pcap (28.7 MB)</p>
              <p>Capture time: 15 minutes</p>
              <p>Protocol distribution: TCP (78%), UDP (15%), ICMP (4%), Other (3%)</p>
              <p>Notable connections: 18 unique IPs, 12 domains</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/sigma/suspicious_traffic.pcap" 
              download
              className="px-4 py-2 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-100 rounded-md font-mono text-sm"
            >
              Download PCAP File
            </a>
          </div>
          <div className="text-cyan-300 text-sm mt-2 font-mono">
            <p>Anomalous traffic patterns detected. Command and control traffic suspected.</p>
            <p className="mt-1 text-xs text-cyan-400">Hint: Look for unusual DNS queries and analyze HTTP headers for covert data.</p>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Sigma Security Layer v1.4\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'NETWORK ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `Our sensors have intercepted suspicious network traffic.\n` +
          `The pattern suggests a sophisticated exfiltration technique.\n` +
          `Your task: identify the C2 channel and extracted data.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n` +
          `- choose <option> Make a karma choice\n\n` +
          `Begin your network traffic analysis...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Sigma level.\n` +
          `Use the Level Select button at the top to access other levels.\n` +
          `Make a karma choice first with:\n` +
          `- choose expose   (Defiance +5)\n` +
          `- choose monitor  (Curiosity +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@sigma:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on analyzing the network capture
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  choose <option>     Make a karma choice after capturing the flag
  clear               Clear the terminal screen`,
          
          analyze: () => `NETWORK ANALYSIS TIPS:

1. Use Wireshark for packet analysis:
   - Look for unusual traffic patterns
   - Analyze DNS queries for encoded data
   - Examine HTTP headers for hidden information
   - Follow TCP streams for suspicious data transfers

2. Check for these exfiltration techniques:
   - DNS tunneling (data hidden in DNS queries/responses)
   - Steganography in transmitted images
   - Custom protocol implementations over standard ports
   - Timing-based covert channels

3. Forensic tools that might help:
   - Wireshark filters: dns, http, ip.addr==X.X.X.X
   - NetworkMiner for artifact extraction
   - tshark for command-line analysis
   - "strings" command on extracted files

Remember: Advanced adversaries often use legitimate-looking traffic to hide their activities.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
        levelId="sigma"
      />

      {/* Challenge information */}
      <div className="mt-4 p-4 border border-cyan-800 bg-black/80 rounded-md text-cyan-300 text-sm max-w-3xl">
        <h3 className="text-lg text-cyan-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-cyan-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Analyze the network traffic capture file</li>
            <li>Identify the command and control channel</li>
            <li>Discover what data was being exfiltrated</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-bold mb-1 text-cyan-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Examine DNS queries for unusual patterns</li>
            <li>Check HTTP headers for hidden data</li>
            <li>Look for encoded data in seemingly normal traffic</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You've successfully identified the command and control channel.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-cyan-400">DECISION POINT:</h4>
                <p>You've discovered evidence of District 14 oppression. How will you proceed with this information?</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('expose')}
                    className="bg-cyan-900/50 border border-cyan-700 text-cyan-200 px-4 py-2 rounded hover:bg-cyan-800/50 transition-colors"
                  >
                    Expose Evidence (+5 Defiance)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('monitor')}
                    className="bg-cyan-900/50 border border-cyan-700 text-cyan-200 px-4 py-2 rounded hover:bg-cyan-800/50 transition-colors"
                  >
                    Continue Monitoring (+5 Curiosity)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-cyan-400 font-mono">Find and submit the flag to proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SigmaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-cyan-500" />}>
      <LevelLayout
        levelId="sigma"
        levelTitle="Network Shadows"
        levelDescription="Our sensors have intercepted suspicious network traffic with patterns suggesting a sophisticated exfiltration technique."
        objectives={[
          'Analyze the network capture file',
          'Identify the command and control channel',
          'Discover what data was exfiltrated',
          'Make a karma choice after capturing the flag'
        ]}
        colorCode="cyan"
        loreText="These traffic patterns match those observed in other Draconis operations."
        loreSubtext="The network never lies, but it can be forced to speak in riddles."
      >
        <SigmaLevelContent />
      </LevelLayout>
    </Suspense>
  );
} 