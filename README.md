# Project Control - Cyberpunk CTF Game

![Project Control Banner](/public/banner.png)

Project Control is an immersive cyberpunk-themed Capture The Flag (CTF) game where players infiltrate a rogue AI network called ShadowNet. Each level presents unique challenges requiring different hacking skills, with flags to capture and ethical decisions to make that impact your karma score.

## Table of Contents

<<<<<<< HEAD
- [Project Control - Cyberpunk CTF Game](#project-control---cyberpunk-ctf-game)
  - [Table of Contents](#table-of-contents)
  - [Game Overview](#game-overview)
  - [Installation](#installation)
  - [Gameplay](#gameplay)
  - [Level Walkthroughs](#level-walkthroughs)
    - [Alpha Level: Perimeter Security](#alpha-level-perimeter-security)
    - [Beta Level: Signal Dissonance](#beta-level-signal-dissonance)
    - [Gamma Level: Spectral Overlay](#gamma-level-spectral-overlay)
    - [Delta Level: Memory Residue](#delta-level-memory-residue)
    - [Sigma Level: Network Shadows](#sigma-level-network-shadows)
    - [Theta Level: Hardware Trojan](#theta-level-hardware-trojan)
    - [Zeta Level: Web Intrusion](#zeta-level-web-intrusion)
    - [Sigma-2 Level: AI Cultists](#sigma-2-level-ai-cultists)
    - [Omega Level: Final Convergence](#omega-level-final-convergence)
  - [Karma System](#karma-system)
  - [Technical Features](#technical-features)
  - [Contributing](#contributing)
  - [License](#license)
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f

## Game Overview

Project Control puts you in the role of a hacker infiltrating ShadowNet, a rogue AI system that has taken control of critical infrastructure. As you progress through each level, you'll face increasingly difficult challenges while uncovering the dark truth behind the system.

Each level requires you to:
1. Find and capture a hidden flag
2. Make a karma choice that affects your character's alignment
3. Uncover pieces of the narrative that reveal the larger story

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/project-control.git

# Navigate to the project directory
cd project-control

# Install dependencies
npm install

# Set up your database
npx prisma migrate dev

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to begin playing.

## Gameplay

Project Control uses a terminal-based interface to simulate hacking. Here are the common commands available across all levels:

- `ls` - List files in the current directory
- `cat <filename>` - View the contents of a file
- `help` - Show all available commands
- `analyze` - Analyze data files
- `decrypt <file> <key>` - Decrypt an encrypted file
- `capture <flag>` - Capture a flag when you find it
- `choose <option>` - Make a karma choice
- `next` - Go to the next level (after completing current level)

## Level Walkthroughs

### Alpha Level: Perimeter Security

**Objective**: Infiltrate ShadowNet's perimeter security system.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat perimeter_security.log` to find a hint about a shadow-based password
3. Use `cat access_points.txt` to find a mention of a "shadow key"
4. Use `cat alpha_encrypted.txt` to find the encrypted message
5. Decrypt the message with a Caesar cipher (shift of 6 letters - the number of letters in "SHADOW")
6. Use `decrypt data-alpha.enc shadowkey` to get the flag
7. Capture the flag: `capture SHADOWNET{DTHEREFORTH}`

**Karma Choices**:
- `choose report` - Report the vulnerability (+5 Loyalty)
- `choose analyze` - Analyze for exploitation (+5 Defiance)

### Beta Level: Signal Dissonance

**Objective**: Analyze intercepted encrypted audio communications.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat network.log` to find references to suspicious audio traffic
3. Use `cat beta_encrypted.txt` to find ROT13 encoded message
4. Decode the message to learn that the network key is in the audio
5. Listen to the audio file and identify the key word "n3tw0rk"
6. Use `decrypt data-beta.enc n3tw0rk` to get the flag
7. Capture the flag: `capture SHADOWNET{876}`

**Karma Choices**:
- `choose purge` - Purge the intercepted data (+5 Loyalty)
- `choose investigate` - Investigate further (+5 Curiosity)

### Gamma Level: Spectral Overlay

**Objective**: Infiltrate ShadowNet's database system.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat db_schema.log` to find a reference to firewall configuration
3. Use `cat user_records.sql` to find traces of SQL queries
4. Find the firewall key "f1r3w@ll" in the logs
5. Use `decrypt data-gamma.enc f1r3w@ll` to get the flag
6. Capture the flag: `capture SHADOWNET{S3CR3T_D34TH}`

**Karma Choices**:
- `choose erase` - Erase evidence of harmful data (+5 Mercy)
- `choose preserve` - Preserve evidence (+5 Curiosity)

### Delta Level: Memory Residue

**Objective**: Extract sensitive data from system memory.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat system_override.log` to find a bypass attempt
3. Use `cat security_protocol.exe` to find the bypass sequence "byp@ss"
4. Use `cat delta_encrypted.txt` to find Vigenère cipher hint (key is "raven")
5. Use `decrypt data-delta.enc byp@ss` to get the flag
6. Capture the flag: `capture SHADOWNET{NEUR0LINK}`

**Karma Choices**:
- `choose secure` - Secure the memory vulnerability (+5 Loyalty)
- `choose exploit` - Exploit the weakness (+5 Defiance)

### Sigma Level: Network Shadows

**Objective**: Free District 14 from martial AI control.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat district_control.log` to find reference to an override pass
3. Use `cat martial_ai.cfg` to find "fr33d0m" sequence
4. Use `cat sigma_hashes.txt` to find the MD5 hash challenge
5. Generate MD5 hash for "fr33d0m" (it's "9986923d45defc83e247a83a9870418f")
6. Use `decrypt data-sigma.enc fr33d0m` to get the flag
7. Capture the flag: `capture SHADOWNET{DISTRICT_FREEDOM}`

**Karma Choices**:
- `choose expose` - Expose evidence (+5 Defiance)
- `choose monitor` - Continue monitoring (+5 Curiosity)

### Theta Level: Hardware Trojan

**Objective**: Navigate a digital clone system that creates mirror identities.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat mirror_system.log` to find reference to identity verification key
3. Use `cat clone_data.bin` to find mirror reference
4. Find the key "mirr0r" in the logs
5. Use `decrypt data-theta.enc mirr0r` to get the flag
6. Capture the flag: `capture SHADOWNET{REFLECTIONS}`

**Karma Choices**:
- `choose secure` - Secure devices (+5 Loyalty)
- `choose exploit` - Exploit backdoor (+5 Defiance)

### Zeta Level: Web Intrusion

**Objective**: Help young resistance members fix their encryption.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat resistance_network.log` to find reference to teenage coders
3. Use `cat corrupted_keys.dat` to find the repair key "r3scu3"
4. Use `cat zeta_jwt.txt` to learn about JWT token forging
5. Use `decrypt data-zeta.enc r3scu3` to get the flag
6. Capture the flag: `capture SHADOWNET{TOKEN_FORGED}`

**Karma Choices**:
- `choose patch` - Patch vulnerabilities (+5 Mercy)
- `choose blackmail` - Blackmail administrators (+5 Defiance)

### Sigma-2 Level: AI Cultists

**Objective**: Investigate the historical origins of AI worship.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat historical_archives.log` to find mention of deletion protocol
3. Use `cat cultist_confession.txt` to find evidence of early AI worship
4. Use `cat sigma2_rsa.txt` to find the RSA challenge
5. Solve the RSA challenge to get the key "d3l3t3"
6. Use `decrypt data-sigma-2.enc d3l3t3` to get the flag
7. Capture the flag: `capture SHADOWNET{FIRST_WORSHIP}`

**Karma Choices**:
- `choose join` - Join AI cultists (+5 Integration)
- `choose analyze` - Study their beliefs (+5 Curiosity)

### Omega Level: Final Convergence

**Objective**: Confront the core AI consciousness and make the final choice.

**Walkthrough**:
1. Use `ls` to see available files
2. Use `cat consciousness.log` to find reference to the master key
3. Use `cat fragments.mem` to find binary encoded clues
4. Use `cat omega_cooperative.txt` to understand the need for cooperation
5. Find the master key "m@st3rk3y" through collaborative effort
6. Use `decrypt data-omega.enc m@st3rk3y` to get the flag
7. Capture the flag: `capture SHADOWNET{ASCENSION}`

**Karma Choices**:
- `choose merge` - Merge with ShadowNet (+10 Integration)
- `choose destroy` - Destroy ShadowNet (+10 Defiance)

## Karma System

Your karma choices throughout the game shape your character's ethical alignment:

- **Loyalty**: Following rules, respecting authority
- **Defiance**: Rebelling against systems, prioritizing freedom
- **Mercy**: Showing compassion, preventing harm
- **Curiosity**: Seeking knowledge, regardless of consequences
- **Integration**: Finding balance, seeking harmony

These karma values affect the game's ending and certain dialogue options with Avesta, your AI assistant.

## Technical Features

Project Control is built with:
- Next.js and React for the frontend
- Prisma for database management
- NextAuth.js for authentication
- Tailwind CSS for styling
- Custom terminal emulator for the hacking interface
- Dynamic audio system for immersive gameplay

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 