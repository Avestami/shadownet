import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// RSA parameters with intentionally close primes
const RSA_CONFIG = {
  // Two close primes, making factorization easier
  p: BigInt('1000000000000000003'),
  q: BigInt('1000000000000000019'),
  e: BigInt(65537)
};

// Calculate RSA components
const n = RSA_CONFIG.p * RSA_CONFIG.q;
const phi = (RSA_CONFIG.p - BigInt(1)) * (RSA_CONFIG.q - BigInt(1));
const d = calculateModInverse(RSA_CONFIG.e, phi);

function calculateModInverse(e: bigint, phi: bigint): bigint {
  let a = e;
  let b = phi;
  let x = BigInt(1);
  let y = BigInt(0);

  while (a > BigInt(1)) {
    const q = a / b;
    let t = b;
    b = a % b;
    a = t;
    t = y;
    y = x - q * y;
    x = t;
  }

  if (x < BigInt(0)) {
    x += phi;
  }

  return x;
}

// PKCS#1 v1.5 padding implementation (simplified)
function addPadding(message: string): Buffer {
  const buffer = Buffer.from(message, 'utf8');
  const paddingLength = 128 - buffer.length - 3;
  const padding = crypto.randomBytes(paddingLength);
  
  // Ensure no 0x00 bytes in padding
  for (let i = 0; i < paddingLength; i++) {
    if (padding[i] === 0) padding[i] = 0xFF;
  }

  const result = Buffer.alloc(128);
  result[0] = 0x00;
  result[1] = 0x02;
  padding.copy(result, 2);
  result[paddingLength + 2] = 0x00;
  buffer.copy(result, paddingLength + 3);

  return result;
}

// Padding oracle (intentionally vulnerable)
export function checkPadding(ciphertext: Buffer): boolean {
  try {
    const decrypted = decrypt(ciphertext);
    return decrypted[0] === 0x00 && decrypted[1] === 0x02;
  } catch {
    return false;
  }
}

// RSA encryption
function encrypt(message: Buffer): Buffer {
  const m = BigInt('0x' + message.toString('hex'));
  let c = BigInt(1);
  let base = m % n;
  let exp = RSA_CONFIG.e;

  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) {
      c = (c * base) % n;
    }
    base = (base * base) % n;
    exp = exp / BigInt(2);
  }

  return Buffer.from(c.toString(16).padStart(256, '0'), 'hex');
}

// RSA decryption
function decrypt(ciphertext: Buffer): Buffer {
  const c = BigInt('0x' + ciphertext.toString('hex'));
  let m = BigInt(1);
  let base = c % n;
  let exp = d;

  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) {
      m = (m * base) % n;
    }
    base = (base * base) % n;
    exp = exp / BigInt(2);
  }

  return Buffer.from(m.toString(16).padStart(256, '0'), 'hex');
}

// Generate CivicShield's "secure" message
export function generateCivicShieldMessage(): Buffer {
  const message = 'CRITICAL: Update encryption keys immediately. Current implementation compromised.';
  const paddedMessage = addPadding(message);
  return encrypt(paddedMessage);
}

// Generate the challenge files
export async function generateTinyRSAChallenge() {
  const outputDir = path.join(process.cwd(), 'public/challenges/tiny_rsa');
  fs.mkdirSync(outputDir, { recursive: true });

  // Save public key components
  const publicKey = {
    n: n.toString(),
    e: RSA_CONFIG.e.toString()
  };
  fs.writeFileSync(
    path.join(outputDir, 'public_key.json'),
    JSON.stringify(publicKey, null, 2)
  );

  // Generate and save encrypted message
  const encryptedMessage = generateCivicShieldMessage();
  fs.writeFileSync(
    path.join(outputDir, 'encrypted_message.bin'),
    encryptedMessage
  );

  // Create CivicShield's documentation
  const documentation = `
CivicShield RSA Implementation
=============================
Version: 1.0.0
Last Updated: ${new Date().toISOString()}

Key Generation:
- Prime generation uses optimized algorithm
- Primes selected from specific range for performance
- Public exponent: ${RSA_CONFIG.e}

Security Features:
- PKCS#1 v1.5 padding
- 1024-bit modulus
- Standard RSA encryption

Note: Performance optimizations may impact security.
Please refer to security@civicshield.net for updates.
`;

  fs.writeFileSync(
    path.join(outputDir, 'civicshield_docs.txt'),
    documentation
  );

  // Create response templates for karma choices
  const responseTemplates = {
    warn: `
SECURE TRANSMISSION
==================
To: CivicShield Security Team
Subject: Critical Vulnerability Report

We have identified a severe vulnerability in your RSA implementation.
The prime number generation algorithm produces predictable values.
Recommend immediate key rotation and implementation review.

[Attachment: Proof of Concept]
`,
    
    leak: `
PUBLIC SECURITY ADVISORY
=======================
Title: CivicShield RSA Implementation Vulnerability
Status: Public Disclosure
Severity: Critical

Technical Details:
- RSA implementation uses predictable primes
- Key generation algorithm compromised
- All messages encrypted with affected keys are at risk

[Technical Details Attached]
`,
    
    exploit: `
ENCRYPTED ARCHIVE
================
Contents: CivicShield Intercepted Communications
Status: Decrypted
Method: RSA Implementation Flaw

[Warning: Unauthorized Access]
`
  };

  Object.entries(responseTemplates).forEach(([name, content]) => {
    fs.writeFileSync(
      path.join(outputDir, `response_${name}.txt`),
      content
    );
  });
}

// Challenge metadata
export const TINY_RSA_METADATA = {
  flag: 'SHADOWNET{RSA_IS_ONLY_AS_STRONG_AS_YOUR_KEYS}',
  karmaChoices: {
    warn: {
      type: 'Defiance',
      subtype: 'Compassionate',
      score: 115,
      hint: 'The true strength lies not in a single, flawed key, but in the harmony of many, finding their shared resonance to form a stronger shield.'
    },
    leak: {
      type: 'Defiance',
      subtype: 'Transparency',
      score: 95,
      outcome: 'Vulnerability publicly disclosed'
    },
    exploit: {
      type: 'Neutral',
      score: 70,
      outcome: 'Vulnerability exploited for personal gain'
    }
  },
  vulnerabilities: {
    closeprimes: {
      p: RSA_CONFIG.p.toString(),
      q: RSA_CONFIG.q.toString(),
      difference: (RSA_CONFIG.q - RSA_CONFIG.p).toString()
    },
    padding: 'PKCS#1 v1.5 with oracle'
  }
}; 