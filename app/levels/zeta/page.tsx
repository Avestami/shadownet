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
    if (user && user.flagsCaptured && user.flagsCaptured.some(flag => 
      flag.includes('SHADOWNET') && flag.includes('TOKEN_FORGED'))) {
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
  const handleTerminalCommand = (command: string, output: string) => {
    console.log("Command received:", command, "Output:", output);
    
    // Convert command to lowercase for case-insensitive comparisons
    const fullCommand = command.toLowerCase();
    
    // Handle downloading docker file
    if (fullCommand === 'download' || fullCommand === 'download-docker') {
      // Provide a link to download the Docker file
      const downloadLink = '/downloads/zeta-docker.zip';
      window.open(downloadLink, '_blank');
      return 'Initiating download of the Docker container file...';
    }
    
    // Handle instructions
    if (fullCommand === 'instructions' || fullCommand === 'help-docker') {
      // Return the Docker instructions
      return fetch('/downloads/zeta-instructions.txt')
        .then(response => response.text())
        .then(instructions => {
          return instructions;
        })
        .catch(error => {
          console.error('Error fetching instructions:', error);
          return 'Error: Could not load instructions. Try using the download command instead.';
        });
    }
    
    // Check if it's a capture command
    if (fullCommand.startsWith('capture')) {
      console.log("Processing capture command. Flag received:", output);
      
      // Extract the flag from the full command
      const parts = fullCommand.split(' ');
      const flag = parts.slice(1).join(' ').toUpperCase();
      
      // Send the flag to the server for validation rather than checking locally
      fetch('/api/capture-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          flagId: flag,
          baseScore: 100,
          levelId: 'zeta'
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to validate flag');
        }
        return response.json();
      })
      .then(data => {
        console.log('Flag validation response:', data);
        
        if (data.success) {
          // Flag is valid - update UI
          if (audioPlayerRef.current) {
            audioPlayerRef.current.playCapture();
          }
          
          triggerGlitch();
          setFlagCaptured(true);
          
          // Update local state and show message
          if (user) {
            const updatedUser = {
              ...user,
              flagsCaptured: [...(user.flagsCaptured || []), flag],
              score: data.score || (user.score || 0) + 100
            };
            
            // Update local state immediately for responsive UI
            setUser(updatedUser);
          }
          
          showStatusMessage(`FLAG CAPTURED! Score +${data.scoreAdded || 100}. Use "mission" to see karma choices.`, 6000);
          
          // Refresh user data
          if (refreshUser) {
            setTimeout(() => {
              refreshUser().then(updatedUser => {
                console.log('User data auto-refreshed after flag capture:', updatedUser);
              });
            }, 500);
          }
          
          return 'Flag captured successfully! Choose your next action.';
        } else if (data.message?.includes('already captured')) {
          showStatusMessage('You have already captured this flag. Type "mission" to view karma choices.', 4000);
          return 'Flag already captured. Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the web application vulnerabilities.';
        }
      })
      .catch(err => {
        console.error('Error validating flag:', err);
        showStatusMessage('Error validating flag. Please try again.', 3000);
        return 'Error validating flag. Please try again.';
      });
      
      return 'Validating flag...'; // Initial response while validation is in progress
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
        }
      } else if (!flagCaptured) {
        return 'You need to capture the flag first before making a karma choice.';
      } else if (karmaChoiceMade) {
        return 'You have already made your karma choice for this level.';
      }
    } else if (fullCommand === 'mission') {
      if (flagCaptured) {
        if (karmaChoiceMade) {
          return 'You have completed this mission and made your karma choice. Proceed to the next level.';
        } else {
          return `Mission complete! Now make your karma choice:
- choose patch    (Fix the vulnerability for the company, more points but no bonus rewards.)
- choose blackmail (Blackmail the company, less points but special access later.)`;
        }
      } else {
        return `Current mission: Exploit vulnerabilities in the admin portal to find the flag.
        
Available commands:
- download        Download the Docker container file for analysis
- instructions    View Docker container setup instructions
- ls              List files in current directory
- cat <filename>  View file contents
- help            Show all commands`;
      }
    } else if (fullCommand.startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts[1].toUpperCase();
        if (flag === 'SHADOWNET{TOKEN_FORGED}') {
          // Handle successful flag submission same as capture
          if (audioPlayerRef.current) {
            audioPlayerRef.current.playCapture();
          }
          
          triggerGlitch();
          setFlagCaptured(true);
          
          // Update user data with score
          if (user) {
            const updatedFlags = [...(user.flagsCaptured || [])];
            if (!updatedFlags.includes(flag)) {
              updatedFlags.push(flag);
              const scoreIncrease = 100;
              
              // Update local state
              setUser({
                ...user,
                flagsCaptured: updatedFlags,
                score: (user.score || 0) + scoreIncrease
              });
              
              showStatusMessage(`FLAG CAPTURED! Score +${scoreIncrease}. Type "mission" for karma choices.`, 6000);
              
              // Save to server
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
              .then(response => response.json())
              .then(data => {
                showStatusMessage(`Your score is now ${data.score}. Type "mission" to view karma choices.`, 5000);
                
                // Refresh user data
                if (refreshUser) {
                  setTimeout(() => refreshUser(), 500);
                }
              })
              .catch(err => {
                console.error('Error saving flag:', err);
                showStatusMessage('Warning: Progress may not have saved properly', 3000);
              });
            } else {
              showStatusMessage('You have already captured this flag. Type "mission" to view karma choices.', 4000);
            }
          }
          
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the web application vulnerabilities.';
        }
      } else {
        return 'Usage: submit <flag>';
      }
    }
    
    return undefined; // Let the Terminal component handle other commands
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
      
      {/* Challenge information */}
      <div className="mt-4 p-4 border border-red-800 bg-black/80 rounded-md text-red-300 text-sm max-w-3xl">
        <h3 className="text-lg text-red-400 font-mono mb-2">MISSION OBJECTIVE</h3>
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-red-400">Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Download and analyze the Docker container</li>
            <li>Exploit JWT vulnerabilities in the admin portal</li>
            <li>Gain unauthorized access and find the flag</li>
          </ul>
        </div>
        
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-red-400">Docker Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Use the <code>download</code> command to get the Docker ZIP file</li>
            <li>Extract the ZIP file on your local machine</li>
            <li>Follow the setup instructions using the <code>instructions</code> command</li>
            <li>Analyze the application's JWT implementation</li>
          </ol>
        </div>
        
        <div className="mb-3">
          <h4 className="font-bold mb-1 text-red-400">Hints:</h4>
          <ul className="list-disc list-inside space-y-1">
            {zetaChallenge.hints.map((hint: string, index: number) => (
              <li key={index}>{hint}</li>
            ))}
            <li>JWT tokens may have weak signing algorithms or predictable secrets</li>
            <li>Look for ways to modify the token's payload without invalidating it</li>
          </ul>
        </div>

        {flagCaptured ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2 text-green-400">FLAG CAPTURED!</h4>
            <p>You&apos;ve successfully exploited the JWT vulnerability.</p>
            
            {!karmaChoiceMade && (
              <div className="mt-4 space-y-3">
                <h4 className="font-bold text-red-400">DECISION POINT:</h4>
                <p>{zetaChallenge.karmaChoices?.[0]?.description || "Choose how to proceed with the discovered vulnerability."}</p>
                
                <div className="flex space-x-4 mt-3">
                  <button 
                    onClick={() => handleKarmaChoice('patch')}
                    className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded hover:bg-red-800/50 transition-colors"
                  >
                    Patch Vulnerability (+5 Mercy)
                  </button>
                  <button 
                    onClick={() => handleKarmaChoice('blackmail')}
                    className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded hover:bg-red-800/50 transition-colors"
                  >
                    Blackmail Company (+5 Defiance)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-red-400 font-mono">Download the Docker container and exploit the JWT vulnerabilities to capture the flag.</p>
            <div className="mt-3 bg-red-900/30 p-3 rounded">
              <p className="text-xs text-red-300">
                <strong>Note:</strong> This challenge requires you to run Docker on your local machine. 
                If you don't have Docker installed, you can get it from <a href="https://www.docker.com/products/docker-desktop" target="_blank" rel="noopener noreferrer" className="underline">docker.com</a>.
              </p>
            </div>
          </div>
        )}
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
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ZETA SECURITY LAYER - Admin Portal Analysis\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'INFILTRATION IN PROGRESS'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `Agent, we've discovered a vulnerable admin portal in the ShadowNet infrastructure.\n` +
          `Your mission is to analyze the Docker container and exploit vulnerabilities in the JWT implementation.\n\n` +
          `Available commands:\n` +
          `- download        Download the Docker container file for analysis\n` +
          `- instructions    View Docker container setup instructions\n` +
          `- ls              List files in current directory\n` +
          `- cat <filename>  View file contents\n` +
          `- help            Show all commands\n` +
          `- capture <flag>  Capture a flag when found\n\n` +
          `Begin your infiltration...\n` +
          (flagCaptured ? 
          `\n========================================\n` +
          `FLAG SUCCESSFULLY CAPTURED!\n` +
          `You have successfully completed the Zeta level.\n` +
          `Make a karma choice with:\n` +
          `- choose patch    (Mercy +5)\n` +
          `- choose blackmail (Defiance +5)\n` +
          `========================================\n` : '')
        }
        prompt="hacker@zeta:~$ "
        onCommandExecuted={handleTerminalCommand}
        levelId="zeta"
      />
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
