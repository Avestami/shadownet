'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function GammaLevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  const imageRef = useRef(null);
  
  // Get challenge data
  const gammaChallenge = LEVEL_CHALLENGES.gamma;
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{S3CR3T_D34TH}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the image file.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
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
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n\n` +
          `Begin your steganographic analysis...\n`
        }
        prompt="hacker@gamma:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on analyzing the image file
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  clear               Clear the terminal screen`,
          
          analyze: () => `IMAGE ANALYSIS TIPS:

1. The image contains data hidden using steganography techniques:
   - Check each color channel (Red, Green, Blue) separately
   - Look for patterns in the least significant bits (LSB)
   - Consider using steganography tools like StegSolve or similar

2. Try these analysis techniques:
   - Color channel isolation and manipulation
   - LSB extraction
   - Metadata analysis
   - Bit-plane visualization

3. Tools that might help:
   - StegSolve (Java-based tool)
   - Stegdetect
   - Image editors with channel separation

Remember: Steganography hides data within the structure of files.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
      />
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
