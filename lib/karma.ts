import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type KarmaType = 'loyalty' | 'defiance' | 'mercy' | 'curiosity' | 'integration';

export interface KarmaValues {
  loyalty: number;
  defiance: number;
  mercy: number;
  curiosity: number;
  integration: number;
}

export interface KarmaChoice {
  type: KarmaType;
  value: number;
  description: string;
}

const LEVEL_SEQUENCE = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'sigma',
  'theta',
  'zeta',
  'sigma2',
  'omega'
];

export async function updateKarma(
  userId: string,
  levelId: string,
  choice: KarmaChoice
): Promise<void> {
  try {
    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Get current user
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { karma: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Parse current karma values
      const currentKarma: KarmaValues = JSON.parse(user.karma as string);

      // Update karma value for the specific type
      currentKarma[choice.type] += choice.value;

      // Update user's karma
      await tx.user.update({
        where: { id: userId },
        data: {
          karma: JSON.stringify(currentKarma)
        }
      });

      // Record the karma choice
      await tx.karmaChoice.create({
        data: {
          userId,
          levelId,
          karmaType: choice.type,
          karmaValue: choice.value,
          choiceText: choice.description
        }
      });
    });
  } catch (error) {
    console.error('Error updating karma:', error);
    throw error;
  }
}

export async function getDominantKarmaType(userId: string): Promise<KarmaType | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { karma: true }
    });

    if (!user) {
      return null;
    }

    const karma: KarmaValues = JSON.parse(user.karma as string);
    let maxValue = -1;
    let dominantType: KarmaType | null = null;

    Object.entries(karma).forEach(([type, value]) => {
      if (value > maxValue) {
        maxValue = value;
        dominantType = type as KarmaType;
      }
    });

    return dominantType;
  } catch (error) {
    console.error('Error getting dominant karma type:', error);
    throw error;
  }
}

export async function unlockNextLevel(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentIndex = LEVEL_SEQUENCE.indexOf(user.currentLevel);
    if (currentIndex === -1 || currentIndex === LEVEL_SEQUENCE.length - 1) {
      return null; // No next level available
    }

    const nextLevel = LEVEL_SEQUENCE[currentIndex + 1];

    // Update user's current level
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentLevel: nextLevel
      }
    });

    // Create level unlock record
    await prisma.levelUnlock.create({
      data: {
        userId,
        levelId: nextLevel
      }
    });

    return nextLevel;
  } catch (error) {
    console.error('Error unlocking next level:', error);
    throw error;
  }
}

export async function isLevelUnlocked(userId: string, levelId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true }
    });

    if (!user) {
      return false;
    }

    const currentIndex = LEVEL_SEQUENCE.indexOf(user.currentLevel);
    const targetIndex = LEVEL_SEQUENCE.indexOf(levelId);

    return targetIndex <= currentIndex;
  } catch (error) {
    console.error('Error checking level unlock status:', error);
    throw error;
  }
}

// Karma thresholds for different effects
export const KARMA_THRESHOLDS = {
  LOYALTY: 300,    // Threshold X
  DEFIANCE: 250,   // Threshold Y
  MERCY: 275,      // Threshold Z
  CURIOSITY: 225,  // Threshold A
  INTEGRATION: 200 // Threshold B
};

export interface KarmaEffect {
  type: KarmaType;
  description: string;
  hint?: string;
  audioEffect?: string;
  visualEffect?: string;
}

export async function getDominantKarmaEffects(userId: string): Promise<KarmaEffect[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { karma: true }
    });

    if (!user) {
      return [];
    }

    const karma: KarmaValues = JSON.parse(user.karma as string);
    const effects: KarmaEffect[] = [];

    // Check each karma type against its threshold
    Object.entries(karma).forEach(([type, value]) => {
      const threshold = KARMA_THRESHOLDS[type.toUpperCase() as keyof typeof KARMA_THRESHOLDS];
      if (value >= threshold) {
        effects.push(getKarmaEffect(type as KarmaType));
      }
    });

    return effects;
  } catch (error) {
    console.error('Error getting karma effects:', error);
    throw error;
  }
}

function getKarmaEffect(type: KarmaType): KarmaEffect {
  const effects: Record<KarmaType, KarmaEffect> = {
    loyalty: {
      type: 'loyalty',
      description: "The Doctor's Failsafe",
      hint: "Clean audio log available with precise frequency information.",
      audioEffect: "stable_hum",
      visualEffect: "organized_lab"
    },
    defiance: {
      type: 'defiance',
      description: "The Corrupted Countermeasure",
      hint: "Lab systems are unstable and may provide misleading information.",
      audioEffect: "distorted_static",
      visualEffect: "chaotic_lab"
    },
    mercy: {
      type: 'mercy',
      description: "The Plea for Purity",
      hint: "Personal audio recording reveals partial flag.",
      audioEffect: "soft_ambience",
      visualEffect: "sorrowful_lab"
    },
    curiosity: {
      type: 'curiosity',
      description: "The Unfinished Schema",
      hint: "Technical schematics provide detailed frequency manipulation instructions.",
      audioEffect: "analytical_tones",
      visualEffect: "research_lab"
    },
    integration: {
      type: 'integration',
      description: "The Harmonic Resonance",
      hint: "Spectral manifestation guides towards frequency balance.",
      audioEffect: "harmonic_resonance",
      visualEffect: "ethereal_lab"
    }
  };

  return effects[type];
}

export async function getAvailableHints(userId: string, levelId: string): Promise<string[]> {
  try {
    const effects = await getDominantKarmaEffects(userId);
    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { hints: true }
    });

    if (!level) {
      return [];
    }

    const levelHints: Record<string, string[]> = JSON.parse(level.hints as string);
    const availableHints: string[] = [];

    effects.forEach(effect => {
      if (levelHints[effect.type]) {
        availableHints.push(...levelHints[effect.type]);
      }
    });

    return availableHints;
  } catch (error) {
    console.error('Error getting available hints:', error);
    throw error;
  }
} 