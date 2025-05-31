import { createCanvas } from '../utils/canvas-polyfill';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
import { AudioContext } from 'web-audio-api';

// RSA parameters
const RSA_PARAMS = {
  p: BigInt('12345678901234567891'), // Intentionally weak prime
  q: BigInt('98765432109876543211'), // Second prime
  e: BigInt(65537) // Public exponent
};

// Calculate RSA components
const n = RSA_PARAMS.p * RSA_PARAMS.q;
const phi = (RSA_PARAMS.p - BigInt(1)) * (RSA_PARAMS.q - BigInt(1));
const d = modInverse(RSA_PARAMS.e, phi);

function modInverse(e: bigint, phi: bigint): bigint {
  let a = e;
  let b = phi;
  let x = BigInt(1);
  let y = BigInt(0);

  while (a > BigInt(1)) {
    const q = a / b;
    let t = b;
    b = a % b;
    a = t;
    t = y;
    y = x - q * y;
    x = t;
  }

  if (x < BigInt(0)) {
    x += phi;
  }

  return x;
}

function rsaEncrypt(message: string, e: bigint, n: bigint): bigint[] {
  return message
    .split('')
    .map(char => {
      const m = BigInt(char.charCodeAt(0));
      let result = BigInt(1);
      let base = m % n;
      let exp = e;

      while (exp > BigInt(0)) {
        if (exp % BigInt(2) === BigInt(1)) {
          result = (result * base) % n;
        }
        base = (base * base) % n;
        exp = exp / BigInt(2);
      }

      return result;
    });
}

// Generate QR code with spectrogram data
async function generateQRSpectrogram(): Promise<Buffer> {
  const qrData = 'SHADOWNET_EY3sONu_8899';
  const canvas = createCanvas(512, 512);
  
  await QRCode.toCanvas(canvas, qrData, {
    width: 512,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  return canvas.toBuffer('image/png');
}

// Generate audio file with embedded QR spectrogram
async function generateAudioWithQR() {
  const context = new AudioContext();
  const duration = 10; // seconds
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(2, duration * sampleRate, sampleRate);
  
  // Convert QR code to frequency data
  const qrBuffer = await generateQRSpectrogram();
  const qrData = new Uint8Array(qrBuffer);
  
  // Embed QR data as frequencies
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  for (let i = 0; i < qrData.length; i++) {
    const frequency = 200 + (qrData[i] * 2); // Map 0-255 to 200-710 Hz
    const samplesPerPixel = Math.floor(sampleRate / 64); // 64 pixels per second
    
    for (let j = 0; j < samplesPerPixel; j++) {
      const t = (i * samplesPerPixel + j) / sampleRate;
      const sample = Math.sin(2 * Math.PI * frequency * t);
      
      if (i * samplesPerPixel + j < leftChannel.length) {
        leftChannel[i * samplesPerPixel + j] = sample * 0.5;
        rightChannel[i * samplesPerPixel + j] = sample * 0.3;
      }
    }
  }

  // Add some noise and distortion
  for (let i = 0; i < buffer.length; i++) {
    leftChannel[i] += (Math.random() - 0.5) * 0.1;
    rightChannel[i] += (Math.random() - 0.5) * 0.1;
  }

  return buffer;
}

// Generate the challenge files
export async function generateInterceptedChallenge() {
  // Prevent execution in production - these are only used for local development
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping intercepted challenge generation in production environment');
    return;
  }
  
  const outputDir = path.join(process.cwd(), 'public/challenges/intercepted');
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate and save the audio file
  const audioBuffer = await generateAudioWithQR();
  // Note: You'll need a WAV encoder library to actually write the file
  console.log('Audio file would be saved to:', path.join(outputDir, 'uplink.wav'));

  // Generate RSA challenge components
  const message = 'TH3Y_ARE_LIST3NING_T00';
  const encrypted = rsaEncrypt(message, RSA_PARAMS.e, n);

  // Save RSA parameters
  const rsaData = {
    n: n.toString(),
    e: RSA_PARAMS.e.toString(),
    p: RSA_PARAMS.p.toString(), // Intentionally leaked
    ciphertext: encrypted.map(n => n.toString())
  };

  fs.writeFileSync(
    path.join(outputDir, 'intercepted.json'),
    JSON.stringify(rsaData, null, 2)
  );

  // Create a "leaked" memo
  const memoContent = `
INTERNAL MEMO - SECURITY AUDIT
=============================
Critical vulnerability detected in RSA implementation.
Prime factor 'p' potentially compromised.
Value: ${RSA_PARAMS.p}

RECOMMENDATION: Immediate key rotation required.
STATUS: Pending review
PRIORITY: High

[END MEMO]
`;

  fs.writeFileSync(path.join(outputDir, 'audit_memo.txt'), memoContent);
}

// Challenge metadata
export const INTERCEPTED_METADATA = {
  primaryFlag: 'SHADOWNET{EXFILTRATE_EY3sONLY_TRANSMIT_FAILED}',
  secondaryFlag: 'SHADOWNET{TH3Y_ARE_LIST3NING_T00}',
  qrData: 'SHADOWNET_EY3sONu_8899',
  rsaComponents: {
    p: RSA_PARAMS.p.toString(),
    e: RSA_PARAMS.e.toString()
  },
  hints: [
    'The spectrogram might reveal more than just noise',
    'One RSA prime factor has been leaked',
    'The uplink seems intentionally vulnerable'
  ]
}; 