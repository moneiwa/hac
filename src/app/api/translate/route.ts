import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    // Validate input
    if (!text || !language) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
            You will be provided with a sentence. Your tasks are to:
            - Detect what language the sentence is in
            - Translate the sentence into ${language}
            Do not return anything other than the translated sentence.
          `,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    // Return the translated text
    return NextResponse.json({
      text: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
