/**
 * Canvas Polyfill - Server-side substitute for the canvas package
 * This module provides stub functions that allow the application to run in environments
 * where the canvas package cannot be installed due to native dependencies
 */

// Basic image data representation
export interface BasicImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

// Mock canvas class
export class MockCanvas {
  width: number;
  height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  
  getContext(type: string) {
    return new MockContext2D(this.width, this.height);
  }
  
  toBuffer(format: string): Buffer {
    // Return an empty buffer
    return Buffer.from([]);
  }
}

// Mock 2D context
export class MockContext2D {
  width: number;
  height: number;
  fillStyle: string = '#000000';
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  
  fillRect(x: number, y: number, width: number, height: number): void {
    // No-op
  }
  
  fillText(text: string, x: number, y: number): void {
    // No-op
  }
  
  getImageData(x: number, y: number, width: number, height: number): BasicImageData {
    return {
      data: new Uint8ClampedArray(width * height * 4),
      width,
      height
    };
  }
  
  putImageData(imageData: BasicImageData, x: number, y: number): void {
    // No-op
  }
  
  createImageData(width: number, height: number): BasicImageData {
    return {
      data: new Uint8ClampedArray(width * height * 4),
      width,
      height
    };
  }
  
  drawImage(image: any, x: number, y: number, width?: number, height?: number): void {
    // No-op
  }
}

// Mock image loader
export function loadImage(path: string): Promise<any> {
  return Promise.resolve({});
}

// API compatible with the canvas package
export function createCanvas(width: number, height: number): MockCanvas {
  return new MockCanvas(width, height);
}

export default {
  createCanvas,
  loadImage,
  MockCanvas,
  MockContext2D
}; 