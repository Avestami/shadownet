import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const levels = await prisma.level.findMany({
      orderBy: { sequence: 'asc' }
    });

    return NextResponse.json(levels);
  } catch (error) {
    console.error('Get levels error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.id || !body.name || !body.unlockCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const level = await prisma.level.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        unlockCode: body.unlockCode,
        sequence: body.sequence || 0,
        narrative: body.narrative || '',
        scoreReward: body.scoreReward || 100,
        availableKarmaChoices: body.availableKarmaChoices || [],
        documents: body.documents || [],
        hints: body.hints || [],
      }
    });

    return NextResponse.json(level);
  } catch (error) {
    console.error('Create level error:', error);
    return NextResponse.json({ error: 'Failed to create level' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ error: 'Missing Level ID' }, { status: 400 });
    }

    const level = await prisma.level.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        unlockCode: body.unlockCode,
        sequence: body.sequence,
        narrative: body.narrative,
        scoreReward: body.scoreReward,
        // Only update these if provided
        ...(body.availableKarmaChoices && { availableKarmaChoices: body.availableKarmaChoices }),
        ...(body.documents && { documents: body.documents }),
        ...(body.hints && { hints: body.hints }),
      }
    });

    return NextResponse.json(level);
  } catch (error) {
    console.error('Update level error:', error);
    return NextResponse.json({ error: 'Failed to update level' }, { status: 500 });
  }
}
