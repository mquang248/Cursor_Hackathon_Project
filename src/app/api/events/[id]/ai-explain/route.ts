import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventsPath = path.join(process.cwd(), 'data', 'events.json');
    const eventsData = fs.readFileSync(eventsPath, 'utf8');
    const events = JSON.parse(eventsData);
    
    const event = events.find((e: any) => e.id === params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'EVENT_NOT_FOUND' },
        { status: 404 }
      );
    }
    
    const systemPromptPath = path.join(process.cwd(), 'system_prompt.txt');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI_ERROR', message: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    
    const openai = new OpenAI({ apiKey });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(event, null, 2) }
      ],
      response_format: { type: 'json_object' }
    });
    
    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return NextResponse.json(
        { error: 'AI_ERROR', message: 'No response from AI' },
        { status: 500 }
      );
    }
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      return NextResponse.json(parsedResponse, { status: 200 });
    } catch (parseError) {
      return NextResponse.json(
        { error: 'AI_ERROR', message: 'Failed to parse AI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI Explain Error:', error);
    return NextResponse.json(
      { error: 'AI_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

