'use client';

import { useState, useEffect } from 'react';
import Terminal from './Terminal';

interface CryptoChallengeProps {
  level: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onSolved?: (key: string) => void;
  karmaReward?: number;
}

// Different encryption types for variety
type EncryptionType = 'caesar' | 'binary' | 'hex' | 'morse' | 'base64' | 'reverse' | 'substitution';

// Simple Caesar cipher
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

// Convert text to binary
const textToBinary = (text: string): string => {
  return text.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join(' ');
};

// Convert text to hex
const textToHex = (text: string): string => {
  return text.split('').map(char => 
    char.charCodeAt(0).toString(16).padStart(2, '0')
  ).join(' ');
};

// Convert text to Morse code
const textToMorse = (text: string): string => {
  const morseMap: Record<string, string> = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 
    'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', 
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
    '8': '---..', '9': '----.', ' ': '/'
  };
  
  return text.toLowerCase().split('').map(char => morseMap[char] || char).join(' ');
};

// Convert text to base64
const textToBase64 = (text: string): string => {
  if (typeof window !== 'undefined') {
    return btoa(text);
  }
  return text; // Fallback for server-side rendering
};

// Reverse text
const reverseText = (text: string): string => {
  return text.split('').reverse().join('');
};

// Simple substitution cipher
const substitutionCipher = (text: string): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cipher =    'zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA';
  
  return text.split('').map(char => {
    const index = alphabet.indexOf(char);
    return index !== -1 ? cipher[index] : char;
  }).join('');
};

// Generate encryption keys for each level
const generateEncryptionKey = (level: string): string => {
  // Keys are predictable but look random
  const baseKeys: Record<string, string> = {
    'alpha': 'shadowkey',
    'beta': 'n3tw0rk',
    'gamma': 'f1r3w@ll',
    'delta': 'byp@ss',
    'omega': 'm@st3rk3y'
  };
  
  return baseKeys[level as keyof typeof baseKeys] || 'default';
};

// Generate hint for the current encryption
const generateHint = (encryptionType: EncryptionType, key: string): string => {
  const hints: Record<EncryptionType, string> = {
    'caesar': `The message is encrypted using a Caesar cipher. Try shifting the alphabet by ${key.length} positions.`,
    'binary': 'The message is encoded in binary format (8 bits per character). Convert from binary to ASCII.',
    'hex': 'This is hexadecimal encoding. Convert from hex to ASCII.',
    'morse': 'The message is encoded using Morse code. Decode dots and dashes.',
    'base64': 'This message is encoded in Base64. Use a Base64 decoder.',
    'reverse': 'Sometimes the simplest approach works best. Try reading it backwards.',
    'substitution': 'This is a substitution cipher. Each letter is replaced with another letter in the alphabet.'
  };
  
  return hints[encryptionType];
};

export const CryptoChallenge: React.FC<CryptoChallengeProps> = ({
  level,
  difficulty = 'medium',
  onSolved,
  karmaReward = 5
}) => {
  const [encryptionType, setEncryptionType] = useState<EncryptionType>('caesar');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const [key, setKey] = useState('');
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Set up the challenge when the component mounts
  useEffect(() => {
    const encryptionKey = generateEncryptionKey(level);
    setKey(encryptionKey);
    
    // Choose encryption type based on difficulty and level
    let encTypes: EncryptionType[] = ['caesar', 'binary', 'reverse'];
    if (difficulty === 'medium') {
      encTypes = ['caesar', 'binary', 'hex', 'reverse', 'base64'];
    } else if (difficulty === 'hard') {
      encTypes = ['caesar', 'binary', 'hex', 'morse', 'base64', 'substitution'];
    }
    
    // Deterministically select encryption type based on level
    const selectedType = encTypes[level.charCodeAt(0) % encTypes.length];
    setEncryptionType(selectedType);
    
    // Generate plaintext message
    const messages = [
      `The system password is ${encryptionKey}. Use it to gain access.`,
      `Access code for level ${level} is ${encryptionKey}.`,
      `Decrypt this message to find the key: ${encryptionKey}.`,
      `The backdoor password to unlock this system is ${encryptionKey}.`,
      `ShadowNet security bypassed. Access key: ${encryptionKey}.`
    ];
    
    const selectedMessage = messages[level.charCodeAt(0) % messages.length];
    setOriginalMessage(selectedMessage);
    
    // Encrypt the message based on the selected type
    let encrypted = '';
    switch (selectedType) {
      case 'caesar':
        encrypted = caesarCipher(selectedMessage, 3);
        break;
      case 'binary':
        encrypted = textToBinary(selectedMessage);
        break;
      case 'hex':
        encrypted = textToHex(selectedMessage);
        break;
      case 'morse':
        encrypted = textToMorse(selectedMessage);
        break;
      case 'base64':
        encrypted = textToBase64(selectedMessage);
        break;
      case 'reverse':
        encrypted = reverseText(selectedMessage);
        break;
      case 'substitution':
        encrypted = substitutionCipher(selectedMessage);
        break;
    }
    
    setEncryptedMessage(encrypted);
  }, [level, difficulty]);

  // Custom commands for the Terminal component
  const terminalCommands = {
    hint: () => {
      setShowHint(true);
      return generateHint(encryptionType, key);
    },
    solve: (args: string[]) => {
      if (args.length === 0) return 'Usage: solve <password>';
      
      const attempt = args[0];
      setAttempts(prev => prev + 1);
      
      if (attempt === key) {
        setSolved(true);
        if (onSolved) {
          onSolved(key);
        }
        return `Success! You've cracked the encryption. Access granted.\nSystem unlocked.\nKarma reward: +${karmaReward}`;
      } else {
        return `Incorrect password. Access denied. Try again.\nAttempts: ${attempts + 1}`;
      }
    },
    analyze: () => {
      return `Analysis complete.\nEncryption type detected: ${encryptionType}\n${showHint ? generateHint(encryptionType, key) : 'Use "hint" command for decryption assistance.'}`;
    }
  };

  return (
    <div className="crypto-challenge bg-black/80 border border-red-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-red-500 text-lg font-mono mb-3">
        <span className="mr-2">🔒</span>
        ENCRYPTION CHALLENGE: LEVEL {level.toUpperCase()}
      </h3>
      
      <div className="encoded-message bg-black/60 p-3 border border-red-900 rounded mb-4">
        <div className="text-xs text-red-400 mb-1">ENCRYPTED MESSAGE:</div>
        <div className="font-mono text-red-300 break-all">{encryptedMessage}</div>
      </div>
      
      <Terminal 
        initialText={`ShadowNet Security Terminal\nEncrypted message detected\nDecrypt to proceed\nUse "hint" for assistance, "analyze" to examine, and "solve <password>" when ready.`}
        prompt="decrypt@shadownet:~$ "
        commands={terminalCommands}
        encryptedContent={originalMessage}
        decryptionKey={key}
        challengeSolved={solved}
        typingEffect={true}
      />
      
      {solved && (
        <div className="mt-4 p-2 bg-green-900/30 border border-green-700 rounded text-green-400 text-center">
          Challenge completed! +{karmaReward} karma points awarded.
        </div>
      )}
    </div>
  );
};

export default CryptoChallenge; 