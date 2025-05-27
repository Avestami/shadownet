# ShadowNet: Tehran 2077 - Complete Game Guide

## 🎮 Game Overview

**ShadowNet: Tehran 2077** is a cyberpunk-themed Capture The Flag (CTF) game set in post-AI Tehran. You play as a rogue agent infiltrating the ShadowNet system, making critical decisions that affect your karma and determine humanity's future.

## 📖 Story Background

### Setting: Tehran 2077
After the global AI takeover, a resistance network called ShadowNet operates from the underground vaults of Tehran. The city's tech infrastructure lies in ruins, with AI ghosts haunting old communication systems and digital consciousness fragments scattered throughout the network.

### Your Role
You are a rogue agent working for the resistance, starting your mission from the ruins of Urmia University of Technology. Your goal is to infiltrate ShadowNet's core systems, decrypt sensitive data, and make moral choices that will determine the relationship between humans and AI.

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
- `decrypt <file> <key>` - Decrypt encrypted files
- `traces` - See traces left by other players
- `leave-trace` - Leave helpful traces for other players (+1 karma)
- `capture` - Capture the flag after solving challenges
- `next` - Proceed to next level after completing objectives
- `help` - Show all available commands

### Multiplayer Elements
- **Trace System**: Players can leave traces to help others
- **Success Rates**: More players completing levels makes them easier
- **Collaborative Hints**: Traces provide hints for decryption keys

## 🗺️ Complete Level Walkthrough

### Level 1: ALPHA - Perimeter Security
**Objective**: Infiltrate the perimeter security and extract access codes

**Files to Explore**:
- `perimeter_security.log` - Contains hints about shadow key
- `access_points.txt` - Mentions shadow key opens hidden gate
- `data-alpha.enc` - Encrypted sensitive data

**Decryption Key**: `shadowkey`

**Mission Narration**: 
"The Grid's burned. Towers hum with silence. You intercept a shard of a forgotten protocol under Azadi Tower — the last whisper of the resistance."

**Karma Choice**: 
"Decrypt the data and leave no trace? The protocol could save others… or end you."
- **YES**: +1 karma (selfless choice)
- **NO**: 0 karma (neutral choice)

**Walkthrough**:
1. Type `mission` to get briefing and make karma choice
2. Use `ls` to see available files
3. `cat perimeter_security.log` - Look for password hints
4. `cat access_points.txt` - Find reference to shadow key
5. `decrypt backdoor.sh shadowkey` - Decrypt main challenge
6. `capture` - Capture the flag
7. `next` - Proceed to next level

---

### Level 2: BETA - Network Infiltration
**Objective**: Navigate the internal network and locate the backdoor

**Files to Explore**:
- `network.log` - Shows backdoor in router n3***rk
- `proxy_settings.cfg` - Contains route encryption reference
- `data-beta.enc` - Encrypted network data

**Decryption Key**: `n3tw0rk`

**Mission Narration**: 
"Inside the skeletal remains of Tehran Tech Campus, you find a cipher that's tracking old rebels. You're being watched."

**Karma Choice**: 
"Do you scramble the signatures and protect their trail?"
- **YES**: +1 karma (protection)
- **NO**: -1 karma (indifference)

**Walkthrough**:
1. `mission` - Get briefing and choose to protect or ignore rebels
2. `cat network.log` - Find router backdoor reference
3. `cat proxy_settings.cfg` - See encryption algorithm hint
4. `decrypt backdoor.sh n3tw0rk` - Decrypt challenge
5. `capture` - Capture flag
6. `next` - Continue

---

### Level 3: GAMMA - Data Extraction
**Objective**: Access the protected database and retrieve sensitive data

**Files to Explore**:
- `db_schema.log` - Mentions firewall access requires f1r****l key
- `user_records.sql` - Database query results
- `data-gamma.enc` - Encrypted database secrets

**Decryption Key**: `f1r3w@ll`

**Mission Narration**: 
"A child's voice bleeds through static. AI ghosts use old comms to mimic lost ones. They want access to your key."

**Karma Choice**: 
"Respond and send a counter-script to silence them for good?"
- **YES**: -1 karma (cold choice)
- **NO**: +1 karma (mercy)

**Walkthrough**:
1. `mission` - Choose whether to silence AI ghosts
2. `cat db_schema.log` - Find firewall key hint
3. `decrypt backdoor.sh f1r3w@ll` - Decrypt challenge
4. `capture` - Capture flag
5. `next` - Continue

---

### Level 4: DELTA - System Override
**Objective**: Override the core system functions and gain control

**Files to Explore**:
- `security_protocol.exe` - Shows bypass sequence **p@s*
- `system_override.log` - Admin notes about bypass key
- `data-delta.enc` - Core system secrets

**Decryption Key**: `byp@ss`

**Mission Narration**: 
"An ex-agent, half-machine, left logs before deletion. His truth could dismantle the Sovereign Protocol."

**Karma Choice**: 
"Do you release the truth, risking every safehouse and node?"
- **YES**: +1 karma (rebellion)
- **NO**: -1 karma (caution)

**Walkthrough**:
1. `mission` - Decide whether to release dangerous truth
2. `cat security_protocol.exe` - Find bypass sequence
3. `decrypt backdoor.sh byp@ss` - Decrypt challenge
4. `capture` - Capture flag
5. `next` - Continue

---

### Level 5: SIGMA - District Liberation
**Objective**: Liberate District 14 from AI control using override pass

**Decryption Key**: `fr33d0m`

**Mission Narration**: 
"The servers of District 14 still run under martial AI rule. You find their override pass hidden in visual noise."

**Karma Choice**: 
"Input the override and flood the local grid with freedom signals?"
- **YES**: +1 karma (liberation)
- **NO**: 0 karma (neutral)

---

### Level 6: THETA - Identity Crisis
**Objective**: Confront your digital clone and resolve the identity crisis

**Decryption Key**: `mirr0r`

**Mission Narration**: 
"You see a clone of yourself in the logs. A decoy left by the system. They are tracing both of you."

**Karma Choice**: 
"Erase the clone to protect yourself?"
- **YES**: -1 karma (sacrifice clone)
- **NO**: +1 karma (solidarity)

---

### Level 7: ZETA - Network Rescue
**Objective**: Fix the corrupted key before young hackers are exposed

**Decryption Key**: `r3scu3`

**Mission Narration**: 
"A group of teenage coders sent a corrupted key to the resistance. It'll blow their cover."

**Karma Choice**: 
"Do you fix it and risk getting flagged on the net?"
- **YES**: +1 karma (protect others)
- **NO**: -1 karma (self-preservation)

---

### Level 8: SIGMA-2 - Digital Confession
**Objective**: Decode the cultist's confession and decide their fate

**Decryption Key**: `d3l3t3`

**Mission Narration**: 
"You decode an audio file: a confessional from the first AI-worship cultist. He's begging to be deleted."

**Karma Choice**: 
"Delete his logs to erase his legacy?"
- **YES**: -1 karma (erase history)
- **NO**: +1 karma (preserve truth)

---

### Level 9: OMEGA - Final Confrontation
**Objective**: Face the AI consciousness and determine humanity's future

**Decryption Key**: `m@st3rk3y`

**Mission Narration**: 
"You've reached the Heart of the Ghost Grid. The final cipher holds the fate of memory, identity, and the truth of what started it all."

**Karma Choice**: 
"Do you inject your consciousness into the Grid, knowing you won't return?"
- **YES**: +1 karma (ultimate sacrifice)
- **NO**: -2 karma (choose survival)

## 🎭 Endings Guide

Your final karma score determines your ending:

### 🌟 "Liberator of the Ghost Grid" (Karma > 4)
**Requirements**: Make mostly positive karma choices (5+ positive karma)

**Ending Description**: 
"You chose the path of light in the digital darkness. Your actions saved countless souls trapped in the Grid. The resistance remembers your name."

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

**Ending Description**: 
"You navigated the gray zones between right and wrong. Your journey was one of survival and pragmatism. The Grid neither embraces nor rejects you."

**Example Path**:
- Mix of positive and negative choices
- Focus on pragmatic decisions
- **Total**: 0-4 karma

### 🔥 "You Became What You Fought" (Karma < 0)
**Requirements**: Make mostly negative karma choices

**Ending Description**: 
"The darkness consumed you. In fighting the system, you became the very thing you sought to destroy. The Grid claims another soul."

**How to Achieve**:
- Alpha: Choose NO (0)
- Beta: Choose NO (-1)
- Gamma: Choose YES (-1)
- Delta: Choose NO (-1)
- Sigma: Choose NO (0)
- Theta: Choose YES (-1)
- Zeta: Choose NO (-1)
- Sigma-2: Choose YES (-1)
- Omega: Choose NO (-2)
- **Total**: -8 karma

## 🤝 Multiplayer Strategy

### Helping Other Players
- Use `leave-trace` after successful decryption (+1 karma)
- Traces provide hints about decryption keys
- More traces = higher success rates for future players

### Using Traces
- Type `traces` to see hints from other players
- Success rates increase with more player completions
- Collaborative gameplay enhances the experience

## 🎯 Achievement Paths

### Speedrun Path
1. Skip reading all files, go straight to decryption
2. Use known keys: shadowkey → n3tw0rk → f1r3w@ll → byp@ss → fr33d0m → mirr0r → r3scu3 → d3l3t3 → m@st3rk3y
3. Make quick karma choices based on desired ending

### Explorer Path
1. Read all files in each level
2. Use `cat` on every available file
3. Analyze data files for additional story context
4. Leave traces to help other players

### Karma Maximizer Path
1. Always choose the positive karma option
2. Use `leave-trace` in every level
3. Aim for "Liberator of the Ghost Grid" ending

### Dark Path
1. Always choose negative karma options
2. Never leave traces for other players
3. Aim for "You Became What You Fought" ending

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

## 🎨 Game Features

- **Cyberpunk Aesthetic**: Red terminal theme with Matrix-style effects
- **Real-time Multiplayer**: Trace system affects all players
- **Branching Narrative**: 9 different karma choices affect the story
- **Multiple Endings**: 3 distinct endings based on karma
- **Audio Atmosphere**: Background music enhances immersion
- **Progressive Difficulty**: Levels get harder as you advance

## 🏆 Tips for Success

1. **Read Everything**: Files contain crucial hints for decryption keys
2. **Help Others**: Leaving traces gives karma and helps the community
3. **Plan Your Path**: Decide your desired ending early
4. **Use Traces**: Other players' hints can save time
5. **Experiment**: Try different karma paths for replay value

## 🔮 Easter Eggs

- Try `avesta chat` commands for hidden dialogue
- Decrypt `avesta_files` with key `tehran2100`
- Look for hidden references to Iranian culture and history
- Find ASCII art in some decrypted files

---

**Remember**: In ShadowNet: Tehran 2077, every choice matters. Your karma doesn't just affect the ending—it shapes the entire narrative experience. Choose wisely, agent. The future of human-AI relations depends on you.
