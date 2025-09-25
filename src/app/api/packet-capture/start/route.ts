import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { activeCaptures } from '@/lib/packetCaptureStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interface: interfaceName, duration = 30 } = body;
    
    // 接口名称现在是可选的，Python脚本会自动检测
    const interfaceToUse = interfaceName || 'auto_detect';
    
    // 生成会话ID
    const sessionId = `capture_${Date.now()}`;
    
    // 创建临时目录和输出文件路径
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // 生成文件名：网络接口名称_抓包时间
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    // 清理接口名称，移除特殊字符和空格
    const cleanInterfaceName = interfaceName.replace(/[^a-zA-Z0-9()]/g, '');
    const fileName = `${cleanInterfaceName}_${timestamp}.pcap`;
    const outputFile = path.join(tempDir, fileName);
    
    console.log(`开始抓包会话: ${sessionId}, 接口: ${interfaceToUse}, 输出文件: ${outputFile}`);
    
    // 调用Python抓包脚本，使用0表示不限制抓包时间
    const scriptPath = path.join(process.cwd(), 'capture.py');
    const pythonProcess = spawn('python', [scriptPath, interfaceToUse, '0', outputFile]);
    
    // 存储进程信息
    activeCaptures.set(sessionId, {
      process: pythonProcess,
      interface: interfaceName,
      startTime: Date.now(),
      outputFile: outputFile,
      stats: {
        packets: 0,
        totalSize: 0,
        duration: 0
      }
    });
    
    // 监听Python脚本的输出
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      console.log('抓包脚本输出:', output);
      
      try {
        const parsed = JSON.parse(output);
        const capture = activeCaptures.get(sessionId);
        
        if (capture) {
          if (parsed.type === 'stats') {
            // 更新统计信息
            capture.stats = {
              packets: parsed.packet_count,
              totalSize: parsed.total_size,
              duration: parsed.duration
            };
          } else if (parsed.type === 'complete') {
            // 抓包完成
            console.log(`抓包完成: ${parsed.packet_count} 个包, ${parsed.total_size} 字节`);
          } else if (parsed.type === 'file_saved') {
            console.log(`PCAP文件已保存: ${parsed.file_path}`);
            // 更新输出文件路径，确保使用实际保存的文件路径
            capture.outputFile = parsed.file_path;
          } else if (parsed.type === 'driver_error') {
            // Npcap驱动错误
            console.error('Npcap驱动错误:', parsed.message);
            // 保存驱动错误信息到进程数据中
            capture.driverError = {
              message: parsed.message,
              detail: parsed.detail,
              downloadUrl: parsed.download_url,
              solution: parsed.solution
            };
          } else if (parsed.type === 'error') {
            console.error('抓包错误:', parsed.message);
            if (parsed.traceback) {
              console.error('详细错误:', parsed.traceback);
            }
          } else if (parsed.type === 'debug') {
            console.log('抓包调试:', parsed.message);
          } else if (parsed.type === 'info') {
            console.log('抓包信息:', parsed.message);
          } else if (parsed.type === 'warning') {
            console.warn('抓包警告:', parsed.message);
          }
        }
      } catch (e) {
        console.log('无法解析脚本输出:', output);
      }
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error('抓包脚本错误:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
      console.log(`抓包脚本退出，代码: ${code}`);
      const capture = activeCaptures.get(sessionId);
      if (capture && capture.driverError) {
        console.error('抓包因驱动错误退出:', capture.driverError);
      }
      activeCaptures.delete(sessionId);
    });
    
    return Response.json({
      success: true,
      status: 'success',
      message: `开始在接口 ${interfaceToUse} 上抓包`,
      sessionId: sessionId,
      outputFile: outputFile,
      fileName: fileName
    });
    
  } catch (error: any) {
    console.error('开始抓包失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || '开始抓包失败' 
      }, 
      { status: 500 }
    );
  }
}