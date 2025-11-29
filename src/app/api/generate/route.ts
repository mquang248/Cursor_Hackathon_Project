import { NextRequest, NextResponse } from 'next/server';
import type { SocialPost, GenerateFeedResponse } from '@/types';

/**
 * POST /api/generate
 * 
 * Generates a historical social media feed based on the given topic.
 * This endpoint will be connected to the Groq SDK for AI-powered generation.
 */
export async function POST(request: NextRequest): Promise<NextResponse<GenerateFeedResponse>> {
  try {
    const body = await request.json();
    const { topic } = body as { topic: string };

    // Validate input
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Topic is required and must be a string',
        },
        { status: 400 }
      );
    }

    // TODO: Connect with Groq SDK here (Member 3 task)
    // 
    // Implementation notes for Member 3:
    // 1. Initialize Groq client with API key from environment
    // 2. Create a prompt that generates historical social media posts
    // 3. Parse the AI response into SocialPost[] format
    // 4. Handle rate limiting and errors appropriately
    //
    // Example integration:
    // ```
    // import Groq from 'groq-sdk';
    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // const completion = await groq.chat.completions.create({
    //   model: 'llama3-8b-8192',
    //   messages: [{ role: 'user', content: promptTemplate(topic) }],
    // });
    // ```

    // Dummy response for frontend testing
    const dummyPosts: SocialPost[] = [
      {
        id: 'api-1',
        author: {
          name: 'Historical Figure',
          handle: '@historical_figure',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=api1',
          isVerified: true,
        },
        content: `Exploring the fascinating history of "${topic}". What an incredible journey through time! 📜✨ #History #${topic.replace(/\s+/g, '')}`,
        timestamp: 'A long time ago',
        stats: { likes: 12500, retweets: 4300, replies: 890 },
        type: 'post',
      },
      {
        id: 'api-2',
        author: {
          name: 'History News Network',
          handle: '@HNN_Breaking',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=hnn',
          isVerified: true,
        },
        content: `🚨 BREAKING: Major developments related to "${topic}" are shaping our understanding of history. Stay tuned for more updates. #BreakingNews`,
        timestamp: 'Centuries ago',
        stats: { likes: 45000, retweets: 23000, replies: 5600 },
        type: 'news',
      },
      {
        id: 'api-3',
        author: {
          name: 'Time Traveler',
          handle: '@chronoexplorer',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=chrono',
          isVerified: false,
        },
        content: `Replying to @historical_figure: This topic "${topic}" is absolutely fascinating! I've been studying it for years. 🔍📚`,
        timestamp: '2 hours ago in the past',
        stats: { likes: 3400, retweets: 890, replies: 234 },
        type: 'reply',
      },
    ];

    return NextResponse.json({
      success: true,
      data: dummyPosts,
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate
 * 
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    message: 'ChronoFeed API is running',
    version: '1.0.0',
  });
}

