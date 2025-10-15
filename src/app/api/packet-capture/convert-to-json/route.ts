import { NextRequest } from 'next/server';
import fs from 'fs';

/**
 * 检查PCAP文件是否存在
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath, sessionId } = body;
    
    if (!filePath) {
      return Response.json(
        { 
          success: false, 
          error: '文件路径不能为空' 
        }, 
        { status: 400 }
      );
    }
    
    console.log(`检查PCAP文件: ${filePath}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return Response.json(
        { 
          success: false, 
          error: 'PCAP文件不存在' 
        }, 
        { status: 404 }
      );
    }
    
    // 获取文件信息
    const stats = fs.statSync(filePath);
    
    console.log('PCAP文件检查完成:', {
      fileSize: stats.size,
      createdTime: stats.mtime.toISOString(),
      exists: true
    });
    
    // 直接返回文件信息，不进行JSON转换
    return Response.json({
      success: true,
      data: {
        captureInfo: {
          filePath: filePath,
          fileSize: stats.size,
          createdTime: stats.mtime.toISOString(),
          interface: 'unknown',
          filter: 'none'
        },
        totalPackets: 0, // 占位符，实际由AI分析模块处理
        totalSize: stats.size,
        duration: 30, // 默认30秒
        protocols: {},
        topTalkers: [],
        conversations: [],
        suspiciousActivities: [],
        trafficPattern: {
          avgPacketSize: 0,
          peakTime: new Date().toISOString(),
          bandwidthUsage: 0
        }
      }
    });
    
  } catch (error: any) {
    console.error('PCAP文件检查失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'PCAP文件检查失败' 
      }, 
      { status: 500 }
    );
  }
}