import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * POST /api/learn-more
 * Get detailed information about a historical event using Groq AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, content, authorName, timestamp, language = 'vi' } = body;

    if (!topic && !content) {
      return NextResponse.json(
        { success: false, error: language === 'vi' ? 'Topic hoặc content là bắt buộc' : 'Topic or content is required' },
        { status: 400 }
      );
    }

    // Generate prompt based on language
    const prompt = language === 'en' 
      ? `You are a Vietnamese history expert. Please provide detailed information about the following historical event in English:

Topic: ${topic || 'Vietnamese History'}
Historical Figure: ${authorName || 'Unknown'}
Time Period: ${timestamp || 'Unknown'}
Original Content: ${content || ''}

Please write a detailed summary (about 200-300 words) including:
1. Historical Context
2. Main Events
3. Important Figures Involved
4. Historical Significance and Impact
5. Lessons Learned

Write in an engaging, easy-to-understand, and historically accurate style.`
      : `Bạn là một chuyên gia lịch sử Việt Nam. Hãy cung cấp thông tin chi tiết về sự kiện lịch sử sau đây bằng tiếng Việt:

Chủ đề: ${topic || 'Lịch sử Việt Nam'}
Nhân vật: ${authorName || 'Không rõ'}
Thời gian: ${timestamp || 'Không rõ'}
Nội dung gốc: ${content || ''}

Hãy viết một bài tóm tắt chi tiết (khoảng 200-300 từ) bao gồm:
1. Bối cảnh lịch sử
2. Diễn biến chính của sự kiện
3. Nhân vật quan trọng liên quan
4. Ý nghĩa lịch sử và tác động
5. Bài học rút ra

Viết theo phong cách dễ hiểu, hấp dẫn và chính xác về mặt lịch sử.`;

    const systemPrompt = language === 'en'
      ? 'You are a Vietnamese history expert who always provides accurate and engaging information about Vietnamese historical events in English.'
      : 'Bạn là một chuyên gia lịch sử Việt Nam, luôn cung cấp thông tin chính xác và hấp dẫn về các sự kiện lịch sử Việt Nam.';

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const result = await response.json();
    const aiContent = result.choices?.[0]?.message?.content || 'Không thể lấy thông tin chi tiết.';

    return NextResponse.json({
      success: true,
      data: {
        content: aiContent,
        topic,
        timestamp,
      },
    });
  } catch (error) {
    console.error('Learn More API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi khi lấy thông tin chi tiết' 
      },
      { status: 500 }
    );
  }
}

