import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const events = JSON.parse(fileContents);
    
    const event = events.find((e: any) => e.id === params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'EVENT_NOT_FOUND' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load event' },
      { status: 500 }
    );
  }
}

