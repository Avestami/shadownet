declare module 'web-audio-api' {
  export class AudioContext {
    constructor();
    sampleRate: number;
    currentTime: number;
    destination: AudioDestinationNode;
    createGain(): GainNode;
    createOscillator(): OscillatorNode;
    decodeAudioData(buffer: Buffer): Promise<AudioBuffer>;
    createBufferSource(): AudioBufferSourceNode;
    createBuffer(numChannels: number, length: number, sampleRate: number): AudioBuffer;
  }

  export class AudioDestinationNode {
    maxChannelCount: number;
  }

  export class GainNode {
    gain: { value: number };
    connect(destination: any): void;
  }

  export class OscillatorNode {
    frequency: { value: number };
    connect(destination: any): void;
    start(time?: number): void;
    stop(time?: number): void;
  }

  export class AudioBuffer {
    length: number;
    duration: number;
    sampleRate: number;
    numberOfChannels: number;
    getChannelData(channel: number): Float32Array;
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;
    copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
  }

  export class AudioBufferSourceNode {
    buffer: AudioBuffer;
    connect(destination: any): void;
    start(time?: number): void;
    stop(time?: number): void;
  }
} 