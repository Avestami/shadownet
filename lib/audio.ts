import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FrequencyData {
  frequencies: number[];
  average: number;
  description: string;
}

// The five frequencies from Dr. Draconis's Document 2
export const DRACONIS_FREQUENCIES: FrequencyData = {
  frequencies: [114.7, 227.3, 401.1, 666.6, 1337.0],
  average: 549.34,
  description: "The Harmonic Five frequencies discovered by Dr. Tenebris Draconis"
};

export interface AudioMetadata {
  originalFrequency?: number;
  targetFrequency?: number;
  isCorrupted: boolean;
  containsFlag: boolean;
  requiredKarma?: string;
  hints?: string[];
}

export async function getAudioFile(levelId: string, filename: string) {
  try {
    const audioFile = await prisma.audioFile.findUnique({
      where: {
        levelId_filename: {
          levelId,
          filename
        }
      }
    });

    return audioFile;
  } catch (error) {
    console.error('Error fetching audio file:', error);
    throw error;
  }
}

export async function validateFrequencyConversion(
  levelId: string,
  filename: string,
  submittedFrequency: number
): Promise<boolean> {
  try {
    const audioFile = await getAudioFile(levelId, filename);
    if (!audioFile) {
      throw new Error('Audio file not found');
    }

    const metadata: AudioMetadata = JSON.parse(audioFile.metadata as string);
    
    // For the final challenge, check if the submitted frequency matches Dr. Draconis's average
    if (filename === 'final_echo.wav') {
      // Allow for a small margin of error (±0.01 Hz)
      return Math.abs(submittedFrequency - DRACONIS_FREQUENCIES.average) <= 0.01;
    }

    // For other audio challenges, check against the target frequency if specified
    if (metadata.targetFrequency) {
      return Math.abs(submittedFrequency - metadata.targetFrequency) <= 0.01;
    }

    return false;
  } catch (error) {
    console.error('Error validating frequency conversion:', error);
    throw error;
  }
}

export async function getAudioEffects(userId: string, levelId: string) {
  try {
    const karmaEffects = await getDominantKarmaEffects(userId);
    const audioEffects = karmaEffects.map(effect => effect.audioEffect).filter(Boolean);
    
    // Get level-specific audio files
    const levelAudioFiles = await prisma.audioFile.findMany({
      where: { levelId }
    });

    return {
      effects: audioEffects,
      files: levelAudioFiles
    };
  } catch (error) {
    console.error('Error getting audio effects:', error);
    throw error;
  }
}

// Helper function to check if a frequency is within the anomalous range
export function isAnomalousFrequency(frequency: number): boolean {
  return DRACONIS_FREQUENCIES.frequencies.some(f => Math.abs(frequency - f) <= 0.01);
}

// Import the karma effects function
import { getDominantKarmaEffects } from './karma'; 