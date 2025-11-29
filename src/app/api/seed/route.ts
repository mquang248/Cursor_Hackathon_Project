import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import eventsData from '@/data/events.json';

interface EventData {
  id: string;
  authorName: string;
  authorHandle: string;
  avatarUrl: string | null;
  content: string;
  timestamp: string;
  topic: string;
  type: 'post' | 'news' | 'reply';
}

/**
 * POST /api/seed
 * Seed the database with 13 Vietnamese historical posts
 */
export async function POST() {
  try {
    await connectDB();

    // Clear existing posts
    await Post.deleteMany({});

    // Transform events data to posts
    const posts = (eventsData as EventData[]).map((event) => ({
      postId: `vn-${event.id}`,
      topic: event.topic,
      authorName: event.authorName,
      authorHandle: event.authorHandle,
      authorAvatarUrl: event.avatarUrl,
      content: event.content,
      timestamp: event.timestamp,
      type: event.type,
      likes: Math.floor(Math.random() * 500000) + 100000,
      retweets: Math.floor(Math.random() * 200000) + 50000,
      replies: Math.floor(Math.random() * 100000) + 20000,
      likedBy: [],
      retweetedBy: [],
    }));

    // Log để debug
    console.log('Posts to insert:', JSON.stringify(posts.slice(0, 2), null, 2));

    const insertedPosts = await Post.insertMany(posts);

    console.log(`✅ Seeded ${insertedPosts.length} posts from events.json`);
    console.log('First post avatarUrl:', insertedPosts[0]?.authorAvatarUrl);

    const topics = [...new Set(posts.map(p => p.topic))];

    return NextResponse.json({
      success: true,
      message: `Đã thêm ${insertedPosts.length} bài viết lịch sử Việt Nam vào database`,
      messageEn: `Successfully seeded ${insertedPosts.length} Vietnamese historical posts`,
      data: {
        count: insertedPosts.length,
        topics,
      },
    });
  } catch (error) {
    console.error('Seed API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi khi seed database / Error seeding database' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seed
 * Get seeding status
 */
export async function GET() {
  try {
    await connectDB();

    const count = await Post.countDocuments();
    const topics = await Post.distinct('topic');

    return NextResponse.json({
      success: true,
      data: {
        totalPosts: count,
        topics,
        eventsInFile: (eventsData as EventData[]).length,
        message: count > 0 
          ? `Database có ${count} bài viết / Database has ${count} posts`
          : 'Database trống / Database is empty',
      },
    });
  } catch (error) {
    console.error('Seed GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi kết nối database / Database connection error' },
      { status: 500 }
    );
  }
}


