# ShadowNet CTF: Cryptographic Challenges Guide

This document provides a complete walkthrough of all cryptographic challenges in the ShadowNet CTF game.

## Mission Overview

Each level now features a specific cryptographic challenge that must be solved to obtain the decryption key:

1. **Alpha** - Caesar Cipher
2. **Beta** - Audio Decoding  
3. **Gamma** - Image Steganography + XOR
4. **Delta** - Vigenère Cipher
5. **Sigma** - Hash Cracking
6. **Theta** - LSB Steganography
7. **Zeta** - JWT Token Forging
8. **Sigma-2** - RSA Decryption
9. **Omega** - Cooperative XOR Keys

## Level-by-Level Solutions

### ALPHA - Caesar Cipher Challenge

**Objective**: Decrypt a Caesar cipher to find the access key.

**Steps**:
1. `cat alpha_encrypted.txt` - View the encrypted message
2. `cat alpha_hint.txt` - Get the hint about the shift value
3. Count letters in "SHADOW" = 6 letters = shift of 6
4. `caesar-decrypt "WKDW LV D VHFUHW PHVVDJH IURP WKH UHVLVWDQFH" 6`
5. Decrypted: "THAT IS A SECRET MESSAGE FROM THE RESISTANCE"
6. The key "shadowkey" is revealed in the decrypted text
7. `decrypt data-alpha.enc shadowkey`

**Key**: `shadowkey`

### BETA - Audio Decoding Challenge

**Objective**: Extract a decryption key from an audio file.

**Steps**:
1. `cat beta_encrypted.txt` - View ROT13 encrypted instructions
2. `download beta_voice.wav` - Download the audio file
3. Audio transcript reveals: "The network key is... n3tw0rk... remember this..."
4. `decrypt data-beta.enc n3tw0rk`

**Key**: `n3tw0rk`

### GAMMA - Image Steganography + XOR Challenge

**Objective**: Extract hidden strings from images and XOR them together.

**Steps**:
1. `download gamma_img1.png` - Contains hidden string "f1r3"
2. `download gamma_img2.png` - Contains hidden string "w@ll"
3. `download gamma_img3.png` - Decoy image (no data)
4. `download gamma_img4.png` - Decoy image (no data)
5. `xor f1r3 w@ll` - Combine the two strings
6. Result: "f1r3w@ll"
7. `decrypt data-gamma.enc f1r3w@ll`

**Key**: `f1r3w@ll`

### DELTA - Vigenère Cipher Challenge

**Objective**: Decrypt a Vigenère cipher using an agent callsign.

**Steps**:
1. `cat delta_encrypted.txt` - View the encrypted message
2. Hint: "a bird of darkness and mystery" = RAVEN
3. `vigenere-decrypt "Kzjvh wf r hvxkvg rvvag jzgz gzv xrppfmtl krjva" raven`
4. Decrypted: "There is a secret agent with the callsign raven"
5. The key "byp@ss" is revealed in the full decrypted message
6. `decrypt data-delta.enc byp@ss`

**Key**: `byp@ss`

### SIGMA - Hash Cracking Challenge

**Objective**: Crack an MD5 hash and forge a new one.

**Steps**:
1. `cat sigma_hashes.txt` - View the hash challenge
2. `hash-crack 5d41402abc4b2a76b9719d911017c592` - Crack the admin hash
3. Result: "hello"
4. `md5 fr33d0m` - Create hash for the access code
5. `decrypt data-sigma.enc fr33d0m`

**Key**: `fr33d0m`

### THETA - LSB Steganography Challenge

**Objective**: Extract a key from the least significant bits of a PNG image.

**Steps**:
1. `download theta_steganography.png` - Download the image
2. LSB analysis reveals: "mirr0r"
3. `decrypt data-theta.enc mirr0r`

**Key**: `mirr0r`

### ZETA - JWT Token Forging Challenge

**Objective**: Forge a JWT token to gain access.

**Steps**:
1. `cat zeta_jwt.txt` - View the JWT challenge
2. `jwt-forge '{"user":"admin","level":"zeta","access":"granted"}' r3scu3`
3. `jwt-verify <your_token> r3scu3` - Verify the token
4. `decrypt data-zeta.enc r3scu3`

**Key**: `r3scu3`

### SIGMA-2 - RSA Decryption Challenge

**Objective**: Break weak RSA encryption with small n.

**Steps**:
1. `cat sigma2_rsa.txt` - View the RSA challenge
2. `factor 323` - Find factors: 17 × 19
3. Calculate φ(n) = (17-1)(19-1) = 16×18 = 288
4. `mod-inverse 5 288` - Find d = 173
5. `rsa-decrypt [72,123,45,234,156,89,201,67] 323 173`
6. Decrypted message contains "d3l3t3"
7. `decrypt data-sigma-2.enc d3l3t3`

**Key**: `d3l3t3`

### OMEGA - Cooperative XOR Keys Challenge

**Objective**: Three agents with similar karma must combine key fragments.

**Requirements**:
- 3 agents with karma within ±2 of each other
- Each agent gets a different fragment based on karma level

**Steps**:
1. `cat omega_cooperative.txt` - Understand the challenge
2. `key-fragment` - Get your karma-based fragment:
   - High karma (15+): "m@st"
   - Medium karma (5-14): "3rk3"
   - Low karma (<5): "y"
3. Find 2 other agents with compatible karma
4. `xor <fragment1> <fragment2>` then `xor <result> <fragment3>`
5. Final result should be "m@st3rk3y"
6. `decrypt data-omega.enc m@st3rk3y`

**Key**: `m@st3rk3y` (requires cooperation)

## New Terminal Commands

### Cryptographic Tools
- `caesar-decrypt <text> <shift>` - Decrypt Caesar cipher
- `vigenere-decrypt <text> <key>` - Decrypt Vigenère cipher
- `xor <string1> <string2>` - XOR two strings together
- `hash-crack <hash>` - Attempt to crack MD5 hash
- `md5 <text>` - Generate MD5 hash
- `jwt-forge <payload_json> <secret>` - Forge JWT token
- `jwt-verify <token> <secret>` - Verify JWT token
- `factor <number>` - Factor a number
- `mod-inverse <a> <m>` - Find modular inverse
- `rsa-decrypt <ciphertext_array> <n> <d>` - Decrypt RSA

### File Operations
- `download <filename>` - Download level-specific files
- `key-fragment` - Get your karma-based key fragment (Omega only)

## Cooperative Gameplay

The Omega level introduces a unique cooperative element:

1. **Team Formation**: Players must find 2 others with similar karma scores
2. **Key Distribution**: Each player gets a different fragment based on their karma
3. **Cooperation**: All 3 fragments must be XORed together to get the master key
4. **Strategy**: Players must balance their karma choices throughout the game to enable cooperation

## Tips for Success

1. **Read all files carefully** - Clues are hidden in the mission files
2. **Use the hint system** - Each level has detailed guidance
3. **Experiment with tools** - Try different cryptographic commands
4. **Collaborate** - The final level requires teamwork
5. **Manage your karma** - Your choices affect your ability to cooperate

## Technical Implementation

All cryptographic functions are implemented in `app/lib/cryptoUtils.ts` with proper error handling and validation. The challenges progress from simple classical ciphers to modern cryptographic concepts, providing an educational journey through cryptography. 