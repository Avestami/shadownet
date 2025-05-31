declare module 'qrcode' {
  export function toCanvas(canvas: any, text: string, options?: any): Promise<any>;
  export function toCanvas(canvas: any, text: string, options: any, callback: (error: Error | null, canvas: any) => void): void;
  
  export function toDataURL(text: string, options?: any): Promise<string>;
  export function toDataURL(text: string, options: any, callback: (error: Error | null, url: string) => void): void;
  
  export function toBuffer(text: string, options?: any): Promise<Buffer>;
  export function toBuffer(text: string, options: any, callback: (error: Error | null, buffer: Buffer) => void): void;
  
  export function toString(text: string, options?: any): Promise<string>;
  export function toString(text: string, options: any, callback: (error: Error | null, string: string) => void): void;
  
  export function toFile(path: string, text: string, options?: any): Promise<void>;
  export function toFile(path: string, text: string, options: any, callback: (error: Error | null) => void): void;
} 