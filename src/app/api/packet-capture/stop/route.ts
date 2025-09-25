import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
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
    
    console.log(`停止抓包会话: ${sessionId}`);
    
    // 停止Python抓包进程
    if (capture.process) {
      try {
        capture.process.kill('SIGTERM');
        console.log(`已发送停止信号给抓包进程: ${sessionId}`);
      } catch (error) {
        console.error(`停止进程失败: ${error}`);
      }
    }
    
    // 等待进程完全停止（最多等待3秒）
    let waitCount = 0;
    while (capture.process && !capture.process.killed && waitCount < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      waitCount++;
    }
    
    // 如果进程还在运行，强制终止
    if (capture.process && !capture.process.killed) {
      try {
        capture.process.kill('SIGKILL');
        console.log(`已强制终止抓包进程: ${sessionId}`);
      } catch (error) {
        console.error(`强制终止进程失败: ${error}`);
      }
    }
    
    // 检查输出文件是否存在且有内容
    let filePath = capture.outputFile;
    let fileName = path.basename(filePath);
    let stats = capture.stats || { packets: 0, totalSize: 0, duration: 0 };
    
    console.log(`停止抓包 - 原始文件路径: ${filePath}, 文件名: ${fileName}`);
    
    // 等待一段时间，确保Python脚本已经完成文件保存
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 始终使用实际文件的大小
    if (fs.existsSync(filePath)) {
      const actualFileSize = fs.statSync(filePath).size;
      stats.totalSize = actualFileSize;
      console.log(`原始文件存在，实际大小: ${actualFileSize} 字节`);
    } else {
      console.log(`原始文件不存在: ${filePath}`);
      
      // 如果文件不存在，尝试查找最近生成的PCAP文件
      const tempDir = path.join(process.cwd(), 'temp');
      if (fs.existsSync(tempDir)) {
        const pcapFiles = fs.readdirSync(tempDir)
          .filter(file => file.endsWith('.pcap'))
          .map(file => ({
            name: file,
            path: path.join(tempDir, file),
            mtime: fs.statSync(path.join(tempDir, file)).mtime
          }))
          .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
        
        if (pcapFiles.length > 0) {
          // 使用最新的PCAP文件
          const latestFile = pcapFiles[0];
          filePath = latestFile.path;
          fileName = latestFile.name;
          console.log(`使用最新的PCAP文件: ${filePath}, 文件名: ${fileName}`);
          
          // 始终使用实际文件的大小
          if (fs.existsSync(filePath)) {
            const actualFileSize = fs.statSync(filePath).size;
            stats.totalSize = actualFileSize;
            console.log(`实际文件大小: ${actualFileSize} 字节`);
          }
        }
      }
    }
    
    console.log(`最终返回 - 文件路径: ${filePath}, 文件名: ${fileName}, 大小: ${stats.totalSize} 字节`);
    
    // 清理会话
    activeCaptures.delete(sessionId);
    
    return Response.json({
      success: true,
      status: 'success',
      message: '抓包已停止',
      filePath: filePath,
      fileName: fileName,
      stats: {
        packetCount: stats.packets,
        totalSize: stats.totalSize,
        duration: stats.duration
      }
    });
    
  } catch (error: any) {
    console.error('停止抓包失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || '停止抓包失败' 
      }, 
      { status: 500 }
    );
  }
}