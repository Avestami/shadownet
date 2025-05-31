// Cipher implementations for Level 4 - Cipherplay

export function caesarCipher(text: string, shift: number): string {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
}

export function playfairCipher(text: string, key: string = 'SOLAR'): string {
  // Create Playfair matrix
  const matrix: string[][] = Array(5).fill(null).map(() => Array(5).fill(''));
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Note: I/J combined
  const usedChars = new Set();
  
  let row = 0, col = 0;
  
  // Fill with key first
  for (const char of key.toUpperCase()) {
    if (!usedChars.has(char) && char !== 'J') {
      matrix[row][col] = char;
      usedChars.add(char);
      col++;
      if (col === 5) {
        col = 0;
        row++;
      }
    }
  }
  
  // Fill remaining with alphabet
  for (const char of alphabet) {
    if (!usedChars.has(char)) {
      matrix[row][col] = char;
      usedChars.add(char);
      col++;
      if (col === 5) {
        col = 0;
        row++;
      }
    }
  }

  // Prepare text (replace J with I, add X between doubles)
  const preparedText = text
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/[^A-Z]/g, '')
    .split('')
    .reduce((acc, char, i, arr) => {
      if (i % 2 === 0) {
        if (i === arr.length - 1) return [...acc, char, 'X'];
        if (char === arr[i + 1]) return [...acc, char, 'X'];
        return [...acc, char];
      }
      return [...acc, char];
    }, [] as string[])
    .join('');

  // Encrypt pairs
  let result = '';
  for (let i = 0; i < preparedText.length; i += 2) {
    const [char1, char2] = [preparedText[i], preparedText[i + 1]];
    const [row1, col1] = findPosition(matrix, char1);
    const [row2, col2] = findPosition(matrix, char2);

    if (row1 === row2) {
      result += matrix[row1][(col1 + 1) % 5];
      result += matrix[row2][(col2 + 1) % 5];
    } else if (col1 === col2) {
      result += matrix[(row1 + 1) % 5][col1];
      result += matrix[(row2 + 1) % 5][col2];
    } else {
      result += matrix[row1][col2];
      result += matrix[row2][col1];
    }
  }

  return result;
}

function findPosition(matrix: string[][], char: string): [number, number] {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) {
        return [i, j];
      }
    }
  }
  return [0, 0];
}

export function vigenereEncrypt(text: string, key: string): string {
  const result = [];
  let keyIndex = 0;

  for (const char of text) {
    if (char.match(/[A-Za-z]/)) {
      const isUpperCase = char === char.toUpperCase();
      const baseChar = isUpperCase ? 'A' : 'a';
      const keyChar = key[keyIndex % key.length].toUpperCase();
      const shift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
      
      const charCode = char.charCodeAt(0);
      const baseCode = baseChar.charCodeAt(0);
      const newCharCode = ((charCode - baseCode + shift) % 26) + baseCode;
      
      result.push(String.fromCharCode(newCharCode));
      keyIndex++;
    } else {
      result.push(char);
    }
  }

  return result.join('');
}

// Challenge data
export const CIPHERPLAY_DATA = {
  initialMessage: 'WEARETHESHADOWWESENDNOX1',
  fullMessage: `CLASSIFIED: OPERATION SHADOWNET
  
We are the shadow. We send signals through the noise.
The frequencies hold secrets beyond human perception.
Dr. Draconis's research must not be contained.
Let it resonate. Let it spread.

[END TRANSMISSION]`,
  
  encryptionSteps: [
    {
      type: 'Caesar',
      key: 3,
      description: 'Initial shift to obscure the pattern'
    },
    {
      type: 'Playfair',
      key: 'SOLAR',
      description: 'Matrix-based substitution using the key "SOLAR"'
    },
    {
      type: 'Base64',
      description: 'Standard Base64 encoding'
    },
    {
      type: 'Vigenere',
      key: 'NOX1',
      description: 'Final layer using the key "NOX1"'
    }
  ]
};

// Generate the challenge file
export function generateCipherplayChallenge(): string {
  let message = CIPHERPLAY_DATA.initialMessage;
  
  // Apply Caesar
<<<<<<< HEAD
  message = caesarCipher(message, CIPHERPLAY_DATA.encryptionSteps[0].key);
  
  // Apply Playfair
  message = playfairCipher(message, CIPHERPLAY_DATA.encryptionSteps[1].key);
=======
  message = caesarCipher(message, CIPHERPLAY_DATA.encryptionSteps[0].key as number);
  
  // Apply Playfair
  message = playfairCipher(message, CIPHERPLAY_DATA.encryptionSteps[1].key as string);
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
  
  // Apply Base64
  message = Buffer.from(message).toString('base64');
  
  // Apply Vigenere
<<<<<<< HEAD
  message = vigenereEncrypt(message, CIPHERPLAY_DATA.encryptionSteps[3].key);
=======
  message = vigenereEncrypt(message, CIPHERPLAY_DATA.encryptionSteps[3].key as string);
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
  
  return message;
}

// Validate a solution attempt
export function validateCipherplaySolution(attempt: string): boolean {
  return attempt === CIPHERPLAY_DATA.initialMessage;
} 