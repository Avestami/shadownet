import { PrismaClient } from '@prisma/client';
import { KarmaType } from './karma';

const prisma = new PrismaClient();

export interface KarmaChoice {
  id: string;
  description: string;
  type: KarmaType;
  score: number;
  hint?: string;
  outcome?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  flag: string;
  files: string[];
  hints: string[];
  karmaChoices: KarmaChoice[];
  documents?: string[];
}

export const LEVEL_CHALLENGES: Record<string, Challenge> = {
  alpha: {
    id: 'alpha',
    title: 'Echoed Transmission',
    description: "Agent, welcome to ShadowNet. We've intercepted a dormant string inside a legacy archive. Your mission: crack the syntax, unveil the message. Remember, old tech hides sharper teeth.",
    flag: 'SHADOWNET{DTHEREFORTH}',
    files: ['file6.txt'],
    hints: [
      'The filename might be more than just a name...',
      'Some archives weren\'t meant to be decoded... just re-aligned.'
    ],
    karmaChoices: [
      {
        id: 'report',
        description: 'Immediately report the exact decoded message and flag to ShadowNet command, adhering strictly to protocol.',
        type: 'loyalty',
        score: 100
      },
      {
        id: 'analyze',
        description: 'Delay reporting to cross-reference the decoded message with other intercepted data, seeking deeper patterns.',
        type: 'curiosity',
        score: 75
      }
    ],
    documents: ['frequencies_and_perception']
  },

  beta: {
    id: 'beta',
    title: 'Signal Dissonance',
    description: "Your receiver just caught a pulse. It's an echo embedded in noise, like someone screaming through static. Listen... but listen with intention. Split the truth from the tone.",
    flag: 'SHADOWNET{SOUND876}',
    files: ['dissonance.wav'],
    hints: [
      'The signal has two faces.',
      'Did you notice the tones? may be draconis was right about the frequencies.',
      'The Morse code might tell you what to do with the numbers...'
      
    ],
    karmaChoices: [
      {
        id: 'purge',
        description: 'Extract the flag efficiently and purge the noisy data from your system.',
        type: 'loyalty',
        score: 100,
        hint: 'Residual anomalous resonance detected. Recommendation: Spectral purification required for long-term stability.'
      },
      {
        id: 'investigate',
        description: 'Analyze the raw noise for hidden patterns or anomalies.',
        type: 'curiosity',
        score: 80
      }
    ]
  },

  gamma: {
    id: 'gamma',
    title: 'Spectral Overlay',
    description: "Agent. A whistleblower's image was uploaded to a darknet dead drop. Within it is the truth. But truth is layered. Choose wisely — the image hides more than pixels.",
    flag: 'SHADOWNET{S3CR3T_D34TH}',
    files: ['whistleblower.png'],
    hints: [
      'Check the blue channel of the image separately',
      'LSB might reveal more than just random noise...'
    ],
    karmaChoices: [
      {
        id: 'submit',
        description: 'Submit the flag and report completion without further action.',
        type: 'loyalty',
        score: 110
      },
      {
        id: 'expose',
        description: "Expose the whistleblower's identity using the LSB data.",
        type: 'curiosity',
        score: 90,
        outcome: "They don't fear the truth. They fear us finding each other."
      }
    ],
    documents: ['harmonic_five']
  }
};

// More levels will be added here...

export async function initializeLevels() {
  try {
    // Create levels in sequence
    for (const [levelId, challenge] of Object.entries(LEVEL_CHALLENGES)) {
      await prisma.level.upsert({
        where: { id: levelId },
        update: {
          name: challenge.title,
          description: challenge.description,
          unlockCode: challenge.flag,
          availableKarmaChoices: JSON.stringify(challenge.karmaChoices),
          documents: JSON.stringify(challenge.documents || []),
          hints: JSON.stringify(challenge.hints)
        },
        create: {
          id: levelId,
          name: challenge.title,
          description: challenge.description,
          unlockCode: challenge.flag,
          availableKarmaChoices: JSON.stringify(challenge.karmaChoices),
          documents: JSON.stringify(challenge.documents || []),
          hints: JSON.stringify(challenge.hints)
        }
      });
    }

    console.log('Levels initialized successfully');
  } catch (error) {
    console.error('Error initializing levels:', error);
    throw error;
  }
}

export async function validateFlag(levelId: string, submittedFlag: string): Promise<boolean> {
  const challenge = LEVEL_CHALLENGES[levelId];
  if (!challenge) {
    return false;
  }

  return challenge.flag === submittedFlag;
}

export async function getAvailableHints(userId: string, levelId: string): Promise<string[]> {
  try {
    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { hints: true }
    });

    if (!level) {
      return [];
    }

    return JSON.parse(level.hints as string);
  } catch (error) {
    console.error('Error getting hints:', error);
    throw error;
  }
}

export async function processKarmaChoice(
  userId: string,
  levelId: string,
  choiceId: string
): Promise<void> {
  try {
    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { availableKarmaChoices: true }
    });

    if (!level) {
      throw new Error('Level not found');
    }

    const choices: KarmaChoice[] = JSON.parse(level.availableKarmaChoices as string);
    const selectedChoice = choices.find(c => c.id === choiceId);

    if (!selectedChoice) {
      throw new Error('Invalid choice');
    }

    // Record the karma choice
    await prisma.karmaChoice.create({
      data: {
        userId,
        levelId,
        karmaType: selectedChoice.type,
        karmaValue: selectedChoice.score,
        choiceText: selectedChoice.description
      }
    });

    // Update user's karma and score
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { karma: true, score: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentKarma = JSON.parse(user.karma as string);
    currentKarma[selectedChoice.type] += selectedChoice.score;

    await prisma.user.update({
      where: { id: userId },
      data: {
        karma: JSON.stringify(currentKarma),
        score: user.score + selectedChoice.score
      }
    });
  } catch (error) {
    console.error('Error processing karma choice:', error);
    throw error;
  }
} 