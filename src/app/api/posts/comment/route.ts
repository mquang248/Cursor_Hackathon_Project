import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import Notification from '@/models/Notification';

/**
 * POST /api/posts/comment
 * Add a comment to a post
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { postId, userId, userName, userHandle, userAvatar, content } = await request.json();

    if (!postId || !userId || !content) {
      return NextResponse.json(
        { success: false, error: 'postId, userId và content là bắt buộc / postId, userId and content are required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Bình luận quá dài (tối đa 500 ký tự) / Comment too long (max 500 characters)' },
        { status: 400 }
      );
    }

    // Create comment
    const comment = await Comment.create({
      postId,
      userId,
      userName: userName || 'Người dùng ẩn danh',
      userHandle: userHandle || '@anonymous',
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`,
      content,
      likes: 0,
      likedBy: [],
    });

    // Update post reply count
    await Post.findOneAndUpdate(
      { postId },
      { $inc: { replies: 1 } },
      { upsert: true }
    );

    // Create notification for post author
    const post = await Post.findOne({ postId });
    if (post) {
      await Notification.create({
        userId: post.authorHandle,
        type: 'comment',
        title: 'Bình luận mới',
        titleEn: 'New Comment',
        message: `${userName || 'Ai đó'} đã bình luận về bài viết của bạn`,
        messageEn: `${userName || 'Someone'} commented on your post`,
        postId: postId,
        fromUserId: userId,
        fromUserName: userName,
        fromUserAvatar: userAvatar,
      });
    }

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error('Comment API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts/comment
 * Get comments for a post
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'postId là bắt buộc / postId is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ postId });

    return NextResponse.json({
      success: true,
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Comment GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/comment
 * Delete a comment
 */
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const userId = searchParams.get('userId');

    if (!commentId || !userId) {
      return NextResponse.json(
        { success: false, error: 'commentId và userId là bắt buộc / commentId and userId are required' },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bình luận / Comment not found' },
        { status: 404 }
      );
    }

    if (comment.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền xóa / Not authorized to delete' },
        { status: 403 }
      );
    }

    // Update post reply count
    await Post.findOneAndUpdate(
      { postId: comment.postId },
      { $inc: { replies: -1 } }
    );

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bình luận / Comment deleted',
    });
  } catch (error) {
    console.error('Comment DELETE API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

