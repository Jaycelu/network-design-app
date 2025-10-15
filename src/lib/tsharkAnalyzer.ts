import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * 使用tshark直接分析PCAP文件并生成AI分析所需的文本报告
 */
export async function analyzePCAPWithTsharkForAI(filePath: string) {
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

    // 尝试使用tshark获取数据包总数
    try {
      await execAsync('tshark --version');
      
      // tshark可用，获取数据包总数
      const { stdout: countOutput } = await execAsync(`tshark -r "${filePath}" -V 2>nul | find /c /v ""`);
      const count = parseInt(countOutput.trim()) || 0;
      analysisReport += `数据包总数: ${count}\n\n`;
      
      if (count === 0) {
        analysisReport += `警告: 未捕获到数据包，可能原因:\n`;
        analysisReport += `- 抓包接口配置错误\n`;
        analysisReport += `- 网络设备未活动\n`;
        analysisReport += `- 抓包时无网络流量\n\n`;
        return analysisReport;
      }
      
      // 获取协议统计
      analysisReport += `协议分布:\n`;
      try {
        const { stdout: protoOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e frame.protocols 2>nul`);
        const protocolLines = protoOutput.split('\n').filter(line => line.trim());
        const protocolCounts: Record<string, number> = {};

        protocolLines.forEach(line => {
          const protocols = line.split(':');
          protocols.forEach(protocol => {
            if (protocol) {
              protocolCounts[protocol] = (protocolCounts[protocol] || 0) + 1;
            }
          });
        });

        // 排序并显示前10个协议
        const sortedProtocols = Object.entries(protocolCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10);

        if (sortedProtocols.length > 0) {
          sortedProtocols.forEach(([protocol, count]) => {
            analysisReport += `- ${protocol}: ${count}个数据包\n`;
          });
        } else {
          analysisReport += `- 无协议信息\n`;
        }
      } catch (e: any) {
        analysisReport += `- 无法获取协议统计: ${e.message}\n`;
      }
      analysisReport += `\n`;

      // 获取Top Talkers（源IP统计）
      analysisReport += `主要通信IP:\n`;
      try {
        const { stdout: talkersOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e ip.src -e frame.len 2>nul`);
        const lines = talkersOutput.split('\n').filter(line => line.trim());
        const ipCounts: Record<string, { packets: number, bytes: number }> = {};

        lines.forEach(line => {
          const parts = line.split('\t');
          if (parts.length >= 2) {
            const ip = parts[0].trim();
            const bytes = parseInt(parts[1]) || 0;
            if (ip && ip !== '') {
              if (!ipCounts[ip]) {
                ipCounts[ip] = { packets: 0, bytes: 0 };
              }
              ipCounts[ip].packets += 1;
              ipCounts[ip].bytes += bytes;
            }
          }
        });

        // 排序并取前5个
        const sortedIPs = Object.entries(ipCounts)
          .sort(([,a], [,b]) => b.packets - a.packets)
          .slice(0, 5);

        if (sortedIPs.length > 0) {
          sortedIPs.forEach(([ip, stats]) => {
            analysisReport += `- ${ip}: ${stats.packets}个包, ${stats.bytes}字节\n`;
          });
        } else {
          analysisReport += `- 无IP通信信息\n`;
        }
      } catch (e: any) {
        analysisReport += `- 无法获取IP统计: ${e.message}\n`;
      }
      analysisReport += `\n`;

      // 获取通信对话（基于IP对）
      analysisReport += `主要通信对话:\n`;
      try {
        const { stdout: convOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e ip.src -e ip.dst -e frame.len 2>nul`);
        const lines = convOutput.split('\n').filter(line => line.trim());
        const conversations: Record<string, { packets: number, bytes: number }> = {};

        lines.forEach(line => {
          const parts = line.split('\t');
          if (parts.length >= 3) {
            const src = parts[0].trim();
            const dst = parts[1].trim();
            const bytes = parseInt(parts[2]) || 0;
            if (src && dst && src !== '' && dst !== '' && src !== dst) {
              const key = `${src} -> ${dst}`;
              if (!conversations[key]) {
                conversations[key] = { packets: 0, bytes: 0 };
              }
              conversations[key].packets += 1;
              conversations[key].bytes += bytes;
            }
          }
        });

        // 排序并取前5个
        const sortedConvs = Object.entries(conversations)
          .sort(([,a], [,b]) => b.packets - a.packets)
          .slice(0, 5);

        if (sortedConvs.length > 0) {
          sortedConvs.forEach(([key, stats]) => {
            analysisReport += `- ${key}: ${stats.packets}个包, ${stats.bytes}字节\n`;
          });
        } else {
          analysisReport += `- 无通信对话信息\n`;
        }
      } catch (e: any) {
        analysisReport += `- 无法获取通信对话: ${e.message}\n`;
      }
      analysisReport += `\n`;
    } catch (e: any) {
      // tshark不可用，提供基础文件信息
      analysisReport += `警告: tshark未安装或不可用，无法进行详细分析\n`;
      analysisReport += `请安装Wireshark以获得完整的网络数据分析功能\n\n`;
      
      analysisReport += `基础文件信息:\n`;
      analysisReport += `- 文件大小: ${totalSize} 字节\n`;
      analysisReport += `- 创建时间: ${stats.mtime.toISOString()}\n\n`;
    }

    // 添加分析建议
    analysisReport += `分析建议:\n`;
    analysisReport += `- 如需详细分析，请安装Wireshark\n`;
    analysisReport += `- 使用Wireshark打开文件可查看完整数据包信息\n`;
    analysisReport += `- 关注文件大小和创建时间以判断抓包是否成功\n`;

    return analysisReport;
  } catch (error: any) {
    console.error('PCAP分析失败:', error);
    throw error;
  }
}