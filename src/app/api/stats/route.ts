import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserStats from '@/models/UserStats';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

/**
 * GET /api/stats
 * Get user statistics or global stats
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const odId = searchParams.get('odId');
    const type = searchParams.get('type') || 'user';

    if (type === 'global') {
      // Get global statistics
      const totalPosts = await Post.countDocuments();
      const totalComments = await Comment.countDocuments();
      const totalLikes = await Post.aggregate([
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]);
      const totalRetweets = await Post.aggregate([
        { $group: { _id: null, total: { $sum: '$retweets' } } }
      ]);

      // Get top topics
      const topTopics = await Post.aggregate([
        { $group: { _id: '$topic', count: { $sum: 1 }, totalLikes: { $sum: '$likes' } } },
        { $sort: { totalLikes: -1 } },
        { $limit: 5 }
      ]);

      return NextResponse.json({
        success: true,
        data: {
          totalPosts,
          totalComments,
          totalLikes: totalLikes[0]?.total || 0,
          totalRetweets: totalRetweets[0]?.total || 0,
          topTopics,
        },
      });
    }

    // Get user statistics
    if (!odId) {
      return NextResponse.json(
        { success: false, error: 'odId là bắt buộc / odId is required' },
        { status: 400 }
      );
    }

    let userStats = await UserStats.findOne({ odId });

    if (!userStats) {
      return NextResponse.json({
        success: true,
        data: {
          odId,
          totalLikes: 0,
          totalComments: 0,
          totalRetweets: 0,
          topicsExplored: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    console.error('Stats GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stats
 * Update user statistics
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { odId, sessionId, action, topic } = body;

    if (!odId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'odId và sessionId là bắt buộc / odId and sessionId are required' },
        { status: 400 }
      );
    }

    // Find or create user stats
    let userStats = await UserStats.findOne({ odId });

    if (!userStats) {
      userStats = await UserStats.create({
        odId,
        sessionId,
        totalLikes: 0,
        totalComments: 0,
        totalRetweets: 0,
        topicsExplored: [],
        lastActive: new Date(),
      });
    }

    // Update based on action
    switch (action) {
      case 'like':
        userStats.totalLikes += 1;
        break;
      case 'unlike':
        userStats.totalLikes = Math.max(0, userStats.totalLikes - 1);
        break;
      case 'comment':
        userStats.totalComments += 1;
        break;
      case 'retweet':
        userStats.totalRetweets += 1;
        break;
      case 'explore':
        if (topic && !userStats.topicsExplored.includes(topic)) {
          userStats.topicsExplored.push(topic);
        }
        break;
    }

    userStats.lastActive = new Date();
    userStats.sessionId = sessionId;
    await userStats.save();

    return NextResponse.json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    console.error('Stats POST API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

