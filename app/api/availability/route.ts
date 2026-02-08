import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Fetch availability for a match date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchDate = searchParams.get('date');

    if (!matchDate) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get the match day record
    const matchDay = await queryOne<{ id: string }>(
      'SELECT id FROM match_days WHERE match_date = $1',
      [matchDate]
    );

    if (!matchDay) {
      // No match day exists yet, return empty availability
      return NextResponse.json({ availability: [] });
    }

    // Get availability for this match day
    const availability = await query<{ player_id: string; is_available: boolean | null }>(
      'SELECT player_id, is_available FROM availability WHERE match_day_id = $1',
      [matchDay.id]
    );

    return NextResponse.json({
      matchDayId: matchDay.id,
      availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// POST - Update availability for a player
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchDate, playerId, isAvailable } = body;

    if (!matchDate || !playerId || !('isAvailable' in body)) {
      return NextResponse.json(
        { error: 'matchDate, playerId, and isAvailable are required' },
        { status: 400 }
      );
    }

    // Get or create the match day
    let matchDay = await queryOne<{ id: string }>(
      'SELECT id FROM match_days WHERE match_date = $1',
      [matchDate]
    );

    if (!matchDay) {
      // Match day doesn't exist, create it
      matchDay = await queryOne<{ id: string }>(
        'INSERT INTO match_days (match_date) VALUES ($1) RETURNING id',
        [matchDate]
      );
    }

    if (!matchDay) {
      throw new Error('Failed to get or create match day');
    }

    // Upsert availability
    await query(
      `INSERT INTO availability (match_day_id, player_id, is_available, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (match_day_id, player_id)
       DO UPDATE SET is_available = $3, updated_at = NOW()`,
      [matchDay.id, playerId, isAvailable]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}
