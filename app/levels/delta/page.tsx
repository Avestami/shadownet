'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function DeltaLevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  
  // Get challenge data
  const deltaChallenge = LEVEL_CHALLENGES.delta;
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{M3M0RY_DUMP_1337}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the memory dump.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
      {/* Memory Analysis Section */}
      <div className="mb-6 bg-black/80 border border-purple-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-purple-400">MEMORY FORENSICS</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-purple-900">
            <div className="w-full p-3 bg-black text-purple-300 font-mono text-sm">
              <p>Memory dump file: shadownet_dump.raw (2.3 GB)</p>
              <p>OS: Windows 10 x64</p>
              <p>Profile: Win10x64_19041</p>
              <p>Acquisition timestamp: 2023-06-15 03:42:19 UTC</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/delta/shadownet_dump.raw" 
              download
              className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-100 rounded-md font-mono text-sm"
            >
              Download Memory Dump
            </a>
          </div>
          <div className="text-purple-300 text-sm mt-2 font-mono">
            <p>Memory dump contains evidence of system compromise.</p>
            <p className="mt-1 text-xs text-purple-400">Hint: Look for unusual processes, network connections, and suspicious strings.</p>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Delta Security Layer v1.3\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'MEMORY ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `ShadowNet detected an anomalous breach event.\n` +
          `We've acquired a memory dump from the compromised system.\n` +
          `Your task: identify the breach method and exfiltration channel.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n\n` +
          `Begin your memory forensics analysis...\n`
        }
        prompt="hacker@delta:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on analyzing the memory dump
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  clear               Clear the terminal screen`,
          
          analyze: () => `MEMORY FORENSICS TIPS:

1. Use Volatility for memory analysis:
   - volatility -f shadownet_dump.raw --profile=Win10x64_19041 pslist
   - volatility -f shadownet_dump.raw --profile=Win10x64_19041 netscan
   - volatility -f shadownet_dump.raw --profile=Win10x64_19041 filescan

2. Look for suspicious indicators:
   - Unusual processes or process relationships
   - Suspicious network connections
   - Injected code or hidden DLLs
   - Encrypted strings or Base64 encoded data

3. Check for specific artifacts:
   - Command history in command prompt/PowerShell
   - Clipboard contents
   - Browser history and cached data
   - Recently executed programs

Remember: Attackers often try to hide their tracks by using legitimate system processes.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
      />
    </div>
  );
}

export default function DeltaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-purple-500" />}>
      <LevelLayout
        levelId="delta"
        levelTitle="Memory Residue"
        levelDescription="ShadowNet detected an anomalous breach event. We've acquired a memory dump from the compromised system."
        objectives={[
          'Analyze the memory dump for evidence of compromise',
          'Identify the attack vector and exfiltration method',
          'Find the flag hidden in memory artifacts',
          'Make a karma choice after capturing the flag'
        ]}
        colorCode="purple"
        loreText="This breach may be connected to Dr. Tenebris Draconis' operations."
        loreSubtext="Memory never truly forgets; it just reorganizes the truth."
      >
        <DeltaLevelContent />
      </LevelLayout>
    </Suspense>
  );
} 