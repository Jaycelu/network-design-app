import { NextRequest } from 'next/server';
import { activeCaptures } from '@/lib/packetCaptureStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return Response.json(
        { 
          success: false, 
          error: '会话ID不能为空' 
        }, 
        { status: 400 }
      );
    }
    
    // 查找对应的抓包会话
    const capture = activeCaptures.get(sessionId);
    if (!capture) {
      return Response.json(
        { 
          success: false, 
          error: '找不到对应的抓包会话' 
        }, 
        { status: 404 }
      );
    }
    
    // 返回当前统计信息
    return Response.json({
      success: true,
      stats: {
        packetCount: capture.stats.packets,
        totalSize: capture.stats.totalSize,
        duration: capture.stats.duration
      }
    });
    
  } catch (error: any) {
    console.error('获取抓包统计失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || '获取抓包统计失败' 
      }, 
      { status: 500 }
    );
  }
}