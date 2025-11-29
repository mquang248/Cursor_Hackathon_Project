import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Notification types
 */
export type NotificationType = 'like' | 'comment' | 'retweet' | 'mention' | 'follow' | 'system';

/**
 * Notification document interface
 */
export interface INotification extends Document {
  userId: string;
  type: NotificationType;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  postId?: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'retweet', 'mention', 'follow', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleEn: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageEn: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
    },
    fromUserId: {
      type: String,
    },
    fromUserName: {
      type: String,
    },
    fromUserAvatar: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching user notifications
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

