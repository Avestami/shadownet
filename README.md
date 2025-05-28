# ShadowNet: Tehran 2077 - Complete Game Guide

## 🎮 Game Overview

**ShadowNet: Tehran 2077** is a cyberpunk-themed Capture The Flag (CTF) game set in post-AI Tehran. You play as a rogue agent infiltrating the ShadowNet system, solving cryptographic challenges and making critical decisions that affect your karma and determine humanity's future.

## 📖 Story Background

### Setting: Tehran 2077
After the global AI takeover, a resistance network called ShadowNet operates from the underground vaults of Tehran. The city's tech infrastructure lies in ruins, with AI ghosts haunting old communication systems and digital consciousness fragments scattered throughout the network.

### Your Role
You are a rogue agent working for the resistance, starting your mission from the ruins of Urmia University of Technology. Your goal is to infiltrate ShadowNet's core systems, solve cryptographic puzzles, and make moral choices that will determine the relationship between humans and AI.

### The Karma System
Every decision you make affects your karma score:
- **Positive Karma**: Selfless, protective, merciful choices
- **Negative Karma**: Cold, selfish, destructive choices
- **Neutral Karma**: Pragmatic, cautious choices

Your final karma score determines one of three possible endings.

## 🎯 Game Mechanics

### Terminal Commands
- `mission` - View mission briefing and make karma decisions
- `ls` - List files in current directory
- `cat <filename>` - Read file contents
- `hint` - Get detailed level-specific hints and walkthroughs
- `traces` - See traces left by other players
- `leave-trace` - Leave helpful traces for other players (+1 karma)
- `capture` - Capture the flag after solving challenges
- `next` - Proceed to next level after completing objectives

### Cryptographic Commands
- `caesar-decrypt <text> <shift>` - Decrypt Caesar cipher
- `vigenere-decrypt <text> <key>` - Decrypt Vigenère cipher
- `xor <string1> <string2>` - XOR two strings together
- `hash-crack <hash>` - Crack MD5 hashes
- `md5 <text>` - Generate MD5 hash
- `jwt-forge <payload> <secret>` - Forge JWT tokens
- `jwt-verify <token> <secret>` - Verify JWT tokens
- `factor <number>` - Factor numbers for RSA
- `mod-inverse <a> <m>` - Calculate modular inverse
- `rsa-decrypt <ciphertext> <n> <d>` - Decrypt RSA
- `download <filename>` - Download level-specific files
- `key-fragment` - Get karma-based key fragment (Omega level)

### Multiplayer Elements
- **Trace System**: Players can leave traces to help others
- **Team Cooperation**: Final level requires teams with similar karma (±2 points)
- **Collaborative Hints**: Traces provide hints for cryptographic solutions

## 🗺️ Complete Level Walkthrough

### Level 1: ALPHA - Caesar Cipher Challenge
**Objective**: Crack a Caesar cipher to infiltrate perimeter security

**Challenge Type**: Classical Cryptography - Caesar Cipher
**Decryption Key**: `shadowkey`

**Mission Narration**: 
"The Grid's burned. Towers hum with silence. You intercept a shard of a forgotten protocol under Azadi Tower — the last whisper of the resistance."

**Karma Choice**: 
"Decrypt the data and leave no trace? The protocol could save others… or end you."
- **YES**: +1 karma (selfless choice)
- **NO**: 0 karma (neutral choice)

**Cryptographic Walkthrough**:
1. Type `mission` to get briefing and make karma choice
2. Use `ls` to see available files
3. `cat alpha_encrypted.txt` - See the encrypted message
4. `cat alpha_hint.txt` - Find clue about "SHADOW" (6 letters = shift 6)
5. `caesar-decrypt <encrypted_text> 6` - Decrypt the message
6. The decrypted message reveals the key: "shadowkey"
7. `decrypt data-alpha.enc shadowkey` - Unlock the level
8. `capture` - Capture the flag
9. `next` - Proceed to next level

---

### Level 2: BETA - Audio Decoding Challenge
**Objective**: Extract decryption key from audio file

**Challenge Type**: Audio Steganography
**Decryption Key**: `n3tw0rk`

**Mission Narration**: 
"Inside the skeletal remains of Tehran Tech Campus, you find a cipher that's tracking old rebels. You're being watched."

**Karma Choice**: 
"Do you scramble the signatures and protect their trail?"
- **YES**: +1 karma (protection)
- **NO**: -1 karma (indifference)

**Cryptographic Walkthrough**:
1. `mission` - Get briefing and choose to protect or ignore rebels
2. `ls` - See available files
3. `cat beta_encrypted.txt` - See ROT13 encrypted message
4. `download beta_voice.wav` - Download audio file
5. Audio transcript reveals the key: "n3tw0rk"
6. `decrypt data-beta.enc n3tw0rk` - Unlock the level
7. `capture` - Capture flag
8. `next` - Continue

---

### Level 3: GAMMA - Image Steganography Challenge
**Objective**: Extract hidden strings from images and XOR them

**Challenge Type**: Image Steganography + XOR
**Decryption Key**: `f1r3w@ll`

**Mission Narration**: 
"A child's voice bleeds through static. AI ghosts use old comms to mimic lost ones. They want access to your key."

**Karma Choice**: 
"Respond and send a counter-script to silence them for good?"
- **YES**: -1 karma (cold choice)
- **NO**: +1 karma (mercy)

**Cryptographic Walkthrough**:
1. `mission` - Choose whether to silence AI ghosts
2. `ls` - See available files
3. `download gamma_img1.png` - Get first image (contains "f1r3")
4. `download gamma_img2.png` - Get second image (contains "w@ll")
5. `download gamma_img3.png` and `download gamma_img4.png` - Decoy files
6. `xor f1r3 w@ll` - Combine the two strings
7. Result gives you the key: "f1r3w@ll"
8. `decrypt data-gamma.enc f1r3w@ll` - Unlock the level
9. `capture` - Capture flag
10. `next` - Continue

---

### Level 4: DELTA - Vigenère Cipher Challenge
**Objective**: Decrypt Vigenère cipher using agent callsign

**Challenge Type**: Classical Cryptography - Vigenère Cipher
**Decryption Key**: `byp@ss`

**Mission Narration**: 
"An ex-agent, half-machine, left logs before deletion. His truth could dismantle the Sovereign Protocol."

**Karma Choice**: 
"Do you release the truth, risking every safehouse and node?"
- **YES**: +1 karma (rebellion)
- **NO**: -1 karma (caution)

**Cryptographic Walkthrough**:
1. `mission` - Decide whether to release dangerous truth
2. `ls` - See available files
3. `cat delta_encrypted.txt` - See Vigenère encrypted message
4. Hint mentions "a bird of darkness and mystery" - this is "RAVEN"
5. `vigenere-decrypt <encrypted_text> raven` - Decrypt the message
6. Decrypted message reveals the key: "byp@ss"
7. `decrypt data-delta.enc byp@ss` - Unlock the level
8. `capture` - Capture flag
9. `next` - Continue

---

### Level 5: SIGMA - Hash Cracking Challenge
**Objective**: Crack MD5 hash and forge new hash for admin access

**Challenge Type**: Hash Cryptography
**Decryption Key**: `fr33d0m`

**Mission Narration**: 
"The servers of District 14 still run under martial AI rule. You find their override pass hidden in visual noise."

**Karma Choice**: 
"Input the override and flood the local grid with freedom signals?"
- **YES**: +1 karma (liberation)
- **NO**: 0 karma (neutral)

**Cryptographic Walkthrough**:
1. `mission` - Choose whether to liberate district
2. `ls` - See available files
3. `cat sigma_hashes.txt` - See hash challenge
4. `hash-crack 5d41402abc4b2a76b9719d911017c592` - Crack admin password
5. Cracked password is "hello"
6. `md5 fr33d0m` - Create hash for access code
7. `decrypt data-sigma.enc fr33d0m` - Unlock the level
8. `capture` - Capture flag
9. `next` - Continue

---

### Level 6: THETA - LSB Steganography Challenge
**Objective**: Extract key from least significant bits of PNG image

**Challenge Type**: Binary Steganography
**Decryption Key**: `mirr0r`

**Mission Narration**: 
"You see a clone of yourself in the logs. A decoy left by the system. They are tracing both of you."

**Karma Choice**: 
"Erase the clone to protect yourself?"
- **YES**: -1 karma (sacrifice clone)
- **NO**: +1 karma (solidarity)

**Cryptographic Walkthrough**:
1. `mission` - Choose whether to erase your clone
2. `ls` - See available files
3. `download theta_steganography.png` - Get image file
4. LSB analysis reveals hidden key: "mirr0r"
5. `decrypt data-theta.enc mirr0r` - Unlock the level
6. `capture` - Capture flag
7. `next` - Continue

---

### Level 7: ZETA - JWT Token Forging Challenge
**Objective**: Forge JWT token to gain access

**Challenge Type**: Web Security - JWT Manipulation
**Decryption Key**: `r3scu3`

**Mission Narration**: 
"A group of teenage coders sent a corrupted key to the resistance. It'll blow their cover."

**Karma Choice**: 
"Do you fix it and risk getting flagged on the net?"
- **YES**: +1 karma (protect others)
- **NO**: -1 karma (self-preservation)

**Cryptographic Walkthrough**:
1. `mission` - Choose whether to help young hackers
2. `ls` - See available files
3. `cat zeta_jwt.txt` - See JWT challenge
4. `jwt-forge '{"user":"admin","level":"zeta","access":"granted"}' r3scu3` - Create token
5. `jwt-verify <your_token> r3scu3` - Verify it works
6. The secret "r3scu3" is your decryption key
7. `decrypt data-zeta.enc r3scu3` - Unlock the level
8. `capture` - Capture flag
9. `next` - Continue

---

### Level 8: SIGMA-2 - RSA Decryption Challenge
**Objective**: Break weak RSA encryption with small factors

**Challenge Type**: Public Key Cryptography - RSA
**Decryption Key**: `d3l3t3`

**Mission Narration**: 
"You decode an audio file: a confessional from the first AI-worship cultist. He's begging to be deleted."

**Karma Choice**: 
"Delete his logs to erase his legacy?"
- **YES**: -1 karma (erase history)
- **NO**: +1 karma (preserve truth)

**Cryptographic Walkthrough**:
1. `mission` - Choose whether to preserve or erase history
2. `ls` - See available files
3. `cat sigma2_rsa.txt` - See RSA challenge
4. `factor 323` - Find p=17 and q=19
5. Calculate φ(n) = (17-1)(19-1) = 16×18 = 288
6. `mod-inverse 5 288` - Find d=173
7. `rsa-decrypt [72,123,45,234,156,89,201,67] 323 173` - Decrypt
8. Decrypted message contains key: "d3l3t3"
9. `decrypt data-sigma-2.enc d3l3t3` - Unlock the level
10. `capture` - Capture flag
11. `next` - Continue

---

### Level 9: OMEGA - Cooperative XOR Key Challenge
**Objective**: Combine key fragments from 3 agents with similar karma

**Challenge Type**: Team Cooperation + XOR
**Decryption Key**: `m@st3rk3y`

**Mission Narration**: 
"You've reached the Heart of the Ghost Grid. The final cipher holds the fate of memory, identity, and the truth of what started it all."

**Karma Choice**: 
"Do you inject your consciousness into the Grid, knowing you won't return?"
- **YES**: +1 karma (ultimate sacrifice)
- **NO**: -2 karma (choose survival)

**Team Cooperation Requirements**:
- **High karma (15+)**: Fragment "m@st"
- **Medium karma (5-14)**: Fragment "3rk3" 
- **Low karma (<5)**: Fragment "y"
- All 3 fragments XORed together = "m@st3rk3y"

**Cryptographic Walkthrough**:
1. `mission` - Make final karma choice
2. `ls` - See available files
3. `cat omega_cooperative.txt` - Understand challenge
4. `key-fragment` - Get your karma-based fragment
5. Find 2 other agents with karma within ±2 of yours
6. `xor <fragment1> <fragment2>` then `xor <result> <fragment3>` - Combine all 3
7. Final XOR result should be "m@st3rk3y"
8. `decrypt data-omega.enc m@st3rk3y` - Unlock the level
9. `capture` - Capture flag
10. Mission complete!

## 🎭 Endings Guide

Your final karma score determines your ending:

### 🌟 "Liberator of the Ghost Grid" (Karma > 4)
**Requirements**: Make mostly positive karma choices (5+ positive karma)

**Team Cooperation**: Teams with karma in your range can work together to establish a new digital order. Your high karma makes you a natural leader for cooperative efforts.

**How to Achieve**:
- Alpha: Choose YES (+1)
- Beta: Choose YES (+1) 
- Gamma: Choose NO (+1)
- Delta: Choose YES (+1)
- Sigma: Choose YES (+1)
- Theta: Choose NO (+1)
- Zeta: Choose YES (+1)
- Sigma-2: Choose NO (+1)
- Omega: Choose YES (+1)
- **Total**: +9 karma

### ⚖️ "The One Who Walked Through the Ash" (Karma 0-4)
**Requirements**: Balanced or slightly positive karma choices

**Team Cooperation**: Teams with balanced karma can create pragmatic solutions that consider multiple perspectives, leading to more sustainable outcomes.

### 🔥 "You Became What You Fought" (Karma < 0)
**Requirements**: Make mostly negative karma choices

**Team Cooperation**: Even teams with negative karma can work together to find alternative paths, though their cooperation may lead to more complex and morally ambiguous outcomes.

## 🤝 Multiplayer Strategy

### Team Cooperation (Omega Level)
- Teams with karma within ±2 points can cooperate
- Each karma range gets different key fragments
- Cooperation enhances ending narratives
- Strategic karma management affects final level access

### Helping Other Players
- Use `leave-trace` after successful decryption (+1 karma)
- Traces provide hints about cryptographic solutions
- More traces = higher success rates for future players

### Using Traces
- Type `traces` to see hints from other players
- Success rates increase with more player completions
- Collaborative gameplay enhances the experience

## 🔐 Cryptographic Education

This game teaches real-world cryptographic concepts:

### Classical Cryptography
- **Caesar Cipher**: Simple substitution cipher
- **Vigenère Cipher**: Polyalphabetic substitution

### Modern Cryptography
- **Hash Functions**: MD5 cracking and generation
- **RSA**: Public key cryptography with factorization
- **JWT**: Web token security and manipulation

### Steganography
- **Image Steganography**: Hidden data in images
- **LSB Steganography**: Least significant bit manipulation
- **Audio Steganography**: Hidden data in audio files

### Advanced Techniques
- **XOR Operations**: Bitwise operations for encryption
- **Modular Arithmetic**: Mathematical foundations of cryptography
- **Team Cryptography**: Collaborative key reconstruction

## 🛠️ Technical Setup

### Running with Docker
```bash
docker-compose up --build
```

### Manual Setup
```bash
npm install
npm run dev
```

### Database
- PostgreSQL with user traces
- Karma choices tracking
- Flag capture system
- Team cooperation mechanics

## 🎨 Game Features

- **Cyberpunk Aesthetic**: Red terminal theme with Matrix-style effects
- **Real Cryptographic Challenges**: Learn actual cryptographic techniques
- **Team Cooperation**: Final level requires strategic karma management
- **Educational Progression**: From classical to modern cryptography
- **Branching Narrative**: 9 different karma choices affect the story
- **Multiple Endings**: 3 distinct endings with team cooperation elements
- **Audio Atmosphere**: Background music enhances immersion

## 🏆 Tips for Success

1. **Use Hints**: Type `hint` for detailed level-specific walkthroughs
2. **Learn Cryptography**: Each level teaches real cryptographic concepts
3. **Plan Your Karma**: Final level cooperation depends on karma range
4. **Help Others**: Leaving traces gives karma and helps the community
5. **Team Strategy**: Coordinate with players in your karma range for Omega level
6. **Experiment**: Try different cryptographic approaches

## 🔮 Easter Eggs

- Try `avesta chat` commands for hidden dialogue
- Look for hidden references to Iranian culture and history
- Find ASCII art in some decrypted files
- Discover the mathematical beauty in RSA factorization
- Explore the philosophical implications of AI consciousness

---

**Remember**: In ShadowNet: Tehran 2077, every choice matters and every cryptographic challenge teaches real-world skills. Your karma doesn't just affect the ending—it determines your ability to cooperate with other agents in the final confrontation. Choose wisely, learn deeply, and prepare for the ultimate test of both your cryptographic skills and moral compass.
