'use client';

import { useState, useCallback } from 'react';
import type { FeedState, SocialPost } from '@/types';

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
  resetFeed: () => void;
}

/**
 * Mock historical data generator
 * Creates realistic-looking historical social media posts
 */
const generateMockPosts = (topic: string): SocialPost[] => {
  const mockData: Record<string, SocialPost[]> = {
    default: [
      {
        id: '1',
        author: {
          name: 'Julius Caesar',
          handle: '@imperatorjc',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=caesar',
          isVerified: true,
        },
        content: 'Just crossed the Rubicon. The die is cast. 🎲 Sometimes you have to make bold moves. #YOLO #RomanEmpire',
        timestamp: 'January 10, 49 BC',
        stats: { likes: 45200, retweets: 12300, replies: 8900 },
        type: 'post',
      },
      {
        id: '2',
        author: {
          name: 'Cleopatra VII',
          handle: '@queenofnile',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=cleopatra',
          isVerified: true,
        },
        content: 'Arrived in Rome rolled up in a carpet. Sometimes you gotta make an entrance. 💅👑 #QueenThings #Diplomacy',
        timestamp: '48 BC',
        stats: { likes: 89000, retweets: 34500, replies: 15600 },
        type: 'post',
      },
      {
        id: '3',
        author: {
          name: 'Leonardo da Vinci',
          handle: '@universalgenius',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=leonardo',
          isVerified: true,
        },
        content: 'Finally finished the Mona Lisa. Not sure about the smile though... what do you guys think? 🎨 #Art #Renaissance #WIP',
        timestamp: '1517',
        stats: { likes: 156000, retweets: 78000, replies: 42000 },
        type: 'post',
      },
      {
        id: '4',
        author: {
          name: 'Marie Curie',
          handle: '@radioactivequeen',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=curie',
          isVerified: true,
        },
        content: 'Just discovered Polonium AND Radium in the same year. My lab is literally glowing rn ✨🔬 #Science #NobelPrize',
        timestamp: '1898',
        stats: { likes: 234000, retweets: 89000, replies: 56000 },
        type: 'post',
      },
      {
        id: '5',
        author: {
          name: 'Historical News Network',
          handle: '@HNN_Breaking',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=news',
          isVerified: true,
        },
        content: '🚨 BREAKING: The Berlin Wall has fallen. East and West Germany to reunite after 28 years of division. History in the making. #BerlinWall #Germany',
        timestamp: 'November 9, 1989',
        stats: { likes: 567000, retweets: 234000, replies: 123000 },
        type: 'news',
      },
    ],
    'world war': [
      {
        id: 'ww1',
        author: {
          name: 'Winston Churchill',
          handle: '@winstonc',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=churchill',
          isVerified: true,
        },
        content: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall never surrender! 🇬🇧 #WWII #NeverGiveUp',
        timestamp: 'June 4, 1940',
        stats: { likes: 890000, retweets: 456000, replies: 234000 },
        type: 'post',
      },
      {
        id: 'ww2',
        author: {
          name: 'Historical News Network',
          handle: '@HNN_Breaking',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=news',
          isVerified: true,
        },
        content: '🚨 BREAKING: Allied forces have landed on the beaches of Normandy. D-Day operations underway. #DDay #WWII #Liberation',
        timestamp: 'June 6, 1944',
        stats: { likes: 1200000, retweets: 890000, replies: 567000 },
        type: 'news',
      },
    ],
    'space': [
      {
        id: 'space1',
        author: {
          name: 'Neil Armstrong',
          handle: '@firstonthemoon',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=armstrong',
          isVerified: true,
        },
        content: 'That\'s one small step for man, one giant leap for mankind. 🌙🚀 The view up here is incredible! #Apollo11 #MoonLanding',
        timestamp: 'July 20, 1969',
        stats: { likes: 2340000, retweets: 1230000, replies: 890000 },
        type: 'post',
      },
      {
        id: 'space2',
        author: {
          name: 'Yuri Gagarin',
          handle: '@firstinspace',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=gagarin',
          isVerified: true,
        },
        content: 'Поехали! (Let\'s go!) 🚀 First human in space. Earth looks so beautiful from up here. Blue marble indeed. #Vostok1 #SpaceRace',
        timestamp: 'April 12, 1961',
        stats: { likes: 1890000, retweets: 890000, replies: 456000 },
        type: 'post',
      },
    ],
    'revolution': [
      {
        id: 'rev1',
        author: {
          name: 'Thomas Jefferson',
          handle: '@tjefferson',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=jefferson',
          isVerified: true,
        },
        content: 'We hold these truths to be self-evident, that all men are created equal... 📜✊ Just dropped a declaration. Thoughts? #Independence #July4th',
        timestamp: 'July 4, 1776',
        stats: { likes: 1776000, retweets: 890000, replies: 567000 },
        type: 'post',
      },
      {
        id: 'rev2',
        author: {
          name: 'Maximilien Robespierre',
          handle: '@robespierremax',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=robespierre',
          isVerified: false,
        },
        content: 'The Revolution is not over until we achieve true virtue in the Republic! Liberté, égalité, fraternité! 🇫🇷 #FrenchRevolution',
        timestamp: '1793',
        stats: { likes: 45000, retweets: 23000, replies: 89000 },
        type: 'post',
      },
    ],
  };

  // Find matching topic or return default
  const lowerTopic = topic.toLowerCase();
  for (const [key, posts] of Object.entries(mockData)) {
    if (lowerTopic.includes(key) || key.includes(lowerTopic)) {
      return posts;
    }
  }

  return mockData.default;
};

/**
 * Custom hook for generating historical social media feeds
 * 
 * @param config - Configuration options for the hook
 * @returns Feed state and control functions
 * 
 * @example
 * ```tsx
 * const { state, generateFeed, resetFeed } = useFeedGenerator({ mockMode: true });
 * 
 * // Generate feed for a topic
 * await generateFeed('Roman Empire');
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
        error: 'Please enter a topic to explore',
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
        // Real API call
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setState({
            status: 'success',
            data: result.data,
            error: null,
          });
        } else {
          throw new Error(result.error || 'Failed to generate feed');
        }
      }
    } catch (error) {
      setState({
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }, [mockMode, mockDelay]);

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
    resetFeed,
  };
}

export default useFeedGenerator;

