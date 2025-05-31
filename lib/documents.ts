import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Document {
  id: string;
  title: string;
  content: string;
  author: string;
  type: 'research' | 'log' | 'memo' | 'personal';
  condition?: {
    karmaType?: string;
    karmaThreshold?: number;
  };
}

export const DRACONIS_DOCUMENTS: Record<string, Document> = {
  frequencies_and_perception: {
    id: 'doc1',
    title: 'Frequencies and Perception',
    author: 'Dr. Tenebris Draconis',
    type: 'research',
    content: `Department of Experimental Acoustics

While human ears perceive 20Hz-20,000Hz, patterns — anomalies — exist beyond these boundaries. Not all frequencies are comfortable, and some are not meant to be heard at all.

Preliminary data indicates that a subset of frequency ranges produce persistent psychological effects in test subjects, reporting discomfort, unease, or altered emotional states.

The soundscape may be far broader than we understand.

[CLASSIFIED RESEARCH DOCUMENT]`
  },
  
  harmonic_five: {
    id: 'doc2',
    title: 'The Harmonic Five',
    author: 'Dr. Tenebris Draconis',
    type: 'memo',
    content: `[INTERNAL MEMO - CLASSIFIED]

They are real. I've identified five frequencies that do not behave normally. Each one triggers something. Biologically. Mentally. Spiritually?

The first brings anxiety, another calm... but the fifth — I won't write what it does. Not again.

Frequencies identified:
- 114.7 Hz
- 227.3 Hz
- 401.1 Hz
- 666.6 Hz
- 1337.0 Hz

There's a pattern — I know there is — I see it when I close my eyes. They pulse like a code. There is an average. A key. We must listen closer.

[END MEMO]`
  },
  
  final_note: {
    id: 'doc3',
    title: 'Final Note: Calibration',
    author: 'Dr. Tenebris Draconis',
    type: 'personal',
    content: `D...r... Draconis I tthink they ffound me — listening

T--The answer is in their harmony. Ave—average. Must match it... you will fix it. You must.

I hear thm in the walls now, the frqncies... s-so loud. You must conve—

[TRANSMISSION LOST]`
  }
};

export async function getAvailableDocuments(userId: string, levelId: string): Promise<Document[]> {
  try {
    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { documents: true }
    });

    if (!level) {
      return [];
    }

    const levelDocs: string[] = JSON.parse(level.documents as string);
    const availableDocs: Document[] = [];

    for (const docId of levelDocs) {
      const doc = DRACONIS_DOCUMENTS[docId];
      if (doc) {
        // If the document has karma conditions, check them
        if (doc.condition) {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { karma: true }
          });

          if (user) {
            const karma = JSON.parse(user.karma as string);
            const karmaValue = karma[doc.condition.karmaType || ''] || 0;
            
            if (karmaValue >= (doc.condition.karmaThreshold || 0)) {
              availableDocs.push(doc);
            }
          }
        } else {
          // If no conditions, document is always available
          availableDocs.push(doc);
        }
      }
    }

    return availableDocs;
  } catch (error) {
    console.error('Error getting available documents:', error);
    throw error;
  }
}

export async function getDocumentById(docId: string): Promise<Document | null> {
  return DRACONIS_DOCUMENTS[docId] || null;
}

// Get a clean version of the final note for high loyalty karma
export async function getCleanFinalNote(userId: string): Promise<Document | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { karma: true }
    });

    if (!user) {
      return null;
    }

    const karma = JSON.parse(user.karma as string);
    if (karma.loyalty >= 300) { // Loyalty threshold
      return {
        ...DRACONIS_DOCUMENTS.final_note,
        content: `Dr. Draconis - Final Calibration Note

The answer lies in harmony. The average frequency of 549.34 Hz is the key.
You must convert and align the corrupted audio to this exact frequency to neutralize the anomalous effects.

I trust you will use this information wisely.

[END NOTE]`
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting clean final note:', error);
    throw error;
  }
} 