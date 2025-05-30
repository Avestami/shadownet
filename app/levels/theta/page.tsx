'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function ThetaLevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  
  // Get challenge data
  const thetaChallenge = LEVEL_CHALLENGES.theta;
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{FIRMWARE_BACKDOOR_X23}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the firmware image.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
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
          `Security audit flagged this network appliance firmware.\n` +
          `Potential supply chain compromise detected.\n` +
          `Your task: locate the backdoor mechanism and extraction method.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n\n` +
          `Begin your firmware analysis...\n`
        }
        prompt="hacker@theta:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on analyzing the firmware
  submit <flag>       Submit a flag (format: SHADOWNET{...})
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
      />
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
          'Analyze the firmware for backdoors or modifications',
          'Identify the persistence mechanism',
          'Discover how the backdoor is triggered',
          'Make a karma choice after capturing the flag'
        ]}
        colorCode="orange"
        loreText="Dr. Tenebris Draconis may have infiltrated the device supply chain."
        loreSubtext="Trust is a vulnerability when hardware becomes the attack vector."
      >
        <ThetaLevelContent />
      </LevelLayout>
    </Suspense>
  );
} 