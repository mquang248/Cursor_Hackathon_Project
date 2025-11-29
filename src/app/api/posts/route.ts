import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const posts = JSON.parse(fileContents);
    
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load posts' },
      { status: 500 }
    );
  }
}

