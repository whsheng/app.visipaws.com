import { NextRequest, NextResponse } from 'next/server';
import { callBailianAPI, parseAIResponse } from '@/lib/bailian';
import { AIAnalyzeResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, prompt } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { status: 'error', error: 'Missing imageBase64' } as AIAnalyzeResponse,
        { status: 400 }
      );
    }

    // 调用阿里百炼 API
    const apiResponse = await callBailianAPI(imageBase64, prompt);

    if (apiResponse.error) {
      return NextResponse.json(
        { status: 'error', error: apiResponse.error.message } as AIAnalyzeResponse,
        { status: 500 }
      );
    }

    // 解析响应
    const content = apiResponse.output?.choices?.[0]?.message?.content;
    let responseText = '';
    
    if (Array.isArray(content)) {
      responseText = content.map(c => c.text || '').join('');
    } else {
      responseText = String(content || '');
    }

    const parsedResult = parseAIResponse(responseText);

    return NextResponse.json({
      status: 'success',
      result: {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: imageBase64,
        petStatus: parsedResult.petStatus,
        abnormalities: parsedResult.abnormalities,
        suggestions: parsedResult.suggestions,
        rawResponse: responseText,
      },
    } as AIAnalyzeResponse);

  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      } as AIAnalyzeResponse,
      { status: 500 }
    );
  }
}
