import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Comment document interface
 */
export interface IComment extends Document {
  postId: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userHandle: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for fetching comments by post
CommentSchema.index({ postId: 1, createdAt: -1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;

