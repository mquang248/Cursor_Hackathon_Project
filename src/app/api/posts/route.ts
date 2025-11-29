import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

/**
 * GET /api/posts
 * Get posts from database with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'likes'; // likes, retweets, createdAt

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    
    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    // Determine sort order
    const sortOptions: Record<string, -1 | 1> = {};
    switch (sortBy) {
      case 'likes':
        sortOptions.likes = -1;
        break;
      case 'retweets':
        sortOptions.retweets = -1;
        break;
      case 'replies':
        sortOptions.replies = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.likes = -1;
    }

    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    // Transform to SocialPost format
    const socialPosts = posts.map(post => ({
      id: post.postId,
      author: {
        name: post.authorName,
        handle: post.authorHandle,
        avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${post.authorHandle.replace('@', '')}`,
        isVerified: true,
      },
      content: post.content,
      timestamp: post.timestamp,
      stats: {
        likes: post.likes,
        retweets: post.retweets,
        replies: post.replies,
      },
      type: post.type,
      topic: post.topic,
    }));

    return NextResponse.json({
      success: true,
      data: socialPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Posts GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi lấy dữ liệu / Error fetching posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { postId, topic, authorName, authorHandle, content, timestamp, type } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: 'postId và content là bắt buộc / postId and content are required' },
        { status: 400 }
      );
    }

    const post = await Post.create({
      postId,
      topic: topic || 'General',
      authorName: authorName || 'Người dùng',
      authorHandle: authorHandle || '@user',
      content,
      timestamp: timestamp || new Date().toISOString(),
      type: type || 'post',
      likes: 0,
      retweets: 0,
      replies: 0,
      likedBy: [],
      retweetedBy: [],
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Posts POST API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi tạo bài viết / Error creating post' },
      { status: 500 }
    );
  }
}

