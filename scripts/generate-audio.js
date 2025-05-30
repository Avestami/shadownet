// Generate audio for the Beta level challenge
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Directories
const outputDir = path.join(__dirname, '../public/challenges/beta');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate right channel with frequency tones (6, 7, 8)
function generateRightChannel() {
  const sampleRate = 44100;
  const duration = 15; // 15 seconds
  const numSamples = sampleRate * duration;
  const rightChannel = new Float32Array(numSamples);
  
  // Add tones at specific positions
  const tones = [
    { freq: 660, start: 2, duration: 1 },  // 6
    { freq: 770, start: 5, duration: 1 },  // 7
    { freq: 880, start: 8, duration: 1 }   // 8
  ];
  
  // Generate the tones
  tones.forEach(tone => {
    const startSample = tone.start * sampleRate;
    const endSample = startSample + (tone.duration * sampleRate);
    
    for (let i = startSample; i < endSample; i++) {
      const t = (i - startSample) / sampleRate;
      // Fade in/out to avoid clicks
      const amplitude = Math.min(t * 5, (tone.duration - t) * 5, 0.7);
      rightChannel[i] += amplitude * Math.sin(2 * Math.PI * tone.freq * t);
    }
  });
  
  // Add some background noise
  for (let i = 0; i < numSamples; i++) {
    rightChannel[i] += (Math.random() * 2 - 1) * 0.05;
  }
  
  return rightChannel;
}

// Generate left channel with Morse code for "THE KEY IS SIT REAR"
function generateLeftChannel() {
  const sampleRate = 44100;
  const duration = 15; // 15 seconds
  const numSamples = sampleRate * duration;
  const leftChannel = new Float32Array(numSamples);
  
  // Morse code for "THE KEY IS SIT REAR"
  const morse = "- .... .   -.- . -.--   .. ...   ... .. -   .-. . .- .-.";
  
  // Morse timing parameters (in seconds)
  const dotDuration = 0.15;
  const dashDuration = dotDuration * 3;
  const symbolGap = dotDuration;
  const letterGap = dotDuration * 3;
  const wordGap = dotDuration * 7;
  
  // Generate the Morse code
  let currentTime = 1; // Start after 1 second
  
  for (let i = 0; i < morse.length; i++) {
    const char = morse[i];
    
    if (char === '.') {
      // Generate a dot
      const startSample = Math.floor(currentTime * sampleRate);
      const endSample = Math.floor((currentTime + dotDuration) * sampleRate);
      
      for (let j = startSample; j < endSample; j++) {
        const t = (j - startSample) / sampleRate;
        leftChannel[j] += 0.6 * Math.sin(2 * Math.PI * 600 * t);
      }
      
      currentTime += dotDuration + symbolGap;
    } else if (char === '-') {
      // Generate a dash
      const startSample = Math.floor(currentTime * sampleRate);
      const endSample = Math.floor((currentTime + dashDuration) * sampleRate);
      
      for (let j = startSample; j < endSample; j++) {
        const t = (j - startSample) / sampleRate;
        leftChannel[j] += 0.6 * Math.sin(2 * Math.PI * 600 * t);
      }
      
      currentTime += dashDuration + symbolGap;
    } else if (char === ' ') {
      // Space between words or letters
      if (i + 1 < morse.length && morse[i+1] === ' ') {
        // Word gap
        currentTime += wordGap - symbolGap;
        i++; // Skip the next space
      } else {
        // Letter gap
        currentTime += letterGap - symbolGap;
      }
    }
  }
  
  // Add a lot of background noise to make it harder
  for (let i = 0; i < numSamples; i++) {
    leftChannel[i] += (Math.random() * 2 - 1) * 0.3;
  }
  
  return leftChannel;
}

// Create a WAV file with both channels
function createStereoWav(leftChannel, rightChannel, filename) {
  const buffer = Buffer.alloc(44 + leftChannel.length * 4); // 44 bytes header + audio data
  
  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + leftChannel.length * 4, 4); // File size - 8
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Format chunk size
  buffer.writeUInt16LE(1, 20); // Audio format (PCM)
  buffer.writeUInt16LE(2, 22); // Number of channels
  buffer.writeUInt32LE(44100, 24); // Sample rate
  buffer.writeUInt32LE(44100 * 4, 28); // Byte rate
  buffer.writeUInt16LE(4, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(leftChannel.length * 4, 40); // Data chunk size
  
  // Write interleaved audio data
  for (let i = 0; i < leftChannel.length; i++) {
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, leftChannel[i] * 32767)), 44 + i * 4);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, rightChannel[i] * 32767)), 44 + i * 4 + 2);
  }
  
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
}

// Generate and save the audio file
const leftChannel = generateLeftChannel();
const rightChannel = generateRightChannel();
createStereoWav(leftChannel, rightChannel, path.join(outputDir, 'dissonance.wav'));

console.log('Audio file generation complete!'); 