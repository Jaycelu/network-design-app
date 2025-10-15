import { promisify } from 'util';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

const execFileAsync = promisify(execFile);

/**
 * 使用Python脚本调用tshark库分析PCAP文件并生成AI分析所需的文本报告
 */
export async function analyzePCAPWithPythonForAI(filePath: string) {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error('PCAP文件不存在');
    }

    // 获取文件统计信息
    const stats = fs.statSync(filePath);
    const totalSize = stats.size;

    // 构建分析报告
    let analysisReport = '';

    // 添加文件基本信息
    analysisReport += `网络抓包分析报告\n`;
    analysisReport += `================\n\n`;
    
    analysisReport += `抓包文件信息:\n`;
    analysisReport += `- 文件路径: ${filePath}\n`;
    analysisReport += `- 文件大小: ${totalSize} 字节\n`;
    analysisReport += `- 创建时间: ${stats.mtime.toISOString()}\n`;
    analysisReport += `- 抓包时长: 30秒 (默认值)\n\n`;

    // 尝试使用Python脚本分析PCAP文件
    try {
      // 获取项目根目录
      const projectRoot = process.cwd();
      const pythonScriptPath = path.join(projectRoot, 'analyze_pcap.py');
      
      // 执行Python脚本分析PCAP文件
      const { stdout, stderr } = await execFileAsync('python', [pythonScriptPath, filePath], {
        timeout: 30000 // 30秒超时
      });
      
      if (stderr) {
        console.error('Python脚本错误输出:', stderr);
      }
      
      // 如果Python脚本成功执行并返回了分析结果
      if (stdout && stdout.trim() !== '') {
        analysisReport += stdout;
        return analysisReport;
      } else {
        // 如果没有输出，提供基础文件信息
        analysisReport += `数据包总数: 0\n\n`;
        analysisReport += `协议分布:\n- 未知\n\n`;
        analysisReport += `主要通信IP:\n- 未知\n\n`;
        analysisReport += `主要通信对话:\n- 未知\n\n`;
        analysisReport += `平均数据包大小: 0.00 字节\n\n`;
      }
    } catch (pythonError: any) {
      // Python脚本执行失败
      console.error('Python脚本执行失败:', pythonError);
      analysisReport += `警告: Python脚本执行失败，无法进行详细分析\n`;
      analysisReport += `错误信息: ${pythonError.message}\n\n`;
      
      // 提供基础文件信息
      analysisReport += `数据包总数: 0\n\n`;
      analysisReport += `协议分布:\n- 未知\n\n`;
      analysisReport += `主要通信IP:\n- 未知\n\n`;
      analysisReport += `主要通信对话:\n- 未知\n\n`;
      analysisReport += `平均数据包大小: 0.00 字节\n\n`;
    }

    // 添加分析建议
    analysisReport += `分析建议:\n`;
    analysisReport += `- 确保Wireshark已正确安装并添加到系统环境变量中\n`;
    analysisReport += `- 使用Wireshark打开文件可查看完整数据包信息\n`;
    analysisReport += `- 关注文件大小和创建时间以判断抓包是否成功\n`;

    return analysisReport;
  } catch (error: any) {
    console.error('PCAP分析失败:', error);
    throw error;
  }
}