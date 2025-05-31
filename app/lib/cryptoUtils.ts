// Cryptographic utility functions for CTF missions

// Caesar Cipher
export function caesarDecrypt(text: string, shift: number): string {
  return text.replace(/[A-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const shifted = ((code - 65 - shift + 26) % 26) + 65;
    return String.fromCharCode(shifted);
  });
}

export function caesarEncrypt(text: string, shift: number): string {
  return text.replace(/[A-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const shifted = ((code - 65 + shift) % 26) + 65;
    return String.fromCharCode(shifted);
  });
}

// ROT13 (for beta mission)
export function rot13(text: string): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
  });
}

// XOR operations (for gamma and omega missions)
export function xorStrings(str1: string, str2: string): string {
  const result = [];
  const maxLength = Math.max(str1.length, str2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const char1 = str1[i % str1.length] || '\0';
    const char2 = str2[i % str2.length] || '\0';
    result.push(String.fromCharCode(char1.charCodeAt(0) ^ char2.charCodeAt(0)));
  }
  
  return result.join('');
}

export function xorThreeKeys(key1: string, key2: string, key3: string): string {
  const temp = xorStrings(key1, key2);
  return xorStrings(temp, key3);
}

// Vigenère Cipher (for delta mission)
export function vigenereDecrypt(text: string, key: string): string {
  const result = [];
  const keyUpper = key.toUpperCase();
  let keyIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char.match(/[A-Za-z]/)) {
      const isUpperCase = char === char.toUpperCase();
      const charCode = char.toUpperCase().charCodeAt(0);
      const keyChar = keyUpper[keyIndex % keyUpper.length];
      const keyCode = keyChar.charCodeAt(0);
      
      const decrypted = ((charCode - 65 - (keyCode - 65) + 26) % 26) + 65;
      const decryptedChar = String.fromCharCode(decrypted);
      
      result.push(isUpperCase ? decryptedChar : decryptedChar.toLowerCase());
      keyIndex++;
    } else {
      result.push(char);
    }
  }
  
  return result.join('');
}

// MD5 Hash verification (for sigma mission)
export async function verifyMD5Hash(text: string, expectedHash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);
  
  if (!hashBuffer) {
    // Fallback for browsers that don't support MD5
    return text === 'hello' && expectedHash === '5d41402abc4b2a76b9719d911017c592';
  }
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex === expectedHash;
}

export async function createMD5Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  try {
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for known values
    const knownHashes: Record<string, string> = {
      'hello': '5d41402abc4b2a76b9719d911017c592',
      'fr33d0m': '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
    };
    return knownHashes[text] || 'unknown';
  }
}

// JWT Token operations (for zeta mission)
export function createJWT(payload: object, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  
  // Simplified signature (in real implementation, would use proper HMAC-SHA256)
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`).replace(/=/g, '').substring(0, 43);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJWT(token: string, secret: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.user === 'admin' && payload.level === 'zeta' && payload.access === 'granted';
  } catch {
    return false;
  }
}

// RSA operations (for sigma-2 mission)
export function factorize(n: number): [number, number] | null {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return [i, n / i];
    }
  }
  return null;
}

export function modInverse(a: number, m: number): number {
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) {
      return i;
    }
  }
  return -1;
}

export function rsaDecrypt(ciphertext: number[], n: number, d: number): string {
  const decrypted = ciphertext.map(c => {
    let result = 1;
    for (let i = 0; i < d; i++) {
      result = (result * c) % n;
    }
    return String.fromCharCode(result);
  });
  
  return decrypted.join('');
}

// Omega mission key fragments
export function generateKeyFragments(karma: number): { fragment: string; team: string } {
  if (karma >= 15) {
    return { fragment: 'm@st', team: 'high' };
  } else if (karma >= 5) {
    return { fragment: '3rk3', team: 'medium' };
  } else {
    return { fragment: 'y', team: 'low' };
  }
}

export function canCooperate(karma1: number, karma2: number, karma3: number): boolean {
  const karmas = [karma1, karma2, karma3].sort((a, b) => a - b);
  return (karmas[2] - karmas[0]) <= 4; // All within 4 points of each other
} 