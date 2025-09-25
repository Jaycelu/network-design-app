import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return Response.json(
        { 
          success: false, 
          error: '文件名不能为空' 
        }, 
        { status: 400 }
      );
    }
    
    // 安全检查：防止路径遍历攻击
    if (fileName.includes('..') || fileName.includes('/')) {
      return Response.json(
        { 
          success: false, 
          error: '无效的文件名' 
        }, 
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'temp', fileName);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return Response.json(
        { 
          success: false, 
          error: '文件不存在' 
        }, 
        { status: 404 }
      );
    }
    
    // 读取文件内容
    const fileBuffer = fs.readFileSync(filePath);
    
    // 返回文件内容
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
    
  } catch (error: any) {
    console.error('文件下载失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || '文件下载失败' 
      }, 
      { status: 500 }
    );
  }
}