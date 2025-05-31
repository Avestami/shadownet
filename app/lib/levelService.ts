import path from 'path';
import fs from 'fs';

// Interface for level unlock information
export interface LevelUnlock {
  levelId: string;
  unlockCode: string;
  nextLevelId: string;
  scoreReward: number;
}

// Level unlock mapping
const LEVEL_UNLOCKS: Record<string, LevelUnlock> = {
  'level1': {
    levelId: 'level1',
    unlockCode: 'AVES2100_KHUZESTAN_ACCESS', // This is the base64 decoded value from level 1
    nextLevelId: 'level2',
    scoreReward: 100
  },
  'level2': {
    levelId: 'level2',
    unlockCode: '3721', // The audio code from level 2
    nextLevelId: 'level3',
    scoreReward: 150
  },
  'level3': {
    levelId: 'level3',
    unlockCode: 'STARGATE47', // The image key from level 3
    nextLevelId: 'level4',
    scoreReward: 200
  },
  'level4': {
    levelId: 'level4',
    unlockCode: 'ZOROASTER', // The identity of Avesta
    nextLevelId: 'ending',
    scoreReward: 250
  }
};

// Verify unlock code for a level
export const verifyUnlockCode = (levelId: string, code: string): boolean => {
  const levelInfo = LEVEL_UNLOCKS[levelId];
  
  if (!levelInfo) {
    return false;
  }
  
  return levelInfo.unlockCode.toLowerCase() === code.toLowerCase();
};

// Get the next level ID after unlocking
export const getNextLevelId = (levelId: string): string | null => {
  const levelInfo = LEVEL_UNLOCKS[levelId];
  
  if (!levelInfo) {
    return null;
  }
  
  return levelInfo.nextLevelId;
};

// Get score reward for completing a level
export const getLevelScoreReward = (levelId: string): number => {
  const levelInfo = LEVEL_UNLOCKS[levelId];
  
  if (!levelInfo) {
    return 0;
  }
  
  return levelInfo.scoreReward;
};

// Get all level data
export const getAllLevels = (): Record<string, LevelUnlock> => {
  return { ...LEVEL_UNLOCKS };
}; 