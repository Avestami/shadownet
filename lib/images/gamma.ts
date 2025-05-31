import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

function createQRCodeLayer(text: string, size: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    QRCode.toBuffer(text, {
      width: size,
      margin: 1,
      color: {
        dark: '#0000FF',  // Blue for the blue channel
        light: '#FFFFFF'
      }
    }, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
}

function embedLSBData(imageData: PixelData[], message: string): void {
  const binaryMessage = message
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

  for (let i = 0; i < binaryMessage.length && i < imageData.length; i++) {
    const pixel = imageData[i];
    const bit = parseInt(binaryMessage[i]);
    
    // Embed in blue channel LSB
    pixel.b = (pixel.b & 0xFE) | bit;
  }
}

export async function generateGammaChallenge() {
  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create base image with some cyberpunk-style patterns
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Add some matrix-like effects
  ctx.fillStyle = '#001100';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), x, y);
  }

  // Generate QR code with base64 clue
  const qrBuffer = await createQRCodeLayer(
    Buffer.from('Check the shadows for truth').toString('base64'),
    width
  );
<<<<<<< HEAD
  const qrImage = await createCanvas(width, height);
  const qrCtx = qrImage.getContext('2d');
  qrCtx.drawImage(qrBuffer, 0, 0, width, height);
=======
  
  // Create an image from the QR code buffer
  const qrImage = await createCanvas(width, height);
  const qrCtx = qrImage.getContext('2d');
  
  // Create a temporary file to load the image
  const tempQrPath = path.join(process.cwd(), 'temp-qr.png');
  fs.writeFileSync(tempQrPath, qrBuffer);
  
  // Load the image from file
  const { loadImage } = require('canvas');
  const qrImg = await loadImage(tempQrPath);
  qrCtx.drawImage(qrImg, 0, 0, width, height);
  
  // Clean up temporary file
  fs.unlinkSync(tempQrPath);
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f

  // Blend QR code into blue channel
  const baseImageData = ctx.getImageData(0, 0, width, height);
  const qrImageData = qrCtx.getImageData(0, 0, width, height);

  for (let i = 0; i < baseImageData.data.length; i += 4) {
    baseImageData.data[i + 2] = qrImageData.data[i + 2]; // Blue channel
  }

  // Convert to PixelData format for LSB embedding
  const pixels: PixelData[] = [];
  for (let i = 0; i < baseImageData.data.length; i += 4) {
    pixels.push({
      r: baseImageData.data[i],
      g: baseImageData.data[i + 1],
      b: baseImageData.data[i + 2],
      a: baseImageData.data[i + 3]
    });
  }

  // Embed whistleblower data in LSB
  const whistleblowerData = JSON.stringify({
    name: 'Lina_Protocol',
    status: 'compromised',
    lastSeen: '2084-03-27T03:27:09Z',
    message: 'They are watching the frequencies'
  });
  embedLSBData(pixels, whistleblowerData);

  // Convert back to ImageData
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    const offset = i * 4;
    baseImageData.data[offset] = pixel.r;
    baseImageData.data[offset + 1] = pixel.g;
    baseImageData.data[offset + 2] = pixel.b;
    baseImageData.data[offset + 3] = pixel.a;
  }

  ctx.putImageData(baseImageData, 0, 0);

  // Save the image
  const outputPath = path.join(process.cwd(), 'public/challenges/gamma/whistleblower.png');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Image generated:', outputPath);
}

// Add metadata about the challenge
export const gammaImageMetadata = {
  dimensions: '512x512',
  channels: {
    blue: 'QR code with base64 clue',
    lsb: 'Whistleblower information'
  },
  steganography: {
    method: 'LSB in blue channel',
    dataLength: 'Variable'
  },
  hints: [
    'The truth is in the blue',
    'Some bits are less significant than others',
    'Base64 leads to more'
  ]
}; 