import { createCanvas, ImageData } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  metadata?: Record<string, any>;
}

interface AlchemySymbol {
  name: string;
  unicode: string;
  frequency: number;
}

const ALCHEMY_SYMBOLS: AlchemySymbol[] = [
  { name: 'air', unicode: '🜁', frequency: 401.1 },
  { name: 'sun', unicode: '☉', frequency: 666.6 },
  { name: 'earth', unicode: '🜂', frequency: 227.3 }
];

// Generate server logs with timestamp collisions
export function generateServerLogs(): LogEntry[] {
  const logs: LogEntry[] = [];
  const baseTimestamp = '2084-03-27T03:27:09Z';

  // Generate normal logs
  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(Date.parse(baseTimestamp) + i * 1000).toISOString();
    logs.push({
      timestamp,
      level: 'INFO',
      message: `Regular system check ${i}`,
      metadata: {
        checkId: crypto.randomBytes(8).toString('hex')
      }
    });
  }

  // Insert collision logs with hidden data
  logs.push({
    timestamp: baseTimestamp,
    level: 'WARN',
    message: 'Anomalous frequency detected in sector 7',
    metadata: {
      frequency: 401.1,
      symbol: '🜁'
    }
  });

  logs.push({
    timestamp: baseTimestamp,
    level: 'ERROR',
    message: 'System clock desynchronization detected',
    metadata: {
      drift: '+0.000666s',
      symbol: '☉'
    }
  });

  logs.push({
    timestamp: baseTimestamp,
    level: 'DEBUG',
    message: 'Attempting clock resync',
    metadata: {
      correction: -227.3,
      symbol: '🜂'
    }
  });

  return logs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// Generate the three images for XOR operation
export async function generateXORImages() {
  const width = 512;
  const height = 512;
  const outputDir = path.join(process.cwd(), 'public/challenges/leaky');
  fs.mkdirSync(outputDir, { recursive: true });

  // Create three images with hidden patterns
  const images = await Promise.all(
    ALCHEMY_SYMBOLS.map(async (symbol, index) => {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Fill with pattern based on frequency
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw symbol pattern
      ctx.fillStyle = '#FFFFFF';
      const pattern = generatePatternFromFrequency(symbol.frequency);
      for (const [x, y] of pattern) {
        ctx.fillRect(x, y, 1, 1);
      }

      // Save image
      const buffer = canvas.toBuffer('image/png');
      const filename = `symbol_${index + 1}.png`;
      fs.writeFileSync(path.join(outputDir, filename), buffer);

      return ctx.getImageData(0, 0, width, height);
    })
  );

  // Generate XORed result
  const resultCanvas = createCanvas(width, height);
  const resultCtx = resultCanvas.getContext('2d');
  const resultData = resultCtx.createImageData(width, height);

  // XOR all three images
  for (let i = 0; i < resultData.data.length; i += 4) {
    const r = images[0].data[i] ^ images[1].data[i] ^ images[2].data[i];
    const g = images[0].data[i + 1] ^ images[1].data[i + 1] ^ images[2].data[i + 1];
    const b = images[0].data[i + 2] ^ images[1].data[i + 2] ^ images[2].data[i + 2];
    const a = 255;

    resultData.data[i] = r;
    resultData.data[i + 1] = g;
    resultData.data[i + 2] = b;
    resultData.data[i + 3] = a;
  }

  resultCtx.putImageData(resultData, 0, 0);
  const resultBuffer = resultCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'result.png'), resultBuffer);
}

function generatePatternFromFrequency(frequency: number): [number, number][] {
  const pattern: [number, number][] = [];
  const seed = frequency.toString().split('').map(Number);
  
  for (let i = 0; i < 512; i += seed[0]) {
    for (let j = 0; j < 512; j += seed[1]) {
      if ((i + j) % Math.floor(frequency) === 0) {
        pattern.push([i, j]);
      }
    }
  }

  return pattern;
}

// Generate the challenge files
export async function generateLeakyChallenge() {
  const outputDir = path.join(process.cwd(), 'public/challenges/leaky');
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate and save logs
  const logs = generateServerLogs();
  fs.writeFileSync(
    path.join(outputDir, 'server.log'),
    logs.map(log => JSON.stringify(log)).join('\n')
  );

  // Generate XOR images
  await generateXORImages();

  // Create a hint file
  const hintContent = `
SYSTEM ANALYSIS REPORT
=====================
Timestamp anomaly detected: 03:27:09
Multiple processes attempting concurrent writes
Detected alchemy symbols in metadata: 🜁☉🜂
Recommendation: Cross-reference symbol frequencies
`;

  fs.writeFileSync(path.join(outputDir, 'analysis.txt'), hintContent);
}

// Challenge metadata
export const LEAKY_LOGS_METADATA = {
  primaryFlag: 'SHADOWNET{CL0CKSYNC_DR1FT}',
  hiddenFlag: 'SHADOWNET{KEYoVRE_FLAG_TRACER}',
  collisionTimestamp: '2084-03-27T03:27:09Z',
  alchemySymbols: ALCHEMY_SYMBOLS,
  hints: [
    'Look for patterns in the timestamp collisions',
    'The alchemy symbols correspond to specific frequencies',
    'XOR the images in the order of the symbols'
  ]
}; 