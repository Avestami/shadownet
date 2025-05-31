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

function ZetaLevelContent() {
  const { user, setUser, refreshUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Get challenge data
  const zetaChallenge = LEVEL_CHALLENGES.zeta;
  
  // Effect to check if user has already captured the flag
  useEffect(() => {
    console.log('ZETA LEVEL - Checking user state:', user);
    if (user && user.flagsCaptured && user.flagsCaptured.includes('SHADOWNET{TOKEN_FORGED}')) {
      setFlagCaptured(true);
    }
    
    // Check if karma choice was already made for this level
    if (user?.choices && Array.isArray(user.choices)) {
      console.log('ZETA LEVEL - User choices on mount:', user.choices);
      
      const zetaChoices = user.choices.filter(choice => 
        choice.startsWith('zeta_')
      );
      
      if (zetaChoices.length > 0) {
        console.log('ZETA LEVEL - Zeta choices already made:', zetaChoices);
        setKarmaChoiceMade(true);
      }
    }
  }, [user]);
  
  // Function to trigger glitch effect
  const triggerGlitch = () => {
    console.log('ZETA DEBUG - Triggering glitch effect');
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 1500);
  };

  // Function to show status messages
  const showStatusMessage = (msg: string, duration = 5000) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), duration);
  };
  
  // Function to handle terminal commands
<<<<<<< HEAD
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit') || command.toLowerCase().startsWith('capture')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{TOKEN_FORGED}') {
          // Play capture sound
          if (audioPlayerRef.current) {
            audioPlayerRef.current.playCapture();
          }
          
          // Trigger glitch effect for visual feedback
          console.log('ZETA DEBUG - Flag captured, triggering glitch effect');
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
          return 'Incorrect flag. Keep analyzing the web application vulnerabilities.';
        }
      }
    } else if (command.toLowerCase() === 'choose') {
      if (flagCaptured && !karmaChoiceMade) {
        const choiceType = command.split(' ')[1]?.toLowerCase();
        if (choiceType === 'patch' || choiceType === 'blackmail') {
          handleKarmaChoice(choiceType);
        } else {
          showStatusMessage('Invalid choice. Use "choose patch" or "choose blackmail".', 3000);
=======
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
    // Convert command to lowercase for case-insensitive comparisons
    const fullCommand = command.toLowerCase();
    
    // Check if it's a capture command
    if (fullCommand.startsWith('capture')) {
      console.log("Processing capture command. Flag received:", output);
      
      // Use the output parameter which already contains the extracted flag from Terminal component
      // Convert to uppercase for consistent comparison
      const flag = output.toUpperCase();
      
      if (flag === 'SHADOWNET{TOKEN_FORGED}') {
        // Play capture sound
        if (audioPlayerRef.current) {
          audioPlayerRef.current.playCapture();
        }
        
        // Trigger glitch effect for visual feedback
        console.log('ZETA DEBUG - Flag captured, triggering glitch effect');
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
        return 'Incorrect flag. Keep analyzing the web application vulnerabilities.';
      }
    } else if (fullCommand.startsWith('choose')) {
      // Handle choose command
      if (flagCaptured && !karmaChoiceMade) {
        const parts = command.split(' ');
        if (parts.length > 1) {
          const choiceType = parts[1].toLowerCase();
          if (choiceType === 'patch' || choiceType === 'blackmail') {
            handleKarmaChoice(choiceType);
          } else {
            showStatusMessage('Invalid choice. Use "choose patch" or "choose blackmail".', 3000);
          }
        } else {
          showStatusMessage('Please specify a choice: "choose patch" or "choose blackmail".', 3000);
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
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
  const handleKarmaChoice = (choiceType: 'patch' | 'blackmail') => {
    console.log('ZETA LEVEL - handleKarmaChoice called with choice:', choiceType);
    console.log('ZETA LEVEL - Current user state:', user);
    
    if (!user) {
      console.log('ZETA LEVEL - No user data available');
      return;
    }
    
    // Check if user has already made a zeta karma choice
    const choiceId = `zeta_${choiceType}`;
    console.log('ZETA LEVEL - Checking for existing choice:', choiceId);
    console.log('ZETA LEVEL - User choices:', user.choices);
    
    // Check if user has already made any zeta karma choice
    if (user.choices && Array.isArray(user.choices)) {
      const zetaChoices = user.choices.filter(choice => 
        choice.startsWith('zeta_')
      );
      
      if (zetaChoices.length > 0) {
        console.log('ZETA LEVEL - User already made a zeta choice:', zetaChoices);
        showStatusMessage('You have already made a karma choice for this level.', 3000);
        setKarmaChoiceMade(true);
        return;
      }
    }
    
    setKarmaChoiceMade(true);
    
    // Update user karma and score
    const karmaType = choiceType === 'patch' ? 'mercy' : 'defiance';
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
      
      console.log('ZETA LEVEL - Updated user with choice:', updatedUser);
      
      // Update local state immediately for responsive UI
      setUser(updatedUser as any);
      
      // Better server update with error handling
      fetch('/api/user/force-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: `flag_zeta`,
          scoreChange: scoreForKarmaChoice,
          karmaType: karmaType,
          karmaValue: karmaValue,
          choiceId: choiceId
        })
      })
      .then(response => {
        console.log('ZETA LEVEL - API response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to save karma choice');
        }
        return response.json();
      })
      .then(data => {
        console.log('ZETA LEVEL - Karma choice saved successfully:', data);
        showStatusMessage(`Karma choice confirmed: ${karmaType} +${karmaValue}, Total Score: ${data.score}`, 5000);
        
        // Refresh user data to ensure UI is updated
        if (refreshUser) {
          setTimeout(() => {
            console.log('ZETA LEVEL - Refreshing user data after karma choice');
            refreshUser().then(updatedUser => {
              console.log('ZETA LEVEL - User data auto-refreshed after karma choice:', updatedUser);
            });
          }, 500);
        }
      })
      .catch(err => {
        console.error('ZETA LEVEL - Error saving karma choice:', err);
        showStatusMessage('Warning: Karma update may not have saved properly', 3000);
      });
    } catch (error) {
      console.error('Error updating karma:', error);
    }
  };
  
  return (
    <div className={`relative ${glitchEffect ? 'animate-glitch' : ''}`}>
      <GlobalAudioPlayer ref={audioPlayerRef} levelId="zeta" initialVolume={0.5} autoPlay={false} />
      
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
      
      {/* Web Application Section */}
      <div className="mb-6 bg-black/80 border border-red-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-red-400">WEB APPLICATION SECURITY</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-red-900">
            <div className="w-full p-3 bg-black text-red-300 font-mono text-sm">
              <p>Target: ShadowNet Admin Portal (Docker Container)</p>
              <p>Tech Stack: Node.js, Express, MongoDB</p>
              <p>Login Page: http://localhost:9000/admin/login</p>
              <p>API Endpoints: Multiple REST endpoints</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/zeta/admin-portal.zip" 
              download
              className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-100 rounded-md font-mono text-sm"
            >
              Download Docker Environment
            </a>
          </div>
          <div className="text-red-300 text-sm mt-2 font-mono">
            <p>Penetration test required on the admin portal. Multiple vulnerabilities exist.</p>
            <p className="mt-1 text-xs text-red-400">Hint: Try SQL injection on login, test for IDOR, and explore NoSQL injection in API endpoints.</p>
          </div>
        </div>
      </div>
<<<<<<< HEAD
    </div>

  );}
=======
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Zeta Security Layer v1.6\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'WEB APPLICATION ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `We've obtained a copy of ShadowNet's admin portal.\n` +
          `Penetration testing is required to identify vulnerabilities.\n` +
          `Your task: exploit the system and find the admin credentials.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n` +
          `- choose <option> Make a karma choice\n\n` +
          `Begin your web application security testing...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Zeta level.\n` +
          `Use the Level Select button at the top to access other levels.\n` +
          `Make a karma choice first with:\n` +
          `- choose patch    (Fix the vulnerability for the company, more points but no bonus rewards.)\n` +
          `- choose blackmail (Blackmail the company, less points but special access later.)\n` : '')
        }
        onCommandExecuted={handleTerminalCommand}
      />
      
      {flagCaptured && !karmaChoiceMade && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded">
          <h3 className="text-lg font-mono mb-2 text-red-300">MISSION COMPLETE: CHOOSE YOUR PATH</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 bg-black/60 border border-red-800 rounded hover:bg-red-900/20 cursor-pointer"
              onClick={() => handleKarmaChoice('patch')}
            >
              <h4 className="font-mono text-red-300 mb-1">PATCH THE VULNERABILITY</h4>
              <p className="text-sm text-gray-300">Report the vulnerability to the company and help them fix it.</p>
              <p className="text-xs text-red-400 mt-2">+5 Mercy, +5 Score</p>
            </div>
            <div 
              className="p-3 bg-black/60 border border-red-800 rounded hover:bg-red-900/20 cursor-pointer"
              onClick={() => handleKarmaChoice('blackmail')}
            >
              <h4 className="font-mono text-red-300 mb-1">BLACKMAIL THE COMPANY</h4>
              <p className="text-sm text-gray-300">Keep the vulnerability secret and use it for leverage.</p>
              <p className="text-xs text-red-400 mt-2">+5 Defiance, +5 Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ZetaPage() {
  return (
    <LevelLayout
      levelId="zeta"
      levelTitle="Web Intrusion Analysis"
      levelDescription="We've obtained a copy of ShadowNet's admin portal. Penetration testing is required to identify vulnerabilities."
      objectives={[
        'Analyze the web application for security vulnerabilities',
        'Exploit weaknesses in the admin portal',
        'Find and submit the flag hidden in the system',
        'Make a karma choice after capturing the flag'
      ]}
      colorCode="red"
      loreText="The true power of the digital world lies in its vulnerabilities."
      loreSubtext="Every system has a backdoor; you just need to find it."
    >
      <Suspense fallback={<LevelLoading />}>
        <ZetaLevelContent />
      </Suspense>
    </LevelLayout>
  );
}
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
