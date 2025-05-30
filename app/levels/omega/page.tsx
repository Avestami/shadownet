'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function OmegaLevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  
  // Get challenge data
  const omegaChallenge = LEVEL_CHALLENGES.omega;
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{FINAL_ASCENSION}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! You have reached the final level of ShadowNet. Make your ultimate choice.';
        } else {
          return 'Incorrect flag. The path to enlightenment requires all your accumulated knowledge.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
      {/* Final Challenge Section */}
      <div className="mb-6 bg-black/80 border border-green-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-green-400">THE CONVERGENCE</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-green-900">
            <div className="w-full p-3 bg-black text-green-300 font-mono text-sm overflow-auto">
              <p>Final Challenge: The Convergence</p>
              <p>Security Level: Maximum</p>
              <p>Challenge Type: Multi-disciplinary</p>
              <p>Success Rate: 0.1%</p>
              <div className="mt-3 text-red-400">
                WARNING: This challenge requires techniques from all previous levels.
              </div>
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
          `All your skills, choices, and karma have led to this moment.\n` +
          `Your task: Decode the ultimate truth about ShadowNet.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis guidance\n` +
          `- submit <flag>   Submit the final flag\n\n` +
          `Begin the final challenge...\n`
        }
        prompt="hacker@omega:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get guidance on the final challenge
  karma               Display your current karma alignment
  submit <flag>       Submit the final flag (format: SHADOWNET{...})
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
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{M3M0RY_DUMP_1337}') ? 'YES' : 'NO'}

Sigma Level: Network Shadows
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{P4CK3T_W1Z4RD}') ? 'YES' : 'NO'}

Theta Level: Hardware Trojan
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{FIRMWARE_BACKDOOR_X23}') ? 'YES' : 'NO'}

Zeta Level: Web Intrusion
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{VULN_HUNTER_PRO}') ? 'YES' : 'NO'}

Sigma-2 Level: Cryptographic Weakness
  - Completed: ${user?.flagsCaptured?.includes('SHADOWNET{CRYPTO_BREAKER_9000}') ? 'YES' : 'NO'}

Omega Level: The Convergence
  - Status: ${flagCaptured ? 'COMPLETED' : 'IN PROGRESS'}`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
      />
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