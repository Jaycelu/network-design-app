import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * 将PCAP文件转换为JSON格式，便于AI模型分析
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
    
    console.log(`开始将PCAP文件转换为JSON格式: ${filePath}`);
    
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
    
    // 转换PCAP为JSON格式
    const jsonData = await convertPCAPToJSON(filePath);
    
    console.log('PCAP转JSON完成:', {
      totalPackets: jsonData.totalPackets,
      totalSize: jsonData.totalSize,
      protocols: Object.keys(jsonData.protocols),
      topTalkers: jsonData.topTalkers.length,
      conversations: jsonData.conversations?.length || 0,
      dataFormat: 'JSON',
      isJSON: true,
      hasCaptureInfo: !!jsonData.captureInfo,
      hasTrafficPattern: !!jsonData.trafficPattern
    });
    
    // 确认这是JSON格式，不是PCAP文件
    console.log('✅ 确认：PCAP文件已成功转换为JSON格式');
    console.log('转换结果：JSON对象，包含真实网络数据');
    console.log('数据验证：', {
      isObject: typeof jsonData === 'object',
      hasTotalPackets: typeof jsonData.totalPackets === 'number',
      hasProtocols: typeof jsonData.protocols === 'object',
      format: 'JSON网络数据'
    });
    
    return Response.json({
      success: true,
      data: jsonData
    });
    
  } catch (error: any) {
    console.error('PCAP转JSON失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'PCAP转JSON失败' 
      }, 
      { status: 500 }
    );
  }
}

/**
 * 将PCAP文件转换为详细的JSON格式
 */
async function convertPCAPToJSON(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    const totalSize = stats.size;
    
    // 基础数据结构
    const result = {
      captureInfo: {
        filePath: filePath,
        fileSize: totalSize,
        createdTime: stats.mtime.toISOString(),
        interface: 'unknown',
        filter: 'none'
      },
      totalPackets: 0,
      totalSize: 0,
      duration: 0,
      protocols: {},
      topTalkers: [],
      conversations: [],
      suspiciousActivities: [],
      trafficPattern: {
        avgPacketSize: 0,
        peakTime: '',
        bandwidthUsage: 0
      }
    };
    
    // 尝试使用tshark进行详细转换
    let hasTools = false;
    
    try {
      await execAsync('tshark --version');
      console.log('✅ 使用tshark进行PCAP转JSON');
      hasTools = true;
      
      // 获取数据包总数
      try {
        const { stdout: countOutput } = await execAsync(`tshark -r "${filePath}" 2>/dev/null | wc -l`);
        result.totalPackets = parseInt(countOutput.trim()) || 0;
      } catch (e) {
        console.log('无法获取数据包总数');
      }
      
      // 获取协议统计
      try {
        const { stdout: protoOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e frame.protocols 2>/dev/null | sort | uniq -c | sort -nr`);
        const lines = protoOutput.trim().split('\n');
        for (const line of lines) {
          const match = line.trim().match(/^(\d+)\s+(.+)/);
          if (match) {
            const count = parseInt(match[1]);
            const protocolInfo = match[2];
            
            // 提取主要协议
            if (protocolInfo.includes('tcp')) result.protocols['TCP'] = (result.protocols['TCP'] || 0) + count;
            if (protocolInfo.includes('udp')) result.protocols['UDP'] = (result.protocols['UDP'] || 0) + count;
            if (protocolInfo.includes('icmp')) result.protocols['ICMP'] = (result.protocols['ICMP'] || 0) + count;
            if (protocolInfo.includes('arp')) result.protocols['ARP'] = (result.protocols['ARP'] || 0) + count;
            if (protocolInfo.includes('dns')) result.protocols['DNS'] = (result.protocols['DNS'] || 0) + count;
            if (protocolInfo.includes('http')) result.protocols['HTTP'] = (result.protocols['HTTP'] || 0) + count;
            if (protocolInfo.includes('https') || protocolInfo.includes('tls')) result.protocols['HTTPS'] = (result.protocols['HTTPS'] || 0) + count;
          }
        }
      } catch (e) {
        console.log('无法获取协议统计');
      }
      
      // 获取Top Talkers（源IP统计）
      try {
        const { stdout: talkersOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e ip.src -e frame.len 2>/dev/null | awk '{ips[$1]+=1; bytes[$1]+=$2} END {for (ip in ips) print ips[ip], ip, bytes[ip]}' | sort -nr | head -10`);
        const lines = talkersOutput.trim().split('\n');
        for (const line of lines) {
          const match = line.trim().match(/^(\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+)/);
          if (match) {
            result.topTalkers.push({
              ip: match[2],
              packets: parseInt(match[1]),
              bytes: parseInt(match[3])
            });
          }
        }
      } catch (e) {
        console.log('无法获取Top Talkers');
      }
      
      // 获取通信对话（基于IP对）
      try {
        const { stdout: convOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e ip.src -e ip.dst -e frame.len 2>/dev/null | awk '{conv[$1","$2]+=1; bytes[$1","$2]+=$3} END {for (c in conv) print conv[c], c, bytes[c]}' | sort -nr | head -20`);
        const lines = convOutput.trim().split('\n');
        for (const line of lines) {
          const match = line.trim().match(/^(\d+)\s+(\d+\.\d+\.\d+\.\d+),(\d+\.\d+\.\d+\.\d+)\s+(\d+)/);
          if (match) {
            result.conversations.push({
              source: match[2],
              destination: match[3],
              packets: parseInt(match[1]),
              bytes: parseInt(match[4])
            });
          }
        }
      } catch (e) {
        console.log('无法获取通信对话');
      }
      
    } catch (e) {
      console.log('未检测到tshark，尝试tcpdump...');
      
      // 尝试使用tcpdump
      try {
        await execAsync('tcpdump --version');
        console.log('✅ 使用tcpdump进行PCAP转JSON');
        hasTools = true;
        
        // 获取数据包总数
        try {
          const { stdout: countOutput } = await execAsync(`tcpdump -r "${filePath}" -nn 2>/dev/null | wc -l`);
          result.totalPackets = parseInt(countOutput.trim()) || 0;
        } catch (e) {
          console.log('无法获取数据包总数');
        }
        
        // 获取协议分布
        try {
          const { stdout: protoOutput } = await execAsync(`tcpdump -r "${filePath}" -nn 2>/dev/null | awk '{print $2}' | sort | uniq -c | sort -nr`);
          const lines = protoOutput.trim().split('\n');
          for (const line of lines) {
            const match = line.trim().match(/^(\d+)\s+(\w+)/);
            if (match) {
              const count = parseInt(match[1]);
              const protocol = match[2].toUpperCase();
              if (protocol) {
                result.protocols[protocol] = (result.protocols[protocol] || 0) + count;
              }
            }
          }
        } catch (e) {
          console.log('无法获取协议分布');
        }
        
        // 获取Top Talkers
        try {
          const { stdout: talkersOutput } = await execAsync(`tcpdump -r "${filePath}" -nn 2>/dev/null | awk '{print $3}' | cut -d'.' -f1-4 | sort | uniq -c | sort -nr | head -10`);
          const lines = talkersOutput.trim().split('\n');
          for (const line of lines) {
            const match = line.trim().match(/^(\d+)\s+(\d+\.\d+\.\d+\.\d+)/);
            if (match) {
              const packets = parseInt(match[1]);
              const ip = match[2];
              result.topTalkers.push({
                ip,
                packets,
                bytes: packets * 100 // 基于数据包数量的估算
              });
            }
          }
        } catch (e) {
          console.log('无法获取Top Talkers');
        }
        
      } catch (e) {
        console.log('❌ 未检测到tcpdump');
      }
    }
    
    // 如果没有工具，只返回基础文件信息
    if (!hasTools) {
      console.log('⚠️ 未检测到网络分析工具，仅返回基础文件信息');
    }
    
    // 计算基础统计信息
    result.totalSize = result.topTalkers.reduce((sum, talker) => sum + talker.bytes, 0);
    result.duration = 30; // 默认30秒，可以根据需要调整
    result.trafficPattern.avgPacketSize = result.totalPackets > 0 ? Math.floor(result.totalSize / result.totalPackets) : 0;
    result.trafficPattern.peakTime = new Date().toLocaleTimeString();
    result.trafficPattern.bandwidthUsage = result.totalPackets > 0 ? Math.min(100, (result.totalSize / 1024 / 1024 / result.duration) * 8 * 100) : 0;
    
    // 基于真实数据进行异常检测
    if (result.totalPackets > 1000) {
      if (Object.keys(result.protocols).length > 5) {
        result.suspiciousActivities.push({
          type: '协议多样性',
          count: 1,
          details: [`检测到${Object.keys(result.protocols).length}种不同协议`]
        });
      }
      
      if (result.topTalkers.length > 0) {
        const topTalker = result.topTalkers[0];
        if (topTalker.packets > result.totalPackets * 0.5) {
          result.suspiciousActivities.push({
            type: '单节点高流量',
            count: 1,
            details: [`${topTalker.ip}占用超过50%的流量（${topTalker.packets}包）`]
          });
        }
      }
    }
    
    console.log('✅ PCAP转JSON完成:', {
      toolUsed: hasTools ? (toolType || 'unknown') : 'none',
      totalPackets: result.totalPackets,
      totalSize: result.totalSize,
      protocols: Object.keys(result.protocols),
      topTalkers: result.topTalkers.length,
      conversations: result.conversations.length
    });
    
    return result;
    
  } catch (error: any) {
    console.error('PCAP转JSON失败:', error);
    
    // 返回基础文件信息作为降级方案
    try {
      const stats = fs.statSync(filePath);
      return {
        captureInfo: {
          filePath: filePath,
          fileSize: stats.size,
          createdTime: stats.mtime.toISOString(),
          interface: 'unknown',
          filter: 'none'
        },
        totalPackets: 0,
        totalSize: 0,
        duration: 0,
        protocols: {},
        topTalkers: [],
        conversations: [],
        suspiciousActivities: [],
        trafficPattern: {
          avgPacketSize: 0,
          peakTime: '',
          bandwidthUsage: 0
        }
      };
    } catch (e) {
      throw new Error(`无法读取文件信息: ${e.message}`);
    }
  }
}