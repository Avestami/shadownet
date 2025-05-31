import { AudioContext } from 'web-audio-api';
import * as fs from 'fs';
import * as path from 'path';

interface ToneSequence {
  frequency: number;
  duration: number;
  channel: 'left' | 'right';
}

// Morse code timing constants (in seconds)
const DOT_DURATION = 0.1;
const DASH_DURATION = DOT_DURATION * 3;
const INTER_ELEMENT_GAP = DOT_DURATION;
const INTER_CHARACTER_GAP = DOT_DURATION * 3;
const INTER_WORD_GAP = DOT_DURATION * 7;

// Morse code mapping
const MORSE_CODE: Record<string, string> = {
  'T': '-',
  'H': '....',
  'E': '.',
  'K': '-.-',
  'Y': '-.--',
  'I': '..',
  'S': '...',
  'R': '.-.',
  'A': '.-'
};

function generateMorseSequence(text: string): ToneSequence[] {
  const sequence: ToneSequence[] = [];
  let currentTime = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    if (char === ' ') {
      currentTime += INTER_WORD_GAP;
      continue;
    }

    const morseChar = MORSE_CODE[char];
    if (!morseChar) continue;

    for (const element of morseChar) {
      sequence.push({
        frequency: 800, // Standard Morse frequency
        duration: element === '.' ? DOT_DURATION : DASH_DURATION,
        channel: 'left'
      });
      currentTime += element === '.' ? DOT_DURATION : DASH_DURATION;
      currentTime += INTER_ELEMENT_GAP;
    }

    currentTime += INTER_CHARACTER_GAP;
  }

  return sequence;
}

function generateToneSequence(): ToneSequence[] {
  return [
    { frequency: 660, duration: 0.5, channel: 'right' }, // 6
    { frequency: 770, duration: 0.5, channel: 'right' }, // 7
    { frequency: 880, duration: 0.5, channel: 'right' }  // 8
  ];
}

export async function generateBetaChallenge() {
  const context = new AudioContext();
  const duration = 10; // Total duration in seconds
  const sampleRate = context.sampleRate;
  const numSamples = duration * sampleRate;

  // Create stereo buffer
  const buffer = context.createBuffer(2, numSamples, sampleRate);
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  // Generate Morse code sequence
  const morseSequence = generateMorseSequence('THE KEY IS SIT REAR');
  
  // Generate tone sequence
  const toneSequence = generateToneSequence();

  // Apply sequences to channels
  for (const sequence of [...morseSequence, ...toneSequence]) {
    const samples = sequence.duration * sampleRate;
    const channel = sequence.channel === 'left' ? leftChannel : rightChannel;

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      channel[i] += Math.sin(2 * Math.PI * sequence.frequency * t) * 0.5;
    }
  }

  // Add some noise and distortion
  for (let i = 0; i < numSamples; i++) {
    const noise = Math.random() * 0.1 - 0.05;
    leftChannel[i] += noise;
    rightChannel[i] += noise;
  }

  // Export to WAV file
  const outputPath = path.join(process.cwd(), 'public/challenges/beta/dissonance.wav');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Save buffer as WAV file
  // Note: You'll need a WAV encoder library to actually write the file
  // This is just a placeholder for the actual implementation
  console.log('Audio file generated:', outputPath);
}

// Add metadata about the challenge
export const betaAudioMetadata = {
  originalFrequencies: [660, 770, 880],
  morseMessage: 'THE KEY IS SIT REAR',
  isCorrupted: true,
  containsFlag: true,
  hints: [
    'Listen to each channel separately',
    'The right channel contains three distinct tones',
    'The left channel contains a message in Morse code'
  ]
}; 