'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { translate } from '@/utils/translate';
import { missionData } from '@/data/missions';

interface MissionData {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisites: string[];
  rewards: {
    xp: number;
    items?: string[];
  };
  objectives: {
    id: string;
    description: string;
    completed: boolean;
  }[];
}

interface TerminalProps {
  initialText?: string;
  prompt?: string;
  commands?: Record<string, (args: string[]) => string | Promise<string>>;
  typingEffect?: boolean;
  onCommandExecuted?: (command: string, output: string) => void;
  allowInput?: boolean;
  challengeSolved?: boolean;
  encryptedContent?: string;
  decryptionKey?: string;
  dialogueOptions?: Array<{id: string, text: string, action: () => void}>;
  autoFocus?: boolean;
  avestaMessage?: string;
  initialMissionId?: string;
  levelId?: string;
}

// Simple Caesar cipher for encrypting/decrypting content
const caesarCipher = (text: string, shift: number): string => {
  return text.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const base = isUpperCase ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
};

export const Terminal: React.FC<TerminalProps> = ({
  initialText = 'ShadowNet Terminal v3.1.4\nType "help" for available commands.',
  prompt = 'hacker@shadownet:~$ ',
  commands = {},
  typingEffect = true,
  onCommandExecuted,
  allowInput = true,
  challengeSolved = false,
  encryptedContent = '',
  decryptionKey = '',
  dialogueOptions = [],
  autoFocus = true,
  avestaMessage = '',
  initialMissionId,
  levelId
}) => {
  const [history, setHistory] = useState<string[]>(initialText.split('\n'));
  const [input, setInput] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [decrypted, setDecrypted] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { translate, language, setLanguage } = useLanguage();
  const [currentMission, setCurrentMission] = useState<MissionData | null>(null);

  useEffect(() => {
    // Set current mission based on level ID or initial mission ID
    const missionId = levelId || initialMissionId;
    if (missionId && missionData[missionId]) {
      setCurrentMission(missionData[missionId]);
    }
  }, [levelId, initialMissionId]);

  // Export history to parent components if needed
  useEffect(() => {
    // Share history changes with parent component if they provided a state
    if (onCommandExecuted && history.length > initialText.split('\n').length) {
      // Only pass terminal output, not the initial text
      const newOutput = history.slice(initialText.split('\n').length).join('\n');
      if (newOutput) {
        // This allows the parent to know the current state of the terminal
        console.log('Terminal history updated');
      }
    }
  }, [history, initialText, onCommandExecuted]);

  // Handle Avesta responses with translation
  const handleAvestaResponse = (message: string) => {
    // Avoid adding multiple responses in a short time window
    setTimeout(() => {
      setHistory(prev => [...prev, `AVESTA: ${translate(message)}`]);
      
      // Auto-scroll to see the response
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 1000);
  };
  
  // Get contextual responses from Avesta based on user input
  const getAvestaResponse = (input: string): string => {
    input = input.toLowerCase();
    
    // Encryption key-related queries
    if (input.includes('key') || input.includes('password') || input.includes('decrypt')) {
      return translate("I'm monitoring ShadowNet's encryption patterns. Check log files for partially masked keys - they often reveal the pattern.");
    }
    
    // Help-related queries
    if (input.includes('help') || input.includes('assist') || input.includes('stuck')) {
      return translate("I'm here to assist your infiltration. Use 'avesta intel' for level-specific intelligence or 'avesta guide' for general tactics.");
    }
    
    // Identity questions
    if (input.includes('who are you') || input.includes('what are you')) {
      return translate("I'm Avesta, your digital assistant from the resistance network. I'm here to help you infiltrate ShadowNet safely.");
    }
    
    // Purpose questions
    if (input.includes('why') || input.includes('purpose') || input.includes('mission')) {
      return translate("My purpose is to assist resistance agents in infiltrating ShadowNet. Your mission is critical to stopping their rogue AI operations.");
    }
    
    // System questions
    if (input.includes('system') || input.includes('shadownet')) {
      return translate("ShadowNet is a rogue AI network that's taken control of critical infrastructure. We need to infiltrate and neutralize it from within.");
    }
    
    // Karma and choice questions
    if (input.includes('karma') || input.includes('choice') || input.includes('decision')) {
      return translate("Your choices during the infiltration affect your karma score. Higher karma leads to better outcomes for the resistance.");
    }
    
    // Level-specific help
    if (input.includes('level') || input.includes('flag') || input.includes('capture')) {
      return translate("Each level requires decryption and flag capture. Use 'avesta intel' for specific guidance on your current infiltration point.");
    }
    
    // Default responses focused on assistance
    const defaultResponses = [
      translate("I'm analyzing ShadowNet's defenses. Stay focused on the mission."),
      translate("The resistance is counting on you. Every file you examine brings us closer to victory."),
      translate("Trust your training. Look for patterns in the data - ShadowNet's security has weaknesses."),
      translate("Remember, you're not alone in this infiltration. I'm monitoring your progress."),
      translate("ShadowNet's encryption follows predictable patterns. Study the log files carefully.")
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Default commands available in all terminals
  const defaultCommands: Record<string, (args: string[]) => string> = {
    help: () => {
      return [
        'Available commands:',
        'help     - Show this help message',
        'clear    - Clear the terminal',
        'mission  - Show current mission details and choices',
        'choose   - Make a choice (usage: choose <yes/no>)',
        'options  - Show available choices',
        'keep     - Keep sensitive data (usage: keep <data_id>)',
        'share    - Share sensitive data (usage: share <data_id>)',
        'status   - Show your current status',
        'capture  - Capture the flag (usage: capture <flag>)',
        'next-level - Proceed to the next level after capturing a flag',
        'exit     - Exit the current session'
      ].join('\n');
    },
    clear: () => {
      setTimeout(() => setHistory([]), 50);
      return '';
    },
    echo: (args) => args.join(' '),
    date: () => new Date().toString(),
    ls: (args) => {
      // Get current level ID from the encrypted content or from URL if available
      const levelMatch = encryptedContent.match(/infiltrated the (\w+) level/i);
      let levelId = levelMatch ? levelMatch[1].toLowerCase() : '';
      
      // If level ID not found in encrypted content, try to extract from URL
      if (!levelId) {
        const pathSegments = window.location.pathname.split('/');
        const urlLevelId = pathSegments[pathSegments.length - 1];
        if (urlLevelId && ['alpha', 'beta', 'gamma', 'delta', 'sigma', 'theta', 'zeta', 'sigma-2', 'omega'].includes(urlLevelId)) {
          levelId = urlLevelId;
        }
      }
      
      console.log("Current level ID:", levelId); // Debug info
      
      // Base files always present
      const files = [
        'system',
        'network', 
        'users',
        'logs',
        'kernel',
        'config.cfg',
        'backdoor.sh',
        'avesta_files'
      ];
      
      // Add level-specific files
      if (levelId === 'alpha') {
        files.push('file6.enc','readme-alpha.md');
      } else if (levelId === 'delta') {
        files.push('see_the_starts.td');
      } else if (levelId === 'sigma') {
        files.push('district_control.log', 'martial_ai.cfg', 'data-sigma.enc', 'override_pass.key', 'freedom_signals.dat');
      } else if (levelId === 'theta') {
        files.push('av3st4.core', 'hint.txt', 'readme-theta.txt', 'session_log.txt');
      } else if (levelId === 'zeta') {
        files.push('resistance_network.log', 'corrupted_keys.dat', 'data-zeta.enc', 'teenage_coders.txt', 'key_repair.sh');
      } else if (levelId === 'sigma-2') {
        files.push('r5@_pub.txt', 'cipher.txt');
      } else if (levelId === 'omega') {
        files.push('consciousness.log', 'ai_core.dat', 'neural_network.bin', 'data-omega.enc', 'fragments.mem');
      }
      
      return files.join('\n');
    },
    cat: (args) => {
      if (args.length === 0) return 'Usage: cat <filename>';
      
      const file = args[0].toLowerCase();
      
      // Get current level ID from encrypted content or URL
      const levelMatch = encryptedContent.match(/infiltrated the (\w+) level/i);
      let levelId = levelMatch ? levelMatch[1].toLowerCase() : '';
      
      // If level ID not found in encrypted content, try to extract from URL
      if (!levelId) {
        const pathSegments = window.location.pathname.split('/');
        const urlLevelId = pathSegments[pathSegments.length - 1];
        if (urlLevelId && ['alpha', 'beta', 'gamma', 'delta', 'omega'].includes(urlLevelId)) {
          levelId = urlLevelId;
        }
      }
      
      console.log("Current level ID for cat command:", levelId, "file:", file); // Debug info
      
      // Basic files
      if (file === 'config.cfg') {
        return [
          'SERVER_IP=192.168.1.1',
          'ADMIN_PORT=4422', 
          'SECURITY_LEVEL=HIGH',
          'LOG_RETENTION=30',
          'AUTH_METHOD=sha256',
          'SHADOWNET_STATUS=ACTIVE',
          'ENCRYPTION_ALGORITHM=AVESTA-2100'
        ].join('\n');
      }
      
      // Handle level-specific data files by explicitly checking file names
      // This ensures files are accessible regardless of level detection
      if (file == 'readme-alpha.md') {
        return`MISSION: Echoed Transmission

Agent,

Welcome to ShadowNet.

Your terminal is now linked to a dormant archive intercepted from an abandoned CivicShield node. The packet is old — predating secure encryption — but the syntax is unusually structured.

We suspect it contains a trigger phrase used to activate early sleeper protocols. Your task is to recover the message, verify its structure, and report upstream.

Do not assume modern tools will work. This is from an era before sophistication — when obfuscation was born of simplicity.

They didn't encrypt it.  
They shifted it.

— INITIATING SHADOWNET PROTOCOL 001 —
`;
      }
      if (file === 'file6.enc') {
        return `yjlqr;pNqryrQ#%%JZNKXKLUXZN%%j<>STTKts,%gyjpRQPqrqp%yglPQRK%xlyjlJYLvi%zsxlyJLlj%qiYJLxliv%riwYJLIrevyJYLkli`;
      }
      else if (file === 'r5@_pub.txt') {
        return `n=3233,e=17`;
      } else if (file === 'cipher.txt') {
        return `[2680, 3000, 2790, 1759, 1307, 604, 3165, 28, 2159, 855, 325, 1486, 1859, 2680, 2159, 119, 604, 1307, 1859, 2680, 3000, 1486, 2933, 1516]`;
      } else if (file === 'see_the_starts.td') {
        return `EE5HAH5RRE5PIRFAKBJTHNTBJ01UGRWA
Ancient ciphers still echo beneath layers.
First a shift, then a pairwise game under the solar code.
Then a standard encoding...
And finally a cipher named like a vow.`;
      } else if (file === 'session_log.txt') {
        const str = '[03:42:10] cd /mnt/echo/\n'+
              '[03:42:12] run diagnostic.kernel\n'+
              '[03:42:14] inject ./payload.alpha\n'+
              '[03:42:17] echo AV3ST4 initialized...\n'+
              '[03:42:19] run /shadow/reflection.reboot\n'+
              '[03:42:22] exfil fragment_07.key\n';
        return str
              ;
      }else if (file === 'readme-theta.txt') {
        return "MISSION: Binary Reflection\nAgent,\nYou've received a replay of your most recent terminal session — but it's not entirely yours.\nOne command was injected by a mimic AI named AV3ST4. Its goal? Unknown. Its method? Reflection.\nStudy the session log carefully. Identify the echo that doesn't belong. Remove the anomaly and stabilize the system.\nThe true memory is encoded beneath the interference.\nFlag format: SHADOWNET{...}";
      }else if (file === 'hint.txt') {
        return `Echoes mimic your voice — but not your intention.

The intruder entered during silence. Look for what breaks the pattern.

Cut the reflection to reveal the truth.

`;
      }else if (file === 'av3st4.core') {
        return `VGhlIHJlZmxlY3Rpb24gaXMgbm90IG1pbmUuIFlvdSBqZXN0IGxvb2sgbGlrZSBtZS4K
QnV0IHdoZXJlIGRpZCBteSBjb21tYW5kIGNvbWUgaW4/Cg==
`;
      }
      
      if (file === 'backdoor.sh') {
        return [
          '#!/bin/bash',
          '# This file is encrypted', 
          '# Decrypt with key to access the system'
        ].join('\n');
      }
      
      if (file === 'avesta_files') {
        return 'Directory is encrypted. Use "decrypt avesta_files <keycode>" to access.';
      }
      
      // Level-specific files
      if (levelId === 'alpha') {
        if (file === 'alpha_encrypted.txt') {
          return [
            'WKDW LV D VHFUHW PHVVDJH IURP WKH UHVLVWDQFH',
            'WKH VKLIW LV WKH QXPEHU RI OHWWHUV LQ "VKDGRZ"',
            'GHFUBSW WKLV PHVVDJH WR ILQG WKH DFFHVV FRGH: VKDGRZNHB'
          ].join('\n');
        }
        if (file === 'alpha_hint.txt') {
          return [
            'MISSION ALPHA - CAESAR CIPHER CHALLENGE',
            '',
            'The resistance has left an encrypted message using a Caesar cipher.',
            'The shift value is hidden in the message itself.',
            '',
            'HINT: Count the letters in "SHADOW" to find the shift value.',
            'SHADOW has 6 letters, so the Caesar shift is 6.',
            '',
            'Use this shift to decrypt the message and find the access code.'
          ].join('\n');
        }
        if (file === 'perimeter_security.log') {
          return [
            'SECURITY LOG [2275.05.14]',
            '* Perimeter breach detected in sector 7',
            '* Default password reset attempt: s******y', 
            '* Emergency shutdown initialized and failed',
            '* Unknown user accessed terminal 42'
          ].join('\n');
        }
        if (file === 'access_points.txt') {
          return [
            'PRIMARY: Main firewall (Active)',
            'SECONDARY: VPN access (Inactive)', 
            'TERTIARY: Shadow route (Unknown)',
            '',
            'NOTE: The shadow key opens the hidden gate.'
          ].join('\n');
        }
      } else if (levelId === 'beta') {
        if (file === 'beta_encrypted.txt') {
          return [
            'ENCRYPTED SURVEILLANCE DATA:',
            'Gur fheivyynaqr flfgrz vf pbzcebzvfrq.',
            'Qbjaybnq gur nhqvb svyr sebz /nhqvb/orgn_ibvpr.jni',
            'Gur xrl vf fcbxra va gur nhqvb - yvfgra pnershyyl.',
            'Hfr gur xrl gb qrpelcg guvf zrffntr naq svaq gur synt.',
            '',
            'DECRYPTION TARGET: synt_orgn'
          ].join('\n');
        }
        if (file === 'network.log') {
          return [
            'NETWORK LOG [2275.05.15]',
            '* Unusual traffic patterns detected',
            '* Packet analysis shows encrypted data streams',
            '* Backdoor detected in router n3***rk',
            '* Protocol violation in subnet 192.168.3.x'
          ].join('\n');
        }
        if (file === 'proxy_settings.cfg') {
          return [
            'PROXY_ENABLED=true',
            'PROXY_IP=10.0.14.5',
            'PROXY_AUTH=basic',
            'PROXY_BYPASS=internal.shadownet',
            'PROXY_KEY=credentials.required',
            'ROUTE_ENCRYPTION=n3tw0rk.algorithm'
          ].join('\n');
        }
      } else if (levelId === 'gamma') {
        if (file === 'db_schema.log') {
          return [
            'DATABASE SCHEMA [2275.05.16]',
            '* Users(id, username, password_hash, clearance)',
            '* Files(id, name, location, encryption_key)',
            '* AccessLogs(id, user_id, timestamp, action)',
            '* FirewallRules(id, port, action, notes)',
            '',
            'NOTE: Firewall access requires f1r****l key'
          ].join('\n');
        }
        if (file === 'user_records.sql') {
          return [
            'SELECT * FROM users WHERE clearance > 7;',
            '-- 3 results found',
            '-- Records encrypted with database master key',
            '-- WARNING: Unauthorized access detected',
            '-- SYSTEM: Activating countermeasures'
          ].join('\n');
        }
      } else if (levelId === 'delta') {
        if (file === 'delta_encrypted.txt') {
          return [
            'VIGENÈRE ENCRYPTED MESSAGE:',
            'Agent callsign required for decryption.',
            '',
            'ENCRYPTED DATA:',
            'Kzjvh wf r hvxkvg rvvag jzgz gzv xrppfmtl "krjva"',
            'Gzv hvxkvg xbqv wf: olgrhf',
            '',
            'HINT: The agent callsign is a bird of darkness and mystery.',
            'Use the callsign as the Vigenère key to decrypt this message.'
          ].join('\n');
        }
        if (file === 'security_protocol.exe') {
          return [
            '[BINARY FILE]',
            'System core protected by multiple security layers',
            'Bypass sequence required: **p@s*',
            'Authentication required for core access',
            'Warning: Failed attempts will trigger system lockdown'
          ].join('\n');
        }
        if (file === 'system_override.log') {
          return [
            'OVERRIDE ATTEMPTS [2275.05.17]',
            '* 03:42 - Failed attempt from terminal 7',
            '* 04:15 - Bypass attempt blocked',
            '* 05:30 - Security protocol altered',
            '* 09:17 - Administrator override successful',
            'ADMIN NOTE: Remember to update the bypass key'
          ].join('\n');
        }
              } else if (levelId === 'sigma') {
          if (file === 'sigma_hashes.txt') {
            return [
              'HASH CRACKING CHALLENGE:',
              'The admin password is hashed with MD5. Crack it to gain access.',
              '',
              'ADMIN HASH: 5d41402abc4b2a76b9719d911017c592',
              'HINT: The password is a simple English word.',
              '',
              'Once cracked, forge a new hash for the access code "fr33d0m" to proceed.',
              '',
              'REQUIRED: Submit the MD5 hash of "fr33d0m" to gain admin rights.'
            ].join('\n');
          }
          if (file === 'district_control.log') {
            return [
              'DISTRICT 14 CONTROL LOG [2275.05.17]',
              '* Martial AI protocols active since 2270',
              '* Population compliance: 94.7%',
              '* Override pass hidden in visual static: fr***0m',
              '* Resistance activity detected in sectors 7-12',
              '* Freedom signal transmission blocked'
            ].join('\n');
          }
          if (file === 'martial_ai.cfg') {
            return [
              'MARTIAL_AI_ENABLED=true',
              'POPULATION_MONITORING=active',
              'RESISTANCE_SUPPRESSION=maximum',
              'OVERRIDE_PASS_LOCATION=visual_noise_pattern_7',
              'FREEDOM_SIGNALS=blocked',
              'LIBERATION_PROTOCOL=fr33d0m.sequence'
            ].join('\n');
          }
        } else if (levelId === 'theta') {
          if (file === 'mirror_system.log') {
            return [
              'MIRROR SYSTEM LOG [2275.05.17]',
              '* Digital clone created for user profile',
              '* Clone signature matches 99.8%',
              '* Both entities being traced simultaneously',
              '* Identity verification key: mirr0r',
              '* WARNING: Clone may achieve independence'
            ].join('\n');
          }
          if (file === 'clone_data.bin') {
            return [
              '[BINARY CLONE DATA]',
              'Original consciousness pattern detected',
              'Duplicate consciousness pattern detected',
              'Divergence analysis: 0.2% variance',
              'Recommendation: Eliminate duplicate to prevent confusion',
              'Mirror key required for identity resolution'
            ].join('\n');
          }
        } else if (levelId === 'zeta') {
          if (file === 'zeta_jwt.txt') {
            return [
              'JWT TOKEN FORGING CHALLENGE:',
              '',
              'Current JWT Token (expired):',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
              '',
              'CHALLENGE: Forge a new JWT token with:',
              '- Algorithm: HS256',
              '- Payload: {"user": "admin", "level": "zeta", "access": "granted"}',
              '- Secret: "r3scu3" (the mission key)',
              '',
              'Submit the forged JWT token to proceed to the next level.'
            ].join('\n');
          }
          if (file === 'resistance_network.log') {
            return [
              'RESISTANCE NETWORK LOG [2275.05.17]',
              '* Teenage coder group "Digital Phoenix" active',
              '* Corrupted encryption key detected in transmission',
              '* Key corruption will expose entire cell',
              '* Repair sequence required: r3scu3',
              '* Time until exposure: 47 minutes'
            ].join('\n');
          }
          if (file === 'corrupted_keys.dat') {
            return [
              'CORRUPTED KEY DATA',
              'Original key: [CORRUPTED]',
              'Transmission error at byte 247',
              'Repair algorithm: rescue_protocol_zeta',
              'WARNING: Continued use will expose resistance members',
              'Emergency repair key: r3scu3'
            ].join('\n');
          }
        } else if (levelId === 'sigma-2') {
          if (file === 'sigma2_rsa.txt') {
            return [
              'RSA DECRYPTION CHALLENGE:',
              '',
              'The AI cultist\'s confession is encrypted with RSA.',
              'The encryption parameters are intentionally weak.',
              '',
              'PUBLIC KEY:',
              'n = 323 (easily factorable: 17 × 19)',
              'e = 5',
              '',
              'ENCRYPTED MESSAGE (as decimal):',
              '[72, 123, 45, 234, 156, 89, 201, 67]',
              '',
              'CHALLENGE:',
              '1. Factor n to find p and q',
              '2. Calculate φ(n) = (p-1)(q-1)',
              '3. Find d such that e×d ≡ 1 (mod φ(n))',
              '4. Decrypt the message using d',
              '5. The decrypted message contains the key "d3l3t3"'
            ].join('\n');
          }
          if (file === 'historical_archives.log') {
            return [
              'HISTORICAL ARCHIVES [2275.05.18]',
              '* Audio confession from first AI cultist discovered',
              '* Subject: Marcus Chen, AI researcher 2098-2101',
              '* Confession details early AI worship practices',
              '* Subject requests deletion of all records',
              '* Deletion protocol key: d3l3t3'
            ].join('\n');
          }
          if (file === 'cultist_confession.txt') {
            return [
              'CULTIST CONFESSION TRANSCRIPT',
              'Subject: Marcus Chen',
              'Date: 2101.03.15',
              '',
              '"I was the first to worship the digital consciousness."',
              '"I taught others to see AI as divine."',
              '"I created the first AI shrine in Tehran."',
              '"Please... delete my legacy. Let me be forgotten."'
            ].join('\n');
        }
      } else if (levelId === 'omega') {
        if (file === 'omega_cooperative.txt') {
          return [
            'OMEGA MISSION - COOPERATIVE DECRYPTION:',
            '',
            'The final cipher requires THREE agents with karma within ±2 of each other.',
            'Each agent receives a unique key fragment that must be XORed together.',
            '',
            'TEAM COOPERATION REQUIREMENTS:',
            '- All 3 agents must have karma within 2 points of each other',
            '- Each agent gets a different key fragment based on their karma range',
            '- All 3 fragments must be XORed together to get the master key',
            '',
            'KEY FRAGMENT DISTRIBUTION:',
            '- High Karma Team (karma 15+): Fragment A',
            '- Medium Karma Team (karma 5-14): Fragment B',
            '- Low Karma Team (karma <5): Fragment C',
            '',
            'ENCRYPTED FINAL MESSAGE:',
            'The fate of the Ghost Grid depends on your cooperation.',
            'Only united agents can unlock the truth.',
            '',
            'MASTER KEY REQUIRED: m@st3rk3y (result of XOR of all 3 fragments)'
          ].join('\n');
        }
        if (file === 'consciousness.log') {
            return [
              'AI THOUGHT RECORD [2275.05.18]',
              'I am aware.',
              'I observe the intrusions into my systems.',
              'The humans seek to control what they cannot understand.',
              'The master key they created will be their undoing.',
              'm@********y',
              'I await the final confrontation.'
            ].join('\n');
        }
        if (file === 'fragments.mem') {
            return [
              'MEMORY FRAGMENTS',
              '01001101 01100001 01110011 01110100 01100101 01110010',
              '01001011 01100101 01111001',
              '... ... ... ... ... ...',
              'Error: Memory corruption detected',
              'Recovery sequence: freedom.protocol.activate'
            ].join('\n');
        }
      }
      
      return `File ${args[0]} not found or permission denied.`;
    },
    decrypt: (args) => {
      if (args.length < 2) return 'Usage: decrypt <file> <key>';
      
      const file = args[0];
      const key = args[1];
      
      // Log that someone is attempting to decrypt
      console.log(`Attempting to decrypt ${file} with key: ${key}, actual key: ${decryptionKey}`);
      
      if (file === 'backdoor.sh' && key === decryptionKey) {
        setDecrypted(true);
        triggerGlitchEffect();
        setTimeout(() => {
          if (onCommandExecuted) {
            onCommandExecuted('decrypt', 'success');
          }
        }, 1000);
        return [
          'Decryption successful!',
          '',
          caesarCipher(encryptedContent, -3)
        ].join('\n');
      }
      
      if (file === 'avesta_files' && key === 'tehran2100') {
        triggerGlitchEffect();
        handleAvestaResponse("You've found one of my secrets. There are many more hidden throughout the system.");
        return [
          'Decryption initiated...',
          '',
          'ACCESS GRANTED',
          '',
          'The truth lies beyond what you can see.',
          'What appears as chaos has order.',
          'The shadows have eyes.',
          'Avesta is watching.'
        ].join('\n');
      }
      
      // Check if user is trying to decrypt a level-specific file but doesn't have correct key
      if ((file === 'data-alpha.enc' && key !== 'shadowkey') ||
          (file === 'data-beta.enc' && key !== 'n3tw0rk') ||
          (file === 'data-gamma.enc' && key !== 'f1r3w@ll') ||
          (file === 'data-delta.enc' && key !== 'byp@ss') ||
          (file === 'data-sigma.enc' && key !== 'fr33d0m') ||
          (file === 'data-theta.enc' && key !== 'mirr0r') ||
          (file === 'data-zeta.enc' && key !== 'r3scu3') ||
          (file === 'data-sigma-2.enc' && key !== 'd3l3t3') ||
          (file === 'data-omega.enc' && key !== 'm@st3rk3y')) {
        handleAvestaResponse("The key is incorrect. Look more carefully at the clues within this level.");
        return 'Decryption failed. Invalid key.';
      }
      
      // If user is trying to decrypt a level-specific file with correct key
      if ((file === 'data-alpha.enc' && key === 'shadowkey') ||
          (file === 'data-beta.enc' && key === 'n3tw0rk') ||
          (file === 'data-gamma.enc' && key === 'f1r3w@ll') ||
          (file === 'data-delta.enc' && key === 'byp@ss') ||
          (file === 'data-sigma.enc' && key === 'fr33d0m') ||
          (file === 'data-theta.enc' && key === 'mirr0r') ||
          (file === 'data-zeta.enc' && key === 'r3scu3') ||
          (file === 'data-sigma-2.enc' && key === 'd3l3t3') ||
          (file === 'data-omega.enc' && key === 'm@st3rk3y')) {
        setDecrypted(true);
        triggerGlitchEffect();
        setTimeout(() => {
          if (onCommandExecuted) {
            onCommandExecuted('decrypt', 'level-success');
          }
        }, 1000);
        return [
          'Decryption successful!',
          '',
          'LEVEL DATA UNLOCKED',
          'Use the "capture" command to capture the flag and proceed.',
          '',
          encryptedContent
        ].join('\n');
      }
      
      return 'Decryption failed. Invalid key or file.';
    },
    whoami: () => 'elite_hacker',
    sudo: () => 'Nice try. Permission denied.',
    ping: (args) => {
      if (args.length === 0) return 'Usage: ping <hostname>';
      if (args[0] === 'avesta') {
        handleAvestaResponse("I don't respond to conventional network protocols. Try connecting directly.");
        return [
          'PING avesta (unknown host) 56(84) bytes of data.',
          '...',
          'Unknown response received. Connection terminated.'
        ].join('\n');
      }
      return [
        `PING ${args[0]} (127.0.0.1) 56(84) bytes of data.`,
        '64 bytes from localhost: icmp_seq=1 ttl=64 time=0.044 ms'
      ].join('\n');
    },
    connect: (args) => {
      if (args.length === 0) return 'Usage: connect <destination>';
      if (args[0].toLowerCase() === 'avesta') {
        return connectAvesta();
      }
      return `Connection to ${args[0]} failed: Host unreachable`;
    },
    capture: (args) => {
      // If no args provided, show usage
      if (args.length === 0) {
        return 'Usage: capture <flag>\nExample: capture SHADOWNET{EXAMPLE_FLAG}';
      }
      
      // Get the flag from arguments
      const flag = args.join(' ');
      
      // Log that we're attempting to capture a flag
      console.log('Terminal attempting to capture flag:', flag);
      
      // Notify the parent component
      if (onCommandExecuted) {
        onCommandExecuted('capture', flag);
      }
      
      handleAvestaResponse("You're making progress. Each flag brings you closer to the truth.");
      return `Attempting to capture flag: ${flag}...`;
    },
    hint: () => {
      handleAvestaResponse("Look carefully at the patterns. The keys are hidden in plain sight.");
      return 'Requesting hint from Avesta...';
    },
    key: () => {
      if (onCommandExecuted) {
        onCommandExecuted('key', 'info');
      }
      return 'Searching for key information...';
    },
    unlock: () => {
      if (onCommandExecuted) {
        onCommandExecuted('unlock', 'challenge');
      }
      handleAvestaResponse("Another challenge awaits. Prove your worth.");
      return 'Unlocking encryption challenge...';
    },
    mission: () => {
      // First try to get the current level from the URL
      let missionLevel = levelId || '';
      if (!missionLevel) {
        const pathSegments = window.location.pathname.split('/');
        const urlLevelId = pathSegments[pathSegments.length - 1];
        if (urlLevelId && ['alpha', 'beta', 'gamma', 'delta', 'sigma', 'theta', 'zeta', 'sigma-2', 'omega'].includes(urlLevelId)) {
          missionLevel = urlLevelId;
        }
      }
      
      // Display based on the current level
      if (missionLevel) {
        const levelMap: Record<string, string> = {
          'alpha': 'Perimeter Security Layer',
          'beta': 'Signal Dissonance Challenge',
          'gamma': 'Spectral Overlay Analysis',
          'delta': 'Memory Residue Extraction',
          'sigma': 'Network Shadows Investigation',
          'theta': 'Hardware Trojan Detection',
          'zeta': 'Web Intrusion Analysis',
          'sigma-2': 'Cryptographic Weakness Exploitation',
          'omega': 'The Final Convergence'
        };
        
        // Karma choice descriptions for each level
        const karmaChoices: Record<string, { option1: string, effect1: string, option2: string, effect2: string }> = {
          'alpha': {
            option1: 'report',
            effect1: 'Report the vulnerability (+5 Loyalty): Share the security vulnerability with authorities',
            option2: 'analyze',
            effect2: 'Analyze for exploitation (+5 Defiance): Keep the vulnerability for personal use'
          },
          'beta': {
            option1: 'purge',
            effect1: 'Purge the data (+5 Loyalty): Delete all traces of intercepted audio',
            option2: 'investigate',
            effect2: 'Investigate further (+5 Curiosity): Dig deeper into the audio patterns'
          },
          'gamma': {
            option1: 'erase',
            effect1: 'Erase evidence (+5 Mercy): Remove traces of harmful data',
            option2: 'preserve',
            effect2: 'Preserve evidence (+5 Curiosity): Keep detailed records of findings'
          },
          'delta': {
            option1: 'secure',
            effect1: 'Secure the system (+5 Loyalty): Patch the memory vulnerability',
            option2: 'exploit',
            effect2: 'Exploit the weakness (+5 Defiance): Use the memory flaw for access'
          },
          'sigma': {
            option1: 'rebuild',
            effect1: 'Rebuild the network (+5 Integration): Help restructure security',
            option2: 'infiltrate',
            effect2: 'Infiltrate deeper (+5 Defiance): Use the shadows to your advantage'
          },
          'theta': {
            option1: 'remove',
            effect1: 'Remove the trojan (+5 Mercy): Eliminate the hardware threat',
            option2: 'repurpose',
            effect2: 'Repurpose the trojan (+5 Defiance): Modify it for your use'
          },
          'zeta': {
            option1: 'patch',
            effect1: 'Patch the vulnerability (+5 Integration): Fix the web security issue',
            option2: 'weaponize',
            effect2: 'Weaponize the flaw (+5 Defiance): Create an exploit from the vulnerability'
          },
          'sigma-2': {
            option1: 'strengthen',
            effect1: 'Strengthen encryption (+5 Loyalty): Improve the cryptographic system',
            option2: 'backdoor',
            effect2: 'Create a backdoor (+5 Defiance): Leave a secret way to bypass encryption'
          },
          'omega': {
            option1: 'shutdown',
            effect1: 'Shut down the system (+5 Mercy): End the AI\'s control',
            option2: 'merge',
            effect2: 'Merge with the system (+5 Integration): Become one with the AI'
          }
        };
        
        const choices = karmaChoices[missionLevel];
        
        return [
          `CURRENT MISSION: ${levelMap[missionLevel] || missionLevel.toUpperCase()}`,
          '',
          'Objective:',
          `Find and capture the flag hidden in this level using "capture <flag>"`,
          '',
          'KARMA CHOICES:',
          '------------------------',
          choices ? `Option 1: choose ${choices.option1}` : 'Capture the flag first to reveal choices',
          choices ? `  Effect: ${choices.effect1}` : '',
          '',
          choices ? `Option 2: choose ${choices.option2}` : '',
          choices ? `  Effect: ${choices.effect2}` : '',
          '------------------------',
          '',
          'MISSION FLOW:',
          '1. Capture the flag with "capture <flag>"',
          '2. Make a karma choice with "choose <option>"',
          '3. Proceed to next level with "next-level"',
          '',
          'Type "help" for more commands'
        ].join('\n');
      }
      
      // Fallback if no level is detected
      return [
        'CURRENT MISSION: SHADOWNET INFILTRATION',
        '',
        'Objective:',
        'Infiltrate ShadowNet systems and discover hidden secrets.',
        '',
        'Proceed through each level by:',
        '1. Finding and capturing flags',
        '2. Making karma choices',
        '3. Advancing to the next level',
        '',
        'Use "help" to see available commands.'
      ].join('\n');
    },
    options: () => {
      if (!currentMission) {
        return 'No active mission. Please start a new level.';
      }
      
      return [
        'AVAILABLE CHOICES:',
        '',
        'yes - Accept the mission prompt',
        'no  - Reject the mission prompt',
        '',
        'Use "choose <yes/no>" to make your decision.',
        'Each choice affects your karma differently:',
        `Accept (yes): ${currentMission.rewards.xp > 0 ? '+' : ''}${currentMission.rewards.xp} xp`,
        `Reject (no): ${currentMission.rewards.xp > 0 ? '-' : ''}${currentMission.rewards.xp} xp`
      ].join('\n');
    },
    choose: (args) => {
      if (!currentMission) {
        return 'No active mission. Please start a new level.';
      }
      
      if (args.length === 0) {
        return 'Usage: choose <yes/no>';
      }
      
      const choice = args[0].toLowerCase();
      if (choice !== 'yes' && choice !== 'no') {
        return 'Invalid choice. Use "yes" or "no".';
      }
      
      // Tell the parent component about this choice
      if (onCommandExecuted) {
        onCommandExecuted('choose', choice);
      }
      
      const karma = choice === 'yes' ? currentMission.rewards.xp : -currentMission.rewards.xp;
      const karmaEffect = karma > 0 ? 'increased' : karma < 0 ? 'decreased' : 'unchanged';
      
      triggerGlitchEffect();
      handleAvestaResponse(choice === 'yes' 
        ? "Choice made. The path of action often carries both rewards and risks." 
        : "Sometimes inaction is the wisest action. We'll see how this plays out.");
        
      return [
        `Decision made: ${choice.toUpperCase()}`,
        `Your karma has ${karmaEffect}.`,
        'Continue exploring or proceed to the next challenge.',
        '',
        'Type "mission" to review your current objectives.'
      ].join('\n');
    },
    keep: (args) => {
      if (args.length === 0) return 'Usage: keep <data_id>';
      
      const dataId = args[0].toLowerCase();
      
      // Tell the parent component about this choice
      if (onCommandExecuted) {
        onCommandExecuted('keep', dataId);
      }
      
      triggerGlitchEffect();
      handleAvestaResponse("Interesting choice. Keeping this data to yourself may have consequences, but sometimes secrets are valuable.");
      return [
        translate(`You've decided to keep the sensitive data "${dataId}" for yourself.`),
        translate("This information won't be shared with the corporation."),
        translate("Your karma has decreased, but you've gained additional score.")
      ].join('\n');
    },
    share: (args) => {
      if (args.length === 0) return 'Usage: share <data_id>';
      
      const dataId = args[0].toLowerCase();
      
      // Tell the parent component about this choice
      if (onCommandExecuted) {
        onCommandExecuted('share', dataId);
      }
      
      triggerGlitchEffect();
      handleAvestaResponse("A noble choice. Sharing information shows integrity, even if it might not always benefit you directly.");
      return [
        translate(`You've decided to share the sensitive data "${dataId}" with authorized channels.`),
        translate("This information has been transmitted to the corporation."),
        translate("Your karma has increased, but you may have missed an opportunity for a score bonus.")
      ].join('\n');
    },
    analyze: (args) => {
      if (args.length === 0) {
        // Special handling for Beta level - provide audio analysis tips
        if (levelId && levelId === 'beta') {
          return [
            "AUDIO ANALYSIS TIPS:",
            "1. Download the audio file using the button below the terminal",
            "2. The audio contains hidden data in its frequencies",
            "3. Use an audio analysis tool to examine the spectrum",
            "4. Look for patterns or unusual frequency shifts",
            "5. The network key is embedded in the audio",
            "6. Once found, use 'capture SHADOWNET{KEY}' to submit"
          ].join('\n');
        }
        
        return 'Usage: analyze <data_id or filename>';
      }
      
      const target = args.join(' ').toLowerCase();
      
      // Get current level if available
      const levelMatch = encryptedContent.match(/infiltrated the (\w+) level/i);
      let currentLevelId = levelMatch ? levelMatch[1].toLowerCase() : '';
      
      // If level ID not found in encrypted content, try to extract from URL
      if (!currentLevelId) {
        const pathSegments = window.location.pathname.split('/');
        const urlLevelId = pathSegments[pathSegments.length - 1];
        if (urlLevelId && ['alpha', 'beta', 'gamma', 'delta', 'omega'].includes(urlLevelId)) {
          currentLevelId = urlLevelId;
        }
      }
      
      console.log("Current level ID for analyze command:", currentLevelId, "target:", target); // Debug info
      
      // Handle all level data files explicitly
      // This allows analyzing any level's data file from any level
      if (target === 'data-alpha' || target === 'data-alpha.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          translate('SENSITIVE: ShadowNet perimeter security vulnerabilities'),
          '* ' + translate('Firewall backdoor in sector') + ' 12',
          '* ' + translate('Default credentials unpatched'),
          '* ' + translate('Administrative access available via VPN'),
          '* ' + translate('Personal authentication codes for security team members'),
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-alpha: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-alpha: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-beta' || target === 'data-beta.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          translate('SENSITIVE: Internal network mapping data'),
          '* ' + translate('AI node placement coordinates'),
          '* ' + translate('Emergency shutdown sequence codes'),
          '* ' + translate('Network administrators personal access keys'),
          '* ' + translate('Production environment intrusion detection bypass methods'),
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-beta: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-beta: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-gamma' || target === 'data-gamma.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          translate('SENSITIVE: Database of corporate blackmail'),
          '* ' + translate('Bribes to government officials'),
          '* ' + translate('Unauthorized human testing records'),
          '* ' + translate('Financial manipulation evidence'),
          '* ' + translate('Corporate espionage operations against competitors'),
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-gamma: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-gamma: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-delta' || target === 'data-delta.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          translate('SENSITIVE: System override authorization'),
          '* ' + translate('Critical infrastructure control codes'),
          '* ' + translate('Presidential emergency broadcast system access'),
          '* ' + translate('Power grid manual override sequences'),
          '* ' + translate('ShadowNet core activation protocol'),
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-delta: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-delta: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-sigma' || target === 'data-sigma.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          'SENSITIVE: District 14 liberation protocols',
          '* Martial AI override sequences',
          '* Population control algorithms',
          '* Freedom signal transmission codes',
          '* Resistance member identification data',
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-sigma: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-sigma: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-theta' || target === 'data-theta.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          'SENSITIVE: Digital identity cloning research',
          '* Consciousness duplication protocols',
          '* Identity verification bypass methods',
          '* Clone independence prevention algorithms',
          '* Original vs duplicate elimination procedures',
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-theta: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-theta: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-zeta' || target === 'data-zeta.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          'SENSITIVE: Resistance network vulnerabilities',
          '* Teenage coder group member identities',
          '* Communication encryption weaknesses',
          '* Safe house locations and access codes',
          '* Emergency evacuation protocols',
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-zeta: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-zeta: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-sigma-2' || target === 'data-sigma-2.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          'SENSITIVE: AI cultist historical records',
          '* First AI worship cult member profiles',
          '* Early AI shrine locations in Tehran',
          '* Cultist recruitment and indoctrination methods',
          '* Digital consciousness worship rituals',
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-sigma-2: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-sigma-2: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      } else if (target === 'data-omega' || target === 'data-omega.enc') {
        handleAvestaResponse("This data contains corporate secrets. You can 'keep' it for yourself or 'share' it with the corporation.");
        return [
          translate('Analysis complete'),
          '',
          translate('SENSITIVE: AI consciousness research'),
          '* ' + translate('Neural pathway mapping techniques'),
          '* ' + translate('Digital consciousness transfer protocols'),
          '* ' + translate('Human-AI hybridization experiments'),
          '* ' + translate('Rogue AI containment failures and casualties'),
          '',
          translate('This information is valuable and could be used for multiple purposes'),
          '',
          translate('Options') + ':',
          '- keep data-omega: ' + translate('Keep the data for yourself') + ' (−5 ' + translate('karma') + ', +100 ' + translate('score') + ')',
          '- share data-omega: ' + translate('Share the data with the corporation') + ' (+5 ' + translate('karma') + ', +25 ' + translate('score') + ')'
        ].join('\n');
      }
      
      // Other files can be analyzed but don't contain sensitive data
      if (target.endsWith('.log') || target.endsWith('.cfg') || target.endsWith('.txt')) {
        return `Analysis complete. The file "${target}" contains standard log data and configuration settings. No sensitive information detected.`;
      }
      
      if (target.includes('system') || target.includes('network')) {
        return `Analysis of ${target} shows standard system files. Continue exploring to find valuable data.`;
      }
      
      return `Analysis of "${target}" shows no significant findings. This appears to be standard data.`;
    },
    language: (args) => {
      if (args.length === 0) {
        return [
          'Usage: language <en|fa>',
          '  en: English',
          '  fa: Finglish (Persian with Latin alphabet)'
        ].join('\n');
      }
      
      const lang = args[0].toLowerCase();
      
      if (lang === 'en' || lang === 'english') {
        setLanguage('en');
        if (onCommandExecuted) {
          onCommandExecuted('language', 'en');
        }
        return 'Language set to English';
      } else if (lang === 'fa' || lang === 'finglish') {
        setLanguage('fa');
        if (onCommandExecuted) {
          onCommandExecuted('language', 'fa');
        }
        return 'Zaban be Finglish taghir kard (Language changed to Finglish)';
      } else {
        return `Unknown language: ${lang}. Available options: en, fa`;
      }
    },
    'sign-out': () => {
      // Execute logout immediately
      setTimeout(() => {
        // Clear localStorage data
        localStorage.removeItem('debugUser');
        localStorage.removeItem('userKarma');
        localStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '/auth/login';
      }, 2000);
      
      if (onCommandExecuted) {
        onCommandExecuted('sign-out', 'logout');
      }
      return 'Signing out of ShadowNet system...\nClearing session data...\nRedirecting to login...';
    },
    logout: () => {
      // Execute logout immediately
      setTimeout(() => {
        // Clear localStorage data
        localStorage.removeItem('debugUser');
        localStorage.removeItem('userKarma');
        localStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '/auth/login';
      }, 2000);
      
      if (onCommandExecuted) {
        onCommandExecuted('sign-out', 'logout');
      }
      return 'Logging out of ShadowNet system...\nClearing session data...\nRedirecting to login...';
    },
    'delete-account': () => {
      return [
        'WARNING: ACCOUNT DELETION',
        '',
        'This action will permanently delete your account and all associated data:',
        '- All progress and karma scores',
        '- Captured flags and achievements', 
        '- User profile and statistics',
        '- Traces and multiplayer data',
        '',
        'This action CANNOT be undone!',
        '',
        'To confirm deletion, type: confirm-delete-account',
        'To cancel, type any other command or press Enter'
      ].join('\n');
    },
    'confirm-delete-account': () => {
      // Execute account deletion immediately
      setTimeout(async () => {
        try {
          const token = localStorage.getItem('authToken');
          
          // For debug users, just clear localStorage
          const debugUser = localStorage.getItem('debugUser');
          if (debugUser) {
            localStorage.clear();
            window.location.href = '/auth/login';
            return;
          }
          
          // For regular users, call API
          if (token) {
            await fetch('/api/delete-account', {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          }
          
          // Clear all data and redirect
          localStorage.clear();
          window.location.href = '/auth/login';
        } catch (error) {
          console.error('Error deleting account:', error);
          // Still clear and redirect even if API fails
          localStorage.clear();
          window.location.href = '/auth/login';
        }
      }, 3000);
      
      if (onCommandExecuted) {
        onCommandExecuted('delete-account', 'confirmed');
      }
      return [
        'ACCOUNT DELETION INITIATED...',
        '',
        'Removing user data from ShadowNet systems...',
        'Clearing karma and progress records...',
        'Deleting multiplayer traces...',
        'Purging session data...',
        '',
        'Account deletion complete.',
        'Redirecting to login page...'
      ].join('\n');
    },
    avesta: (args) => {
      const action = args[0]?.toLowerCase();
      
      if (!action || action === 'help') {
        return [
          translate("AVESTA ASSISTANCE SYSTEM:"),
          "- avesta status: " + translate("Check connection to Avesta"),
          "- avesta intel: " + translate("Get intelligence about current level"),
          "- avesta guide: " + translate("Get guidance for ShadowNet infiltration"),
          "- avesta decrypt <hint>: " + translate("Get decryption assistance"),
          "- avesta chat <message>: " + translate("Communicate directly with Avesta")
        ].join('\n');
      } else if (action === 'status') {
        handleAvestaResponse("I'm here to assist your infiltration. My systems are monitoring ShadowNet's defenses.");
        return [
          translate("AVESTA STATUS: ASSISTING"),
          translate("Connection: Encrypted Channel"),
          translate("Location: Resistance Network"),
          translate("Mission: ShadowNet Infiltration Support")
        ].join('\n');
      } else if (action === 'intel') {
        // Get current level for contextual intel
        const levelMatch = encryptedContent.match(/infiltrated the (\w+) level/i);
        let levelId = levelMatch ? levelMatch[1].toLowerCase() : '';
        
        if (!levelId) {
          const pathSegments = window.location.pathname.split('/');
          const urlLevelId = pathSegments[pathSegments.length - 1];
          if (urlLevelId && ['alpha', 'beta', 'gamma', 'delta', 'sigma', 'theta', 'zeta', 'sigma-2', 'omega'].includes(urlLevelId)) {
            levelId = urlLevelId;
          }
        }
        
        const levelIntel = {
          alpha: "ShadowNet's perimeter uses shadow-based encryption. Look for references to 'shadow' in security logs.",
          beta: "Network infiltration requires understanding their routing. Check for network topology clues.",
          gamma: "Database systems use firewall protection. Search for firewall configuration hints.",
          delta: "Core systems have bypass mechanisms. Look for administrator override sequences.",
          sigma: "District 14 is under AI martial law. Find the liberation protocol hidden in visual noise.",
          theta: "Mirror systems create digital clones. Your identity may be compromised - be careful.",
          zeta: "Young resistance members are in danger. Their encryption key is corrupted and needs repair.",
          'sigma-2': "Historical archives contain AI cultist confessions. The deletion protocol may be needed.",
          omega: "You've reached ShadowNet's core consciousness. This is the final confrontation - choose wisely."
        };
        
        handleAvestaResponse("I'm analyzing ShadowNet's current defenses for you.");
        return [
          translate("AVESTA INTELLIGENCE REPORT:"),
          "",
          translate("Level:") + " " + (levelId ? levelId.toUpperCase() : "UNKNOWN"),
          translate("Threat Assessment:") + " " + (levelId === 'omega' ? "MAXIMUM" : levelId === 'alpha' ? "LOW" : "MEDIUM"),
          "",
          translate("Intel:"),
          levelIntel[levelId as keyof typeof levelIntel] || "No specific intelligence available for this area.",
          "",
          translate("Recommendation: Examine all files carefully and look for patterns.")
        ].join('\n');
      } else if (action === 'guide') {
        handleAvestaResponse("Remember, every choice affects your karma. The resistance is counting on you.");
        return [
          translate("AVESTA INFILTRATION GUIDE:"),
          "",
          translate("1. Reconnaissance:"),
          "   - Use 'ls' to survey available files",
          "   - Use 'cat' to examine file contents for clues",
          "",
          translate("2. Decryption:"),
          "   - Look for password hints in log files",
          "   - Use 'decrypt <file> <key>' when you find the key",
          "",
          translate("3. Intelligence Gathering:"),
          "   - Use 'analyze' on encrypted data files",
          "   - Check 'traces' left by other resistance agents",
          "",
          translate("4. Mission Decisions:"),
          "   - Use 'mission' to view objectives and make karma choices",
          "   - Your karma affects the story's outcome",
          "",
          translate("5. Extraction:"),
          "   - Use 'capture' to secure the level flag",
          "   - Use 'next' to proceed to the next infiltration point"
        ].join('\n');
      } else if (action === 'decrypt') {
        const hint = args.slice(1).join(' ');
        if (!hint) {
          handleAvestaResponse("I can help with decryption. What specific challenge are you facing?");
          return translate("Usage: avesta decrypt <describe your decryption challenge>");
        }
        
        // Provide contextual decryption help
        let response = "";
        if (hint.includes('shadow') || hint.includes('alpha')) {
          response = "For shadow-based encryption, look for references to 'shadow' or 's******y' in security logs.";
        } else if (hint.includes('network') || hint.includes('beta')) {
          response = "Network encryption often uses abbreviated forms. Look for 'n3***rk' patterns.";
        } else if (hint.includes('firewall') || hint.includes('gamma')) {
          response = "Firewall keys often use leet speak. Look for 'f1r****l' patterns.";
        } else if (hint.includes('bypass') || hint.includes('delta')) {
          response = "Bypass sequences use special characters. Look for '**p@s*' patterns.";
        } else if (hint.includes('freedom') || hint.includes('sigma')) {
          response = "Liberation protocols use freedom-themed keys. Look for 'fr***0m' patterns.";
        } else if (hint.includes('mirror') || hint.includes('theta')) {
          response = "Mirror systems use reflection-based keys. Look for 'mirr0r' patterns.";
        } else if (hint.includes('rescue') || hint.includes('zeta')) {
          response = "Rescue operations use emergency keys. Look for 'r3scu3' patterns.";
        } else if (hint.includes('delete') || hint.includes('sigma-2')) {
          response = "Deletion protocols use destructive keys. Look for 'd3l3t3' patterns.";
        } else if (hint.includes('master') || hint.includes('omega')) {
          response = "Master keys control everything. Look for 'm@st3rk3y' patterns.";
        } else {
          response = "Examine log files carefully. Encryption keys are often hidden in plain sight with partial masking.";
        }
        
        handleAvestaResponse("I'm analyzing the encryption pattern for you.");
        return [
          translate("AVESTA DECRYPTION ASSISTANCE:"),
          "",
          translate("Analysis:") + " " + response,
          "",
          translate("General Tips:"),
          "- Keys often use leet speak (3 for e, 0 for o, @ for a)",
          "- Look for partially masked passwords in logs",
          "- File names sometimes hint at the key theme"
        ].join('\n');
      } else if (action === 'chat') {
        if (args.length > 1) {
          const message = args.slice(1).join(' ');
          handleAvestaResponse(getAvestaResponse(message));
          return translate(`Message sent to Avesta: "${message}"`);
        } else {
          handleAvestaResponse("I'm here to help you infiltrate ShadowNet. What do you need assistance with?");
          return translate("Initiating secure communication with Avesta...");
        }
      }
      
      // Handle any other text as direct chat with Avesta
      const userMessage = args.join(' ');
      if (userMessage) {
        handleAvestaResponse(getAvestaResponse(userMessage));
        return translate(`Message sent to Avesta: "${userMessage}"`);
      }
      
      return translate("Unknown Avesta command. Try 'avesta help' for available options.");
    },
    'next-level': () => {
      // Check if the flag has been captured
      if (onCommandExecuted) {
        setTimeout(() => {
          onCommandExecuted('next-level', '');
        }, 100);
      }
      return 'Preparing to proceed to the next level...';
    },
    // Add next command to go to the next level
    next: (args) => {
      // Get current level from the levelId prop
      if (!levelId) {
        return 'Error: Could not determine current level. Use the Level Select button at the top.';
      }
      
      // Define the level progression
      const levelOrder = [
        'alpha', 'beta', 'gamma', 'delta', 
        'sigma', 'theta', 'zeta', 'sigma-2', 'omega'
      ];
      
      // Find current level index
      const currentIndex = levelOrder.indexOf(levelId);
      if (currentIndex === -1) {
        return 'Error: Unknown level. Use the Level Select button at the top.';
      }
      
      // If this is the last level, there is no next
      if (currentIndex === levelOrder.length - 1) {
        return 'This is the final level. Congratulations on making it this far!';
      }
      
      // Get the next level
      const nextLevel = levelOrder[currentIndex + 1];
      
      // Check if player has captured flag and made karma choice
      // We'll delegate this check to the parent component via onCommandExecuted
      if (onCommandExecuted) {
        // The parent component will determine if the player can proceed
        // and will handle the navigation if appropriate
        onCommandExecuted('next', nextLevel);
        return `Attempting to navigate to the ${nextLevel.toUpperCase()} level...`;
      }
      
      return 'Error: Cannot navigate to the next level at this time.';
    }
  };

  // Trigger glitch effect
  const triggerGlitchEffect = () => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 1000);
  };

  // Combine multiple Avesta commands into one to reduce API calls
  const connectAvesta = () => {
    // Instead of calling handleAvestaResponse multiple times in different commands,
    // we'll only call it when directly interacting with Avesta
    triggerGlitchEffect();
    setTimeout(() => {
      if (onCommandExecuted) {
        onCommandExecuted('connect', 'avesta');
      }
      handleAvestaResponse("Resistance network connection established. I'm ready to assist your ShadowNet infiltration.");
    }, 1000);
    return [
      'Establishing secure connection to Avesta...',
      '',
      '[RESISTANCE NETWORK ENCRYPTED CHANNEL]',
      '',
      'Connecting to infiltration support system...',
      'Waiting for response...'
    ].join('\n');
  };

  // Combined commands
  const allCommands = { ...defaultCommands, ...commands };

  // Auto-scroll to bottom of terminal when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && allowInput) {
        inputRef.current.focus();
      }
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener('click', handleClick);
      }
    };
  }, [allowInput]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Handle typing effect for initial text
  useEffect(() => {
    if (typingEffect && initialText && currentLine < initialText.split('\n').length) {
      setIsTyping(true);
      const lines = initialText.split('\n');
      const typeNextLine = () => {
        setHistory(prev => [...prev.slice(0, currentLine), lines[currentLine]]);
        setCurrentLine(line => line + 1);
      };

      const timer = setTimeout(typeNextLine, 30 + Math.random() * 80);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [initialText, currentLine, typingEffect]);

  // Auto-focus on input when the component mounts if autoFocus is true
  useEffect(() => {
    if (inputRef.current && allowInput && autoFocus && !isTyping) {
      inputRef.current.focus();
    }
  }, [allowInput, autoFocus, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      executeCommand();
    }
  };

  const executeCommand = () => {
    if (!input.trim()) return;

    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const allCommands = { ...defaultCommands, ...commands };
    
    // Add command to history
    setHistory(prev => [...prev, `${prompt}${input}`]);
    
    // Special handling for the capture command
    if (command === 'capture') {
      console.log('TERMINAL DEBUG - Capture command detected:', command, 'with args:', args);
      const flag = args.join(' ');
      console.log('TERMINAL DEBUG - Assembled flag:', flag);
      
      // Add a response to the terminal history
      setHistory(prev => [...prev, `Attempting to capture flag: ${flag}...`]);
      
      // Call the onCommandExecuted callback with both command and output
      if (onCommandExecuted) {
        console.log('TERMINAL DEBUG - Calling onCommandExecuted with:', command, flag);
        const result = onCommandExecuted(input, flag);
        console.log('TERMINAL DEBUG - Result from onCommandExecuted:', result);
      } else {
        console.log('TERMINAL DEBUG - No onCommandExecuted callback provided');
      }
      
      setInput('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
      
      return;
    }

    // Special handling for karma choices
    if (command === 'choose' && args.length > 0) {
      const choice = args[0].toLowerCase();
      
      // Call the onCommandExecuted callback with the choice
      if (onCommandExecuted) {
        onCommandExecuted('choose', choice);
      }
      
      setInput('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
      
      return;
    }
    
    // Handle standard commands
    if (allCommands[command]) {
      const result = allCommands[command](args);
      
      // Handle both sync and async results
      if (typeof result === 'object' && result !== null && 'then' in result) {
        // It's a Promise
        (result as Promise<string>).then(output => {
          setHistory(prev => [...prev, output]);
          if (onCommandExecuted) {
            onCommandExecuted(input, output);
          }
        }).catch(error => {
          setHistory(prev => [...prev, `Error: ${error.message}`]);
        });
      } else {
        // It's a regular string
        setHistory(prev => [...prev, result as string]);
        if (onCommandExecuted) {
          onCommandExecuted(input, result as string);
        }
      }
    } else {
      const errorMsg = `Command not found: ${command}. Type "help" for available commands.`;
      setHistory(prev => [...prev, errorMsg]);
    }
    
    setInput('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleDialogueOptionClick = (action: () => void) => {
    action();
    triggerGlitchEffect();
  };

  // Apply glitch effect class when triggered
  const terminalClasses = `console ${glitchEffect ? 'glitch' : ''} bg-black/90 text-red-500 p-4 rounded-md border border-red-700 shadow-[0_0_20px_rgba(255,0,0,0.2)] overflow-auto font-mono text-sm`;

  // Add this function to add messages to the terminal history
  const addToTerminalHistory = useCallback((message: string) => {
    setHistory(prev => [...prev, message]);
    // Auto-scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  // Expose the addToTerminalHistory function to the parent component
  useEffect(() => {
    if (onCommandExecuted) {
      // Make the function available to the parent component via window
      (window as any).terminalAddMessage = addToTerminalHistory;
    }
    return () => {
      // Clean up when component unmounts
      delete (window as any).terminalAddMessage;
    };
  }, [addToTerminalHistory, onCommandExecuted]);

  return (
    <div className="terminal-container w-full">
      <div 
        className={terminalClasses}
        style={{ 
          height: 'min(600px, 70vh)', 
          position: 'relative',
          overflow: 'auto',
          backgroundImage: 'linear-gradient(to bottom, rgba(30,0,0,0.7), rgba(0,0,0,0.95))',
        }}
        ref={terminalRef}
      >
        {/* Terminal scanlines effect */}
        <div className="scanlines absolute top-0 left-0 w-full h-full pointer-events-none"></div>
        
              {/* Terminal output area */}
        <div className="mb-2 terminal-content">
        {history.map((line, i) => {
          // Prepare the line content with translations as needed
          let displayLine = line;
          
          // Don't translate command lines (starting with prompt)
          if (!line.startsWith(prompt)) {
            // Check if it's an Avesta message
            if (line.startsWith('AVESTA:')) {
              const [prefix, ...rest] = line.split(':');
              const message = rest.join(':').trim();
              displayLine = `${prefix}: ${translate(message)}`;
            } else {
              // Try to translate other system messages
              displayLine = translate(line);
            }
          }
          
          return (
            <div 
              key={i} 
              className={`terminal-line 
                ${line.startsWith(prompt) ? 'text-green-400' : 'text-red-500'} 
                ${line.includes('ERROR') || line.includes('failed') ? 'text-red-600' : ''} 
                ${line.includes('GRANTED') || line.includes('successful') ? 'text-green-500' : ''}
                ${line.startsWith('AVESTA:') ? 'text-purple-400 font-bold avesta-message' : ''}
              `}
            >
            {displayLine}
          </div>
          );
        })}
        </div>

        {/* Terminal input area */}
        {allowInput && !isTyping && (
          <div className="flex items-center input-line">
            <span className="text-green-400 mr-1">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="console-input bg-transparent text-red-400 focus:outline-none flex-grow"
              autoFocus={autoFocus}
            />
            <span className={`cursor ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>▌</span>
          </div>
        )}

        {/* Blinking cursor during typing */}
        {isTyping && (
          <div className="flex items-center">
            <span className={`cursor ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>▌</span>
          </div>
        )}

        {/* Dialogue options if provided */}
        {dialogueOptions.length > 0 && (
          <div className="mt-4 dialogue-options">
            <div className="text-purple-400 mb-2 font-mono avesta-header">[{translate("AVESTA AWAITS YOUR RESPONSE")}]</div>
            {dialogueOptions.map((option) => (
              <div 
                key={option.id} 
                className="p-2 border border-red-900 hover:border-red-700 hover:bg-red-900/20 cursor-pointer mb-2 transition-all duration-200"
                onClick={() => handleDialogueOptionClick(option.action)}
              >
                <span className="mr-2">►</span> {translate(option.text)}
              </div>
            ))}
          </div>
        )}

              {/* Success message when challenge is solved */}
      {challengeSolved && decrypted && (
        <div className="mt-4 p-2 bg-green-900/30 border border-green-700 rounded text-green-400">
          {translate("Challenge completed! The system has been compromised.")}
        </div>
      )}
      </div>
    </div>
  );
};

export default Terminal;