import { NextRequest, NextResponse } from 'next/server';
import type { SocialPost, GenerateFeedResponse } from '@/types';

/**
 * POST /api/generate
 * 
 * Generates a Vietnamese historical social media feed based on the given topic.
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
          error: 'Vui lòng nhập chủ đề / Topic is required and must be a string',
        },
        { status: 400 }
      );
    }

    // TODO: Connect with Groq SDK here (Member 3 task)
    // 
    // Implementation notes for Member 3:
    // 1. Initialize Groq client with API key from environment
    // 2. Create a prompt that generates Vietnamese historical social media posts
    // 3. Parse the AI response into SocialPost[] format
    // 4. Handle rate limiting and errors appropriately
    // 5. Make sure to generate bilingual content (Vietnamese + English)
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
    //
    // Example prompt template:
    // ```
    // const promptTemplate = (topic: string) => `
    //   Generate 5 social media posts about Vietnamese historical topic: "${topic}"
    //   Each post should be bilingual (Vietnamese first, then English translation)
    //   Include famous Vietnamese historical figures, events, and cultural elements.
    //   Format as JSON array with: id, author, content, timestamp, stats, type
    // `;
    // ```

    // Dummy response for frontend testing - Vietnamese History
    const dummyPosts: SocialPost[] = [
      {
        id: 'api-1',
        author: {
          name: 'Nhà Sử Học',
          handle: '@lichsu_vietnam',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=lichsu',
          isVerified: true,
        },
        content: `📚 Khám phá chủ đề "${topic}" trong lịch sử Việt Nam! Đây là một phần quan trọng của di sản văn hóa dân tộc.\n\n🇬🇧 Exploring the topic "${topic}" in Vietnamese history! This is an important part of our national cultural heritage.\n\n#LịchSửViệtNam #${topic.replace(/\s+/g, '')}`,
        timestamp: 'Từ ngàn xưa / Ages ago',
        stats: { likes: 12500, retweets: 4300, replies: 890 },
        type: 'post',
      },
      {
        id: 'api-2',
        author: {
          name: 'Báo Lịch Sử VN',
          handle: '@lichsuvn_news',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=baols',
          isVerified: true,
        },
        content: `🚨 TIN NÓNG: Những phát hiện mới về "${topic}" đang thay đổi cách chúng ta hiểu về lịch sử Việt Nam!\n\n🇬🇧 BREAKING: New discoveries about "${topic}" are changing how we understand Vietnamese history!\n\n#TinLịchSử #ViệtNam`,
        timestamp: 'Nhiều thế kỷ trước',
        stats: { likes: 45000, retweets: 23000, replies: 5600 },
        type: 'news',
      },
      {
        id: 'api-3',
        author: {
          name: 'Sinh Viên Sử Học',
          handle: '@sinhviensuhoc',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=sinhvien',
          isVerified: false,
        },
        content: `💬 Trả lời @lichsu_vietnam: Chủ đề "${topic}" thực sự rất thú vị! Mình đã nghiên cứu nó trong nhiều năm. 📖\n\n🇬🇧 Replying: The topic "${topic}" is really fascinating! I've been studying it for years.\n\n#HọcSử #NghiênCứu`,
        timestamp: '2 giờ trước trong quá khứ',
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
        error: error instanceof Error ? error.message : 'Lỗi máy chủ / Internal server error',
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
    message: 'Việt Sử Ký / VietChronicle API đang hoạt động - API is running',
    version: '1.0.0',
    description: 'Lịch Sử Việt Nam / Vietnamese History',
  });
}
