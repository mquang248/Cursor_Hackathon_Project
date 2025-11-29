import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postsPath = path.join(process.cwd(), 'data', 'posts.json');
    const eventsPath = path.join(process.cwd(), 'data', 'events.json');
    
    const postsData = fs.readFileSync(postsPath, 'utf8');
    const eventsData = fs.readFileSync(eventsPath, 'utf8');
    
    const posts = JSON.parse(postsData);
    const events = JSON.parse(eventsData);
    
    const post = posts.find((p: any) => p.id === params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }
    
    const event = events.find((e: any) => e.id === post.eventId);
    
    return NextResponse.json(
      {
        ...post,
        event: event || null
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load post' },
      { status: 500 }
    );
  }
}

