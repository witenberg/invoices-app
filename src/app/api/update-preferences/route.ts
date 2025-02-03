import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {

  const { id, currency, language } = await req.json();

  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE users SET default_currency = $1, default_language = $2 WHERE userid = $3',
      [currency, language, id]
    );
    return NextResponse.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  } finally {
    client.release();
  }
}
