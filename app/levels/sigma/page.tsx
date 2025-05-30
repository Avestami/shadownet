'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function SigmaLevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  
  // Get challenge data
  const sigmaChallenge = LEVEL_CHALLENGES.sigma;
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{P4CK3T_W1Z4RD}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the network capture.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
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
          `- submit <flag>   Submit the flag when found\n\n` +
          `Begin your network traffic analysis...\n`
        }
        prompt="hacker@sigma:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on analyzing the network capture
  submit <flag>       Submit a flag (format: SHADOWNET{...})
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
      />
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