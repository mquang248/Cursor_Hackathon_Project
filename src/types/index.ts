/**
 * ChronoFeed - Data Contracts
 * Single source of truth for all TypeScript interfaces
 * 
 * @author ChronoFeed Team
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

