#!/usr/bin/env node

/**
 * This script creates placeholder audio files for all levels
 * Run with: node scripts/create-audio-files.js
 */

const fs = require('fs');
const path = require('path');

const LEVELS = [
  'alpha', 
  'beta', 
  'gamma', 
  'delta', 
  'sigma', 
  'theta', 
  'zeta', 
  'sigma-2', 
  'omega'
];

const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Create the audio directory if it doesn't exist
if (!fs.existsSync(AUDIO_DIR)) {
  console.log(`Creating audio directory: ${AUDIO_DIR}`);
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Create a README file explaining the audio files
const readmeContent = `# Audio Files for ShadowNet Levels

This directory contains audio files for each level of the ShadowNet game.

## Audio Files
${LEVELS.map(level => `- ${level}.mp3 - Background audio for the ${level} level`).join('\n')}

Each level should also have a capture.mp3 file that plays when a flag is captured.

## Adding Custom Audio
Replace these placeholder files with actual audio files with the same names.
`;

fs.writeFileSync(path.join(AUDIO_DIR, 'README.md'), readmeContent);
console.log(`Created README.md in ${AUDIO_DIR}`);

// Create a placeholder README for each missing audio file
LEVELS.forEach(level => {
  const audioFilePath = path.join(AUDIO_DIR, `${level}.mp3`);
  
  // Skip if the file already exists
  if (fs.existsSync(audioFilePath)) {
    console.log(`Audio file for ${level} already exists, skipping.`);
    return;
  }
  
  // Create a placeholder file
  const placeholderContent = `# Placeholder for ${level}.mp3
  
This is a placeholder file. Replace it with an actual audio file for the ${level} level.`;
  
  // Since we can't create actual MP3 files without audio libraries,
  // we'll create a README.md explaining what needs to be done
  fs.writeFileSync(path.join(AUDIO_DIR, `${level}.mp3.README.md`), placeholderContent);
  console.log(`Created placeholder README for ${level}.mp3`);
});

// Create a capture sound placeholder if it doesn't exist
const captureAudioPath = path.join(AUDIO_DIR, 'capture.mp3');
if (!fs.existsSync(captureAudioPath)) {
  const captureContent = `# Placeholder for capture.mp3
  
This is a placeholder file. Replace it with an actual audio file for the flag capture sound.`;
  
  fs.writeFileSync(path.join(AUDIO_DIR, `capture.mp3.README.md`), captureContent);
  console.log(`Created placeholder README for capture.mp3`);
}

console.log('\nDone! Please replace the placeholder files with actual MP3 files.');
console.log('You can use royalty-free audio from sources like https://freesound.org/'); 