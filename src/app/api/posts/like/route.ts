import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Notification from '@/models/Notification';

/**
 * POST /api/posts/like
 * Toggle like on a post
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { postId, odId, action } = await request.json();

    if (!postId || !odId) {
      return NextResponse.json(
        { success: false, error: 'postId và odId là bắt buộc / postId and odId are required' },
        { status: 400 }
      );
    }

    let post = await Post.findOne({ postId });

    // If post doesn't exist, create it
    if (!post) {
      post = await Post.create({
        postId,
        topic: 'unknown',
        authorName: 'Unknown',
        authorHandle: '@unknown',
        content: '',
        timestamp: new Date().toISOString(),
        type: 'post',
        likes: 0,
        retweets: 0,
        replies: 0,
        likedBy: [],
        retweetedBy: [],
      });
    }

    const isLiked = post.likedBy.includes(odId);

    if (action === 'like' && !isLiked) {
      // Add like
      post.likes += 1;
      post.likedBy.push(odId);

      // Create notification
      await Notification.create({
        userId: post.authorHandle,
        type: 'like',
        title: 'Lượt thích mới',
        titleEn: 'New Like',
        message: `Ai đó đã thích bài viết của bạn`,
        messageEn: `Someone liked your post`,
        postId: postId,
        fromUserId: odId,
      });

    } else if (action === 'unlike' && isLiked) {
      // Remove like
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = post.likedBy.filter((id: string) => id !== odId);
    }

    await post.save();

    return NextResponse.json({
      success: true,
      data: {
        postId: post.postId,
        likes: post.likes,
        isLiked: post.likedBy.includes(odId),
      },
    });
  } catch (error) {
    console.error('Like API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts/like
 * Get like status for a post
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const odId = searchParams.get('odId');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'postId là bắt buộc / postId is required' },
        { status: 400 }
      );
    }

    const post = await Post.findOne({ postId });

    if (!post) {
      return NextResponse.json({
        success: true,
        data: {
          postId,
          likes: 0,
          isLiked: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        postId: post.postId,
        likes: post.likes,
        isLiked: odId ? post.likedBy.includes(odId) : false,
      },
    });
  } catch (error) {
    console.error('Like GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

