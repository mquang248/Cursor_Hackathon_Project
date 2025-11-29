import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

/**
 * GET /api/notifications
 * Get notifications for a user
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const odId = searchParams.get('odId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!odId) {
      return NextResponse.json(
        { success: false, error: 'odId là bắt buộc / odId is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = { userId: odId };
    
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId: odId, isRead: false });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Notifications GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, type, title, titleEn, message, messageEn, postId, fromUserId, fromUserName, fromUserAvatar } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc / Missing required fields' },
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      titleEn: titleEn || title,
      message,
      messageEn: messageEn || message,
      postId,
      fromUserId,
      fromUserName,
      fromUserAvatar,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Notifications POST API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark notifications as read
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { odId, notificationIds, markAllRead } = body;

    if (!odId) {
      return NextResponse.json(
        { success: false, error: 'odId là bắt buộc / odId is required' },
        { status: 400 }
      );
    }

    if (markAllRead) {
      // Mark all notifications as read for this user
      await Notification.updateMany(
        { userId: odId, isRead: false },
        { isRead: true }
      );
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, userId: odId },
        { isRead: true }
      );
    }

    const unreadCount = await Notification.countDocuments({ userId: odId, isRead: false });

    return NextResponse.json({
      success: true,
      data: { unreadCount },
      message: 'Đã đánh dấu đã đọc / Marked as read',
    });
  } catch (error) {
    console.error('Notifications PUT API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const odId = searchParams.get('odId');
    const notificationId = searchParams.get('notificationId');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    if (!odId) {
      return NextResponse.json(
        { success: false, error: 'odId là bắt buộc / odId is required' },
        { status: 400 }
      );
    }

    if (deleteAll) {
      await Notification.deleteMany({ userId: odId });
    } else if (notificationId) {
      await Notification.findOneAndDelete({ _id: notificationId, userId: odId });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa thông báo / Notifications deleted',
    });
  } catch (error) {
    console.error('Notifications DELETE API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ / Server error' },
      { status: 500 }
    );
  }
}

