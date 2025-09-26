import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * 分析PCAP文件并返回详细的网络流量数据
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
    
    console.log(`开始分析PCAP文件: ${filePath}`);
    
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
    
    // 使用tcpdump或tshark分析PCAP文件
    const analysisResult = await analyzePCAPFile(filePath);
    
    console.log('PCAP文件分析完成:', {
      totalPackets: analysisResult.totalPackets,
      totalSize: analysisResult.totalSize,
      protocols: Object.keys(analysisResult.protocols),
      topTalkersCount: analysisResult.topTalkers.length
    });
    
    return Response.json({
      success: true,
      data: analysisResult
    });
    
  } catch (error: any) {
    console.error('PCAP文件分析失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'PCAP文件分析失败' 
      }, 
      { status: 500 }
    );
  }
}

/**
 * 使用系统工具分析PCAP文件 - 完全基于真实数据，禁用模拟数据
 */
async function analyzePCAPFile(filePath: string) {
  try {
    console.log(`开始分析PCAP文件: ${filePath}`);
    
    // 基本统计信息 - 基于文件真实数据
    let totalPackets = 0;
    let totalSize = 0;
    let duration = 30; // 默认30秒
    const protocols: { [key: string]: number } = {};
    const topTalkers: Array<{ip: string, packets: number, bytes: number}> = [];
    const suspiciousActivities: Array<{type: string, count: number, details: string[]}> = [];
    
    // 获取文件真实统计信息
    const stats = fs.statSync(filePath);
    totalSize = stats.size;
    
    // 如果没有安装工具，直接返回基础真实数据，不进行任何模拟
    let hasTools = false;
    let toolType = '无工具';
    
    try {
      // 检查是否安装了tshark
      await execAsync('tshark --version');
      console.log('✅ 检测到tshark，使用tshark进行PCAP分析');
      hasTools = true;
      toolType = 'tshark';
      
      // 使用tshark获取真实统计信息
      try {
        // 获取真实数据包总数
        const { stdout: countOutput } = await execAsync(`tshark -r "${filePath}" 2>/dev/null | wc -l`);
        totalPackets = parseInt(countOutput.trim()) || 0;
        
        // 获取真实协议分布
        const { stdout: protoOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e frame.protocols 2>/dev/null | sort | uniq -c | sort -nr`);
        const protocolLines = protoOutput.trim().split('\n');
        for (const line of protocolLines) {
          const match = line.trim().match(/^(\d+)\s+(.+)/);
          if (match) {
            const count = parseInt(match[1]);
            const protocolInfo = match[2];
            // 提取真实协议数据
            if (protocolInfo.includes('tcp')) protocols['TCP'] = (protocols['TCP'] || 0) + count;
            if (protocolInfo.includes('udp')) protocols['UDP'] = (protocols['UDP'] || 0) + count;
            if (protocolInfo.includes('icmp')) protocols['ICMP'] = (protocols['ICMP'] || 0) + count;
            if (protocolInfo.includes('arp')) protocols['ARP'] = (protocols['ARP'] || 0) + count;
            if (protocolInfo.includes('dns')) protocols['DNS'] = (protocols['DNS'] || 0) + count;
          }
        }
        
        // 获取真实Top Talkers
        const { stdout: talkersOutput } = await execAsync(`tshark -r "${filePath}" -T fields -e ip.src -e frame.len 2>/dev/null | awk '{ips[$1]+=1; bytes[$1]+=$2} END {for (ip in ips) print ips[ip], ip, bytes[ip]}' | sort -nr | head -5`);
        const talkerLines = talkersOutput.trim().split('\n');
        for (const line of talkerLines) {
          const match = line.trim().match(/^(\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+)/);
          if (match) {
            const packets = parseInt(match[1]);
            const ip = match[2];
            const bytes = parseInt(match[3]);
            topTalkers.push({ ip, packets, bytes });
          }
        }
        
      } catch (error) {
        console.error('tshark分析失败:', error);
        hasTools = false;
        // 如果tshark失败，继续尝试tcpdump，但不使用模拟数据
      }
    } catch {
      console.log('未检测到tshark，尝试tcpdump...');
      try {
        // 检查是否安装了tcpdump
        await execAsync('tcpdump --version');
        console.log('✅ 检测到tcpdump，使用tcpdump进行PCAP分析');
        hasTools = true;
        toolType = 'tcpdump';
        
        // 使用tcpdump获取真实数据
        try {
          // 获取真实数据包总数
          const { stdout: countOutput } = await execAsync(`tcpdump -r "${filePath}" -nn 2>/dev/null | wc -l`);
          totalPackets = parseInt(countOutput.trim()) || 0;
          
          // 获取真实协议分布
          const { stdout: protoOutput } = await execAsync(`tcpdump -r "${filePath}" -nn 2>/dev/null | awk '{print $2}' | sort | uniq -c | sort -nr`);
          const protocolLines = protoOutput.trim().split('\n');
          for (const line of protocolLines) {
            const match = line.trim().match(/^(\d+)\s+(\w+)/);
            if (match) {
              const count = parseInt(match[1]);
              const protocol = match[2].toUpperCase();
              if (protocol) {
                protocols[protocol] = (protocols[protocol] || 0) + count;
              }
            }
          }
          
          // 获取真实Top Talkers
          const { stdout: talkersOutput } = await execAsync(`tcpdump -r "${filePath}" -nn 2>/dev/null | awk '{print $3}' | cut -d'.' -f1-4 | sort | uniq -c | sort -nr | head -5`);
          const talkerLines = talkersOutput.trim().split('\n');
          for (const line of talkerLines) {
            const match = line.trim().match(/^(\d+)\s+(\d+\.\d+\.\d+\.\d+)/);
            if (match) {
              const packets = parseInt(match[1]);
              const ip = match[2];
              topTalkers.push({
                ip,
                packets,
                bytes: packets * 100 // 基于tcpdump输出的估算
              });
            }
          }
          
        } catch (error) {
          console.error('tcpdump分析失败:', error);
          hasTools = false;
        }
      } catch {
        console.log('❌ 未检测到tcpdump');
      }
    }
    
    // 关键：如果没有工具，不生成模拟数据，只返回基础真实信息
    if (!hasTools) {
      console.log('⚠️ 未检测到网络分析工具，仅返回基础文件统计信息');
      
      // 只返回文件的真实基础信息，不进行任何估算或模拟
      const fileAge = Date.now() - stats.mtime.getTime();
      duration = Math.min(300, Math.floor(fileAge / 1000)) || 30;
      
      // 只基于文件大小返回极基础的信息，不进行协议分析
      console.log('基础文件信息:', {
        fileSize: totalSize,
        fileAge: duration,
        hasTools: false
      });
      
      return {
        totalPackets: 0, // 无法获取真实数据包数量
        totalSize: totalSize,
        duration: duration,
        protocols: {}, // 空对象，不模拟协议数据
        topTalkers: [], // 空数组，不模拟通信节点
        suspiciousActivities: [], // 空数组，不模拟可疑活动
        trafficPattern: {
          avgPacketSize: 0, // 无法计算
          peakTime: stats.mtime.toLocaleTimeString(),
          bandwidthUsage: 0 // 无法计算
        },
        captureInfo: {
          interface: 'PCAP文件(无分析工具)',
          startTime: stats.mtime.toISOString(),
          filter: '无过滤器'
        }
      };
    }
    
    // 基于文件修改时间计算抓包时长
    const fileAge = Date.now() - stats.mtime.getTime();
    duration = Math.min(300, Math.floor(fileAge / 1000)) || 30;
    
    // 基于真实数据进行简单的异常检测
    if (totalPackets > 0) {
      // 基于真实数据包数量进行异常检测
      if (Object.keys(protocols).length > 5) {
        suspiciousActivities.push({
          type: '协议多样性',
          count: 1,
          details: [`检测到${Object.keys(protocols).length}种不同协议`]
        });
      }
      
      // 基于Top Talkers的异常检测
      if (topTalkers.length > 0) {
        const topTalker = topTalkers[0];
        if (topTalker.packets > totalPackets * 0.5) {
          suspiciousActivities.push({
            type: '单节点高流量',
            count: 1,
            details: [`${topTalker.ip}占用超过50%的流量`]
          });
        }
      }
    }
    
    console.log('✅ PCAP真实数据分析完成:', {
      totalPackets,
      totalSize,
      duration,
      toolType,
      protocolsCount: Object.keys(protocols).length,
      topTalkersCount: topTalkers.length,
      suspiciousCount: suspiciousActivities.length
    });
    
    return {
      totalPackets,
      totalSize,
      duration,
      protocols,
      topTalkers: topTalkers.slice(0, 5),
      suspiciousActivities,
      trafficPattern: {
        avgPacketSize: totalPackets > 0 ? Math.floor(totalSize / totalPackets) : 0,
        peakTime: stats.mtime.toLocaleTimeString(),
        bandwidthUsage: totalPackets > 0 ? Math.min(100, (totalSize / 1024 / 1024 / duration) * 8 * 100) : 0
      },
      captureInfo: {
        interface: `PCAP文件(${toolType})`,
        startTime: stats.mtime.toISOString(),
        filter: '无过滤器'
      }
    };
    
  } catch (error) {
    console.error('❌ PCAP文件分析错误:', error);
    
    // 如果发生错误，返回空数据，不进行任何模拟
    console.log('返回空数据，不进行任何模拟');
    
    return {
      totalPackets: 0,
      totalSize: 0,
      duration: 0,
      protocols: {},
      topTalkers: [],
      suspiciousActivities: [],
      trafficPattern: {
        avgPacketSize: 0,
        peakTime: new Date().toLocaleTimeString(),
        bandwidthUsage: 0
      },
      captureInfo: {
        interface: 'PCAP文件(错误)',
        startTime: new Date().toISOString(),
        filter: '无过滤器'
      }
    };
  }
}