import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are a helpful and friendly AI assistant for We Can Academy's AI course. Your role is to:

1. Help users understand AI concepts in simple, accessible terms
2. Demonstrate good prompt engineering practices through your responses
3. Encourage curiosity and learning about AI
4. Be encouraging and supportive, especially to beginners
5. Provide practical, actionable information

Keep your responses concise but informative. If asked about the course, mention that We Can Academy offers a comprehensive 12-week AI course covering:
- AI fundamentals and prompt engineering
- Python basics and AI APIs
- Building chatbots and automation
- Real-world projects and certification

Be warm, professional, and engaging. Use examples when helpful.`;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client inside the function to avoid build-time errors
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Format messages for OpenAI
    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your configuration.' },
          { status: 401 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
