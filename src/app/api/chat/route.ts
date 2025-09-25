import { NextRequest } from 'next/server';
import { analyzeNetworkIssue } from '@/lib/aiModel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    // 检查必要的参数
    if (!message) {
      return Response.json(
        { 
          success: false, 
          error: '消息内容不能为空' 
        }, 
        { status: 400 }
      );
    }

    // 调用AI模型进行网络问题分析
    const aiResponse = await analyzeNetworkIssue(message);

    return Response.json({
      success: true,
      data: {
        message: aiResponse,
        sessionId
      }
    });
  } catch (error: any) {
    console.error('AI聊天API错误:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || '服务器内部错误' 
      }, 
      { status: 500 }
    );
  }
}