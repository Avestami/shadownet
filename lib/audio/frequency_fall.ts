import { AudioContext } from 'web-audio-api';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface KarmaState {
  loyalty: number;
  defiance: number;
  mercy: number;
  curiosity: number;
  integration: number;
}

interface AudioVariant {
  baseFrequency: number;
  noiseLevel: number;
  distortionLevel: number;
  harmonics: number[];
}

// The five key frequencies from Dr. Draconis's research
const HARMONIC_FREQUENCIES = [
  114.7, // Anxiety
  227.3, // Calm
  401.1, // Unknown
  666.6, // Chaos
  1337.0 // [REDACTED]
];

// Calculate the target average frequency
const TARGET_FREQUENCY = HARMONIC_FREQUENCIES.reduce((a, b) => a + b) / HARMONIC_FREQUENCIES.length; // 549.34 Hz

// Generate the final echo audio with embedded flag
async function generateFinalEcho(variant: AudioVariant): Promise<AudioBuffer> {
  const context = new AudioContext();
  const duration = 30; // seconds
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(2, duration * sampleRate, sampleRate);
  
  // Embed the flag in frequency patterns
  const flagPattern = Buffer.from('SHADOWNET{S0UND_0PENED_0UR_EYES}')
    .toString('hex')
    .split('')
    .map(c => parseInt(c, 16) * 20 + 440); // Map hex values to frequencies

  // Generate the base frequency layer
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Add base frequency
    sample += Math.sin(2 * Math.PI * variant.baseFrequency * t) * 0.3;

    // Add harmonics
    variant.harmonics.forEach((harmonic, index) => {
      sample += Math.sin(2 * Math.PI * harmonic * t) * (0.2 / (index + 1));
    });

    // Add flag pattern
    const flagIndex = Math.floor(t * 2) % flagPattern.length;
    sample += Math.sin(2 * Math.PI * flagPattern[flagIndex] * t) * 0.1;

    // Add noise and distortion
    const noise = (Math.random() - 0.5) * variant.noiseLevel;
    const distortion = Math.tanh(sample * variant.distortionLevel);

    leftChannel[i] = (sample + noise) * 0.7 + distortion * 0.3;
    rightChannel[i] = (sample + noise) * 0.5 + distortion * 0.5;
  }

  return buffer;
}

// Generate Dr. Draconis's final log based on karma
async function generateDraconisLog(karma: KarmaState): Promise<AudioBuffer> {
  const context = new AudioContext();
  const duration = 15; // seconds
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, duration * sampleRate, sampleRate);
  
  // Base message components
  const messages = {
    clean: "The average... 549.34 Hz... align the frequencies... purify the signal...",
    corrupted: "T-the... [static] ...quencies... ave... [noise] ...34... [distortion] ...ify...",
    spiritual: "Find the harmony... where all frequencies converge... 549.34... balance...",
    technical: "Frequency shift required... target 549.34 Hz... normalize all channels..."
  };

  // Select message based on dominant karma
  let message = messages.corrupted; // default
  let distortionLevel = 0.5;
  let noiseLevel = 0.3;

  if (karma.loyalty > 100) {
    message = messages.clean;
    distortionLevel = 0.1;
    noiseLevel = 0.1;
  } else if (karma.mercy > 100) {
    message = messages.spiritual;
    distortionLevel = 0.2;
    noiseLevel = 0.2;
  } else if (karma.curiosity > 100) {
    message = messages.technical;
    distortionLevel = 0.3;
    noiseLevel = 0.2;
  }

  // TODO: Implement text-to-speech conversion
  // For now, we'll simulate with frequency patterns
  const channel = buffer.getChannelData(0);
  const baseFreq = 200;
  
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    let sample = Math.sin(2 * Math.PI * baseFreq * t);
    
    // Add distortion and noise
    sample = Math.tanh(sample * distortionLevel);
    sample += (Math.random() - 0.5) * noiseLevel;
    
    channel[i] = sample;
  }

  return buffer;
}

// Generate the lab environment audio effects
async function generateLabAmbience(karma: KarmaState): Promise<AudioBuffer> {
  const context = new AudioContext();
  const duration = 60; // seconds
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(2, duration * sampleRate, sampleRate);

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  // Base ambient frequencies
  const ambientFreqs = [50, 100, 150, 200];
  const hum = 60; // Power line hum

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Add base ambient tones
    ambientFreqs.forEach(freq => {
      sample += Math.sin(2 * Math.PI * freq * t) * 0.1;
    });

    // Add power line hum
    sample += Math.sin(2 * Math.PI * hum * t) * 0.05;

    // Modify based on karma
    if (karma.defiance > 100) {
      // More chaotic, aggressive ambience
      sample *= 1.5;
      sample += Math.sin(2 * Math.PI * 666.6 * t) * 0.2;
    } else if (karma.mercy > 100) {
      // Calmer, more harmonious ambience
      sample *= 0.7;
      sample += Math.sin(2 * Math.PI * 227.3 * t) * 0.1;
    }

    // Add subtle variations between channels
    leftChannel[i] = sample + (Math.random() - 0.5) * 0.1;
    rightChannel[i] = sample + (Math.random() - 0.5) * 0.1;
  }

  return buffer;
}

// Generate all challenge components based on karma state
export async function generateFrequencyFallChallenge(karma: KarmaState) {
  const outputDir = path.join(process.cwd(), 'public/challenges/frequency_fall');
  fs.mkdirSync(outputDir, { recursive: true });

  // Determine audio variant based on karma
  const variant: AudioVariant = {
    baseFrequency: TARGET_FREQUENCY,
    noiseLevel: 0.3,
    distortionLevel: 0.5,
    harmonics: HARMONIC_FREQUENCIES
  };

  // Modify variant based on karma
  if (karma.loyalty > 100) {
    variant.noiseLevel = 0.1;
    variant.distortionLevel = 0.2;
  } else if (karma.defiance > 100) {
    variant.noiseLevel = 0.5;
    variant.distortionLevel = 0.8;
    variant.harmonics = [...HARMONIC_FREQUENCIES, 800, 900, 1000]; // Additional misleading frequencies
  }

  // Generate audio files
  const finalEcho = await generateFinalEcho(variant);
  const draconisLog = await generateDraconisLog(karma);
  const labAmbience = await generateLabAmbience(karma);

  // TODO: Implement WAV file writing
  console.log('Would save audio files:', {
    finalEcho: path.join(outputDir, 'final_echo.wav'),
    draconisLog: path.join(outputDir, 'draconis_log.wav'),
    labAmbience: path.join(outputDir, 'lab_ambience.wav')
  });

  // Generate lab environment description
  const labDescription = generateLabDescription(karma);
  fs.writeFileSync(
    path.join(outputDir, 'lab_status.txt'),
    labDescription
  );

  // Create additional files based on karma
  if (karma.loyalty > 100) {
    // Generate failsafe terminal contents
    const failsafeContent = `
DRACONIS RESEARCH FAILSAFE
=========================
BACKUP STATUS: INTACT
FREQUENCY DATA: PRESERVED

Core Frequency: 549.34 Hz
Alignment Protocol: Active
Purification Status: Ready

WARNING: Execute alignment protocol immediately.
`;
    fs.writeFileSync(
      path.join(outputDir, 'failsafe_terminal.txt'),
      failsafeContent
    );
  }

  if (karma.curiosity > 100) {
    // Generate technical schematics
    const schematicContent = `
FREQUENCY MANIPULATION PROTOCOL
=============================
1. Load source audio (final_echo.wav)
2. Apply FFT analysis
3. Identify peak frequencies
4. Calculate target: 549.34 Hz
5. Apply pitch shift: factor = target_freq / current_freq
6. Normalize output
7. Verify spectral alignment

Note: Maintain phase coherence during transformation
`;
    fs.writeFileSync(
      path.join(outputDir, 'frequency_schematic.txt'),
      schematicContent
    );
  }
}

function generateLabDescription(karma: KarmaState): string {
  let description = 'LAB STATUS REPORT\n===============\n\n';

  if (karma.loyalty > 100) {
    description += `
Environment: Partially Stable
Systems: 60% Operational
Backup Power: Active
Containment: Holding

Notes: Failsafe systems responding. Access to secure backup terminal granted.
`;
  } else if (karma.defiance > 100) {
    description += `
Environment: CRITICAL
Systems: UNSTABLE
Power: FLUCTUATING
Containment: COMPROMISED

Warning: Multiple system failures. Extreme frequency distortions detected.
`;
  } else if (karma.mercy > 100) {
    description += `
Environment: Subdued
Systems: Dormant
Power: Minimal
Containment: Passive

Note: Residual frequencies present but non-aggressive. Purity protocols available.
`;
  } else if (karma.curiosity > 100) {
    description += `
Environment: Active Research State
Systems: Diagnostic Mode
Power: Stable
Containment: Experimental

Note: Research terminals active. Frequency manipulation data accessible.
`;
  } else if (karma.integration > 100) {
    description += `
Environment: Resonating
Systems: Harmonizing
Power: Balanced
Containment: Synchronized

Note: Harmonic convergence detected. Frequency patterns aligning.
`;
  }

  return description;
}

// Challenge metadata
export const FREQUENCY_FALL_METADATA = {
  flag: 'SHADOWNET{S0UND_0PENED_0UR_EYES}',
  targetFrequency: TARGET_FREQUENCY,
  harmonicFrequencies: HARMONIC_FREQUENCIES,
  karmaThresholds: {
    loyalty: 100,
    defiance: 100,
    mercy: 100,
    curiosity: 100,
    integration: 100
  },
  hints: {
    loyalty: 'Align the frequency to exactly 549.34 Hz',
    defiance: 'Filter out the phantom frequencies first',
    mercy: 'The frequencies seek their natural state',
    curiosity: 'Calculate the pitch shift ratio',
    integration: 'Find the point where all harmonics converge'
  }
}; 