import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const events = JSON.parse(fileContents);
    
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load events' },
      { status: 500 }
    );
  }
}

