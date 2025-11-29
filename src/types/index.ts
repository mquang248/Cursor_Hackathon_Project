/**
 * Việt Sử Ký - Data Contracts
 * Single source of truth for all TypeScript interfaces
 * 
 * @author Việt Sử Ký Team
 * @version 1.0.0
 */

/**
 * Author information for a social post
 */
export interface Author {
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified: boolean;
}

/**
 * Engagement statistics for a post
 */
export interface PostStats {
  likes: number;
  retweets: number;
  replies: number;
}

/**
 * Post type classification
 */
export type PostType = 'post' | 'reply' | 'news';

/**
 * Main social post interface
 * Represents a historical event as a social media post
 */
export interface SocialPost {
  id: string;
  author: Author;
  content: string;
  timestamp: string; // e.g., "2 hours ago" or specific historical date like "July 4, 1776"
  stats: PostStats;
  type: PostType;
  imageUrl?: string; // Optional image URL for the post
}

/**
 * Feed loading status
 */
export type FeedStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Complete feed state for state management
 */
export interface FeedState {
  status: FeedStatus;
  data: SocialPost[];
  error: string | null;
}

/**
 * API request payload for generating feed
 */
export interface GenerateFeedRequest {
  topic: string;
}

/**
 * API response structure
 */
export interface GenerateFeedResponse {
  success: boolean;
  data?: SocialPost[];
  error?: string;
}

/**
 * Like action request
 */
export interface LikeRequest {
  postId: string;
  odId: string;
  action: 'like' | 'unlike';
}

/**
 * Like response
 */
export interface LikeResponse {
  success: boolean;
  data?: {
    postId: string;
    likes: number;
    isLiked: boolean;
  };
  error?: string;
}

/**
 * Comment request
 */
export interface CommentRequest {
  postId: string;
  userId: string;
  userName?: string;
  userHandle?: string;
  userAvatar?: string;
  content: string;
}

/**
 * Comment data
 */
export interface CommentData {
  _id: string;
  postId: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

/**
 * Notification types
 */
export type NotificationType = 'like' | 'comment' | 'retweet' | 'mention' | 'follow' | 'system';

/**
 * Notification data
 */
export interface NotificationData {
  _id: string;
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
  createdAt: string;
}

/**
 * User statistics
 */
export interface UserStatsData {
  odId: string;
  sessionId: string;
  totalLikes: number;
  totalComments: number;
  totalRetweets: number;
  topicsExplored: string[];
  lastActive: string;
}

/**
 * Global statistics
 */
export interface GlobalStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalRetweets: number;
  topTopics: Array<{
    _id: string;
    count: number;
    totalLikes: number;
  }>;
}

