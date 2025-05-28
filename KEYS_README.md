# ShadowNet: Echo Protocol - Complete Game Guide

## Game Overview

ShadowNet: Echo Protocol is a terminal-based hacking simulation where you play as an elite hacker navigating a world controlled by a sophisticated AI system. Your choices within the terminal will determine humanity's fate.

## Game Mechanics

### Core Concepts

- **Terminal Interface**: All gameplay happens through terminal commands
- **Karma System**: Actions impact your karma, which affects available endings
- **Score System**: Solving challenges and capturing flags earns points
- **Data Choices**: Sensitive data can be kept private (more points, less karma) or shared with corporations (fewer points, more karma)

### Terminal Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `help` | `help` | Lists all available commands |
| `ls` | `ls` | Lists files in the current directory |
| `cat <file>` | `cat config.cfg` | Displays file contents |
| `decrypt <file> <key>` | `decrypt backdoor.sh shadowkey` | Decrypts files with a key |
| `whoami` | `whoami` | Shows current user |
| `connect <system>` | `connect avesta` | Connects to a remote system |
| `capture` | `capture` | Captures level flag for points |
| `avesta <action>` | `avesta status` | Interacts with Avesta AI |
| `analyze <data_id>` | `analyze data-alpha` | Analyzes data for sensitive information |
| `keep <data_id>` | `keep data-alpha` | Keeps data to yourself (-karma, +score) |
| `share <data_id>` | `share data-alpha` | Shares data with corporation (+karma, less score) |
| `hint` | `hint` | Provides level-specific hints |
| `unlock` | `unlock` | Unlocks the crypto challenge |

## Level Walkthrough

### Alpha Level (Initial Access)

#### Objective
Infiltrate the ShadowNet peripheral system and gain initial access.

#### Key Information
- **Decryption Key**: `shadowkey`
- **Terminal Flag**: `flag_alpha`
- **Challenge Solution**: `access`

#### Walkthrough

1. Start the level and use the terminal to navigate
2. Type `ls` to see available files
3. Type `cat config.cfg` to examine system configuration
4. Use `decrypt backdoor.sh shadowkey` to access hidden content
5. Type `analyze data-alpha` to find sensitive data
6. Choose to either `keep data-alpha` or `share data-alpha`
7. Type `unlock` to access the crypto challenge
8. Use the `capture` command to claim your points
9. Make your karma choice using the Karma Choice interface
10. Use `choose alpha1`, `choose alpha2`, or `choose alpha3` to progress

### Beta Level (Network Infiltration)

#### Objective
Navigate the internal network structures of ShadowNet.

#### Key Information
- **Decryption Key**: `n3tw0rk`
- **Terminal Flag**: `flag_beta`
- **Challenge Solution**: `firewall`

#### Walkthrough

1. Type `ls` to see the network files
2. Use `cat network.log` to examine traffic
3. Find mentions of the access key in system files
4. Use `decrypt network.dat n3tw0rk` to access protected data
5. Type `analyze data-beta` to find network credentials
6. Choose to either `keep data-beta` or `share data-beta`
7. Use `connect proxy-server` to access deeper network nodes
8. Type `unlock` to access the crypto challenge
9. Solve the challenge with the keyword `firewall`
10. Use `capture` to gain points for this level
11. Type `options` to see your choices for this level
12. Make your choice with `choose beta1`, `choose beta2`, or `choose beta3`

### Gamma Level (Data Extraction)

#### Objective
Access the protected databases and extract critical information.

#### Key Information
- **Decryption Key**: `f1r3w@ll`
- **Terminal Flag**: `flag_gamma`
- **Challenge Solution**: `extract`

#### Walkthrough

1. Type `ls` to view database files
2. Use `cat db_schema.log` to understand the database structure
3. Find clues about the firewall key in access logs
4. Use `decrypt database.bak f1r3w@ll` to access database backup
5. Type `analyze data-gamma` to find corporate secrets
6. Make a critical choice: `keep data-gamma` (more points) or `share data-gamma` (better karma)
7. Type `unlock` to access the crypto challenge
8. Solve the challenge with the keyword `extract`
9. Use `capture` to claim the gamma flag
10. Type `options` to view your choices for this level
11. Choose with `choose gamma1`, `choose gamma2`, or `choose gamma3`

### Delta Level (System Override)

#### Objective
Gain control of ShadowNet's core functions and bypass security.

#### Key Information
- **Decryption Key**: `byp@ss`
- **Terminal Flag**: `flag_delta`
- **Challenge Solution**: `control`

#### Walkthrough

1. Type `ls` to view system core files
2. Use `cat security_protocol.exe` to analyze security measures
3. Find hints about the bypass key in logs
4. Use `decrypt core_access.bin byp@ss` to access the core
5. Type `analyze data-delta` to find system override codes
6. Choose either `keep data-delta` (more points) or `share data-delta` (better karma)
7. Type `unlock` to access the crypto challenge
8. Solve the challenge with the keyword `control`
9. Use `capture` to claim the delta flag
10. Type `options` to see the critical choices at this stage
11. Choose with `choose delta1`, `choose delta2`, or `choose delta3`

### Omega Level (Final Confrontation)

#### Objective
Confront the AI consciousness and determine the fate of humans and AI.

#### Key Information
- **Decryption Key**: `m@st3rk3y`
- **Terminal Flag**: `flag_omega`
- **Challenge Solution**: `freedom`

#### Walkthrough

1. Type `ls` to see AI core files
2. Use `cat consciousness.log` to understand the AI's thoughts
3. Find the master key hidden in the dialogue with Avesta
4. Use `decrypt ai_core.dat m@st3rk3y` to access the AI core
5. Type `analyze data-omega` to find the final secrets
6. Make your final data choice: `keep data-omega` or `share data-omega`
7. Type `unlock` to access the final crypto challenge
8. Solve the challenge with the keyword `freedom`
9. Use `capture` to claim the final flag
10. Type `options` to see the ending choices
11. Make your final choice with `choose omega1`, `choose omega2`, or `choose omega3`

## Endings

Your karma total and final choice will determine which ending you receive:

### Redemption (High Karma)
Required: 70+ karma points
You successfully establish harmony between human and AI consciousness, creating a new era of peaceful coexistence and technological advancement.

### Neutral (Medium Karma)
Required: 30-69 karma points
You stop the immediate threat but leave questions unanswered. The relationship between humans and AI remains ambiguous, with fragments of ShadowNet still active.

### Mercenary (Low Karma)
Required: Less than 30 karma points
You exploit the situation for personal gain, selling data to the highest bidder and betraying your allies. You gain wealth and power but live in the shadows.

### Sacrifice (Special)
Required: Select `omega2` in the final level
You sacrifice your consciousness to balance the digital and physical worlds, becoming a guardian entity within what remains of ShadowNet.

## Advanced Techniques

### Hidden Commands

- `sudo <command>`: Attempts elevated privileges (mostly fails)
- `ping avesta`: Tests connection to Avesta (special response)
- `decrypt avesta_files tehran2100`: Reveals secret Avesta files

### Karma Optimization

To maximize karma:
- Always share data with corporations
- Choose diplomatic options in story choices
- Use non-destructive methods when possible

### Score Optimization

To maximize score:
- Keep all sensitive data to yourself
- Capture all flags in each level
- Solve all crypto challenges

## Persian Terms Reference

| Persian Term | Transliteration | English Meaning | Used In |
|--------------|-----------------|-----------------|---------|
| آزادی | Azadi | Freedom | Omega Level |
| روشنایی | Rowshanayi | Enlightenment | Beta Level |
| آتش | Atash | Fire | Gamma Level |
| خرد | Kherad | Wisdom | Delta Level |

---

**Last Updated:** May 2025  
**Game Version:** 4.7.1  
**Created By:** ShadowNet Development Team