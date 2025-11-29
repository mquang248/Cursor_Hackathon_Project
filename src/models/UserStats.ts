import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * User statistics document interface
 */
export interface IUserStats extends Document {
  odId: string;
  sessionId: string;
  totalLikes: number;
  totalComments: number;
  totalRetweets: number;
  topicsExplored: string[];
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    odId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    totalRetweets: {
      type: Number,
      default: 0,
    },
    topicsExplored: [{
      type: String,
    }],
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserStats: Model<IUserStats> = mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema);

export default UserStats;

