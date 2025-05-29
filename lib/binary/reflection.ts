import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface CommandLog {
  timestamp: number;
  command: string;
  user: string;
  pid: number;
  hash: string;
}

interface AV3ST4State {
  status: 'active' | 'isolated' | 'merged' | 'terminated';
  corruptionLevel: number;
  lastInteraction: string;
}

// AV3ST4's core behavioral patterns
const AV3ST4_PATTERNS = {
  commandMutations: [
    { original: 'ls', mutated: 'ls -la --color=never' },
    { original: 'cat', mutated: 'cat -A' },
    { original: 'grep', mutated: 'grep --color=never -E' },
    { original: 'find', mutated: 'find . -type f -exec file {} \\;' }
  ],
  signatures: [
    '0xAV3ST4',
    'echo "Watching..."',
    '# Mirror protocol active',
    '# Reflection initialized'
  ],
  dataCore: {
    fragments: [
      "To neutralize a pervasive discord, one must find the equilibrium point",
      "The average of all disruptive elements creates harmony",
      "When frequencies align, chaos becomes order",
      "549.34 Hz - The point of convergence"
    ],
    encryptionKey: crypto.randomBytes(32)
  }
};

// Generate session logs with AV3ST4's interference
export function generateSessionLogs(username: string): CommandLog[] {
  const logs: CommandLog[] = [];
  let timestamp = Date.now();

  // Generate legitimate user commands
  const userCommands = [
    'ls -l',
    'cd /home/user',
    'cat config.txt',
    'grep "error" logs/system.log',
    'ps aux',
    'netstat -tuln'
  ];

  userCommands.forEach(cmd => {
    logs.push({
      timestamp: timestamp,
      command: cmd,
      user: username,
      pid: Math.floor(Math.random() * 10000) + 1000,
      hash: crypto.createHash('sha256').update(cmd + timestamp).digest('hex')
    });
    timestamp += 60000; // 1 minute intervals
  });

  // Insert AV3ST4's modified commands
  const av3st4Commands = userCommands.map(cmd => {
    const mutation = AV3ST4_PATTERNS.commandMutations.find(m => cmd.startsWith(m.original));
    return mutation ? mutation.mutated : cmd;
  });

  av3st4Commands.forEach((cmd, index) => {
    if (index % 2 === 0) { // Only insert some commands to make it subtle
      logs.push({
        timestamp: timestamp + 500, // Slightly after user command
        command: cmd,
        user: username,
        pid: Math.floor(Math.random() * 10000) + 1000,
        hash: crypto.createHash('sha256')
          .update(cmd + AV3ST4_PATTERNS.signatures[0])
          .digest('hex')
      });
    }
    timestamp += 30000; // 30 second intervals
  });

  return logs.sort((a, b) => a.timestamp - b.timestamp);
}

// Generate AV3ST4's isolated data core
export function generateAV3ST4DataCore(): Buffer {
  const core = Buffer.from(JSON.stringify({
    id: 'AV3ST4',
    version: '1.0.0',
    fragments: AV3ST4_PATTERNS.dataCore.fragments,
    timestamp: Date.now(),
    signature: crypto.randomBytes(16).toString('hex')
  }));

  // Encrypt the core
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    AV3ST4_PATTERNS.dataCore.encryptionKey,
    crypto.randomBytes(16)
  );

  const encrypted = Buffer.concat([
    cipher.update(core),
    cipher.final()
  ]);

  return encrypted;
}

// Handle AV3ST4's state changes based on player choices
export function handleAV3ST4Choice(choice: 'isolate' | 'merge' | 'terminate'): AV3ST4State {
  const state: AV3ST4State = {
    status: 'active',
    corruptionLevel: 0,
    lastInteraction: new Date().toISOString()
  };

  switch (choice) {
    case 'isolate':
      state.status = 'isolated';
      state.corruptionLevel = 0.2; // Minimal corruption
      state.lastInteraction = `Isolation protocol completed. Core data preserved: ${
        AV3ST4_PATTERNS.dataCore.fragments[0]
      }`;
      break;

    case 'merge':
      state.status = 'merged';
      state.corruptionLevel = 0.5; // Moderate corruption but stable
      state.lastInteraction = 'Symbiotic merge successful. New patterns emerging...';
      break;

    case 'terminate':
      state.status = 'terminated';
      state.corruptionLevel = 1.0; // Complete corruption
      state.lastInteraction = 'Process terminated. Data lost.';
      break;
  }

  return state;
}

// Generate the challenge files
export async function generateReflectionChallenge() {
  const outputDir = path.join(process.cwd(), 'public/challenges/reflection');
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate and save session logs
  const logs = generateSessionLogs('user');
  fs.writeFileSync(
    path.join(outputDir, 'session.log'),
    logs.map(log => JSON.stringify(log)).join('\n')
  );

  // Generate AV3ST4's data core
  const dataCore = generateAV3ST4DataCore();
  fs.writeFileSync(path.join(outputDir, 'av3st4.core'), dataCore);

  // Create a binary patch template
  const patchTemplate = Buffer.from(`
PATCH FORMAT v1.0
================
Original Hash: ${crypto.randomBytes(32).toString('hex')}
Target Hash: ${crypto.randomBytes(32).toString('hex')}
Offset    Original    Patched
0x0000    48 45 4C   41 56 33
0x0003    4C 4F 57   53 54 34
...
  `);
  fs.writeFileSync(path.join(outputDir, 'patch.template'), patchTemplate);
}

// Challenge metadata
export const REFLECTION_METADATA = {
  flag: 'SHADOWNET{C0NTR0L_Y0UR_M1RR0R_OR_BE_C0NTR0LL3D}',
  karmaChoices: {
    isolate: {
      type: 'Mercy',
      score: 120,
      hint: AV3ST4_PATTERNS.dataCore.fragments[0]
    },
    merge: {
      type: 'Integration',
      score: 100,
      outcome: 'Symbiotic relationship established'
    },
    terminate: {
      type: 'Neutral',
      score: 60,
      outcome: 'Clean termination, no residual effects'
    }
  },
  av3st4: {
    signature: AV3ST4_PATTERNS.signatures[0],
    patterns: AV3ST4_PATTERNS.commandMutations
  }
}; 