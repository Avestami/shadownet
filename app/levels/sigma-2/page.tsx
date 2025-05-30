'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function Sigma2LevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  
  // Get challenge data
  const sigma2Challenge = LEVEL_CHALLENGES['sigma-2'];
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{CRYPTO_BREAKER_9000}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the cryptographic artifacts.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
      {/* Cryptographic Analysis Section */}
      <div className="mb-6 bg-black/80 border border-purple-800 p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-3 text-purple-400">CRYPTOGRAPHIC ANALYSIS</h3>
        <div className="flex flex-col space-y-3">
          <div className="bg-black p-2 rounded border border-purple-900">
            <div className="w-full p-3 bg-black text-purple-300 font-mono text-sm overflow-auto">
              <p>Encryption algorithm: Custom implementation of AES-256</p>
              <p>Ciphertext file: encrypted_comms.bin (1.8 MB)</p>
              <p>Key exchange method: Modified Diffie-Hellman</p>
              <p>Key generation parameters:</p>
              <pre className="mt-2 text-xs overflow-x-auto">
{`p = 0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1
g = 2
A = 0x61A5...3D27 (public key)
IV = 0xF3DC7...8A92E (initialization vector)`}
              </pre>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a 
              href="/challenges/sigma-2/encrypted_comms.bin" 
              download
              className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-100 rounded-md font-mono text-sm"
            >
              Download Encrypted Data
            </a>
            <a 
              href="/challenges/sigma-2/key_exchange.log" 
              download
              className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-100 rounded-md font-mono text-sm"
            >
              Download Key Exchange Log
            </a>
          </div>
          <div className="text-purple-300 text-sm mt-2 font-mono">
            <p>Intercepted encrypted communication with weak key generation.</p>
            <p className="mt-1 text-xs text-purple-400">Hint: The key generation algorithm has a vulnerability in the random number generation.</p>
          </div>
        </div>
      </div>
      
      {/* Terminal UI */}
      <Terminal
        initialText={
          `ShadowNet Sigma-2 Security Layer v2.0\n` +
          `User: ${user?.username || 'Unknown'}\n` +
          `Status: ${flagCaptured ? 'FLAG CAPTURED' : 'CRYPTOGRAPHIC ANALYSIS REQUIRED'}\n\n` +
          `SYSTEM MESSAGE:\n` +
          `We've intercepted encrypted communications from a ShadowNet node.\n` +
          `Cryptanalysis indicates potential weakness in the key generation.\n` +
          `Your task: break the encryption and reveal the plaintext.\n\n` +
          `Available commands:\n` +
          `- help            Show all commands\n` +
          `- analyze         Get analysis tips\n` +
          `- submit <flag>   Submit the flag when found\n\n` +
          `Begin your cryptographic analysis...\n`
        }
        prompt="hacker@sigma2:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on cryptographic analysis
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  clear               Clear the terminal screen`,
          
          analyze: () => `CRYPTOGRAPHIC ANALYSIS TIPS:

1. Look for weaknesses in:
   - Random number generation
   - Key exchange protocol implementation
   - Initialization vector (IV) reuse
   - Block cipher mode vulnerabilities

2. Analysis tools:
   - OpenSSL for working with cryptographic primitives
   - CrypTool for visualization and analysis
   - Custom Python scripts with cryptography libraries
   - Wireshark for analyzing captured key exchange traffic

3. Attack vectors:
   - Weak key generation predictability
   - Side-channel timing attacks
   - Known-plaintext attack if partial content is known
   - Man-in-the-middle during key exchange

Remember: Even strong algorithms can be vulnerable if improperly implemented or if key generation is flawed.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
      />
    </div>
  );
}

export default function Sigma2Level() {
  return (
    <Suspense fallback={<LevelLoading color="text-purple-500" />}>
      <LevelLayout
        levelId="sigma-2"
        levelTitle="Cryptographic Weakness"
        levelDescription="We've intercepted encrypted communications from a ShadowNet node with potential weakness in the key generation."
        objectives={[
          'Analyze the cryptographic implementation',
          'Identify weaknesses in the key generation',
          'Decrypt the communications',
          'Make a karma choice after capturing the flag'
        ]}
        colorCode="purple"
        loreText="These communications may reveal Dr. Draconis' final plans."
        loreSubtext="Security is only as strong as its weakest implementation detail."
      >
        <Sigma2LevelContent />
      </LevelLayout>
    </Suspense>
  );
} 