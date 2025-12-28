import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { decisions } from '../../../../data/story';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // 1. Try Database
    const dbLevel = await prisma.level.findUnique({
      where: { id }
    });

    if (dbLevel) {
      // Transform DB level to match the frontend expected structure
      // The frontend expects 'options' for choices.
      // We stored choices in 'availableKarmaChoices' or we might need to fetch relations.
      // For simplicity in this iteration, we'll map what we have.
      
      return NextResponse.json({
        id: dbLevel.id,
        narrative: dbLevel.narrative,
        options: [], // TODO: map choices from DB if we implemented that fully
        // If the DB level has no narrative (e.g. just created), fallback might be safer? 
        // But if it exists in DB, we should respect it.
        isDynamic: true
      });
    }

    // 2. Fallback to Static Data
    const staticLevel = decisions.find(d => d.id === id);
    if (staticLevel) {
      return NextResponse.json(staticLevel);
    }

    // 3. Fallback for unknown levels
    return NextResponse.json({
      id: id,
      narrative: `Level ${id} data not found. System corruption detected.`,
      options: []
    }, { status: 404 });

  } catch (error) {
    console.error('Error fetching level:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
