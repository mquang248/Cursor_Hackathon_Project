'use client';

import { useState, useCallback } from 'react';
import type { FeedState, SocialPost } from '@/types';
import eventsData from '@/data/events.json';

/**
 * Configuration for the feed generator hook
 */
interface UseFeedGeneratorConfig {
  mockMode?: boolean;
  mockDelay?: number;
}

/**
 * Return type for the useFeedGenerator hook
 */
interface UseFeedGeneratorReturn {
  state: FeedState;
  generateFeed: (topic: string) => Promise<void>;
  loadAllPosts: () => Promise<void>;
  resetFeed: () => void;
}

/**
 * Event data structure from events.json
 */
interface EventData {
  id: string;
  authorName: string;
  authorHandle: string;
  avatarUrl: string | null;
  content: string;
  timestamp: string;
  topic: string;
  type: 'post' | 'news' | 'reply';
}

/**
 * Transform events.json data to SocialPost format
 */
const transformEventsToSocialPosts = (events: EventData[]): SocialPost[] => {
  return events.map((event) => ({
    id: `vn-${event.id}`,
    author: {
      name: event.authorName,
      handle: event.authorHandle,
      avatarUrl: event.avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${event.authorHandle.replace('@', '')}`,
      isVerified: true,
    },
    content: event.content,
    timestamp: event.timestamp,
    stats: {
      likes: Math.floor(Math.random() * 500000) + 100000,
      retweets: Math.floor(Math.random() * 200000) + 50000,
      replies: Math.floor(Math.random() * 100000) + 20000,
    },
    type: event.type,
  }));
};

/**
 * All mock posts from events.json
 */
const allMockPosts = transformEventsToSocialPosts(eventsData as EventData[]);

/**
 * Generate mock posts by filtering based on topic
 */
const generateMockPosts = (topic: string): SocialPost[] => {
  if (!topic || topic === 'default') {
    return allMockPosts;
  }

  const lowerTopic = topic.toLowerCase();
  
  // Filter posts that match the topic
  const matchedPosts = allMockPosts.filter((post) => {
    const content = post.content.toLowerCase();
    const authorName = post.author.name.toLowerCase();
    const authorHandle = post.author.handle.toLowerCase();
    
    return (
      content.includes(lowerTopic) ||
      authorName.includes(lowerTopic) ||
      authorHandle.includes(lowerTopic)
    );
  });

  // If no matches found, return all posts
  return matchedPosts.length > 0 ? matchedPosts : allMockPosts;
};

/**
 * Custom hook for generating Vietnamese historical social media feeds
 * 
 * @param config - Configuration options for the hook
 * @returns Feed state and control functions
 * 
 * @example
 * ```tsx
 * const { state, generateFeed, resetFeed } = useFeedGenerator({ mockMode: true });
 * 
 * // Generate feed for a topic
 * await generateFeed('Điện Biên Phủ');
 * 
 * // Access the state
 * if (state.status === 'success') {
 *   console.log(state.data);
 * }
 * ```
 */
export function useFeedGenerator(config: UseFeedGeneratorConfig = {}): UseFeedGeneratorReturn {
  const { mockMode = true, mockDelay = 1500 } = config;

  const [state, setState] = useState<FeedState>({
    status: 'idle',
    data: [],
    error: null,
  });

  /**
   * Generate feed posts for a given topic
   */
  const generateFeed = useCallback(async (topic: string): Promise<void> => {
    if (!topic.trim()) {
      setState({
        status: 'error',
        data: [],
        error: 'Vui lòng nhập chủ đề để khám phá / Please enter a topic to explore',
      });
      return;
    }

    // Set loading state
    setState({
      status: 'loading',
      data: [],
      error: null,
    });

    try {
      if (mockMode) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, mockDelay));
        
        const mockPosts = generateMockPosts(topic);
        
        setState({
          status: 'success',
          data: mockPosts,
          error: null,
        });
      } else {
        // Fetch from database API
        const response = await fetch(`/api/posts?search=${encodeURIComponent(topic)}&limit=20`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setState({
            status: 'success',
            data: result.data,
            error: null,
          });
        } else {
          // Fallback to mock data if no results from database
          const mockPosts = generateMockPosts(topic);
          setState({
            status: 'success',
            data: mockPosts,
            error: null,
          });
        }
      }
    } catch (error) {
      setState({
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi / An unexpected error occurred',
      });
    }
  }, [mockMode, mockDelay]);

  /**
   * Load all posts from database (no search filter)
   */
  const loadAllPosts = useCallback(async (): Promise<void> => {
    setState({
      status: 'loading',
      data: [],
      error: null,
    });

    try {
      const response = await fetch('/api/posts?limit=50&sortBy=likes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setState({
          status: 'success',
          data: result.data,
          error: null,
        });
      } else {
        // No posts in database, show empty state
        setState({
          status: 'idle',
          data: [],
          error: null,
        });
      }
    } catch (error) {
      console.error('Load posts error:', error);
      // Fallback to mock data from events.json
      setState({
        status: 'success',
        data: allMockPosts,
        error: null,
      });
    }
  }, []);

  /**
   * Reset the feed to initial state
   */
  const resetFeed = useCallback((): void => {
    setState({
      status: 'idle',
      data: [],
      error: null,
    });
  }, []);

  return {
    state,
    generateFeed,
    loadAllPosts,
    resetFeed,
  };
}

export default useFeedGenerator;
