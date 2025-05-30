'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useUser } from '../../context/UserProvider';
import Terminal from '../../components/Terminal';
import LevelLayout from '../../components/LevelLayout';
import LevelLoading from '../../components/LevelLoading';
import { LEVEL_CHALLENGES } from '../../../lib/levels';

function ZetaLevelContent() {
  const { user, setUser } = useUser();
  const [flagCaptured, setFlagCaptured] = useState(false);
  const [karmaChoiceMade, setKarmaChoiceMade] = useState(false);
  
  // Get challenge data
  const zetaChallenge = LEVEL_CHALLENGES.zeta;
  
  // Function to handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (command.toLowerCase().startsWith('submit')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const flag = parts.slice(1).join(' ');
        
        if (flag === 'SHADOWNET{VULN_HUNTER_PRO}') {
          setFlagCaptured(true);
          return 'Flag captured successfully! Choose your next action.';
        } else {
          return 'Incorrect flag. Keep analyzing the web application vulnerabilities.';
        }
      }
    }
    return null;
  };
  
  return (
    <div className="relative">
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
          `- submit <flag>   Submit the flag when found\n\n` +
          `Begin your web application security testing...\n`
        }
        prompt="hacker@zeta:~$ "
        commands={{
          help: () => `Available commands:
  analyze             Get tips on web application testing
  submit <flag>       Submit a flag (format: SHADOWNET{...})
  clear               Clear the terminal screen`,
          
          analyze: () => `WEB APPLICATION SECURITY TIPS:

1. Test for these common vulnerabilities:
   - SQL Injection (SQLi)
   - Cross-Site Scripting (XSS)
   - Insecure Direct Object References (IDOR)
   - Cross-Site Request Forgery (CSRF)
   - NoSQL Injection
   - Authentication bypasses

2. Web application testing tools:
   - Burp Suite for intercepting and modifying requests
   - OWASP ZAP for automated scanning
   - SQLmap for database injection testing
   - Developer tools in your browser

3. Testing methodology:
   - Map the application (find all endpoints)
   - Identify input points
   - Test authentication mechanisms
   - Check authorization controls
   - Test all input fields for injection

Remember: Always document your findings and the steps to reproduce vulnerabilities.`,
          
          clear: () => ''
        }}
        onCommandExecuted={handleTerminalCommand}
      />
    </div>
  );
}

export default function ZetaLevel() {
  return (
    <Suspense fallback={<LevelLoading color="text-red-500" />}>
      <LevelLayout
        levelId="zeta"
        levelTitle="Web Intrusion"
        levelDescription="We've obtained a copy of ShadowNet's admin portal. Penetration testing is required to identify vulnerabilities."
        objectives={[
          'Deploy the Docker container with the vulnerable web application',
          'Identify and exploit vulnerabilities in the admin portal',
          'Gain administrative access and find the flag',
          'Make a karma choice after capturing the flag'
        ]}
        colorCode="red"
        loreText="This admin portal may contain clues about Dr. Draconis' next move."
        loreSubtext="Web applications are often the weakest link in the security chain."
      >
        <ZetaLevelContent />
      </LevelLayout>
    </Suspense>
  );
} 