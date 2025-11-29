import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Post interaction document interface
 */
export interface IPost extends Document {
  postId: string;
  topic: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  content: string;
  timestamp: string;
  type: 'post' | 'reply' | 'news';
  imageUrl?: string;
  likes: number;
  retweets: number;
  replies: number;
  likedBy: string[];
  retweetedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorHandle: {
      type: String,
      required: true,
    },
    authorAvatarUrl: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['post', 'reply', 'news'],
      default: 'post',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
      default: 0,
    },
    replies: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: String,
    }],
    retweetedBy: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
PostSchema.index({ topic: 1, createdAt: -1 });
PostSchema.index({ likes: -1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;

