import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Player } from '@/lib/types';

// GET - Fetch all players
export async function GET() {
  try {
    const players = await query<Player>(
      'SELECT * FROM players ORDER BY rotation_order ASC'
    );

    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}
